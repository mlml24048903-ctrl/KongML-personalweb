const {chromium}=require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.clear());
  await page.goto("http://127.0.0.1:4175/?workbench-modes=1",{waitUntil:"networkidle"});
  await page.mouse.wheel(0,-180);await page.waitForTimeout(1100);await page.locator("body.workspace-entered:not(.inner-mode)").waitFor();
  await page.screenshot({path:"tests/playful-outer.png",fullPage:true});
  await page.mouse.wheel(0,-180);await page.waitForTimeout(1100);await page.locator("body.inner-mode").waitFor();
  await page.screenshot({path:"tests/playful-inner.png",fullPage:true});
  if(errors.length)throw Error(errors.join("\n"));console.log("WORKBENCH_MODES_OK");await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
