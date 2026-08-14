const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173/?view=felt-doodle-tools-v1", { waitUntil: "networkidle" });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1000);
  await page.locator("#feltTearButton").click(); await page.waitForTimeout(820);
  await page.locator("#feltTabDoodle").click();
  const normalLayout = await page.evaluate(() => {
    const toolbar = document.querySelector(".felt-doodle-toolbar").getBoundingClientRect();
    const canvas = document.querySelector("#feltDoodleCanvas").getBoundingClientRect();
    return { toolbarRight: toolbar.right, canvasLeft: canvas.left, penPressed: document.querySelector("#feltDoodlePen").getAttribute("aria-pressed") };
  });
  if (normalLayout.toolbarRight >= normalLayout.canvasLeft || normalLayout.penPressed !== "true") throw new Error(`doodle sidebar is not laid out correctly: ${JSON.stringify(normalLayout)}`);
  await page.locator("#feltDoodlePen").click();
  if (!await page.locator(".felt-tool-size").evaluate(element => element.classList.contains("is-open"))) throw new Error("second pen activation did not open the size control");
  await page.screenshot({ path: "tests/felt-doodle-size-popover-v2.png", fullPage: true });
  await page.locator("#feltDoodleSize").fill("17");
  await page.locator("#feltDoodleExpand").click(); await page.waitForTimeout(120);
  const expanded = await page.locator("#feltEditor").evaluate(element => ({
    expanded: element.classList.contains("is-doodle-expanded"),
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }));
  if (!expanded.expanded || expanded.width < 900 || expanded.height < 700) throw new Error(`doodle editor did not expand: ${JSON.stringify(expanded)}`);
  await page.locator("#feltDoodleEraser").click();
  if (await page.locator("#feltDoodleEraser").getAttribute("aria-pressed") !== "true") throw new Error("eraser state was not exposed");
  if (await page.locator("#feltDoodleSize").inputValue() !== "38") throw new Error("eraser did not restore its independent size");
  await page.locator("#feltDoodleEraser").click();
  await page.locator("#feltDoodleSize").fill("62");
  const canvasBox = await page.locator("#feltDoodleCanvas").boundingBox();
  await page.mouse.move(canvasBox.x + 80, canvasBox.y + 80);
  await page.mouse.down(); await page.mouse.move(canvasBox.x + 180, canvasBox.y + 150, { steps: 5 }); await page.mouse.up();
  await page.screenshot({ path: "tests/felt-doodle-tools-v1.png", fullPage: true });
  if (!await page.locator("#feltDoodleSave").isVisible()) throw new Error("fullscreen save action is not visible");
  await page.locator("#feltDoodleSave").click();
  if (await page.locator("#feltEditor").evaluate(element => element.open)) throw new Error("fullscreen save did not place the note and close the editor");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("FELT_DOODLE_TOOLS_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
