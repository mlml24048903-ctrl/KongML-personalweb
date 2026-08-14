const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4173/?view=mobile-readable-v1", { waitUntil: "networkidle" });
  await page.screenshot({ path: "tests/mobile-readable-home-v1.png", fullPage: true });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1000);
  await page.screenshot({ path: "tests/mobile-readable-outside-v1.png", fullPage: true });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.locator("#feltTearButton").click(); await page.waitForTimeout(700);
  await page.locator("#feltTabDoodle").click();
  await page.locator("#feltDoodlePen").click();
  const sizeBox = await page.locator(".felt-tool-size").boundingBox();
  if (!sizeBox || sizeBox.x < 0 || sizeBox.x + sizeBox.width > 390) throw new Error(`mobile size control is clipped: ${JSON.stringify(sizeBox)}`);
  await page.screenshot({ path: "tests/mobile-readable-doodle-v1.png", fullPage: true });
  const checks = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    editorOverflow: document.querySelector("#feltEditor").scrollWidth - document.querySelector("#feltEditor").clientWidth,
    toolbarBottom: document.querySelector(".felt-doodle-toolbar").getBoundingClientRect().bottom,
    pageBottom: document.querySelector(".felt-editor-pages").getBoundingClientRect().bottom
  }));
  if (checks.overflow > 1 || checks.editorOverflow > 1 || checks.toolbarBottom > checks.pageBottom + 1) throw new Error(`mobile layout failed: ${JSON.stringify(checks)}`);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("MOBILE_READABILITY_OK", JSON.stringify(checks));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
