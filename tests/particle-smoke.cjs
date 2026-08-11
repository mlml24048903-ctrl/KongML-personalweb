const {chromium}=require("C:/Users/mlml2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage({viewport:{width:1280,height:800}}),messages=[];
  page.on("console",message=>messages.push(`${message.type()}: ${message.text()}`));
  await page.addInitScript(()=>{localStorage.clear();localStorage.setItem("km-portfolio-desktop-mode-v1","code")});
  await page.goto("http://127.0.0.1:4175/?paper-turn-smoke=1",{waitUntil:"networkidle"});
  if(!await page.locator("body.code-desktop-mode").count())throw Error("code desktop state was not restored");
  const started=Date.now();
  await page.locator('[data-profile-page="about"]').click();
  let stageSeen=false,coverSeen=false,coverAt=0,stageAt=0;
  for(let index=0;index<32;index++){
    const stage=await page.locator(".paper-turn-stage").count(),cover=await page.locator(".paper-transition-cover").count();
    if(stage&&!stageSeen)stageAt=Date.now()-started;if(cover&&!coverSeen)coverAt=Date.now()-started;stageSeen ||= stage>0;coverSeen ||= cover>0;
    if(stage&&index>4){const state=await page.locator(".paper-turn-stage").evaluate(node=>({...node.dataset}));if(state.sourceCapture!=="live"||state.sourceState!=="code-desktop")throw Error(`outgoing desktop state was replaced: ${JSON.stringify(state)}`);if(state.targetGeometry!=="flat")throw Error(`incoming page is not flat: ${JSON.stringify(state)}`);await page.screenshot({path:"tests/paper-turn-live.png",fullPage:true});break}
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1800);
  if(!stageSeen)throw Error(`paper-turn stage missing cover=${coverSeen}\n${messages.join("\n")}`);
  if(await page.locator(".paper-transition-layer").count())throw Error("paper-turn layers were not cleaned up");
  console.log(`PAPER_TURN_SMOKE_OK cover=${coverAt}ms stage=${stageAt}ms total=${Date.now()-started}ms`);await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
