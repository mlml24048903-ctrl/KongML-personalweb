const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const warnings = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("console", (message) => { if (message.type() === "warning") warnings.push(message.text()); });
  await page.addInitScript(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4175/?profile-long-scroll=1", { waitUntil: "networkidle" });
  await page.locator('[data-profile-page="about"]').click();
  await page.locator("body.profile-open").waitFor({ state: "attached", timeout: 5000 });
  await page.waitForFunction(() => document.querySelectorAll(".profile-page:not([hidden])").length === 3, null, { timeout: 7000 });

  const pages = page.locator(".profile-page:not([hidden])");
  if (await pages.count() !== 3) throw new Error("profile pages are not one continuous three-page canvas");
  const metrics = await page.locator(".profile-pages").evaluate((scroller) => {
    const items = [...scroller.querySelectorAll(".profile-page")], first = items[0].offsetTop;
    return { clientHeight: scroller.clientHeight, scrollHeight: scroller.scrollHeight, anchors: items.map((item) => item.offsetTop - first) };
  });
  if (metrics.scrollHeight < metrics.clientHeight * 2.8) throw new Error(`profile canvas is too short: ${JSON.stringify(metrics)}`);

  const setProgress = async (progress) => {
    await page.locator(".profile-pages").evaluate((scroller, value) => {
      const items = [...scroller.querySelectorAll(".profile-page")], first = items[0].offsetTop, boundary = items[1].offsetTop - first;
      const start = Math.max(0, boundary - scroller.clientHeight);scroller.scrollTop = start + (boundary - start) * value;
    }, progress);
    await page.waitForTimeout(180);
  };

  await setProgress(.28);
  const stage = page.locator(".paper-turn-stage.is-profile-long-scroll");
  if (!await stage.count()) {
    const diagnostic = await page.evaluate(() => ({ scrollTop: document.querySelector(".profile-pages")?.scrollTop, pair: window.pagePaperTransition?.longScrollPair, request: window.pagePaperTransition?.longScrollRequest }));
    throw new Error(`long-scroll paper-turn stage missing: ${JSON.stringify({ diagnostic, warnings })}`);
  }
  const early = await stage.evaluate((node) => ({ ...node.dataset }));
  if (early.fromKey !== "profile:about" || early.toKey !== "profile:now") throw new Error(`wrong long-scroll pair: ${JSON.stringify(early)}`);
  if (early.renderMode !== "paper-crumple-turn") throw new Error(`long-scroll stage is not using the paper mesh: ${JSON.stringify({ early, warnings })}`);
  if (early.sourceCapture !== "live" || early.targetGeometry !== "flat") throw new Error(`long-scroll pages are not using stable live/flat layers: ${JSON.stringify(early)}`);
  if (early.composition !== "live-dom-seam") throw new Error(`long-scroll is still replacing the full live page: ${JSON.stringify(early)}`);
  await page.screenshot({ path: "tests/profile-paper-turn-28.png", fullPage: true });

  await page.waitForTimeout(900);
  const settled = await page.locator(".profile-pages").evaluate((node) => node.scrollTop);
  if (Math.abs(settled) > 1) throw new Error(`scroll did not magnetically settle to the first page: ${settled}`);
  if (await stage.count()) throw new Error("paper fold remained after magnetic settling");

  await setProgress(.62);
  await page.screenshot({ path: "tests/profile-paper-turn-62.png", fullPage: true });
  const later = Number(await stage.getAttribute("data-progress"));
  await setProgress(.4);
  const reversed = Number(await stage.getAttribute("data-progress"));
  if (!(reversed < later)) throw new Error(`reverse scroll was not reversible: ${later} -> ${reversed}`);

  await setProgress(.72);
  await page.waitForTimeout(900);
  const nextSettled = await page.locator(".profile-pages").evaluate((scroller) => {
    const items = [...scroller.querySelectorAll(".profile-page")], first = items[0].offsetTop;
    return { top: scroller.scrollTop, target: items[1].offsetTop - first };
  });
  if (Math.abs(nextSettled.top - nextSettled.target) > 1) throw new Error(`scroll did not magnetically settle to the next page: ${JSON.stringify(nextSettled)}`);

  await page.locator(".profile-pages").evaluate((scroller) => {
    const items = [...scroller.querySelectorAll(".profile-page")], first = items[0].offsetTop;scroller.scrollTop = items[1].offsetTop - first;
  });
  await stage.waitFor({ state: "detached", timeout: 3000 });
  if (!await page.locator('[data-profile-switch="now"].is-current').count()) throw new Error("navigation did not follow the long canvas");

  await page.locator('[data-profile-switch="contact"]').click();
  await page.waitForFunction(() => {
    const scroller = document.querySelector(".profile-pages"), items = [...scroller.querySelectorAll(".profile-page")], first = items[0].offsetTop;
    return Math.abs(scroller.scrollTop - (items[2].offsetTop - first)) < 3;
  }, null, { timeout: 5000 });
  if (!await page.locator('[data-profile-switch="contact"].is-current').count()) throw new Error("profile locator did not reach contact");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.addInitScript(() => localStorage.clear());
  await mobile.goto("http://127.0.0.1:4175/?profile-long-mobile=1", { waitUntil: "networkidle" });
  await mobile.locator('[data-profile-page="about"]').click();
  await mobile.locator("body.profile-open").waitFor({ state: "attached", timeout: 5000 });
  await mobile.waitForFunction(() => document.querySelectorAll(".profile-page:not([hidden])").length === 3, null, { timeout: 7000 });
  if (await mobile.locator(".profile-page:not([hidden])").count() !== 3) throw new Error("mobile profile canvas is not continuous");
  const mobileSize = await mobile.locator(".profile-pages").evaluate((node) => ({ scrollHeight: node.scrollHeight, clientHeight: node.clientHeight, width: node.scrollWidth, clientWidth: node.clientWidth }));
  if (mobileSize.scrollHeight <= mobileSize.clientHeight || mobileSize.width > mobileSize.clientWidth + 1) throw new Error(`mobile long canvas failed: ${JSON.stringify(mobileSize)}`);
  await mobile.locator(".profile-pages").evaluate((node) => { node.scrollTop = 240; });
  await mobile.waitForTimeout(180);
  if (await mobile.locator(".paper-turn-stage.is-profile-long-scroll").count()) throw new Error("mobile should prefer the readable native canvas over the WebGL paper fold");
  await mobile.close();

  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PROFILE_LONG_SCROLL_OK");
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
