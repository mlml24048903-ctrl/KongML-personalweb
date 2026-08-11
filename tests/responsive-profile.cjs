const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const errors = [];

  for (const width of [320, 375, 414, 768]) {
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
    page.on("pageerror", (error) => errors.push(`${width}px: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`${width}px: ${message.text()}`);
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`http://127.0.0.1:4175/?responsive=${width}`, { waitUntil: "networkidle" });

    for (const name of ["about", "now", "contact"]) {
      const selector = `[data-profile-${name === "about" ? "page" : "switch"}="${name}"]`;
      await page.locator(selector).first().click();
      await page.locator(`.profile-page--${name}.is-current`).waitFor();
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        wrappedControl: [...document.querySelectorAll(".masthead nav button,.profile-chrome button,.profile-back,.contact-actions a,.contact-actions button")]
          .filter((node) => node.offsetParent !== null)
          .some((node) => node.getClientRects().length > 1),
      }));
      if (result.overflow) throw new Error(`${width}px ${name}: horizontal overflow`);
      if (result.wrappedControl) throw new Error(`${width}px ${name}: interactive label wrapped`);
    }
    await page.close();
  }

  if (errors.length) throw new Error(errors.join("\n"));
  console.log("RESPONSIVE_PROFILE_OK");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
