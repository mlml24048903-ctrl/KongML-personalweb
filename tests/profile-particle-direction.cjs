const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.addInitScript(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4175/?profile-paper-direction=1", { waitUntil: "networkidle" });
  await page.locator('[data-profile-page="about"]').click();
  await page.waitForFunction(() => document.querySelectorAll(".profile-page:not([hidden])").length === 3, null, { timeout: 7000 });

  const scrollTop = () => page.locator(".profile-pages").evaluate((node) => node.scrollTop);
  await page.locator('[data-profile-switch="now"]').click();
  await page.waitForTimeout(120);const downA = await scrollTop();await page.waitForTimeout(160);const downB = await scrollTop();
  if (!(downB > downA && downA > 0)) throw new Error(`downward locator did not move continuously: ${downA} -> ${downB}`);
  await page.waitForFunction(() => document.querySelector('[data-profile-switch="now"]')?.classList.contains("is-current"), null, { timeout: 5000 });
  await page.waitForTimeout(500);const atNow = await scrollTop();

  await page.locator('[data-profile-switch="about"]').click();
  await page.waitForTimeout(120);const upA = await scrollTop();await page.waitForTimeout(160);const upB = await scrollTop();
  if (!(upB < upA && upA < atNow)) throw new Error(`upward locator did not reverse the same canvas: ${upA} -> ${upB}, anchor ${atNow}`);
  await page.waitForFunction(() => document.querySelector(".profile-pages")?.scrollTop < 3, null, { timeout: 5000 });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PROFILE_PAPER_DIRECTION_OK");
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
