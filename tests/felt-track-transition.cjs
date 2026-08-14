const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173/?view=felt-track-v2", { waitUntil: "networkidle" });
  await page.mouse.wheel(0, -180); await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -180); await page.waitForTimeout(240);
  const track = await page.locator("#outsideTrack").evaluate(element => {
    const style = getComputedStyle(element), rect = element.getBoundingClientRect();
    return { transform: style.transform, transition: style.transitionDuration, left: rect.left, width: rect.width };
  });
  if (!(track.left < -20 && track.left > -1400)) throw new Error(`track did not move continuously: ${JSON.stringify(track)}`);
  if (track.width < 2800) throw new Error(`track is not a shared 200vw strip: ${track.width}`);
  const seams = await page.evaluate(() => [
    [120, 120], [260, 120], [120, 820], [300, 820]
  ].map(([x, y]) => ({ x, y, layers: document.elementsFromPoint(x, y).slice(0, 6).map(element => ({ tag: element.tagName, id: element.id, cls: element.className, background: getComputedStyle(element).backgroundColor })) })));
  console.log("SEAM_LAYERS", JSON.stringify(seams));
  await page.screenshot({ path: "tests/felt-track-mid-v2.png", fullPage: true });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tests/felt-track-final-v2.png", fullPage: true });
  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(220);
  const reverseTrack = await page.locator("#outsideTrack").evaluate(element => {
    const rect = element.getBoundingClientRect();
    const desk = document.querySelector(".outside-desk-panel");
    return {
      left: rect.left,
      deskOpacity: Number.parseFloat(getComputedStyle(desk).opacity),
      travelingClass: document.body.classList.contains("is-outside-traveling")
    };
  });
  if (!(reverseTrack.left < -20 && reverseTrack.left > -1400)) throw new Error(`reverse track snapped instead of moving: ${JSON.stringify(reverseTrack)}`);
  if (reverseTrack.deskOpacity < .95) throw new Error(`desk did not appear continuously before entering frame: ${JSON.stringify(reverseTrack)}`);
  if (reverseTrack.travelingClass) throw new Error("legacy timer class is still controlling the transition");
  await page.screenshot({ path: "tests/felt-track-reverse-mid-v2.png", fullPage: true });
  await page.waitForTimeout(1000);
  const returned = await page.locator("#outsideTrack").evaluate(element => ({
    left: element.getBoundingClientRect().left,
    deskOpacity: Number.parseFloat(getComputedStyle(document.querySelector(".outside-desk-panel")).opacity)
  }));
  if (Math.abs(returned.left) > 2 || returned.deskOpacity < .99) throw new Error(`desk did not settle cleanly: ${JSON.stringify(returned)}`);
  await page.screenshot({ path: "tests/felt-track-reverse-final-v2.png", fullPage: true });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("FELT_TRACK_TRANSITION_OK");
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
