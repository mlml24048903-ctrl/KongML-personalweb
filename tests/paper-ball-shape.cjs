const { pathToFileURL } = require("url");
const path = require("path");
const { chromium } = require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 360 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname, "..", "index.html")).href);
  const measurements = await page.evaluate(() => {
    const stage = document.createElement("div");
    stage.style.cssText = "position:fixed;inset:0;background:#eee7d7;z-index:999999;display:flex;align-items:center;justify-content:center;gap:120px";
    document.body.append(stage);

    const makeBall = (className, label) => {
      const ball = document.createElement("div");
      ball.className = `${className} throwable-paper is-paper-ball`;
      ball.style.cssText = "position:relative;left:auto;top:auto;transform:none!important";
      ball.innerHTML = `<strong>${label}</strong>`;
      randomizePaperBall(ball);
      stage.append(ball);
      const style = getComputedStyle(ball);
      const rect = ball.getBoundingClientRect();
      return {
        label,
        width: rect.width,
        height: rect.height,
        minHeight: style.minHeight,
        aspect: rect.width / rect.height,
        clipPath: style.clipPath,
        childDisplay: getComputedStyle(ball.firstElementChild).display,
      };
    };

    return [makeBall("business-card", "名片"), makeBall("printed-document", "文件")];
  });

  for (const item of measurements) {
    if (Math.abs(item.aspect - 1) > 0.02) throw new Error(`${item.label} is not square: ${item.aspect}`);
    if (item.childDisplay !== "none") throw new Error(`${item.label} content remains visible`);
    if (item.label === "名片" && item.width !== 58) throw new Error(`business-card size ${item.width}`);
    if (item.label === "文件" && item.width !== 64) throw new Error(`printed-document size ${item.width}`);
  }
  const interaction = await page.evaluate(() => {
    const layer = document.getElementById("businessCardLayer");
    const card = document.createElement("div");
    card.className = "business-card throwable-paper is-paper-ball is-ball-flying";
    card.dataset.paperRadius = "29";
    card.style.left = "360px";
    card.style.top = "250px";
    randomizePaperBall(card);
    layer.append(card);
    card.style.transform = "translate(-50%,-50%) translate3d(42px,-68px,0) rotate(28deg)";
    const inlineTransform = card.style.transform;
    const computedTransform = getComputedStyle(card).transform;
    card.remove();

    const fullCard = document.createElement("div");
    fullCard.className = "business-card throwable-paper";
    fullCard.style.position = "fixed";
    fullCard.style.transform = "none";
    document.body.append(fullCard);
    const fullRect = fullCard.getBoundingClientRect();
    fullCard.remove();
    return { inlineTransform, computedTransform, fullWidth: fullRect.width, fullHeight: fullRect.height };
  });
  if (!interaction.inlineTransform.includes("translate3d")) throw new Error("physics did not write flight transform");
  if (interaction.computedTransform === "none") throw new Error("flight transform did not render");
  if (interaction.fullWidth !== 218 || Math.abs(interaction.fullHeight - 127) > 1) throw new Error(`full card size ${interaction.fullWidth}x${interaction.fullHeight}`);
  if (errors.length) throw new Error(errors.join("\n"));
  await page.screenshot({ path: path.resolve(__dirname, "paper-ball-shape.png") });
  console.log(JSON.stringify(measurements, null, 2));
  console.log(JSON.stringify(interaction, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
