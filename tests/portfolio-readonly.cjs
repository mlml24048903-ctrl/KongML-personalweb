const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });

  await page.route("**/api/felt-notes**", route => {
    const request = route.request();
    if (request.method() === "GET" && new URL(request.url()).searchParams.get("access") === "1") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ configured: true, admin: false }) });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ configured: true, admin: false, initialized: true, notes: [] }) });
  });

  await page.addInitScript(() => {
    localStorage.setItem("km-portfolio-visitor-id-v1", "readonly-visitor-browser-test");
    localStorage.setItem("km-portfolio-outer-layout-v1", "1");
    localStorage.setItem("km-portfolio-outer-items-v4", JSON.stringify([{ id: "visitor-edit", color: "lime", title: "访客修改", content: "不应显示", x: .5, y: .5, rotation: 0 }]));
    localStorage.setItem("km-portfolio-inner-items-v6", JSON.stringify([{ id: "visitor-file", kind: "file", title: "访客文件", content: "不应显示", parentId: null, x: .5, y: .5 }]));
  });

  await page.goto("http://127.0.0.1:4173/?api-preview=1", { waitUntil: "networkidle" });
  await page.locator("body.portfolio-readonly").waitFor();
  await page.waitForFunction(() => document.querySelectorAll(".outer-item").length === 3);

  if (await page.locator(".outer-item .delete-item").count()) throw Error("visitor can see outer-note delete controls");
  if ((await page.locator(".outer-item small").first().textContent()).trim() !== "便签") throw Error("visitor can see the outer-note edit hint");
  if (await page.locator("#workspaceToolbar").isVisible()) throw Error("visitor can see the note mutation toolbar");

  const note = page.locator(".outer-item").first();
  const before = await note.evaluate(node => ({ left: node.style.left, top: node.style.top }));
  const box = await note.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 50); await page.mouse.up();
  await note.dblclick();
  const after = await note.evaluate(node => ({ left: node.style.left, top: node.style.top }));
  if (before.left !== after.left || before.top !== after.top) throw Error("visitor moved an outer note");
  if (await page.locator("#itemDialog").evaluate(dialog => dialog.open)) throw Error("visitor opened the note editor");

  await page.locator("[data-scene-target='2']").click();
  await page.waitForTimeout(1100);
  if (await page.locator(".retro-actions").isVisible()) throw Error("visitor can see file creation controls");
  if (await page.locator(".code-tree-actions").count()) throw Error("visitor can see file edit or delete controls");
  const firstEntry = page.locator(".code-tree-toggle").first();
  await firstEntry.click();
  if (await page.locator(".code-tree-node.is-open").count() < 1) throw Error("read-only visitor cannot browse folders");
  await page.locator("#retroDesktop").click({ button: "right", position: { x: 500, y: 500 } });
  if (await page.locator(".retro-context-menu").isVisible()) throw Error("visitor can open the file creation menu");

  if (errors.length) throw Error(errors.join("\n"));
  console.log("PORTFOLIO_READONLY_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
