const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const remote = new Map();
  const posts = [];

  await page.route("**/api/felt-notes**", async route => {
    const request = route.request();
    if (request.method() === "POST") {
      const body = request.postDataJSON();
      posts.push(body.note);
      remote.set(body.note.id, { ...body.note, public: true, visitorId: body.visitorId });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, admin: true, note: body.note }) });
    }
    if (request.method() === "DELETE") {
      remote.delete(new URL(request.url()).searchParams.get("id"));
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ configured: true, admin: true, initialized: true, notes: [...remote.values()] }) });
  });

  await page.addInitScript(() => {
    localStorage.setItem("km-portfolio-visitor-id-v1", "owner-device-browser-test");
    localStorage.setItem("km-felt-canvas-notes-v1", JSON.stringify([
      { id: "felt-profile", owner: true, x: .19, y: .34, rotation: 0, scale: 1.05, color: "bone", mode: "md", content: "# 当前残缺版本", pins: [], seed: 21 }
    ]));
  });

  await page.goto("http://127.0.0.1:4173/?api-preview=1&owner=test-owner-claim-code-12345", { waitUntil: "networkidle" });
  await page.waitForFunction(() => localStorage.getItem("km-felt-admin-migrated-v3") === "1");
  if (posts.length < 7) throw new Error(`only ${posts.length} recovered notes were migrated`);
  if (!posts.some(note => note.id === "felt-profile" && note.scale === 1.05 && note.content.includes("孔米乐"))) throw new Error("recovered owner note was not migrated");
  if (!posts.some(note => note.id === "e3c3e165-bdd6-41a7-8a00-ded228063d7f" && note.content.includes("联系我"))) throw new Error("recovered contact note was not migrated");
  if (!posts.some(note => note.id === "a3e91573-4a87-400c-98b5-f805f8dd6cbe" && note.imageData?.length > 180000)) throw new Error("recovered image data was not migrated");
  if (!await page.evaluate(() => localStorage.getItem("km-felt-canvas-notes-backups-v1"))) throw new Error("local backup was not created before migration");

  await page.evaluate(() => window.dispatchEvent(new CustomEvent("felt-receipt-torn", { detail: { stats: { clicks: 7, minutes: 2, prints: 1, notes: 3 } } })));
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("km-felt-canvas-notes-v1") || "[]").some(note => note.kind === "receipt" && note.pendingSync === false));
  if (!posts.some(note => note.kind === "receipt" && note.receiptData?.clicks === 7)) throw new Error("receipt was not published");

  console.log("FELT_PUBLIC_SYNC_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
