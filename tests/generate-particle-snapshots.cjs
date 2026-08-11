const {chromium}=require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const path=require("path"),fs=require("fs");
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage({viewport:{width:1440,height:900}});await page.emulateMedia({reducedMotion:"reduce"});
  const output=path.resolve(__dirname,"..","assets","snapshots");fs.mkdirSync(output,{recursive:true});
  await page.addInitScript(()=>localStorage.clear());await page.goto("http://127.0.0.1:4175/?snapshot-source=1",{waitUntil:"networkidle"});
  await page.screenshot({path:path.join(output,"home.png")});
  for(const name of ["about","now","contact"]){
    const selector=name==="about"?`[data-profile-page="${name}"]`:`[data-profile-switch="${name}"]`;
    await page.locator(selector).first().click();await page.waitForTimeout(240);
    await page.screenshot({path:path.join(output,`${name}.png`)});
  }
  console.log("KICKER",await page.locator(".profile-page--contact .profile-kicker").evaluate(node=>({display:getComputedStyle(node).display,width:getComputedStyle(node).width,parent:getComputedStyle(node.parentElement).display,rect:node.getBoundingClientRect().width})));
  console.log("SNAPSHOTS_OK");await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
