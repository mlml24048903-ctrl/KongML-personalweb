const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const recovered = require("../assets/owner-notes-recovery-v1.json");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 2048, height: 1080 }]) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(notes => {
      localStorage.clear();
      localStorage.setItem("km-felt-canvas-notes-v1", JSON.stringify(notes));
    }, recovered);
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.mouse.wheel(0, -180); await page.waitForTimeout(1050);
    const outerSize = await page.locator(".outer-item").first().evaluate(node => ({ width: parseFloat(getComputedStyle(node).width), font: parseFloat(getComputedStyle(node.querySelector("h3")).fontSize) }));
    const monitorWidth = await page.locator(".monitor-wrap").evaluate(node => parseFloat(getComputedStyle(node).width));
    const expectedOuter = viewport.width === 1440 ? 176 : 218, expectedMonitor = viewport.width === 1440 ? 1440 * .62 : 1220;
    if (Math.abs(outerSize.width - expectedOuter) > 1 || Math.abs(monitorWidth - expectedMonitor) > 1) throw new Error(`unexpected computer scene scale at ${viewport.width}px: ${JSON.stringify({ outerSize, monitorWidth })}`);
    await page.mouse.wheel(0, -180); await page.waitForTimeout(1050);
    await page.locator("body.message-board-open").waitFor();
    const scale = Number(await page.locator("#feltCanvas").getAttribute("data-scene-scale"));
    const expected = viewport.width === 1440 ? 1 : 1.38;
    if (Math.abs(scale - expected) > .01) throw new Error(`unexpected ${viewport.width}px scale: ${scale}`);
    await page.screenshot({ path: `tests/felt-wide-${viewport.width}.png`, fullPage: true });
    await page.close();
  }
  console.log("FELT_WIDE_SCALE_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
