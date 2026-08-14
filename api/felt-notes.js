const { createHash } = require("crypto");

const allowedColors = new Set(["yellow", "blue", "pink", "mint", "lavender", "bone", "coral", "custom"]);
const allowedModes = new Set(["md", "doodle", "image"]);
const imageBucket = "felt-images";
const maxImageBytes = 2 * 1024 * 1024;
const recentWrites = new Map();

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
  return { buffer, contentType: match[1].toLowerCase(), extension: match[1].split("/")[1].replace("jpeg", "jpg") };
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
  const objectPath = `notes/${noteId}.${decoded.extension}`;
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

function cleanNote(note, id) {
  const doodle = Array.isArray(note.doodle) ? note.doodle.slice(0, 80).map(stroke => ({ width: Math.max(1, Math.min(80, Number(stroke.width) || 5)), erase: Boolean(stroke.erase), points: Array.isArray(stroke.points) ? stroke.points.slice(0, 1400).map(point => [Number(point[0]) || 0, Number(point[1]) || 0]) : [] })) : [];
  const pins = Array.isArray(note.pins) ? note.pins.slice(0, 12).map(pin => ({ x: Math.max(.02, Math.min(.98, Number(pin.x) || .5)), y: Math.max(.02, Math.min(.98, Number(pin.y) || .08)), color: /^#[0-9a-f]{6}$/i.test(pin.color) ? pin.color : "#1769aa", angle: Math.max(-1.5, Math.min(1.5, Number(pin.angle) || 0)) })) : [];
  return {
    id,
    public: true,
    x: Math.max(.05, Math.min(.95, Number(note.x) || .5)),
    y: Math.max(.06, Math.min(.94, Number(note.y) || .5)),
    rotation: Math.max(-.7, Math.min(.7, Number(note.rotation) || 0)),
    scale: Math.max(.72, Math.min(1.2, Number(note.scale) || .96)),
    color: allowedColors.has(note.color) ? note.color : "bone",
    customColor: /^#[0-9a-f]{6}$/i.test(note.customColor) ? note.customColor : "#f6d365",
    mode: allowedModes.has(note.mode) ? note.mode : "md",
    content: cleanText(note.content, 600),
    imageUrl: safeImageUrl(note.imageUrl),
    imageAspect: Math.max(.12, Math.min(8, Number(note.imageAspect) || 1)),
    doodle,
    pins,
    seed: Math.max(1, Math.min(999999, Number(note.seed) || 1))
  };
}

module.exports = async function handler(request, response) {
  if (!configured()) return send(response, 200, { configured: false, notes: [] });
  const restRoot = `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
  const base = `${restRoot}/felt_notes`;
  const visitorId = cleanText(request.headers["x-visitor-id"] || request.body?.visitorId || request.query?.visitorId, 80);
  try {
    if (request.method === "GET") {
      const result = await fetch(`${base}?select=id,visitor_id,payload,created_at&order=created_at.desc&limit=120`, { headers: supabaseHeaders() });
      if (!result.ok) return send(response, 502, { error: "留言暂时没有同步成功", stage: "read_notes", upstreamStatus: result.status });
      const rows = await result.json();
      return send(response, 200, { configured: true, notes: rows.map(row => ({ ...row.payload, id: row.id, visitorId: visitorId && row.visitor_id === visitorId ? visitorId : "remote" })) });
    }
    if (request.method === "POST") {
      if (!visitorId || visitorId.length < 12) return send(response, 400, { error: "invalid visitor" });
      const now = Date.now(), ip = requestIp(request);
      if (exceedsMemoryRate(visitorId, ip, now) || await exceedsDurableRate(restRoot, visitorId, now)) return send(response, 429, { error: "too many notes" });
      const id = cleanText(request.body?.note?.id, 80);
      if (!/^[a-z0-9-]{12,80}$/i.test(id)) return send(response, 400, { error: "invalid note" });
      const moderation = moderationReason(request.body?.note);
      if (moderation) return send(response, 422, { error: moderation });
      const payload = cleanNote(request.body.note, id);
      const ownershipResult = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&select=visitor_id,payload&limit=1`, { headers: supabaseHeaders() });
      if (!ownershipResult.ok) throw new Error(await ownershipResult.text());
      const existing = await ownershipResult.json();
      if (existing[0] && existing[0].visitor_id !== visitorId) return send(response, 403, { error: "note belongs to another visitor" });
      const previousImageUrl = safeImageUrl(existing[0]?.payload?.imageUrl);
      if (payload.mode === "image") {
        const decodedImage = decodeImage(request.body?.note?.imageData);
        if (decodedImage) payload.imageUrl = await uploadNoteImage(id, decodedImage);
        else payload.imageUrl ||= previousImageUrl;
        if (!payload.imageUrl) return send(response, 422, { error: "image upload required" });
      }
      const result = existing[0]
        ? await fetch(`${base}?id=eq.${encodeURIComponent(id)}&visitor_id=eq.${encodeURIComponent(visitorId)}`, { method: "PATCH", headers: supabaseHeaders({ prefer: "return=minimal" }), body: JSON.stringify({ payload, updated_at: new Date().toISOString() }) })
        : await fetch(base, { method: "POST", headers: supabaseHeaders({ prefer: "return=minimal" }), body: JSON.stringify({ id, visitor_id: visitorId, payload }) });
      if (!result.ok) throw new Error(await result.text());
      if (payload.mode !== "image" && previousImageUrl) await deleteNoteImage(previousImageUrl).catch(() => {});
      return send(response, 200, { ok: true, note: payload });
    }
    if (request.method === "DELETE") {
      const id = cleanText(request.query?.id, 80);
      if (!visitorId || !id) return send(response, 400, { error: "invalid request" });
      const ownershipResult = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=payload&limit=1`, { headers: supabaseHeaders() });
      if (!ownershipResult.ok) throw new Error(await ownershipResult.text());
      const existing = await ownershipResult.json();
      if (!existing[0]) return send(response, 403, { error: "note belongs to another visitor" });
      const result = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&visitor_id=eq.${encodeURIComponent(visitorId)}`, { method: "DELETE", headers: supabaseHeaders({ prefer: "return=minimal" }) });
      if (!result.ok) throw new Error(await result.text());
      await deleteNoteImage(existing[0].payload?.imageUrl).catch(() => {});
      return send(response, 200, { ok: true });
    }
    response.setHeader("allow", "GET, POST, DELETE");
    return send(response, 405, { error: "method not allowed" });
  } catch (error) {
    return send(response, 502, { error: "留言暂时没有同步成功" });
  }
};
