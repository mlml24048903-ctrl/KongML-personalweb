const { pathToFileURL } = require("url");
const path = require("path");
const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("dialog", dialog => dialog.accept());

  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("km-portfolio-outer-items-v4", JSON.stringify([
      { id: "note-edge", color: "orange", title: "old", content: "old", x: .91, y: .88, rotation: 12 },
      { id: "custom-note", color: "lime", title: "custom", content: "kept", x: .5, y: .5, rotation: 0 }
    ]));
  });

  await page.goto(pathToFileURL(path.resolve(__dirname, "..", "index.html")).href);
  const siteIdentity = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    shareTitle: document.querySelector('meta[property="og:title"]')?.content,
    shareDescription: document.querySelector('meta[property="og:description"]')?.content
  }));
  if (siteIdentity.title !== "Kikimy / 想法持续生长" || siteIdentity.description !== "Kikimy的个人工作台：产品、开发、语言与持续生长的想法。" || siteIdentity.shareTitle !== siteIdentity.title || siteIdentity.shareDescription !== siteIdentity.description) {
    throw Error(`site identity mismatch: ${JSON.stringify(siteIdentity)}`);
  }
  if (await page.locator("#entryHint").count()) throw Error("entry hint remains");
  if ((await page.locator("#hero-title").textContent()) !== "THE WORLDIS STILLIN DRAFT.") throw Error("slogan");
  if (await page.locator("#profileLayer,[data-profile-page]").count()) throw Error("retired profile pages remain");

  const canonical = await page.locator('[data-id="note-edge"]').evaluate(node => ({ left: node.style.left, top: node.style.top }));
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("km-portfolio-outer-items-v4") || "[]").find(item => item.id === "note-edge"));
  if (canonical.left !== "20.5%" || canonical.top !== "20%" || stored?.x !== .205 || stored?.y !== .2 || await page.locator('[data-id="custom-note"]').count() !== 1) {
    throw Error(`outer layout migration failed: ${JSON.stringify({ canonical, stored })}`);
  }

  await page.mouse.wheel(0, -180);
  await page.waitForTimeout(800);
  await page.locator("body.workspace-entered:not(.inner-mode)").waitFor();
  const note = page.locator(".outer-item").first();
  const box = await note.boundingBox();
  await note.evaluate(node => node.addEventListener("pointerup", () => {
    const layer = document.getElementById("outerItems").getBoundingClientRect();
    node.dataset.releaseLeft = node.style.left;
    node.dataset.releaseTop = node.style.top;
    node.dataset.releaseLayerWidth = String(layer.width);
    node.dataset.releaseLayerHeight = String(layer.height);
  }, { capture: true, once: true }));
  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  if (!await note.evaluate(node => node.classList.contains("is-pressed"))) throw Error("note press");
  await page.mouse.move(box.x + 60, box.y + 50);
  await page.mouse.up();
  await page.waitForTimeout(940);

  const settled = await note.evaluate(node => ({
    left: node.style.left,
    top: node.style.top,
    releaseLeft: node.dataset.releaseLeft,
    releaseTop: node.dataset.releaseTop,
    layerWidth: Number(node.dataset.releaseLayerWidth),
    layerHeight: Number(node.dataset.releaseLayerHeight),
    opacity: getComputedStyle(node).opacity,
    animation: getComputedStyle(node).animationName,
    landing: node.classList.contains("is-landing"),
    ready: node.classList.contains("is-interaction-ready")
  }));
  const drift = Math.hypot(
    (parseFloat(settled.left) - parseFloat(settled.releaseLeft)) * settled.layerWidth / 100,
    (parseFloat(settled.top) - parseFloat(settled.releaseTop)) * settled.layerHeight / 100
  );
  if (drift < 1 || drift > 18.1) throw Error(`note inertia outside bounds: ${JSON.stringify({ drift, settled })}`);
  if (settled.opacity !== "1" || settled.animation !== "none" || settled.landing || !settled.ready) {
    throw Error(`note replayed entrance after drop: ${JSON.stringify(settled)}`);
  }

  await page.locator("#enterMouse").click();
  await page.waitForTimeout(800);
  await page.locator("body.inner-mode").waitFor();
  if (await page.locator(".custom-inner-icon").count() < 3) throw Error("desktop items");
  await page.locator("#powerButton").evaluate(node => node.click());
  await page.waitForTimeout(600);
  if (!await page.locator("body").evaluate(node => node.classList.contains("screen-off"))) throw Error("power off");
  await page.locator("#powerButton").evaluate(node => node.click());
  await page.waitForTimeout(700);
  await page.screenshot({ path: "tests/final-v3.png", fullPage: true });
  if (errors.length) throw Error(errors.join("\n"));
  console.log("SMOKE_V3_OK");
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
