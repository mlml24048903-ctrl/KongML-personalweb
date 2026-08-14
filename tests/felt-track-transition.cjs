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
  const settledDesk = await page.locator(".outside-desk-panel").evaluate(element => ({
    visibility: getComputedStyle(element).visibility,
    opacity: Number.parseFloat(getComputedStyle(element).opacity),
    hiddenClass: element.classList.contains("is-track-hidden")
  }));
  if (settledDesk.visibility !== "visible" || settledDesk.opacity < .99 || settledDesk.hiddenClass) throw new Error(`offscreen desk was removed from the continuous strip: ${JSON.stringify(settledDesk)}`);
  await page.evaluate(() => {
    window.__reverseFrames = [];
    const sample = time => { window.__reverseFrames.push(time); if (window.__reverseFrames.length < 85) requestAnimationFrame(sample); };
    requestAnimationFrame(sample);
  });
  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(220);
  const reverseTrack = await page.locator("#outsideTrack").evaluate(element => {
    const rect = element.getBoundingClientRect();
    const desk = document.querySelector(".outside-desk-panel");
    return {
      left: rect.left,
      deskOpacity: Number.parseFloat(getComputedStyle(desk).opacity),
      deskVisibility: getComputedStyle(desk).visibility,
      travelingClass: document.body.classList.contains("is-outside-traveling")
    };
  });
  if (!(reverseTrack.left < -20 && reverseTrack.left > -1400)) throw new Error(`reverse track snapped instead of moving: ${JSON.stringify(reverseTrack)}`);
  if (reverseTrack.deskOpacity < .95) throw new Error(`desk did not appear continuously before entering frame: ${JSON.stringify(reverseTrack)}`);
  if (reverseTrack.deskVisibility !== "visible") throw new Error(`desk did not become visible before reverse motion: ${JSON.stringify(reverseTrack)}`);
  if (reverseTrack.travelingClass) throw new Error("legacy timer class is still controlling the transition");
  await page.screenshot({ path: "tests/felt-track-reverse-mid-v2.png", fullPage: true });
  await page.waitForTimeout(1000);
  const frameTiming = await page.evaluate(() => {
    const gaps = window.__reverseFrames.slice(1).map((time, index) => time - window.__reverseFrames[index]);
    return { maxGap: Math.max(...gaps), frames: window.__reverseFrames.length };
  });
  console.log("REVERSE_FRAME_TIMING", JSON.stringify(frameTiming));
  if (frameTiming.frames < 70 || frameTiming.maxGap > 90) throw new Error(`reverse animation stalled: ${JSON.stringify(frameTiming)}`);
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
