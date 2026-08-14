process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SECRET_KEY = "test-key";

const handler = require("../api/felt-notes.js");
let ownership = [];
let writtenPayload = null;
let uploadedBytes = 0;

global.fetch = async (url, options = {}) => {
  if (String(url).includes("felt_note_rate_events")) return { ok: true, json: async () => [] };
  if (String(url).includes("/storage/v1/bucket/felt-images")) return { ok: true, json: async () => ({ id: "felt-images" }) };
  if (String(url).includes("/storage/v1/object/felt-images/")) { uploadedBytes = options.body?.length || 0; return { ok: true, json: async () => ({}) }; }
  if (options.method === "POST") { writtenPayload = JSON.parse(options.body).payload; return { ok: true, json: async () => [] }; }
  if (String(url).includes("select=visitor_id")) return { ok: true, json: async () => ownership };
  return { ok: true, json: async () => [] };
};

function request(note, visitorId) {
  return new Promise(resolve => {
    const response = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      end(body) { resolve({ status: this.statusCode, body: JSON.parse(body) }); }
    };
    handler({ method: "POST", headers: { "x-forwarded-for": "203.0.113.7" }, socket: {}, body: { visitorId, note }, query: {} }, response);
  });
}

(async () => {
  const base = { id: "12345678-1234-1234-1234-123456789abc", content: "hello", mode: "doodle", doodle: [{ erase: true, width: 99, points: [[1, 2], [3, 4]] }] };
  const valid = await request(base, "visitor-valid-12345");
  if (valid.status !== 200 || !writtenPayload?.doodle?.[0]?.erase || writtenPayload.doodle[0].width !== 80) throw new Error(`valid doodle was not sanitized correctly: ${JSON.stringify({ valid, writtenPayload })}`);

  ownership = [];
  const imageData = `data:image/jpeg;base64,${Buffer.from("image-payload").toString("base64")}`;
  const image = await request({ ...base, id: "42345678-1234-1234-1234-123456789abc", mode: "image", imageData, imageAspect: 2 }, "visitor-image-12345");
  if (image.status !== 200 || uploadedBytes !== 13 || !writtenPayload?.imageUrl?.includes("/storage/v1/object/public/felt-images/notes/42345678-1234-1234-1234-123456789abc.jpg") || writtenPayload.imageData) throw new Error(`image storage upload failed: ${JSON.stringify({ image, uploadedBytes, writtenPayload })}`);

  const blocked = await request({ ...base, id: "22345678-1234-1234-1234-123456789abc", content: "加微信赚钱推广" }, "visitor-blocked-12345");
  if (blocked.status !== 422) throw new Error(`moderation failed: ${JSON.stringify(blocked)}`);

  ownership = [{ visitor_id: "someone-else" }];
  const forbidden = await request({ ...base, id: "32345678-1234-1234-1234-123456789abc" }, "visitor-owner-12345");
  if (forbidden.status !== 403) throw new Error(`ownership protection failed: ${JSON.stringify(forbidden)}`);
  console.log("FELT_NOTES_API_OK");
})().catch(error => { console.error(error); process.exitCode = 1; });
