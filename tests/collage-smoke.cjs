const {chromium}=require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text())});
  await page.addInitScript(()=>localStorage.clear());
  await page.goto("http://127.0.0.1:4175/?collage-smoke=1",{waitUntil:"networkidle"});
  await page.waitForTimeout(3000);
  await page.screenshot({path:"tests/collage-home.png",fullPage:true});
  for(const name of ["about","now","contact"]){
    const selector=`[data-profile-${name==="about"?"page":"switch"}="${name}"]`;
    await page.locator(selector).first().click();
    if(name==="about"){
      await page.waitForTimeout(360);
      await page.screenshot({path:"tests/collage-particles-mid.png",fullPage:true});
      await page.waitForTimeout(1900);
    }else await page.waitForTimeout(2800);
    await page.locator(`.profile-page--${name}.is-current`).waitFor();
    if(name==="about")console.log("KICKER_STYLE",await page.locator(".profile-page--about .profile-kicker").evaluate(node=>({display:getComputedStyle(node).display,width:getComputedStyle(node).width,parentDisplay:getComputedStyle(node.parentElement).display,rect:node.getBoundingClientRect().width})));
    await page.screenshot({path:`tests/collage-${name}.png`,fullPage:true});
  }
  await page.locator("#profileBack").click();
  await page.waitForTimeout(2260);
  if(await page.locator("body.profile-open").count())throw Error("profile did not close");
  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:"networkidle"});
  await page.locator('[data-profile-page="about"]').click();
  await page.waitForTimeout(3000);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
  if(overflow)throw Error("mobile horizontal overflow");
  await page.screenshot({path:"tests/collage-mobile-about.png",fullPage:true});
  if(errors.length)throw Error(errors.join("\n"));
  console.log("COLLAGE_SMOKE_OK");
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
