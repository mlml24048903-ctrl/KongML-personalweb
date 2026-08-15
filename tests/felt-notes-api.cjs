process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SECRET_KEY = "sb_secret_test-key";
process.env.NODE_ENV = "test";
const testOwnerClaim = "test-owner-claim-code-12345";
process.env.FELT_ADMIN_CLAIM_HASH = require("crypto").createHash("sha256").update(testOwnerClaim).digest("hex");

const handler = require("../api/felt-notes.js");
let ownership = [];
let writtenPayload = null;
let uploadedBytes = 0;
let leakedSecretBearer = false;
let adminVisitor = "";

global.fetch = async (url, options = {}) => {
  if (String(options.headers?.authorization || "").includes("sb_secret_")) leakedSecretBearer = true;
  if (String(url).includes("felt_note_rate_events")) return { ok: true, json: async () => [] };
  if (String(url).includes("id=eq.25c4e84d-4206-4242-b69b-0c56c0aef124") && String(url).includes(`visitor_id=eq.${adminVisitor}`)) return { ok: true, json: async () => adminVisitor ? [{ id: "25c4e84d-4206-4242-b69b-0c56c0aef124" }] : [] };
  if (String(url).includes("/storage/v1/bucket/felt-images")) return { ok: true, json: async () => ({ id: "felt-images" }) };
  if (String(url).includes("/storage/v1/object/felt-images/")) { uploadedBytes = options.body?.length || 0; return { ok: true, json: async () => ({}) }; }
  if (options.method === "PATCH") { writtenPayload = JSON.parse(options.body).payload; return { ok: true, json: async () => [] }; }
  if (options.method === "POST") { writtenPayload = JSON.parse(options.body).payload; return { ok: true, json: async () => [] }; }
  if (String(url).includes("select=visitor_id")) return { ok: true, json: async () => ownership };
  return { ok: true, json: async () => [] };
};

function request(note, visitorId, ownerClaim = "") {
  return new Promise(resolve => {
    const response = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      end(body) { resolve({ status: this.statusCode, body: JSON.parse(body) }); }
    };
    handler({ method: "POST", headers: { "x-forwarded-for": "203.0.113.7" }, socket: {}, body: { visitorId, ownerClaim, note }, query: {} }, response);
  });
}

(async () => {
  const base = { id: "12345678-1234-1234-1234-123456789abc", content: "hello", mode: "doodle", doodle: [{ erase: true, width: 99, points: [[1, 2], [3, 4]] }] };
  const valid = await request(base, "visitor-valid-12345");
  if (valid.status !== 200 || !writtenPayload?.doodle?.[0]?.erase || writtenPayload.doodle[0].width !== 80) throw new Error(`valid doodle was not sanitized correctly: ${JSON.stringify({ valid, writtenPayload })}`);

  ownership = [];
  const png = Buffer.alloc(24); png.set(Buffer.from([0x89, 0x50, 0x4e, 0x47]), 0); png.writeUInt32BE(32, 16); png.writeUInt32BE(32, 20);
  const imageData = `data:image/png;base64,${png.toString("base64")}`;
  const image = await request({ ...base, id: "42345678-1234-1234-1234-123456789abc", mode: "image", imageData, imageAspect: 2 }, "visitor-image-12345");
  if (image.status !== 200 || uploadedBytes !== 24 || !writtenPayload?.imageUrl?.includes("/storage/v1/object/public/felt-images/notes/42345678-1234-1234-1234-123456789abc-") || !writtenPayload.imageUrl.endsWith(".png") || writtenPayload.imageData) throw new Error(`image storage upload failed: ${JSON.stringify({ image, uploadedBytes, writtenPayload })}`);
  if (leakedSecretBearer) throw new Error("opaque Supabase secret key was sent as a bearer token");

  const blocked = await request({ ...base, id: "22345678-1234-1234-1234-123456789abc", content: "加微信赚钱推广" }, "visitor-blocked-12345");
  if (blocked.status !== 422) throw new Error(`moderation failed: ${JSON.stringify(blocked)}`);

  ownership = [{ visitor_id: "someone-else" }];
  const forbidden = await request({ ...base, id: "32345678-1234-1234-1234-123456789abc" }, "visitor-owner-12345");
  if (forbidden.status !== 403) throw new Error(`ownership protection failed: ${JSON.stringify(forbidden)}`);

  const ownerDevice = "owner-device-12345";
  const adminEdit = await request({ ...base, id: "felt-profile", owner: true, mode: "receipt", fontScale: 1.25, kind: "receipt", receiptData: { clicks: 8, minutes: 3 } }, ownerDevice, testOwnerClaim);
  if (adminEdit.status !== 200 || adminEdit.body.admin !== true || writtenPayload?.owner !== true || writtenPayload?.fontScale !== 1.25 || writtenPayload?.kind !== "receipt" || writtenPayload?.receiptData?.clicks !== 8) throw new Error(`admin device update failed: ${JSON.stringify({ adminEdit, writtenPayload })}`);
  console.log("FELT_NOTES_API_OK");
})().catch(error => { console.error(error); process.exitCode = 1; });
