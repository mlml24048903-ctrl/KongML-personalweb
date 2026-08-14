const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4173/?view=receipt-tear-v1", { waitUntil: "networkidle" });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.locator("#feltReceiptButton").click();
  await page.waitForTimeout(1200);
  const reveal = page.locator(".visitor-receipt__paper-reveal"), box = await reveal.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 120);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 115, box.y + 245, { steps: 12 });
  const pullingState = await page.evaluate(() => ({
    revealClip: getComputedStyle(document.querySelector(".visitor-receipt__paper-reveal")).clipPath,
    stubTransform: getComputedStyle(document.querySelector(".visitor-receipt__paper-stub")).transform,
    paperTransform: getComputedStyle(document.querySelector(".visitor-receipt__paper")).transform
  }));
  if (pullingState.revealClip !== "none") throw new Error(`receipt remained clipped while pulling: ${pullingState.revealClip}`);
  if (pullingState.stubTransform !== "none") throw new Error(`receipt stub moved while pulling: ${pullingState.stubTransform}`);
  if (pullingState.paperTransform === "none") throw new Error("detachable receipt body did not move while pulling");
  await page.mouse.up();
  await page.waitForTimeout(650);
  const result = await page.evaluate(() => {
    const notes = JSON.parse(localStorage.getItem("km-felt-canvas-notes-v1") || "[]");
    const ticket = notes.find(note => note.kind === "receipt");
    return { hidden: document.querySelector("#visitorReceipt").getAttribute("aria-hidden"), ticket };
  });
  if (result.hidden !== "true") throw new Error("receipt overlay remained open after tearing");
  if (!result.ticket?.receiptData || result.ticket.mode !== "receipt") throw new Error(`torn receipt was not stored: ${JSON.stringify(result)}`);
  if (!result.ticket.receiptData.barcodeSeed) throw new Error("torn receipt did not retain its randomized barcode seed");
  const pinBox = await page.locator("#feltPinButton").boundingBox();
  await page.mouse.click(pinBox.x + 20, pinBox.y + 20);
  await page.mouse.click(740, 405);
  await page.waitForTimeout(220);
  const pinnedTicket = await page.evaluate(() => JSON.parse(localStorage.getItem("km-felt-canvas-notes-v1") || "[]").find(note => note.kind === "receipt"));
  if (!pinnedTicket?.pins?.length) throw new Error("torn receipt could not be pinned to the board");
  await page.screenshot({ path: "tests/receipt-torn-on-board-v1.png", fullPage: true });
  await page.mouse.dblclick(740, 405, { delay: 70 });
  await page.waitForTimeout(180);
  const deletedTicket = await page.evaluate(() => JSON.parse(localStorage.getItem("km-felt-canvas-notes-v1") || "[]").find(note => note.kind === "receipt"));
  if (deletedTicket) throw new Error("double-click did not delete the torn receipt");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("RECEIPT_TEAR_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
