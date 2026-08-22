const { createHash, timingSafeEqual } = require("crypto");

const allowedColors = new Set(["yellow", "blue", "pink", "mint", "lavender", "bone", "coral", "lime", "custom"]);
const allowedModes = new Set(["md", "doodle", "image", "receipt"]);
const imageBucket = "felt-images";
const maxImageBytes = 2 * 1024 * 1024;
const recentWrites = new Map();
const adminDeviceRecordId = "felt-admin-device";
const adminClaimHash = process.env.FELT_ADMIN_CLAIM_HASH || "66be51ee59d51c26813942703602d2cbf544926bed0f5fc5a2396b4ea19f2d4a";
// This existing public note was created on the owner's browser. Its private
// visitor_id is the one-time device proof; after the first verified request we
// keep a hidden sentinel row so the device remains recognized if the note is deleted.
const adminAnchorNoteId = process.env.FELT_ADMIN_ANCHOR_NOTE_ID || "25c4e84d-4206-4242-b69b-0c56c0aef124";

function send(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(body));
}

function configured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

function supabaseHeaders(extra = {}) {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key,
    ...(/^sb_secret_/i.test(key) ? {} : { authorization: `Bearer ${key}` }),
    "content-type": "application/json",
    ...extra
  };
}

function storageRoot() {
  return `${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1`;
}

function safeImageUrl(value) {
  if (typeof value !== "string" || !value) return "";
  const root = process.env.SUPABASE_URL?.replace(/\/$/, "");
  return root && value.startsWith(`${root}/storage/v1/object/public/${imageBucket}/`) ? value.slice(0, 1200) : "";
}

function decodeImage(value) {
  if (typeof value !== "string" || !value) return null;
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=]+)$/i);
  if (!match) throw new Error("invalid image data");
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > maxImageBytes) throw new Error("image too large");
  const dimensions = imageDimensions(buffer, match[1].toLowerCase());
  if (!dimensions || dimensions.width < 24 || dimensions.height < 24 || dimensions.width > 12000 || dimensions.height > 12000) throw new Error("invalid image dimensions");
  return { buffer, contentType: match[1].toLowerCase(), extension: match[1].split("/")[1].replace("jpeg", "jpg") };
}

function imageDimensions(buffer, contentType) {
  if (contentType === "image/png" && buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (contentType === "image/jpeg" && buffer.length > 10 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      const size = buffer.readUInt16BE(offset + 2);
      if (size < 2) return null;
      offset += size + 2;
    }
  }
  if (contentType === "image/webp" && buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const kind = buffer.toString("ascii", 12, 16);
    if (kind === "VP8X") return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    if (kind === "VP8 " && buffer.length >= 30) return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L" && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
  }
  return null;
}

async function ensureImageBucket() {
  const root = storageRoot();
  const check = await fetch(`${root}/bucket/${imageBucket}`, { headers: supabaseHeaders() });
  if (check.ok) return;
  if (check.status !== 404 && check.status !== 400) throw new Error(await check.text());
  const created = await fetch(`${root}/bucket`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ id: imageBucket, name: imageBucket, public: true, file_size_limit: maxImageBytes, allowed_mime_types: ["image/jpeg", "image/png", "image/webp"] })
  });
  if (!created.ok && created.status !== 409) throw new Error(await created.text());
}

async function uploadNoteImage(noteId, decoded) {
  await ensureImageBucket();
  const version = createHash("sha256").update(decoded.buffer).digest("hex").slice(0, 12);
  const objectPath = `notes/${noteId}-${version}.${decoded.extension}`;
  const uploaded = await fetch(`${storageRoot()}/object/${imageBucket}/${objectPath}`, {
    method: "POST",
    headers: supabaseHeaders({ "content-type": decoded.contentType, "cache-control": "3600", "x-upsert": "true" }),
    body: decoded.buffer
  });
  if (!uploaded.ok) throw new Error(await uploaded.text());
  return `${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${imageBucket}/${objectPath}`;
}

async function deleteNoteImage(imageUrl) {
  const safeUrl = safeImageUrl(imageUrl);
  if (!safeUrl) return;
  const prefix = decodeURIComponent(safeUrl.split(`/object/public/${imageBucket}/`)[1] || "");
  if (!prefix.startsWith("notes/")) return;
  const removed = await fetch(`${storageRoot()}/object/${imageBucket}`, {
    method: "DELETE",
    headers: supabaseHeaders(),
    body: JSON.stringify({ prefixes: [prefix] })
  });
  if (!removed.ok && removed.status !== 404) throw new Error(await removed.text());
}

function cleanText(value, max) {
  return String(value || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, max);
}

function requestIp(request) {
  return cleanText(String(request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "").split(",")[0].trim(), 80);
}

function rateHash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function exceedsMemoryRate(visitorId, ip, now) {
  const checks = [[`visitor:${visitorId}`, 8], ...(ip ? [[`ip:${ip}`, 24]] : [])];
  for (const [key, limit] of checks) {
    const writes = (recentWrites.get(key) || []).filter(time => now - time < 60000);
    if (writes.length >= limit) return true;
    writes.push(now); recentWrites.set(key, writes);
  }
  return false;
}

function moderationReason(note) {
  const text = cleanText(note?.content, 600).normalize("NFKC");
  const links = text.match(/(?:https?:\/\/|www\.)\S+/gi) || [];
  if (links.length > 3) return "too many links";
  if (/(.)\1{30,}/u.test(text)) return "repeated content";
  if (/(代开.{0,4}发票|博彩.{0,6}(网站|平台)|裸聊|色情资源|刷单.{0,6}(返利|佣金)|加(?:我)?(?:微信|vx|v信).{0,12}(赚钱|推广|返利))/i.test(text)) return "blocked promotional content";
  return "";
}

async function exceedsDurableRate(restRoot, visitorId, now) {
  const events = `${restRoot}/felt_note_rate_events`;
  const visitorHash = rateHash(visitorId);
  try {
    const inserted = await fetch(events, { method: "POST", headers: supabaseHeaders({ prefer: "return=minimal" }), body: JSON.stringify({ visitor_hash: visitorHash }) });
    if (!inserted.ok) return false;
    const since = encodeURIComponent(new Date(now - 60000).toISOString());
    const result = await fetch(`${events}?visitor_hash=eq.${visitorHash}&created_at=gte.${since}&select=id&limit=9`, { headers: supabaseHeaders() });
    if (!result.ok) return false;
    const limited = (await result.json()).length > 8;
    if (Math.random() < .02) {
      const cutoff = encodeURIComponent(new Date(now - 86400000).toISOString());
      await fetch(`${events}?created_at=lt.${cutoff}`, { method: "DELETE", headers: supabaseHeaders({ prefer: "return=minimal" }) });
    }
    return limited;
  } catch { return false; }
}

function cleanReceiptData(value) {
  if (!value || typeof value !== "object") return {};
  return {
    clicks: Math.max(0, Math.min(999999, Number(value.clicks) || 0)),
    minutes: Math.max(0, Math.min(999999, Number(value.minutes) || 0)),
    prints: Math.max(0, Math.min(999999, Number(value.prints) || 0)),
    notes: Math.max(0, Math.min(999999, Number(value.notes) || 0)),
    barcodeSeed: Math.max(1, Math.min(999999, Number(value.barcodeSeed) || 1))
  };
}

function cleanNote(note, id, isAdmin = false) {
  const doodle = Array.isArray(note.doodle) ? note.doodle.slice(0, 80).map(stroke => ({ width: Math.max(1, Math.min(80, Number(stroke.width) || 5)), erase: Boolean(stroke.erase), points: Array.isArray(stroke.points) ? stroke.points.slice(0, 1400).map(point => [Number(point[0]) || 0, Number(point[1]) || 0]) : [] })) : [];
  const pins = Array.isArray(note.pins) ? note.pins.slice(0, 12).map(pin => ({
    x: Math.max(.02, Math.min(.98, Number(pin.x) || .5)),
    y: Math.max(.02, Math.min(.98, Number(pin.y) || .08)),
    color: /^#[0-9a-f]{6}$/i.test(pin.color) ? pin.color : "#1769aa",
    angle: Math.max(-1.5, Math.min(1.5, Number(pin.angle) || 0)),
    ...(Number.isFinite(Number(pin.ax)) ? { ax: Math.max(0, Math.min(1, Number(pin.ax))) } : {}),
    ...(Number.isFinite(Number(pin.ay)) ? { ay: Math.max(0, Math.min(1, Number(pin.ay))) } : {})
  })) : [];
  return {
    id,
    public: true,
    x: Math.max(.05, Math.min(.95, Number(note.x) || .5)),
    y: Math.max(.06, Math.min(.94, Number(note.y) || .5)),
    rotation: Math.max(-.7, Math.min(.7, Number(note.rotation) || 0)),
    scale: Math.max(.72, Math.min(1.2, Number(note.scale) || .96)),
    fontScale: Math.max(.75, Math.min(1.4, Number(note.fontScale) || 1)),
    color: allowedColors.has(note.color) ? note.color : "bone",
    customColor: /^#[0-9a-f]{6}$/i.test(note.customColor) ? note.customColor : "#f6d365",
    mode: allowedModes.has(note.mode) ? note.mode : "md",
    content: cleanText(note.content, 600),
    imageUrl: safeImageUrl(note.imageUrl),
    imageAspect: Math.max(.12, Math.min(8, Number(note.imageAspect) || 1)),
    doodle,
    pins,
    z: Math.max(1, Math.min(1000000, Math.round(Number(note.z) || 1))),
    updatedAt: Math.max(0, Math.min(Date.now() + 60000, Math.round(Number(note.updatedAt) || 0))),
    seed: Math.max(1, Math.min(999999, Number(note.seed) || 1)),
    ...(note.kind === "receipt" ? { kind: "receipt", receiptData: cleanReceiptData(note.receiptData) } : {}),
    ...(isAdmin && note.owner ? { owner: true } : {})
  };
}

function validAdminClaim(value) {
  if (typeof value !== "string" || value.length < 20 || value.length > 80) return false;
  const actual = Buffer.from(createHash("sha256").update(value).digest("hex"));
  const expected = Buffer.from(adminClaimHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function createAdminDevice(base, visitorId) {
  const created = await fetch(base, {
    method: "POST",
    headers: supabaseHeaders({ prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({ id: adminDeviceRecordId, visitor_id: visitorId, payload: { hidden: true, kind: "admin-device" } })
  });
  if (!created.ok) throw new Error(await created.text());
}

async function adminDevice(base, visitorId, claimCode = "") {
  if (!visitorId) return false;
  const sentinel = await fetch(`${base}?id=eq.${adminDeviceRecordId}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id&limit=1`, { headers: supabaseHeaders() });
  if (!sentinel.ok) throw new Error(await sentinel.text());
  if ((await sentinel.json()).length) return true;
  if (validAdminClaim(claimCode)) {
    await createAdminDevice(base, visitorId);
    return true;
  }
  const anchor = await fetch(`${base}?id=eq.${encodeURIComponent(adminAnchorNoteId)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id&limit=1`, { headers: supabaseHeaders() });
  if (!anchor.ok) throw new Error(await anchor.text());
  if (!(await anchor.json()).length) return false;
  await createAdminDevice(base, visitorId);
  return true;
}

module.exports = async function handler(request, response) {
  if (!configured()) return send(response, 200, { configured: false, notes: [] });
  const restRoot = `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
  const base = `${restRoot}/felt_notes`;
  const visitorId = cleanText(request.headers["x-visitor-id"] || request.body?.visitorId || request.query?.visitorId, 80);
  const claimCode = cleanText(request.headers["x-owner-claim"] || request.body?.ownerClaim || request.query?.ownerClaim, 80);
  try {
    const isAdmin = await adminDevice(base, visitorId, claimCode);
    if (request.method === "GET") {
      if (String(request.query?.access || "") === "1") return send(response, 200, { configured: true, admin: isAdmin });
      const result = await fetch(`${base}?select=id,visitor_id,payload,created_at&order=created_at.desc&limit=120`, { headers: supabaseHeaders() });
      if (!result.ok) return send(response, 502, { error: "留言暂时没有同步成功", stage: "read_notes", upstreamStatus: result.status });
      const rows = await result.json();
      return send(response, 200, { configured: true, admin: isAdmin, initialized: rows.some(row => row.id === adminDeviceRecordId), notes: rows.filter(row => !row.payload?.hidden).map(row => ({ ...row.payload, id: row.id, visitorId: visitorId && row.visitor_id === visitorId ? visitorId : "remote" })) });
    }
    if (request.method === "POST") {
      if (!visitorId || visitorId.length < 12) return send(response, 400, { error: "invalid visitor" });
      const now = Date.now(), ip = requestIp(request);
      if (!isAdmin && (exceedsMemoryRate(visitorId, ip, now) || await exceedsDurableRate(restRoot, visitorId, now))) return send(response, 429, { error: "too many notes" });
      const id = cleanText(request.body?.note?.id, 80);
      if (!(isAdmin ? /^[a-z0-9-]{6,80}$/i : /^[a-z0-9-]{12,80}$/i).test(id) || id === adminDeviceRecordId) return send(response, 400, { error: "invalid note" });
      const moderation = isAdmin ? "" : moderationReason(request.body?.note);
      if (moderation) return send(response, 422, { error: moderation });
      const payload = cleanNote(request.body.note, id, isAdmin);
      const ownershipResult = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&select=visitor_id,payload&limit=1`, { headers: supabaseHeaders() });
      if (!ownershipResult.ok) throw new Error(await ownershipResult.text());
      const existing = await ownershipResult.json();
      if (!isAdmin && existing[0] && existing[0].visitor_id !== visitorId) return send(response, 403, { error: "note belongs to another visitor" });
      const previousImageUrl = safeImageUrl(existing[0]?.payload?.imageUrl);
      if (payload.mode === "image") {
        const decodedImage = decodeImage(request.body?.note?.imageData);
        if (decodedImage) payload.imageUrl = await uploadNoteImage(id, decodedImage);
        else payload.imageUrl ||= previousImageUrl;
        if (!payload.imageUrl) return send(response, 422, { error: "image upload required" });
      }
      const result = existing[0]
        ? await fetch(`${base}?id=eq.${encodeURIComponent(id)}${isAdmin ? "" : `&visitor_id=eq.${encodeURIComponent(visitorId)}`}`, { method: "PATCH", headers: supabaseHeaders({ prefer: "return=minimal" }), body: JSON.stringify({ payload, updated_at: new Date().toISOString() }) })
        : await fetch(base, { method: "POST", headers: supabaseHeaders({ prefer: "return=minimal" }), body: JSON.stringify({ id, visitor_id: visitorId, payload }) });
      if (!result.ok) throw new Error(await result.text());
      if (previousImageUrl && (payload.mode !== "image" || payload.imageUrl !== previousImageUrl)) await deleteNoteImage(previousImageUrl).catch(() => {});
      return send(response, 200, { ok: true, admin: isAdmin, note: payload });
    }
    if (request.method === "DELETE") {
      const id = cleanText(request.query?.id, 80);
      if (!visitorId || !id) return send(response, 400, { error: "invalid request" });
      if (id === adminDeviceRecordId) return send(response, 400, { error: "invalid note" });
      const ownershipResult = await fetch(`${base}?id=eq.${encodeURIComponent(id)}${isAdmin ? "" : `&visitor_id=eq.${encodeURIComponent(visitorId)}`}&select=payload&limit=1`, { headers: supabaseHeaders() });
      if (!ownershipResult.ok) throw new Error(await ownershipResult.text());
      const existing = await ownershipResult.json();
      if (!existing[0]) return send(response, 403, { error: "note belongs to another visitor" });
      const result = await fetch(`${base}?id=eq.${encodeURIComponent(id)}${isAdmin ? "" : `&visitor_id=eq.${encodeURIComponent(visitorId)}`}`, { method: "DELETE", headers: supabaseHeaders({ prefer: "return=minimal" }) });
      if (!result.ok) throw new Error(await result.text());
      await deleteNoteImage(existing[0].payload?.imageUrl).catch(() => {});
      return send(response, 200, { ok: true });
    }
    response.setHeader("allow", "GET, POST, DELETE");
    return send(response, 405, { error: "method not allowed" });
  } catch (error) {
    return send(response, 502, { error: "留言暂时没有同步成功", ...(process.env.NODE_ENV === "test" ? { detail: String(error?.message || error) } : {}) });
  }
};
