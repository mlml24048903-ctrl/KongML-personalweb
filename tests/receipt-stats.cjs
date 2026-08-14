const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173/?view=receipt-stats-v1", { waitUntil: "networkidle" });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1200);
  const roll = page.locator("#feltReceiptButton");
  await roll.click();
  const receipt = page.locator("#visitorReceipt");
  if (await receipt.getAttribute("aria-hidden") !== "false") throw new Error("receipt did not open");
  await page.waitForTimeout(190);
  const staged = await page.evaluate(() => {
    const roller = document.querySelector(".visitor-receipt__roller"), reveal = document.querySelector(".visitor-receipt__paper-reveal");
    return { rollerOpacity: Number.parseFloat(getComputedStyle(roller).opacity), paperClip: getComputedStyle(reveal).clipPath };
  });
  if (staged.rollerOpacity < .7 || !/100%/.test(staged.paperClip)) throw new Error(`roll and paper did not enter in sequence: ${JSON.stringify(staged)}`);
  await page.screenshot({ path: "tests/receipt-roll-first-v2.png", fullPage: true });
  await page.waitForTimeout(420);
  await page.screenshot({ path: "tests/receipt-printing-v2.png", fullPage: true });
  await page.waitForTimeout(760);
  const texture = await page.locator(".visitor-receipt__texture").evaluate(canvas => {
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let painted = 0;
    for (let index = 3; index < data.length; index += 4) if (data[index]) painted += 1;
    return { width: canvas.width, height: canvas.height, painted };
  });
  if (texture.width < 300 || texture.height < 500 || texture.painted < 500) throw new Error(`paper texture was not drawn: ${JSON.stringify(texture)}`);
  for (const key of ["clicks", "minutes", "prints", "notes"]) {
    const value = await receipt.locator(`[data-stat="${key}"]`).textContent();
    if (!value || Number.isNaN(Number(value))) throw new Error(`invalid ${key} statistic: ${value}`);
  }
  await page.screenshot({ path: "tests/receipt-stats-v2.png", fullPage: true });
  await page.mouse.click(36, 36);
  await page.waitForTimeout(70);
  const closing = await page.evaluate(() => ({
    roller: Number.parseFloat(getComputedStyle(document.querySelector(".visitor-receipt__roller")).opacity),
    paper: Number.parseFloat(getComputedStyle(document.querySelector(".visitor-receipt__paper-reveal")).opacity)
  }));
  if (Math.abs(closing.roller - closing.paper) > .24 || closing.paper > .75) throw new Error(`receipt layers did not close together: ${JSON.stringify(closing)}`);
  await page.screenshot({ path: "tests/receipt-closing-v3.png", fullPage: true });
  await page.waitForTimeout(480);
  if (await receipt.getAttribute("aria-hidden") !== "true") throw new Error("receipt did not close");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("RECEIPT_STATS_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
