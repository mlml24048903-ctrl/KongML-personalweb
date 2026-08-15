const STORAGE={outerItems:"km-portfolio-outer-items-v4",innerItems:"km-portfolio-inner-items-v6",desktopMode:"km-portfolio-desktop-mode-v1"};
["km-portfolio-outer-items-v2","km-portfolio-outer-items-v3","km-portfolio-inner-items-v2","km-portfolio-inner-items-v3","km-portfolio-inner-items-v4","km-portfolio-inner-items-v5","km-portfolio-connections-v3"].forEach(key=>localStorage.removeItem(key));
const defaultOuterItems=[
{id:"note-edge",color:"orange",title:"\u4fdd\u6301\u950b\u8292",content:"\u5bf9\u4e16\u754c\u4fdd\u6301\u654f\u611f\uff0c\u5bf9\u7b54\u6848\u4fdd\u6301\u6000\u7591\u3002",x:.205,y:.2,rotation:-6},
{id:"note-unfinished",color:"bone",title:"\u4fdd\u6709\u91ce\u5fc3",content:"\u7edd\u4e0d\u6b62\u6b65\u4e8e\u8fc7\u5f80\u548c\u73b0\u5728\uff0c\u6c38\u8fdc\u8d70\u5411\u672a\u6765\uff0c\u63a2\u5bfb\u65b0\u7684\u9886\u57df\u3002",x:.75,y:.56,rotation:4},
{id:"note-next",color:"lime",title:"AI \u00d7 \u4ea7\u54c1 \u00d7 \u6587\u5316",content:"\u5728\u8bed\u8a00\u3001\u6587\u5316\u4e0e\u6280\u672f\u7684\u4ea4\u754c\u5904\uff0c\u5bfb\u627e\u65b0\u7684\u4f53\u9a8c\u3002",x:.14,y:.6,rotation:-2}
];
const defaultInnerItems=[
{id:"internships",kind:"folder",title:"实习经历",content:"> 两段实习，分别聚焦数字产品和商务合作。\n\n## 文件夹内容\n- 科技初创公司｜产品经理\n- 北京其遇文化｜商务合作",parentId:null,x:.12,y:.18},
{id:"campus",kind:"folder",title:"校园经历",content:"> 在校期间负责课程设计、团队协作与活动执行。\n\n## 文件夹内容\n- 启航团校｜执行校长",parentId:null,x:.34,y:.18},
{id:"portfolio",kind:"folder",title:"作品集",content:"> 三个从需求调研推进到原型或可运行版本的产品项目。\n\n## 文件夹内容\n- 探索季｜线下 AR 探索产品\n- 抚尘归心｜心理支持产品\n- 拾墨｜AI 学习资料整理工具",parentId:null,x:.56,y:.18},
{id:"intern-product",kind:"file",title:"科技初创公司｜产品经理",content:"> 负责探索季 H5，并参与微信小程序、商家端和运营后台的建设。\n\n## 主要工作\n- 根据线下场地的游玩过程整理需求和页面流程\n- 设计地图、AR 扫描、任务、图鉴和奖励等功能\n- 完成交互稿，并开发 H5 的主要页面\n- 参与小程序、商家端和后台的界面调整\n- 检查不同端的数据、页面状态和操作结果\n- 根据测试与现场使用情况修改功能和提示\n\n独立完成探索季 H5 从方案到可运行版本的主要工作，并整理产品说明和演示材料。",parentId:"internships",x:.5,y:.5},
{id:"intern-bd",kind:"file",title:"北京其遇文化｜商务合作",content:"> 为国际义工旅行和海外实习项目拓展高校组织、校园媒体与内容账号合作。\n\n## 主要工作\n- 通过社交平台、高校渠道和已有关系收集合作方信息\n- 根据学生触达能力、账号活跃度和内容方向筛选合作对象\n- 针对不同组织的关注点调整沟通内容\n- 跟进合作意向、内容发布和后续联系\n- 整理常用话术、合作记录和渠道资料\n\n这段经历让我积累了信息搜集、合作判断和对外沟通经验。",parentId:"internships",x:.5,y:.5},
{id:"campus-school",kind:"file",title:"启航团校｜执行校长",content:"> 担任南开大学汉语言文化学院启航团校执行校长，负责面向大一团员的课程设计和项目运行。\n\n## 主要工作\n- 制定培养计划，安排理论学习、技能训练和实践活动\n- 设计课程内容并整理讲授材料\n- 沟通授课嘉宾，协调时间与课程要求\n- 组织线上、线下课程和现场活动\n- 收集反馈并调整后续课程\n- 将课程资料整理为下一届可以继续使用的模板\n\n完成了从课程规划、人员协调到现场执行的完整工作。",parentId:"campus",x:.5,y:.5},
{id:"work-explore",kind:"folder",title:"探索季",content:"> 为线下商业场地设计的 AR 探索产品。游客通过地图寻找目标，用手机扫描现场图片或设备，完成 3D 互动、小游戏、任务和收集；商家可以在管理端设置活动内容并查看运营信息。\n\n## 产品组成\n- 游客端 H5 与微信小程序\n- 商家端与运营后台\n- 地图、AR 扫描、3D 互动、任务、图鉴与奖励\n\n## 文件夹内容\n- 产品与功能\n- 我的工作与成果",parentId:"portfolio",x:.5,y:.5},
{id:"work-fuchen",kind:"folder",title:"抚尘归心",content:"> 面向存在自我污名化和羞耻感的青年群体，提供测评、心理练习、知识内容、匿名支持与 AI 陪伴。\n\n项目希望用私密、低门槛的方式帮助使用者理解自己的感受，并在需要时找到专业支持。\n\n## 文件夹内容\n- 研究与产品方案\n- 我的工作与成果",parentId:"portfolio",x:.5,y:.5},
{id:"work-shimo",kind:"folder",title:"拾墨",content:"> 面向大学生的 AI 学习资料整理工具。它可以读取笔记、教材、文献和课程大纲，按课程章节整理内容，并生成辅助复习的材料。\n\n## 使用过程\n导入资料 → AI 读取与整理 → 对应课程章节 → 生成复习内容\n\n## 文件夹内容\n- 产品与 AI 功能\n- 我的工作与成果",parentId:"portfolio",x:.5,y:.5},
{id:"explore-product",kind:"file",title:"产品与功能",content:"> 探索季希望让游客在真实场地中主动寻找和发现内容，同时让商家可以持续更新活动，而不必为每次活动重新开发一套产品。\n\n## 游客端体验\n游客进入 H5 或小程序后，可以查看场地地图、不同区域和当前任务。到达对应区域后，使用手机摄像头扫描现场图片或设备；识别成功后，页面显示对应的 3D 内容、互动游戏或收集结果。完成互动可以推进任务、点亮图鉴，并根据活动设置领取积分、优惠券等奖励。\n\n扫描过程包含摄像头授权、识别引导、加载状态和结果反馈。对于识别失败、重复收集、设备未开放、网络异常等情况，页面会给出相应提示，并允许使用者重试或返回地图。\n\n## 商家端与后台\n商家可以设置场地、区域和地图，上传扫描图片，关联现场设备，并为不同目标配置 3D 模型、互动游戏、任务和奖励。后台还包括门店、会员、订单、账号、内容上线状态和运营信息等管理功能。\n\n通过这些设置，同一套产品可以适配不同场地和不同主题的活动。",parentId:"work-explore",x:.5,y:.5},
{id:"explore-contribution",kind:"file",title:"我的工作与成果",content:"> 独立推进探索季 H5 的产品设计与前端实现，并参与微信小程序、商家端和运营后台的建设。\n\n## 我的工作\n1. 根据线下游玩过程和商家运营需求，整理游客端与管理端的功能范围。\n2. 设计地图浏览、区域选择、AR 扫描、目标识别、3D 互动、任务、图鉴和奖励领取流程。\n3. 完成主要页面和状态的交互设计，包括首次引导、摄像头授权、加载、识别成功、识别失败和重复收集等情况。\n4. 将交互方案开发为可运行的 H5，并完成手机端显示和触控操作适配。\n5. 参与小程序、商家端和后台的页面调整，检查扫描目标、任务、奖励等数据在不同端是否一致。\n6. 根据测试结果持续修改页面布局、操作提示、跳转和异常处理，并整理产品文档与演示材料。\n\n## 项目成果\n完成探索季 H5 可运行版本，跑通“查看地图—寻找目标—AR 扫描—完成互动—收集图鉴—领取奖励”的主要流程。系统已支持图片或设备识别、3D 内容、互动游戏、任务进度、奖励领取，以及商家对地图、扫描目标、互动内容和奖励的设置。",parentId:"work-explore",x:.5,y:.5},
{id:"fuchen-plan",kind:"file",title:"研究与产品方案",content:"> 自我污名化是指一个人受到外界负面标签影响，并逐渐用这些标签否定自己。它可能带来羞耻、回避、求助意愿下降和社交退缩。\n\n项目围绕青年群体开展需求调研，并参考自我污名、认知行为疗法、叙事疗法和同伴支持等研究。产品从测评开始，根据使用者关注的问题推荐心理练习、知识内容和支持资源，同时明确测评不能代替专业诊断。\n\n## 主要功能\n- 自我污名化测评与阶段对比\n- 帮助使用者识别负面标签的心理练习\n- 情绪安抚、知识内容和专业求助资源\n- 匿名交流与同伴支持\n- AI 陪伴、复测提醒和内容推荐\n\n产品强调隐私保护、匿名使用和低门槛支持。",parentId:"work-fuchen",x:.5,y:.5},
{id:"fuchen-result",kind:"file",title:"我的工作与成果",content:"> 参与大学生群体需求调研和产品定位，协助将心理学方法整理为可以在产品中使用的测评、练习和内容模块。\n\n## 我的工作\n- 参与访谈与资料整理，归纳使用者关注的问题\n- 参与功能讨论，明确测评、心理练习、内容推荐和支持入口\n- 协助整理量表、知识内容和产品说明\n- 负责产品视觉呈现和主要页面效果\n- 主导演示视频的内容结构、画面安排与后期制作\n\n项目完成了移动端、管理后台和多组 H5 测评原型，并制作了完整演示视频。",parentId:"work-fuchen",x:.5,y:.5},
{id:"shimo-plan",kind:"file",title:"产品与 AI 功能",content:"> 大学生的课堂笔记、教材、文献和课程大纲通常分散在不同文件中，复习时需要花费大量时间重新整理。拾墨借助 AI 读取这些资料，将内容对应到课程章节，减少整理时间。\n\n使用者可以导入 PDF、图片、文本和课程大纲。系统通过 OCR 识别图片文字，提取课程大纲，拆分笔记内容，并将笔记匹配到相应章节；匹配不准确时可以手动修改。\n\n## 主要功能\n- 笔记、教材、文献和课程大纲导入\n- OCR 图片文字识别\n- 大纲提取、笔记分类和章节匹配\n- 章节进度与教材页码对应\n- 摘要、思维导图、知识问答和复习闪卡\n- 内容来源查看、手动修改和导出",parentId:"work-shimo",x:.5,y:.5},
{id:"shimo-result",kind:"file",title:"我的工作与成果",content:"> 独立负责拾墨从需求调研到网页端 MVP 的主要工作，并使用真实课程资料进行测试。\n\n## 我的工作\n- 开展用户调研，整理学习资料管理与复习中的主要问题\n- 明确产品定位、使用流程和功能范围，输出 PRD\n- 设计资料导入、课程整理、章节查看和复习页面\n- 使用 Coze 搭建 AI 工作流并接入大模型 API\n- 实现 OCR 解析、大纲提取、笔记分类和复习闪卡生成\n- 完成网页端开发部署和完整演示视频\n\n项目跑通“资料导入—AI 读取与整理—章节对应—复习内容生成”的主要流程。",parentId:"work-shimo",x:.5,y:.5}
];const clone=v=>structuredClone(v);
function load(k,f){try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:clone(f)}catch{return clone(f)}}
function loadOuterItems(){
  const saved=load(STORAGE.outerItems,defaultOuterItems),defaults=new Map(defaultOuterItems.map(item=>[item.id,item]));
  const fixed=defaultOuterItems.map(item=>{const current=saved.find(entry=>entry.id===item.id);return current?{...current,title:item.title,content:item.content,color:item.color,rotation:item.rotation}:clone(item)});
  return [...fixed,...saved.filter(item=>!defaults.has(item.id))];
}
const discoveredInteractions=new Set();
function interactionSeen(key){return discoveredInteractions.has(key)}
function markInteraction(key){
  if(discoveredInteractions.has(key))return;
  discoveredInteractions.add(key);
  const hint=document.getElementById("interactionHint");if(hint?.dataset.key?.split(" ").includes(key))hideInteractionHint();
}
function pendingPaperHint(){return interactionSeen("paper-guide")?"":"单击团起 · 双击放大"}
function hintForTarget(target){
  if(target.matches(".desk-printer")&&!interactionSeen("printer"))return{key:"printer",text:"打印机已就绪……",kind:"ring-arrow",place:"right"};
  if(target.matches(".throwable-paper:not(.is-paper-ball):not(.is-crumpling)")){const text=pendingPaperHint();if(text)return{key:"paper-guide",text,kind:"ring-arrow",place:"paper"}}
  if(target.matches(".monitor-screen")&&state.level===0&&!interactionSeen("scroll-in"))return{key:"scroll-in",text:"向前滚动，走进屏幕外",kind:"ring-arrow",place:"screen"};
  if(target.matches(".computer-tower")&&!interactionSeen("power"))return{key:"power",text:"关机逃离工作（？",kind:"ring-arrow",place:"tower"};
  if(target.matches(".mouse")&&!interactionSeen("mouse"))return{key:"mouse",text:"是时候更进一步",kind:"ring-arrow",place:"mouse"};
  return null;
}
function ensureInteractionHint(){
  let hint=document.getElementById("interactionHint");if(hint)return hint;
  hint=document.createElement("div");hint.id="interactionHint";hint.className="interaction-hint";hint.setAttribute("aria-hidden","true");hint.innerHTML='<svg class="hint-ring-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="hint-ring hint-ring-a" d="M8 50 C7 19 25 7 53 8 C82 8 95 25 93 53 C91 82 72 94 45 92 C18 91 5 75 8 50Z"/><path class="hint-ring hint-ring-b" d="M10 47 C12 18 31 5 58 10 C87 13 97 32 90 61 C84 87 61 96 35 89 C12 83 3 67 10 47Z"/></svg><svg class="hint-pointer-svg"><path class="hint-arrow"/></svg><span></span>';
  document.body.append(hint);return hint;
}
function positionInteractionHintLabel(hint,config,r){
  const label=hint.querySelector("span"),box=label.getBoundingClientRect(),ringX=r.width*.03,ringY=r.height*.03,topGap=30,sideGap=34;
  let x=r.left+r.width*.5-box.width*.5,y=r.top-ringY-box.height-topGap;
  if(config.place==="right"){x=r.right+ringX+sideGap;y=r.top+r.height*.34}
  if(config.place==="tower"){x=r.left-ringX-box.width-sideGap;y=r.top+r.height*.42}
  if(config.place==="mouse"){x=r.left-ringX-box.width-sideGap;y=r.top+r.height*.28}

  x=Math.max(12,Math.min(innerWidth-box.width-12,x));y=Math.max(12,Math.min(innerHeight-box.height-12,y));
  label.style.left=`${x-r.left}px`;label.style.top=`${y-r.top}px`;
}
function positionInteractionHintArrow(hint,config,r){
  const label=hint.querySelector("span").getBoundingClientRect(),svg=hint.querySelector(".hint-pointer-svg"),arrow=svg.querySelector(".hint-arrow"),side=config.place==="right"||config.place==="tower"||config.place==="mouse";
  svg.style.left=`${-r.left}px`;svg.style.top=`${-r.top}px`;svg.style.width=`${innerWidth}px`;svg.style.height=`${innerHeight}px`;
  let sx=label.left+label.width*.5,sy=label.bottom+5,ex=Math.max(18,Math.min(innerWidth-18,r.left+r.width*.5)),ey=r.top-r.height*.02;
  if(config.place==="right"){sx=label.left-6;sy=label.top+label.height*.5;ex=r.right+r.width*.025;ey=r.top+r.height*.5}
  if(config.place==="tower"){sx=label.right+6;sy=label.top+label.height*.5;ex=r.left+r.width*.01;ey=r.top+r.height*.52}
  if(config.place==="mouse"){sx=label.right+6;sy=label.top+label.height*.5;ex=r.left+r.width*.01;ey=r.top+r.height*.48}
  const vx=ex-sx,vy=ey-sy,len=Math.max(1,Math.hypot(vx,vy)),ux=vx/len,uy=vy/len,px=-uy,py=ux,bow=Math.min(16,len*.16),c1x=sx+vx*.34+px*bow,c1y=sy+vy*.34+py*bow,c2x=ex-ux*len*.24,c2y=ey-uy*len*.24,size=12,wing=8,ax=ex-ux*size,ay=ey-uy*size;
  arrow.setAttribute("d",`M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey} M ${ax-uy*wing} ${ay+ux*wing} L ${ex} ${ey} L ${ax+uy*wing} ${ay-ux*wing}`);
}
function showInteractionHint(target){
  const config=hintForTarget(target);if(!config)return hideInteractionHint();
  const hint=ensureInteractionHint();cancelAnimationFrame(hint._followRaf);hint.dataset.key=config.key;hint.dataset.kind=config.kind;hint.dataset.place=config.place;hint.querySelector("span").textContent=config.text;hint.classList.add("is-visible");hint._target=target;
  const follow=()=>{if(hint._target!==target||!hint.classList.contains("is-visible"))return;const r=target.getBoundingClientRect();hint.style.left=`${r.left}px`;hint.style.top=`${r.top}px`;hint.style.width=`${r.width}px`;hint.style.height=`${r.height}px`;positionInteractionHintLabel(hint,config,r);positionInteractionHintArrow(hint,config,r);hint._followRaf=requestAnimationFrame(follow)};follow();
}
function hideInteractionHint(){const hint=document.getElementById("interactionHint");if(hint){cancelAnimationFrame(hint._followRaf);hint.classList.remove("is-visible");hint._target=null}}
function bindInteractionHints(){
  const selector=".desk-printer,.throwable-paper,.monitor-screen,.computer-tower,.mouse";
  document.addEventListener("pointerover",e=>{const target=e.target.closest(selector);if(target&&!target.contains(e.relatedTarget))showInteractionHint(target)});
  document.addEventListener("pointerout",e=>{const target=e.target.closest(selector);if(target&&!target.contains(e.relatedTarget))hideInteractionHint()});
  document.addEventListener("pointermove",e=>{
    if(state.level!==0||interactionSeen("scroll-in"))return;
    const screen=document.getElementById("monitorScreen"),hint=document.getElementById("interactionHint");
    if(e.target.closest(".desk-printer,.throwable-paper,.computer-tower,.mouse,.outer-item")){if(hint?._target===screen)hideInteractionHint();return}
    const r=screen.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
    if(inside&&hint?._target!==screen)showInteractionHint(screen);else if(!inside&&hint?._target===screen)hideInteractionHint();
  });
  window.addEventListener("scroll",hideInteractionHint,{passive:true});
}
localStorage.setItem(STORAGE.desktopMode,"code");
const state={level:0,outsideBoard:false,swipeStartX:0,swipeStartY:0,outerItems:loadOuterItems(),innerItems:load(STORAGE.innerItems,defaultInnerItems),dialogContext:null,wheelAmount:0,wheelDirection:0,wheelLocked:false,activeFolderId:null,draggedInnerId:null,zIndex:60,codeMode:true,noteImageData:"",noteDoodleData:"",noteDoodleDirty:false,printQueue:[]};
const els={body:document.body,stage:document.getElementById("computerStage"),outsideTrack:document.getElementById("outsideTrack"),outsideDesk:document.querySelector(".outside-desk-panel"),feltBoard:document.getElementById("feltBoard"),enterMouse:document.getElementById("enterMouse"),toolbar:document.getElementById("workspaceToolbar"),modeGuide:document.getElementById("modeGuide"),modeLabel:document.getElementById("modeLabel"),modeDescription:document.getElementById("modeDescription"),outerItems:document.getElementById("outerItems"),retroDesktop:document.getElementById("retroDesktop"),customInnerItems:document.getElementById("customInnerItems"),windowLayer:document.getElementById("windowLayer"),dialog:document.getElementById("itemDialog"),dialogTitle:document.getElementById("dialogTitle"),itemForm:document.getElementById("itemForm"),itemTitle:document.getElementById("itemTitle"),itemContent:document.getElementById("itemContent"),colorField:document.getElementById("colorField"),zoomMeter:document.querySelector("#zoomMeter span"),zoomLabel:document.querySelector("#zoomMeter small"),toast:document.getElementById("toast"),powerButton:document.getElementById("powerButton"),noteMediaTools:document.getElementById("noteMediaTools"),noteImageInput:document.getElementById("noteImageInput"),noteImagePreview:document.getElementById("noteImagePreview"),noteDoodle:document.getElementById("noteDoodle"),clearNoteImage:document.getElementById("clearNoteImage"),clearDoodle:document.getElementById("clearDoodle")};
function persist(){localStorage.setItem(STORAGE.outerItems,JSON.stringify(state.outerItems));localStorage.setItem(STORAGE.innerItems,JSON.stringify(state.innerItems))}
function esc(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function inlineMd(v){return esc(v).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/`([^`]+)`/g,'<span class="md-tag">$1</span>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*]+)\*/g,"$1<em>$2</em>")}
function markdownToHTML(md=""){const lines=String(md).replace(/\r/g,"").split("\n");let h="",list=null;const close=()=>{if(list){h+=`</${list}>`;list=null}};for(const line of lines){const hd=line.match(/^(#{1,3})\s+(.+)$/),ul=line.match(/^[-*]\s+(.+)$/),ol=line.match(/^\d+\.\s+(.+)$/);if(hd){close();h+=`<h${hd[1].length}>${inlineMd(hd[2])}</h${hd[1].length}>`}else if(line.startsWith("> ")){close();h+=`<blockquote>${inlineMd(line.slice(2))}</blockquote>`}else if(ul){if(list!=="ul"){close();list="ul";h+="<ul>"}h+=`<li>${inlineMd(ul[1])}</li>`}else if(ol){if(list!=="ol"){close();list="ol";h+="<ol>"}h+=`<li>${inlineMd(ol[1])}</li>`}else if(!line.trim())close();else{close();h+=`<p>${inlineMd(line)}</p>`}}close();return h||"<p>NO CONTENT</p>"}

function finishMonitorTravel(stage,shell,monitor,animations){
  const cleanup=()=>{
    stage.classList.remove("is-mode-traveling");
    shell.classList.remove("is-mode-traveling");
    monitor.classList.remove("is-mode-traveling");
  };
  Promise.allSettled(animations.map(animation=>animation.finished)).then(cleanup);
  setTimeout(cleanup,1050);
}
function animateMonitorTravel(stage,shell,monitor,firstStage,firstMonitor){
  const lastStage=stage.getBoundingClientRect(),lastMonitor=monitor.getBoundingClientRect();
  if(!firstStage.width||!lastStage.width||!firstMonitor.width||!lastMonitor.width){stage.classList.remove("is-mode-traveling");shell.classList.remove("is-mode-traveling");monitor.classList.remove("is-mode-traveling");return}
  const stageDx=firstStage.left-lastStage.left,stageDy=firstStage.top-lastStage.top;
  const scale=firstMonitor.width/lastMonitor.width;
  const firstLocalX=firstMonitor.left-firstStage.left,firstLocalY=firstMonitor.top-firstStage.top;
  const lastLocalX=lastMonitor.left-lastStage.left,lastLocalY=lastMonitor.top-lastStage.top;
  const dx=firstLocalX-lastLocalX*scale;
  const dy=firstLocalY-lastLocalY*scale;
  const stageAnimation=stage.animate(
    [
      {translate:`${stageDx}px ${stageDy}px`},
      {translate:"0 0"}
    ],
    {duration:980,easing:"cubic-bezier(.16,1,.3,1)"}
  );
  const monitorAnimation=shell.animate(
    [
      {transform:`translate(${dx}px,${dy}px) scale(${scale})`},
      {transform:"translate(0,0) scale(1)"}
    ],
    {duration:980,easing:"cubic-bezier(.16,1,.3,1)"}
  );
  finishMonitorTravel(stage,shell,monitor,[stageAnimation,monitorAnimation]);
}
function alignOuterMonitorStand(){
  const monitor=document.querySelector(".monitor-wrap"),base=document.querySelector(".monitor-base");
  if(!monitor||!base)return;
  monitor.style.setProperty("--stand-shift-y","0px");
  if(state.level===2||innerWidth<=900)return;
  const delta=innerHeight-base.getBoundingClientRect().bottom;
  monitor.style.setProperty("--stand-shift-y",`${delta.toFixed(2)}px`);
}
let outsideSlideToken=0,outsideSlideTimer=0;
function setOutsideBoard(open){
  if(state.level!==1)return;
  const next=Boolean(open),changed=state.outsideBoard!==next,token=++outsideSlideToken;
  state.outsideBoard=next;
  const applyPosition=()=>{
    if(token!==outsideSlideToken)return;
    els.body.classList.toggle("message-board-open",state.outsideBoard);
    clearTimeout(outsideSlideTimer);
    outsideSlideTimer=setTimeout(()=>els.outsideTrack.classList.remove("is-sliding"),1120);
  };
  if(changed){
    els.outsideTrack.classList.add("is-sliding");
    requestAnimationFrame(()=>requestAnimationFrame(applyPosition));
  }else applyPosition();
  els.feltBoard.setAttribute("aria-hidden",String(!state.outsideBoard));
  els.feltBoard.inert=!state.outsideBoard;
  els.toolbar.hidden=state.outsideBoard;
  els.modeLabel.textContent=state.outsideBoard?"留言 / 02":"屏幕外模式 / 01";
  els.modeDescription.textContent=state.outsideBoard?"反向滑动回到桌面":"点击文件夹或鼠标进入屏幕，滑动前往留言";
  hideInteractionHint();
  window.dispatchEvent(new CustomEvent("feltboardvisibility",{detail:{open:state.outsideBoard}}));
}
function setLevel(n,openId){
  const l=Math.max(0,Math.min(2,n));
  const levelChanged=state.level!==l,monitor=document.querySelector(".monitor-wrap"),shell=document.querySelector(".monitor-motion-shell");
  const firstStage=levelChanged?els.stage.getBoundingClientRect():null,firstMonitor=levelChanged?monitor.getBoundingClientRect():null;
  if(levelChanged){els.stage.getAnimations().forEach(animation=>animation.cancel());shell.getAnimations().forEach(animation=>animation.cancel());els.stage.classList.add("is-mode-traveling");shell.classList.add("is-mode-traveling");monitor.classList.add("is-mode-traveling")}
  state.level=l;
  if(l!==1){state.outsideBoard=false;els.body.classList.remove("message-board-open");els.feltBoard.setAttribute("aria-hidden","true");els.feltBoard.inert=true}
  els.body.classList.toggle("workspace-entered",l>0);
  els.body.classList.toggle("inner-mode",l===2);
  els.stage.classList.toggle("entered",l>0);
  alignOuterMonitorStand();
  if(firstMonitor)requestAnimationFrame(()=>animateMonitorTravel(els.stage,shell,monitor,firstStage,firstMonitor));
  els.toolbar.hidden=l!==1;
  els.modeGuide.hidden=l===0;
  if(l===1){
    setOutsideBoard(false);
  }else{
    els.modeLabel.textContent=state.codeMode?"\u4ee3\u7801\u76ee\u5f55 / 02":"\u50cf\u7d20\u684c\u9762 / 02";
    els.modeDescription.textContent="\u5411\u540e\u6eda\u52a8\u53ef\u9000\u56de\u5c4f\u5e55\u5916\u3002";
    if(!els.customInnerItems.childElementCount)renderInnerItems();
    else if(state.codeMode&&!els.retroDesktop.querySelector(".code-desktop-tree"))renderCodeTree();
    if(openId)openItemWindow(openId);
  }
  state.wheelAmount=0;
  els.zoomMeter.style.width="0";
}
function renderOuterItems(){
  els.outerItems.innerHTML="";
  state.outerItems.forEach(item=>{
    const n=document.createElement("article"),image=safeImage(item.imageData),doodle=safeImage(item.doodleData);
    n.className="outer-item";n.dataset.id=item.id;n.dataset.color=item.color;n.dataset.shape=[...item.id].reduce((a,c)=>a+c.charCodeAt(0),0)%3;
    n.style.left=`${item.x*100}%`;n.style.top=`${item.y*100}%`;n.style.setProperty("--rotation",`${item.rotation||0}deg`);
    const media=image||doodle?`<div class="sticky-media${doodle&&!image?" is-doodle-only":""}">${image?`<img src="${image}" alt="" />`:""}${doodle?`<img class="sticky-doodle" src="${doodle}" alt="" />`:""}</div>`:"";
    n.classList.toggle("has-media",!!media);
    n.innerHTML=`<span class="sticky-paper" aria-hidden="true"></span><span class="sticky-grain" aria-hidden="true"></span>${media}<button class="delete-item" type="button">\u00d7</button><div class="sticky-copy"><h3>${esc(item.title)}</h3><p>${esc(item.content)}</p></div><small>\u4fbf\u7b7e / \u53cc\u51fb\u7f16\u8f91</small>`;
    bindOuterItem(n,item);els.outerItems.append(n);
  });
}
function bindOuterItem(n,item){
  let d=null,raf=0;
  const follow=()=>{
    if(!d)return;
    d.cx+=(d.tx-d.cx)*.115;
    d.cy+=(d.ty-d.cy)*.115;
    d.sway+=(d.swayTarget-d.sway)*.14;
    d.swayTarget*=.91;
    item.x=d.cx;item.y=d.cy;
    n.style.left=`${d.cx*100}%`;n.style.top=`${d.cy*100}%`;
    n.style.setProperty("--sway",`${d.sway.toFixed(2)}deg`);
    raf=requestAnimationFrame(follow);
  };
  n.addEventListener("pointerdown",e=>{
    if(e.target.closest(".delete-item"))return;
    const r=els.outerItems.getBoundingClientRect();
    d={sx:e.clientX,sy:e.clientY,x:item.x*r.width,y:item.y*r.height,r,lx:e.clientX,lt:e.timeStamp,cx:item.x,cy:item.y,tx:item.x,ty:item.y,sway:0,swayTarget:0};
    n.style.setProperty("--sway","0deg");n.classList.remove("is-landing");n.classList.add("is-pressed","is-dragging");
    n.setPointerCapture(e.pointerId);cancelAnimationFrame(raf);follow();
  });
  n.addEventListener("pointermove",e=>{
    if(!d)return;
    const dt=Math.max(8,e.timeStamp-d.lt),dx=e.clientX-d.lx,vx=dx/dt;
    d.swayTarget=Math.max(-10.5,Math.min(10.5,vx*18+Math.sign(dx||1)*1.6));
    d.lx=e.clientX;d.lt=e.timeStamp;
    d.tx=Math.max(.035,Math.min(.965,(d.x+e.clientX-d.sx)/d.r.width));
    d.ty=Math.max(.04,Math.min(.94,(d.y+e.clientY-d.sy)/d.r.height));document.getElementById("deskTrash").classList.toggle("is-trash-target",!!trashAt(e.clientX,e.clientY));
  });
  const land=e=>{
    if(!d)return;
    const trash=e&&trashAt(e.clientX,e.clientY);document.getElementById("deskTrash").classList.remove("is-trash-target");
    if(trash){cancelAnimationFrame(raf);d=null;n.classList.remove("is-pressed","is-dragging");n.classList.add("is-note-discarding");setTimeout(()=>{state.outerItems=state.outerItems.filter(x=>x.id!==item.id);persist();renderOuterItems()},520);return}
    const targetX=d.tx,targetY=d.ty,releaseSway=d.sway,landedRotation=Math.max(-13,Math.min(13,(item.rotation||0)+releaseSway*.72));
    cancelAnimationFrame(raf);d=null;
    item.x=targetX;item.y=targetY;item.rotation=landedRotation;
    n.style.setProperty("--rotation",`${landedRotation.toFixed(2)}deg`);n.style.setProperty("--sway","0deg");
    n.style.left=`${targetX*100}%`;n.style.top=`${targetY*100}%`;
    n.classList.remove("is-pressed","is-dragging");n.classList.add("is-landing");
    setTimeout(()=>{n.classList.remove("is-landing");n.style.setProperty("--sway","0deg")},920);
    persist();
  };
  n.addEventListener("pointerup",land);n.addEventListener("pointercancel",land);n.addEventListener("dblclick",e=>{e.stopPropagation();openItemDialog({scope:"outer",action:"edit",item})});
  n.querySelector(".delete-item").addEventListener("click",e=>{e.stopPropagation();state.outerItems=state.outerItems.filter(x=>x.id!==item.id);persist();renderOuterItems()});
}
const COMPACT_DESKTOP=matchMedia("(max-width:720px)").matches,DESKTOP_GRID=(COMPACT_DESKTOP?[.12,.37,.62,.87].flatMap(x=>[.17,.39,.61,.83].map(y=>({x,y}))):[.1,.25,.4,.55,.7,.85].flatMap(x=>[.2,.45,.7].map(y=>({x,y})))),PRINTER_DESKTOP_SLOT=COMPACT_DESKTOP?{x:.87,y:.83}:{x:.85,y:.7};
function desktopGridIndex(x,y){let best=0,score=Infinity;DESKTOP_GRID.forEach((p,index)=>{const d=(p.x-x)**2+(p.y-y)**2;if(d<score){score=d;best=index}});return best}
function nearestDesktopSlot(x=.1,y=.2,excludeId){const occupied=new Set([desktopGridIndex(PRINTER_DESKTOP_SLOT.x,PRINTER_DESKTOP_SLOT.y)]);state.innerItems.filter(i=>!i.parentId&&i.id!==excludeId).forEach(i=>occupied.add(desktopGridIndex(i.x,i.y)));const ranked=DESKTOP_GRID.map((p,index)=>({p,index,d:(p.x-x)**2+(p.y-y)**2})).sort((a,b)=>a.d-b.d);return clone((ranked.find(v=>!occupied.has(v.index))||ranked[0]).p)}
function normalizeDesktopGrid(){const used=new Set([desktopGridIndex(PRINTER_DESKTOP_SLOT.x,PRINTER_DESKTOP_SLOT.y)]);state.innerItems.filter(i=>!i.parentId).forEach(i=>{const ranked=DESKTOP_GRID.map((p,index)=>({p,index,d:(p.x-i.x)**2+(p.y-i.y)**2})).sort((a,b)=>a.d-b.d),slot=ranked.find(v=>!used.has(v.index))||ranked[0];used.add(slot.index);i.x=slot.p.x;i.y=slot.p.y})}
function nextPos(excludeId){return nearestDesktopSlot(.1,.2,excludeId)}
function iconHTML(i){return `<span class="pixel-icon ${i.kind==="folder"?"pixel-folder":"pixel-file"}"></span><span>${esc(i.title)}</span>`}
const codeTreeExpanded=new Set(),codeFileExpanded=new Set();
function codeDisplayName(item){if(item.kind==="folder")return `${item.title.replace(/\/$/,"")}/`;return /\.[a-z0-9]+$/i.test(item.title)?item.title:`${item.title}.md`}
function renderCodeTree(){
  const previousTree=els.retroDesktop.querySelector(".code-desktop-tree"),previousScroll=previousTree?.scrollTop||0;previousTree?.remove();
  const tree=document.createElement("section");tree.className="code-desktop-tree";tree.setAttribute("aria-label","可展开的个人作品文件目录");
  tree.innerHTML='<header><span>kong@portfolio</span>:<b>~/desktop</b>$ tree --interactive</header><p class="code-tree-help"># 单击文件夹展开目录 · 单击文件阅读内容</p><div class="code-tree-root"></div>';
  const root=tree.querySelector(".code-tree-root");
  const build=(parentId,depth=0)=>{
    const branch=document.createElement("div");branch.className="code-tree-branch";branch.style.setProperty("--tree-depth",depth);
    state.innerItems.filter(item=>(item.parentId||null)===(parentId||null)).forEach(item=>{
      const node=document.createElement("article"),open=item.kind==="folder"?codeTreeExpanded.has(item.id):codeFileExpanded.has(item.id);node.className=`code-tree-node is-${item.kind}${open?" is-open":""}`;node.dataset.innerId=item.id;
      const toggle=document.createElement("button");toggle.type="button";toggle.className="code-tree-toggle";toggle.setAttribute("aria-expanded",String(open));toggle.innerHTML=`<span class="code-tree-caret">${item.kind==="folder"?">":"·"}</span><span class="code-tree-type">${item.kind==="folder"?"[DIR]":"[MD]"}</span><span class="code-tree-name">${esc(codeDisplayName(item))}</span><span class="code-tree-action">${open?"收起":"展开"}</span>`;
      node.append(toggle);
      const actions=document.createElement("div");actions.className="code-tree-actions";actions.innerHTML='<button type="button" data-code-edit>编辑</button><button type="button" data-code-delete>删除</button>';
      actions.querySelector("[data-code-edit]").onclick=e=>{e.stopPropagation();openItemDialog({scope:"inner",action:"edit",kind:item.kind,item})};
      actions.querySelector("[data-code-delete]").onclick=e=>{e.stopPropagation();deleteItem(item.id)};
      node.append(actions);
      if(item.kind==="folder"){
        const children=build(item.id,depth+1);children.hidden=!open;node.append(children);
        toggle.onclick=()=>{codeTreeExpanded.has(item.id)?codeTreeExpanded.delete(item.id):codeTreeExpanded.add(item.id);renderCodeTree()};
      }else{
        const content=document.createElement("div");content.className="code-file-content markdown-view";content.hidden=!open;content.innerHTML=`<div class="code-file-command">$ cat ${esc(codeDisplayName(item))}</div>${markdownToHTML(item.content)}`;node.append(content);
        toggle.onclick=()=>{codeFileExpanded.has(item.id)?codeFileExpanded.delete(item.id):codeFileExpanded.add(item.id);renderCodeTree()};
      }
      branch.append(node);
    });
    return branch;
  };
  root.append(build(null));
  const printer=document.createElement("button");printer.type="button";printer.className="code-tree-printer";printer.innerHTML='<span>&gt;</span><b>[SYS]</b><span>printer.queue</span><small>点击打开打印机</small>';printer.onclick=openPrinterWindow;root.append(printer);
  els.retroDesktop.append(tree);tree.scrollTop=previousScroll;
}
function revealCodeTreeItem(id){
  const item=state.innerItems.find(entry=>entry.id===id);if(!item)return;
  let parentId=item.parentId;while(parentId){codeTreeExpanded.add(parentId);parentId=state.innerItems.find(entry=>entry.id===parentId)?.parentId||null}
  if(item.kind==="folder")codeTreeExpanded.add(item.id);else codeFileExpanded.add(item.id);
  renderCodeTree();requestAnimationFrame(()=>{const node=els.retroDesktop.querySelector(`.code-tree-node[data-inner-id="${CSS.escape(item.id)}"]`);if(!node)return;node.scrollIntoView({block:"center",behavior:"smooth"});node.classList.add("is-revealed");setTimeout(()=>node.classList.remove("is-revealed"),900)});
}let desktopGridReady=false;
function renderInnerItems(){if(!desktopGridReady){normalizeDesktopGrid();desktopGridReady=true;persist()}els.customInnerItems.innerHTML="";state.innerItems.filter(i=>!i.parentId).forEach(i=>{const n=document.createElement("div");n.className="retro-icon custom-inner-icon";n.tabIndex=0;n.dataset.innerId=i.id;n.dataset.kind=i.kind;n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);n.innerHTML=iconHTML(i);bindDesktopItem(n,i);els.customInnerItems.append(n)});const printer=document.createElement("button");printer.type="button";printer.className="retro-icon system-printer-icon";printer.style.setProperty("--x",`${PRINTER_DESKTOP_SLOT.x*100}%`);printer.style.setProperty("--y",`${PRINTER_DESKTOP_SLOT.y*100}%`);printer.innerHTML=`<span class="pixel-icon pixel-printer-icon"><i></i></span><span>\u6253\u5370\u673a</span>`;printer.onclick=openPrinterWindow;els.customInnerItems.append(printer);renderCodeTree()}
function bindDesktopItem(n,i){let d=null,moved=false;n.addEventListener("pointerdown",e=>{const r=els.retroDesktop.getBoundingClientRect();d={sx:e.clientX,sy:e.clientY,x:i.x*r.width,y:i.y*r.height,r};moved=false;n.setPointerCapture(e.pointerId)});n.addEventListener("pointermove",e=>{if(!d)return;const dx=e.clientX-d.sx,dy=e.clientY-d.sy;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;n.classList.add("is-dragging")}i.x=Math.max(.04,Math.min(.96,(d.x+dx)/d.r.width));i.y=Math.max(.08,Math.min(.9,(d.y+dy)/d.r.height));n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`)});n.addEventListener("pointerup",e=>{if(!d)return;n.classList.remove("is-dragging");const f=[...els.customInnerItems.querySelectorAll('[data-kind="folder"]')].find(x=>{if(x===n)return false;const r=x.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});if(moved&&f)moveItem(i.id,f.dataset.innerId);else{if(moved){const slot=nearestDesktopSlot(i.x,i.y,i.id);i.x=slot.x;i.y=slot.y;n.classList.add("is-snapping");n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);setTimeout(()=>n.classList.remove("is-snapping"),360)}persist()}d=null});n.addEventListener("pointercancel",()=>{if(!d)return;const slot=nearestDesktopSlot(i.x,i.y,i.id);i.x=slot.x;i.y=slot.y;n.classList.remove("is-dragging");n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);persist();d=null});n.addEventListener("dblclick",()=>{if(!moved)openItemWindow(i.id)})}
function descendant(candidate,ancestor){let c=state.innerItems.find(x=>x.id===candidate);while(c){if(c.parentId===ancestor)return true;c=state.innerItems.find(x=>x.id===c.parentId)}return false}
function moveItem(id,parent){if(!id||id===parent||descendant(parent,id))return;const i=state.innerItems.find(x=>x.id===id);if(!i)return;i.parentId=parent||null;if(!parent)Object.assign(i,nextPos(i.id));persist();renderInnerItems();refreshWindows();toast(parent?"\u5df2\u653e\u5165\u6587\u4ef6\u5939":"\u5df2\u79fb\u56de\u684c\u9762")}
function deleteItem(id){const i=state.innerItems.find(x=>x.id===id);if(!i||!confirm(i.kind==="folder"?"\u5220\u9664\u6587\u4ef6\u5939\u53ca\u5176\u5168\u90e8\u5185\u5bb9\uff1f":"\u5220\u9664\u8fd9\u4e2a\u6587\u4ef6\uff1f"))return;const rm=new Set([id]);let again=true;while(again){again=false;state.innerItems.forEach(x=>{if(rm.has(x.parentId)&&!rm.has(x.id)){rm.add(x.id);again=true}})}state.innerItems=state.innerItems.filter(x=>!rm.has(x.id));els.windowLayer.querySelectorAll(".retro-window").forEach(w=>{if(rm.has(w.dataset.itemId))w.remove()});persist();renderInnerItems();refreshWindows()}
function front(w){state.zIndex++;w.style.zIndex=state.zIndex;els.windowLayer.querySelectorAll(".retro-window").forEach(x=>x.classList.toggle("is-active",x===w))}
function openItemWindow(id){if(state.level!==2)setLevel(2);const i=state.innerItems.find(x=>x.id===id);if(!i)return;if(state.codeMode){revealCodeTreeItem(i.id);return}const w=document.createElement("article"),n=els.windowLayer.children.length%6;w.className="retro-window";w.dataset.itemId=id;w.style.left=`${12+n*2.6}%`;w.style.top=`${8+n*2.5}%`;w.style.width=i.kind==="folder"?"68%":"70%";w.style.height=i.kind==="folder"?"74%":"76%";w.innerHTML=`<header class="retro-window__bar"><div class="window-title-group"><button class="window-back">\u2190</button><span class="window-title"></span></div><div class="window-controls"><button class="window-maximize">\u25a1</button><button class="window-close">\u00d7</button></div></header><div class="retro-window__body"></div><footer class="retro-window__status"><span>\u5c31\u7eea</span><span>Markdown / \u672c\u5730</span></footer>${["n","e","s","w","ne","nw","se","sw"].map(d=>`<i class="window-resize resize-${d}" data-resize="${d}" aria-hidden="true"></i>`).join("")}`;els.windowLayer.append(w);bindFrame(w);renderWindow(w,id);front(w)}
function bindFrame(w){
  const b=w.querySelector(".retro-window__bar"),layout=()=>{const visual=w.getBoundingClientRect(),width=w.offsetWidth,height=w.offsetHeight;return{left:w.offsetLeft,top:w.offsetTop,width,height,parentWidth:els.windowLayer.clientWidth,parentHeight:els.windowLayer.clientHeight,scaleX:visual.width/width||1,scaleY:visual.height/height||1}};let d=null;w.onpointerdown=()=>front(w);
  b.onpointerdown=e=>{if(e.target.closest("button"))return;const r=layout();d={sx:e.clientX,sy:e.clientY,...r};b.setPointerCapture(e.pointerId)};
  b.onpointermove=e=>{if(!d||w.classList.contains("is-maximized"))return;const dx=(e.clientX-d.sx)/d.scaleX,dy=(e.clientY-d.sy)/d.scaleY;w.style.left=`${Math.max(0,Math.min(d.parentWidth-d.width,d.left+dx))}px`;w.style.top=`${Math.max(31,Math.min(d.parentHeight-d.height,d.top+dy))}px`};b.onpointerup=b.onpointercancel=()=>d=null;
  w.querySelectorAll("[data-resize]").forEach(h=>{let s=null;h.onpointerdown=e=>{e.preventDefault();e.stopPropagation();if(w.classList.contains("is-maximized"))return;front(w);s={sx:e.clientX,sy:e.clientY,...layout(),dir:h.dataset.resize};h.setPointerCapture(e.pointerId)};h.onpointermove=e=>{if(!s)return;const dx=(e.clientX-s.sx)/s.scaleX,dy=(e.clientY-s.sy)/s.scaleY,minW=300,minH=190;let x=s.left,y=s.top,ww=s.width,hh=s.height;if(s.dir.includes("e"))ww=Math.max(minW,Math.min(s.parentWidth-s.left,s.width+dx));if(s.dir.includes("s"))hh=Math.max(minH,Math.min(s.parentHeight-s.top,s.height+dy));if(s.dir.includes("w")){x=Math.max(0,Math.min(s.left+dx,s.left+s.width-minW));ww=s.width+(s.left-x)}if(s.dir.includes("n")){y=Math.max(31,Math.min(s.top+dy,s.top+s.height-minH));hh=s.height+(s.top-y)}w.style.left=`${x}px`;w.style.top=`${y}px`;w.style.width=`${ww}px`;w.style.height=`${hh}px`};h.onpointerup=h.onpointercancel=()=>s=null});
  w.querySelector(".window-close").onclick=()=>w.remove();w.querySelector(".window-maximize").onclick=()=>{w.classList.toggle("is-maximized");front(w)};w.querySelector(".window-back").onclick=()=>{const i=state.innerItems.find(x=>x.id===w.dataset.itemId);if(i?.parentId)renderWindow(w,i.parentId)};
}
function entryHTML(i){return `<div class="folder-entry" draggable="true" data-inner-id="${i.id}" data-kind="${i.kind}"><span class="pixel-icon ${i.kind==="folder"?"pixel-folder":"pixel-file"}"></span><div class="folder-entry__label"><b>${esc(i.title)}</b><small>${i.kind==="folder"?"\u6587\u4ef6\u5939":"Markdown \u6587\u4ef6"}</small></div></div>`}
function renderWindow(w,id){const i=state.innerItems.find(x=>x.id===id);if(!i){w.remove();return}w.dataset.itemId=id;const kindLabel=i.kind==="folder"?"\u6587\u4ef6\u5939":"Markdown \u6587\u4ef6";w.querySelector(".window-title").textContent=`${i.title} / ${kindLabel}`;w.querySelector(".window-back").hidden=!(i.kind==="folder"&&i.parentId);const b=w.querySelector(".retro-window__body");if(i.kind==="file")b.innerHTML=`<div class="window-file-tools"><span>Markdown \u6587\u4ef6</span><div><button data-edit>\u7f16\u8f91</button><button data-delete>\u5220\u9664</button></div></div><div class="markdown-view">${markdownToHTML(i.content)}</div>`;else{const kids=state.innerItems.filter(x=>x.parentId===i.id);b.innerHTML=`<div class="window-file-tools"><span>\u6587\u4ef6\u5939 / ${kids.length} \u9879</span><div><button data-edit>\u7f16\u8f91</button><button data-delete>\u5220\u9664</button></div></div><div class="folder-description markdown-view">${markdownToHTML(i.content)}</div><div class="folder-dropzone">${kids.map(entryHTML).join("")||'<p class="empty-folder">\u6587\u4ef6\u5939\u4e3a\u7a7a</p>'}</div>`;bindFolder(w,i)}b.querySelector(".window-file-tools [data-edit]").onclick=()=>openItemDialog({scope:"inner",action:"edit",kind:i.kind,item:i});b.querySelector(".window-file-tools [data-delete]").onclick=()=>deleteItem(i.id);front(w)}
function bindFolder(w,folder){w.querySelectorAll(".folder-entry").forEach(e=>{e.ondblclick=x=>{openItemWindow(e.dataset.innerId)};e.ondragstart=x=>{state.draggedInnerId=e.dataset.innerId;x.dataTransfer.setData("text/plain",e.dataset.innerId)};if(e.dataset.kind==="folder"){e.ondragover=x=>x.preventDefault();e.ondrop=x=>{x.preventDefault();x.stopPropagation();moveItem(x.dataTransfer.getData("text/plain")||state.draggedInnerId,e.dataset.innerId)}}});const z=w.querySelector(".folder-dropzone");z.ondragover=e=>{e.preventDefault();z.classList.add("is-drop-target")};z.ondragleave=()=>z.classList.remove("is-drop-target");z.ondrop=e=>{e.preventDefault();moveItem(e.dataTransfer.getData("text/plain")||state.draggedInnerId,folder.id)}}
function safeImage(v){return typeof v==="string"&&/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(v)?v:""}
function updateNoteImagePreview(){const src=safeImage(state.noteImageData);els.noteImagePreview.hidden=!src;els.noteImagePreview.innerHTML=src?`<img src="${src}" alt="\u5df2\u5bfc\u5165\u7684\u4fbf\u7b7e\u56fe\u7247" />`:""}
function resetDoodle(src=""){const c=els.noteDoodle,ctx=c.getContext("2d");ctx.clearRect(0,0,c.width,c.height);state.noteDoodleData=safeImage(src);state.noteDoodleDirty=false;if(state.noteDoodleData){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,c.width,c.height);img.src=state.noteDoodleData}}
function fileToNoteImage(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{const max=720,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(c.toDataURL("image/jpeg",.84))};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("image"))};img.src=url})}
function bindNoteMedia(){const c=els.noteDoodle,ctx=c.getContext("2d");let drawing=false;const point=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}};c.onpointerdown=e=>{drawing=true;state.noteDoodleDirty=true;const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=7;ctx.strokeStyle="#151713";c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke()};c.onpointerup=c.onpointercancel=()=>drawing=false;els.noteImageInput.onchange=async()=>{const file=els.noteImageInput.files?.[0];if(!file)return;try{state.noteImageData=await fileToNoteImage(file);updateNoteImagePreview()}catch{toast("\u56fe\u7247\u5bfc\u5165\u5931\u8d25")}};els.clearNoteImage.onclick=()=>{state.noteImageData="";els.noteImageInput.value="";updateNoteImagePreview()};els.clearDoodle.onclick=()=>{state.noteDoodleData="";state.noteDoodleDirty=false;ctx.clearRect(0,0,c.width,c.height)}}
function refreshWindows(){els.windowLayer.querySelectorAll(".retro-window:not([data-system-app])").forEach(w=>renderWindow(w,w.dataset.itemId))}
function openItemDialog(c){state.dialogContext=c;const inner=c.scope==="inner",edit=c.action==="edit",kind=c.kind||"file";els.dialogTitle.textContent=edit?(inner?"\u7f16\u8f91\u6587\u4ef6\u7cfb\u7edf\u9879":"\u7f16\u8f91\u4fbf\u7b7e"):(inner?`\u65b0\u5efa${kind==="folder"?"\u6587\u4ef6\u5939":"\u6587\u4ef6"}`:"\u65b0\u5efa\u4fbf\u7b7e");els.itemTitle.value=c.item?.title||"";els.itemContent.value=c.item?.content||"";els.colorField.hidden=inner;els.noteMediaTools.hidden=inner;els.itemContent.placeholder=inner&&kind==="file"?"Markdown: > \u6458\u8981 / ## \u6807\u9898 / **\u7c97\u4f53** / *\u659c\u4f53* / `\u6807\u7b7e` / - \u5217\u8868":"";state.noteImageData=inner?"":safeImage(c.item?.imageData);updateNoteImagePreview();resetDoodle(inner?"":c.item?.doodleData);if(!inner){const r=els.itemForm.querySelector(`[name="color"][value="${c.item?.color||"lime"}"]`);if(r)r.checked=true}els.dialog.showModal();setTimeout(()=>els.itemTitle.focus())}
function closeDialog(){state.dialogContext=null;state.noteImageData="";state.noteDoodleData="";state.noteDoodleDirty=false;els.itemForm.reset();resetDoodle();updateNoteImagePreview();if(els.dialog.open)els.dialog.close()}
function saveDialog(e){e.preventDefault();if(!els.itemTitle.value.trim())return;const c=state.dialogContext,title=els.itemTitle.value.trim();let content=els.itemContent.value.trim();if(c.scope==="inner"){if(!content)content=c.kind==="folder"?"> \u7528\u4e8e\u6574\u7406\u4e00\u7ec4\u76f8\u5173\u6587\u4ef6\u4e0e\u601d\u8003\u3002\n\n## \u6587\u4ef6\u5939\u8bf4\u660e\n- \u53ef\u4ee5\u62d6\u5165\u6587\u4ef6\u6216\u5b50\u6587\u4ef6\u5939\n- \u53cc\u51fb\u9879\u76ee\u6253\u5f00\u65b0\u7a97\u53e3":"> \u8fd9\u662f\u4e00\u4efd\u53ef\u7ee7\u7eed\u7f16\u8f91\u7684 Markdown \u6587\u4ef6\u3002\n\n## \u6838\u5fc3\u8bb0\u5f55\n- \u5199\u4e0b\u4e00\u4e2a\u5177\u4f53\u95ee\u9898\n- \u8bb0\u5f55\u5224\u65ad\u4e0e\u4e0b\u4e00\u6b65\n\n`NEW FILE`";if(c.action==="edit"){c.item.title=title;c.item.content=content}else{const p=state.activeFolderId?{x:.5,y:.5}:nextPos();state.innerItems.push({id:crypto.randomUUID(),kind:c.kind,title,content,parentId:state.activeFolderId||null,...p})}persist();renderInnerItems();refreshWindows()}else{if(state.noteDoodleDirty)state.noteDoodleData=els.noteDoodle.toDataURL("image/png");const media={imageData:safeImage(state.noteImageData),doodleData:safeImage(state.noteDoodleData)};if(c.action==="edit"){c.item.title=title;c.item.content=content;c.item.color=new FormData(els.itemForm).get("color");Object.assign(c.item,media)}else{state.outerItems.push({id:crypto.randomUUID(),color:new FormData(els.itemForm).get("color"),title,content,x:.5,y:.4,rotation:1,...media});window.dispatchEvent(new CustomEvent("portfolio-stat",{detail:{type:"notes",count:1}}))}persist();renderOuterItems()}closeDialog()}
function toast(m){els.toast.textContent=m;els.toast.classList.add("is-visible");clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove("is-visible"),1800)}
function resetAll(){if(!confirm("\u91cd\u7f6e\u4fbf\u7b7e\u3001\u6587\u4ef6\u548c\u6587\u4ef6\u5939\uff1f"))return;Object.values(STORAGE).forEach(k=>localStorage.removeItem(k));state.outerItems=clone(defaultOuterItems);state.innerItems=clone(defaultInnerItems);els.windowLayer.innerHTML="";persist();renderOuterItems();renderInnerItems()}
function wheelAllowed(e){return !e.target.closest(".felt-editor,.item-dialog")&&!(state.level===2&&e.target.closest(".retro-window,.retro-desktop,.code-desktop-tree"))}
function handleWheel(e){
  if(!wheelAllowed(e)||state.wheelLocked)return;
  const raw=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:-e.deltaY,d=raw>0?1:-1;
  if((state.level===0&&d<0)||(state.level===2&&d>0))return;
  e.preventDefault();
  if(state.wheelDirection!==d){state.wheelDirection=d;state.wheelAmount=0}
  state.wheelAmount=Math.min(180,state.wheelAmount+Math.max(Math.abs(e.deltaX),Math.abs(e.deltaY)));
  els.zoomLabel.textContent=state.level===1?(d>0?"滑动 / 前往留言":"滑动 / 返回桌面"):(d>0?"向前滚动 / 进入":"向后滚动 / 退出");
  els.zoomMeter.style.width=`${Math.min(100,state.wheelAmount/1.4)}%`;
  clearTimeout(handleWheel.t);handleWheel.t=setTimeout(()=>{state.wheelAmount=0;els.zoomMeter.style.width="0"},450);
  if(state.wheelAmount<140)return;
  state.wheelLocked=true;
  if(state.level===0&&d>0){markInteraction("scroll-in");setLevel(1)}
  else if(state.level===1){
    if(d>0&&!state.outsideBoard)setOutsideBoard(true);
    else if(d<0&&state.outsideBoard)setOutsideBoard(false);
    else if(d<0)setLevel(0);
  }else if(state.level===2&&d<0)setLevel(1);
  setTimeout(()=>state.wheelLocked=false,900);
}

function bindOutsideSwipe(){
  window.addEventListener("touchstart",e=>{if(state.level!==1||e.touches.length!==1||e.target.closest("dialog"))return;state.swipeStartX=e.touches[0].clientX;state.swipeStartY=e.touches[0].clientY},{passive:true});
  window.addEventListener("touchend",e=>{if(state.level!==1||!e.changedTouches.length||e.target.closest("dialog"))return;const dx=e.changedTouches[0].clientX-state.swipeStartX,dy=e.changedTouches[0].clientY-state.swipeStartY;if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy))return;setOutsideBoard(dx<0)},{passive:true});
  window.addEventListener("keydown",e=>{if(state.level!==1||e.target.closest("input,textarea,button,[contenteditable]"))return;if(e.key==="ArrowRight")setOutsideBoard(true);if(e.key==="ArrowLeft")state.outsideBoard?setOutsideBoard(false):setLevel(0)});
}

let printedCardCount=0,printedLayerOrder=1000;
function stampPrintOrder(paper){const order=++printedLayerOrder;paper.dataset.printOrder=String(order);paper.style.zIndex=order}
function businessCardHTML(index){return `<strong>\u5b54\u7c73\u4e50</strong><span class="card-role">AI\u4ea7\u54c1\u7ecf\u7406\u5b9e\u4e60\u4e2d</span><span class="card-school">\u5357\u5f00\u5927\u5b66 \u00b7 \u5929\u6d25</span><span class="card-email">mlml2404@outlook.com</span>`}
function bindPrinter(){const printer=document.getElementById("deskPrinter");printer.onclick=()=>{markInteraction("printer");printBusinessCard(printer)}}
function printBusinessCard(printer){
  window.dispatchEvent(new CustomEvent("portfolio-stat",{detail:{type:"prints",count:1}}));
  const layer=document.getElementById("businessCardLayer"),slot=printer.querySelector(".printer-slot"),lr=layer.getBoundingClientRect(),sr=slot.getBoundingClientRect();
  const index=++printedCardCount,card=document.createElement("article"),rotation=-7+((index*5)%15);
  card.className="business-card throwable-paper is-printing-card";card.tabIndex=0;card.dataset.rotation=rotation;card.dataset.paperRadius="29";stampPrintOrder(card);card.style.setProperty("--card-rotation",`${rotation}deg`);card.innerHTML=businessCardHTML(index);layer.append(card);bindBusinessCard(card);
  const originX=sr.left+sr.width*.5-lr.left,originY=sr.top+sr.height*.5-lr.top,deskY=lr.height*.82;
  const spread=((index-1)%5-2)*24,targetX=Math.max(125,Math.min(lr.width-125,originX+54+spread)),targetY=Math.min(lr.height-74,deskY+((index-1)%3)*6),curve=index%2?1:-1,printerAngle=-11;
  card.style.left=`${originX}px`;card.style.top=`${originY}px`;
  printer.classList.remove("is-printing");void printer.offsetWidth;printer.classList.add("is-printing");setTimeout(()=>printer.classList.remove("is-printing"),1050);
  const motion=card.animate([
    {left:`${originX}px`,top:`${originY}px`,opacity:0,transform:`translate(-50%,-50%) scaleX(.78) scaleY(.06) rotateZ(${printerAngle}deg)`,easing:"linear"},
    {left:`${originX+5}px`,top:`${originY+22}px`,opacity:1,transform:`translate(-50%,-50%) scaleX(.82) scaleY(.42) rotateZ(${printerAngle}deg)`,offset:.22},
    {left:`${originX+14}px`,top:`${originY+70}px`,opacity:1,transform:`translate(-50%,-50%) scaleX(.9) scaleY(1) rotateZ(${printerAngle}deg)`,offset:.39},
    {left:`${originX+curve*82}px`,top:`${originY+(targetY-originY)*.34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*5}deg)`,offset:.58},
    {left:`${targetX+curve*58}px`,top:`${originY+(targetY-originY)*.67}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*2.5}deg)`,offset:.76},
    {left:`${targetX-curve*16}px`,top:`${targetY-34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(2deg) rotateZ(${rotation}deg)`,offset:.89},
    {left:`${targetX}px`,top:`${targetY}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(28deg) rotateZ(${rotation}deg)`}
  ],{duration:3600,easing:"cubic-bezier(.18,.68,.16,1)",fill:"forwards"});
  motion.onfinish=()=>{motion.commitStyles();motion.cancel();card.classList.remove("is-printing-card");card.classList.add("is-settled","is-on-desk");requestAnimationFrame(()=>requestAnimationFrame(()=>card.style.removeProperty("transform")))};
}
function trashAt(x,y){const trash=document.getElementById("deskTrash"),r=trash.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom?trash:null}
function discardBusinessCard(card,trash){const layer=card.parentElement.getBoundingClientRect(),r=trash.getBoundingClientRect();card.classList.remove("is-dragging-card","is-card-landing","is-expanded");card.classList.add("is-discarding");card.style.left=`${r.left+r.width/2-layer.left}px`;card.style.top=`${r.top+r.height*.48-layer.top}px`;trash.classList.remove("is-trash-target");setTimeout(()=>card.remove(),620)}
function randomizePaperBall(card){
  const rand=(min,max)=>min+Math.random()*(max-min),points=[];
  const sides=11+Math.floor(Math.random()*4),centerX=rand(49,51),centerY=rand(49,51);for(let i=0;i<sides;i++){const a=Math.PI*2*(i+rand(-.22,.22))/sides-Math.PI/2,dent=Math.random()<.28?rand(.05,.09):0,r=rand(.41,.49)-dent,x=Math.max(2,Math.min(98,centerX+Math.cos(a)*r*100)),y=Math.max(2,Math.min(98,centerY+Math.sin(a)*r*100));points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`)}
  card.style.setProperty("--ball-shape",`polygon(${points.join(",")})`);
  card.style.setProperty("--crease-a",`${rand(-68,68).toFixed(1)}deg`);
  card.style.setProperty("--crease-b",`${rand(78,154).toFixed(1)}deg`);
  card.style.setProperty("--crease-c",`${rand(168,238).toFixed(1)}deg`);
  card.style.setProperty("--crease-x",`${rand(24,68).toFixed(1)}%`);
  card.style.setProperty("--crease-y",`${rand(20,70).toFixed(1)}%`);
  card.style.setProperty("--ball-radius",`${rand(34,54).toFixed(0)}% ${rand(39,61).toFixed(0)}% ${rand(36,57).toFixed(0)}% ${rand(35,62).toFixed(0)}%`);
  card.style.setProperty("--ball-rest",`${rand(-28,28).toFixed(1)}deg`);
  card.style.setProperty("--curve-x",`${rand(22,78).toFixed(1)}%`);
  card.style.setProperty("--curve-y",`${rand(18,82).toFixed(1)}%`);
  card.style.setProperty("--patch-x",`${rand(16,72).toFixed(1)}%`);
  card.style.setProperty("--patch-y",`${rand(20,76).toFixed(1)}%`);
  card.style.setProperty("--fiber-size",`${rand(7,19).toFixed(1)}px`);
  card.style.setProperty("--fold-width",`${rand(1.2,3.8).toFixed(1)}%`);
  card.style.setProperty("--patch-x2",`${rand(18,84).toFixed(1)}%`);
  card.style.setProperty("--patch-y2",`${rand(14,86).toFixed(1)}%`);
  card.style.setProperty("--paper-hue",`${rand(-5,7).toFixed(1)}deg`);
}
function crumpleBusinessCard(card){
  if(card.classList.contains("is-paper-ball")||card.classList.contains("is-crumpling"))return;
  const crumpleDuration=840;
  randomizePaperBall(card);card.classList.remove("is-on-desk");card.classList.add("is-crumpling");
  setTimeout(()=>{card.classList.remove("is-crumpling");card.classList.add("is-paper-ball");card.setAttribute("aria-label","\u7eb8\u56e2\uff0c\u6309\u4f4f\u62d6\u52a8\u53ef\u629b\u51fa")},crumpleDuration);
}
function paperRadius(card){return +(card.dataset.paperRadius||29)}
function throwPlan(card,dx,dy){
  const layer=card.parentElement.getBoundingClientRect(),origin={x:parseFloat(card.style.left),y:parseFloat(card.style.top)},g=1040,tr=document.getElementById("deskTrash").getBoundingClientRect(),radius=paperRadius(card),deskY=Math.min(layer.height-30,tr.bottom-layer.top-radius);
  let vx=-dx*6.1,vy=Math.max(-1080,Math.min(-380,-620-dy*3.2));
  const disc=Math.max(0,vy*vy-2*g*(origin.y-deskY)),endT=Math.max(.42,(-vy+Math.sqrt(disc))/g);
  const point=t=>({x:origin.x+vx*t,y:origin.y+vy*t+.5*g*t*t});let hit=false,hitT=endT;
  for(let t=.02;t<=endT;t+=.02){const p=point(t),inBin=p.x>=tr.left-layer.left-16&&p.x<=tr.right-layer.left+16&&p.y>=tr.top-layer.top-26&&p.y<=tr.top-layer.top+42;if(inBin){hit=true;hitT=t;break}}
  const finalT=hit?hitT:endT,end=point(finalT),control={x:origin.x+vx*finalT*.5,y:origin.y+vy*finalT*.5},d=`M ${origin.x} ${origin.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
  return{origin,vx,vy,g,endT:finalT,end,hit,d,point,layer};
}
function beginBallAim(card,e){
  const r=card.getBoundingClientRect();card.throwState={sx:e.clientX,sy:e.clientY,lastPlan:null};card.setPointerCapture(e.pointerId);card.style.zIndex=Math.max(+(card.dataset.printOrder||0),++state.zIndex+180);document.getElementById("deskTrash").classList.add("is-open");const svg=document.getElementById("throwTrajectory");svg.classList.add("is-visible");svg.querySelector("path").setAttribute("d",`M ${r.left+r.width/2} ${r.top+r.height/2}`);
}
function updateBallAim(card,e){const s=card.throwState;if(!s)return;const dx=e.clientX-s.sx,dy=e.clientY-s.sy;if(Math.hypot(dx,dy)<5)return;s.lastPlan=throwPlan(card,dx,dy);document.querySelector("#throwTrajectory path").setAttribute("d",s.lastPlan.d);document.getElementById("deskTrash").classList.toggle("is-aimed",s.lastPlan.hit)}
function physicsRect(el,layer,restitution){
  if(!el)return null;const style=getComputedStyle(el);if(style.display==="none"||+style.opacity<.05)return null;
  const r=el.getBoundingClientRect();return{left:r.left-layer.left,right:r.right-layer.left,top:r.top-layer.top,bottom:r.bottom-layer.top,restitution};
}
function resolveCircleRect(body,rect,radius){
  if(!rect)return false;
  const nx=Math.max(rect.left,Math.min(body.x,rect.right)),ny=Math.max(rect.top,Math.min(body.y,rect.bottom));
  let dx=body.x-nx,dy=body.y-ny,dist=Math.hypot(dx,dy);
  if(dist>=radius)return false;
  if(dist<.001){const sides=[{d:Math.abs(body.x-rect.left),x:-1,y:0},{d:Math.abs(rect.right-body.x),x:1,y:0},{d:Math.abs(body.y-rect.top),x:0,y:-1},{d:Math.abs(rect.bottom-body.y),x:0,y:1}].sort((a,b)=>a.d-b.d);dx=sides[0].x;dy=sides[0].y;dist=1}
  const ux=dx/dist,uy=dy/dist,penetration=radius-dist;body.x+=ux*penetration;body.y+=uy*penetration;
  const toward=body.vx*ux+body.vy*uy;if(toward<0){const impulse=(1+rect.restitution)*toward;body.vx-=impulse*ux;body.vy-=impulse*uy;body.spin+=(uy*body.vx-ux*body.vy)*.045}return true;
}
function resolvePaperBallPairs(card,body,layer,radius,gravity){
  document.querySelectorAll(".throwable-paper.is-paper-ball").forEach(other=>{
    if(other===card||!other.isConnected)return;
    const active=!!other._physics?.running,otherBody=active?other._physicsBody:null;
    let ox=active?otherBody.x:parseFloat(other.style.left),oy=active?otherBody.y:parseFloat(other.style.top),ovx=active?otherBody.vx:0,ovy=active?otherBody.vy:0;
    if(!Number.isFinite(ox)||!Number.isFinite(oy))return;
    let dx=body.x-ox,dy=body.y-oy,dist=Math.hypot(dx,dy),minimum=radius+paperRadius(other);
    if(dist>=minimum)return;
    if(dist<.001){dx=1;dy=0;dist=1}
    const nx=dx/dist,ny=dy/dist,penetration=minimum-dist;body.x+=nx*penetration*.5;body.y+=ny*penetration*.5;ox-=nx*penetration*.5;oy-=ny*penetration*.5;
    if(active){otherBody.x=ox;otherBody.y=oy}else{other.style.left=`${ox}px`;other.style.top=`${oy}px`}
    const relative=(body.vx-ovx)*nx+(body.vy-ovy)*ny;
    if(relative>=0)return;
    const impulse=-(1+.58)*relative/2;body.vx+=impulse*nx;body.vy+=impulse*ny;body.spin+=(ny*impulse-nx*impulse)*.09;ovx-=impulse*nx;ovy-=impulse*ny;
    if(active){otherBody.vx=ovx;otherBody.vy=ovy;otherBody.spin-=impulse*.11}else if(Math.hypot(ovx,ovy)>28){simulatePaperBall(other,{origin:{x:ox,y:oy},vx:ovx,vy:ovy,g:gravity,layer})}
  });
}
function simulatePaperBall(card,plan){
  const layer=plan.layer,trash=document.getElementById("deskTrash"),radius=paperRadius(card),tr=trash.getBoundingClientRect(),deskY=Math.min(layer.height-30,tr.bottom-layer.top-radius);
  const obstacles=[physicsRect(document.querySelector(".monitor"),layer,.56),physicsRect(document.querySelector("#deskPrinter .printer-top"),layer,.5),physicsRect(document.querySelector("#deskPrinter .printer-shell"),layer,.5)].filter(Boolean),opening={left:tr.left-layer.left-7,right:tr.right-layer.left+7,top:tr.top-layer.top-16,bottom:tr.top-layer.top+32};
  const body={x:plan.origin.x,y:plan.origin.y,vx:plan.vx,vy:plan.vy,spin:Math.max(-820,Math.min(820,plan.vx*1.35)),angle:0,bounces:0},visualOrigin={x:plan.origin.x,y:plan.origin.y};
  const token={running:true};card._physics=token;card._physicsBody=body;card.classList.remove("is-ball-resting");card.classList.add("is-ball-flying");let previous=0;
  const step=stamp=>{
    if(card._physics!==token||!token.running||!card.isConnected)return;
    if(!previous){previous=stamp;requestAnimationFrame(step);return}
    const frame=Math.min(.028,(stamp-previous)/1000);previous=stamp;const substeps=Math.max(1,Math.ceil(frame/.009)),dt=frame/substeps;let captured=false;
    for(let i=0;i<substeps;i++){
      body.vy+=plan.g*dt;const damping=Math.pow(.9975,dt*60);body.vx*=damping;body.vy*=Math.pow(.998,dt*60);body.x+=body.vx*dt;body.y+=body.vy*dt;body.angle+=body.spin*dt;body.spin*=Math.pow(.985,dt*60);
      const left=26+radius,right=layer.width-26-radius,top=26+radius;
      if(body.x<left){body.x=left;body.vx=Math.abs(body.vx)*.66;body.spin+=body.vy*.12;body.bounces++}
      if(body.x>right){body.x=right;body.vx=-Math.abs(body.vx)*.66;body.spin-=body.vy*.12;body.bounces++}
      if(body.y<top){body.y=top;body.vy=Math.abs(body.vy)*.58;body.spin+=body.vx*.1;body.bounces++}
      for(const obstacle of obstacles)if(resolveCircleRect(body,obstacle,radius))body.bounces++;
      resolvePaperBallPairs(card,body,layer,radius,plan.g);
      if(body.vy>0&&body.x>opening.left&&body.x<opening.right&&body.y+radius>opening.top&&body.y<opening.bottom){captured=true;break}
      if(body.y>deskY){body.y=deskY;if(Math.abs(body.vy)>34){body.vy=-Math.abs(body.vy)*.49;body.vx*=.78;body.spin*=.7;body.bounces++}else body.vy=0}
      if(body.y>=deskY-.5&&body.vy===0){body.vx=Math.sign(body.vx)*Math.max(0,Math.abs(body.vx)-900*dt);body.spin=Math.sign(body.spin)*Math.max(0,Math.abs(body.spin)-720*dt)}
    }
    card.style.transform=`translate(-50%,-50%) translate3d(${body.x-visualOrigin.x}px,${body.y-visualOrigin.y}px,0) rotate(${body.angle}deg)`;
    if(captured){token.running=false;card.style.left=`${body.x}px`;card.style.top=`${body.y}px`;card.style.transform="";card.style.setProperty("--ball-spin",`${body.angle}deg`);trashCollision(card,trash);return}
    const sleeping=body.y>=deskY-.5&&Math.abs(body.vy)<5&&Math.abs(body.vx)<10;
    if(sleeping||(body.bounces>24&&body.y>=deskY-.5)){token.running=false;body.vx=0;body.vy=0;card.style.left=`${body.x}px`;card.style.top=`${body.y}px`;card.style.transform="";card.style.setProperty("--ball-spin",`${body.angle}deg`);trash.classList.remove("is-open");card.classList.remove("is-ball-flying");card.classList.add("is-ball-resting");return}
    requestAnimationFrame(step);
  };requestAnimationFrame(step);
}
function releaseBallAim(card){
  const s=card.throwState;card.throwState=null;document.getElementById("throwTrajectory").classList.remove("is-visible");const trash=document.getElementById("deskTrash");trash.classList.remove("is-aimed");if(!s||!s.lastPlan){trash.classList.remove("is-open");return}if(!s.lastPlan.hit)trash.classList.remove("is-open");simulatePaperBall(card,s.lastPlan);
}
function trashCollision(card,trash){
  if(card._physics)card._physics.running=false;
  const layer=card.parentElement.getBoundingClientRect(),tr=trash.getBoundingClientRect(),cx=tr.left+tr.width/2-layer.left,startX=parseFloat(card.style.left),startY=parseFloat(card.style.top),base=+card.style.getPropertyValue("--ball-spin").replace("deg","")||0;
  trash.classList.add("is-open","is-hit");card.classList.remove("is-ball-flying");card.classList.add("is-bin-bouncing");
  const motion=card.animate([
    {left:`${startX}px`,top:`${startY}px`,transform:`translate(-50%,-50%) rotate(${base}deg) scale(1)`,opacity:1,offset:0},
    {left:`${cx-13}px`,top:`${tr.top-layer.top-3}px`,transform:`translate(-50%,-50%) rotate(${base+96}deg) scale(.91)`,offset:.22,easing:"cubic-bezier(.25,.72,.25,1)"},
    {left:`${cx+9}px`,top:`${tr.top-layer.top+15}px`,transform:`translate(-50%,-50%) rotate(${base+168}deg) scale(.76)`,offset:.41,easing:"cubic-bezier(.35,0,.45,1)"},
    {left:`${cx-7}px`,top:`${tr.top-layer.top+3}px`,transform:`translate(-50%,-50%) rotate(${base+236}deg) scale(.63)`,offset:.57,easing:"cubic-bezier(.2,.75,.3,1)"},
    {left:`${cx+5}px`,top:`${tr.top-layer.top+22}px`,transform:`translate(-50%,-50%) rotate(${base+310}deg) scale(.47)`,offset:.72,easing:"cubic-bezier(.4,0,.5,1)"},
    {left:`${cx-2}px`,top:`${tr.top-layer.top+13}px`,transform:`translate(-50%,-50%) rotate(${base+362}deg) scale(.34)`,offset:.82},
    {left:`${cx}px`,top:`${tr.top-layer.top+48}px`,transform:`translate(-50%,-50%) rotate(${base+440}deg) scale(.06)`,opacity:.15,offset:1}
  ],{duration:980,easing:"linear",fill:"forwards"});
  motion.onfinish=()=>{burstConfetti(trash);card.remove();trash.classList.remove("is-open");setTimeout(()=>trash.classList.remove("is-hit"),460)};
}
function burstConfetti(trash){
  const layer=document.getElementById("confettiLayer"),r=trash.getBoundingClientRect(),colors=["var(--lime)","var(--orange)","#f4efe4"];
  for(let i=0;i<24;i++){
    const p=document.createElement("i"),angle=(-160+Math.random()*140)*Math.PI/180,power=175+Math.random()*90,vx=Math.cos(angle)*power,vy=Math.sin(angle)*power-28,g=360+Math.random()*75,duration=1450+Math.random()*420,seconds=duration/1000,spin=(Math.random()>.5?1:-1)*(420+Math.random()*500);
    p.style.left=`${r.left+r.width/2}px`;p.style.top=`${r.top+7}px`;p.style.width=`${3+Math.random()*2}px`;p.style.height=`${12+Math.random()*9}px`;p.style.borderRadius=Math.random()>.68?"50%":"1px";p.style.background=colors[i%colors.length];p.style.animation="none";layer.append(p);
    const frames=Array.from({length:11},(_,step)=>{const progress=step/10,t=seconds*progress,x=vx*t,y=vy*t+.5*g*t*t,flutter=Math.sin(progress*Math.PI*5+i)*16;return{opacity:step===10?0:step===0?.35:1,transform:`translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(spin*progress).toFixed(1)}deg) skewX(${flutter.toFixed(1)}deg)`}});
    const motion=p.animate(frames,{duration,easing:"linear",fill:"forwards"});motion.onfinish=()=>p.remove()
  }
}
function animateCardDrop(card,drag,finalX,finalY,rotation){
  const startX=drag.cx,startY=drag.cy,fall=finalY-startY,curve=Math.sign(drag.releaseVX||drag.sway||1),paperScale=card.classList.contains("printed-document")?.72:1;
  card.classList.remove("is-dragging-card");card.classList.add("is-card-dropping");
  const motion=card.animate([
    {left:`${startX}px`,top:`${startY}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${rotation+drag.sway*.45}deg) scale(${paperScale})`,offset:0},
    {left:`${startX+curve*82}px`,top:`${startY+fall*.34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*5}deg) scale(${paperScale})`,offset:.38},
    {left:`${finalX+curve*58}px`,top:`${startY+fall*.67}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*2.5}deg) scale(${paperScale})`,offset:.66},
    {left:`${finalX-curve*16}px`,top:`${finalY-34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(2deg) rotateZ(${rotation}deg) scale(${paperScale})`,offset:.87},
    {left:`${finalX}px`,top:`${finalY}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(28deg) rotateZ(${rotation}deg) scale(${paperScale})`,offset:1}
  ],{duration:3200,easing:"cubic-bezier(.18,.68,.16,1)",fill:"forwards"});
  motion.onfinish=()=>{motion.commitStyles();motion.cancel();card.classList.remove("is-card-dropping");card.classList.add("is-on-desk");requestAnimationFrame(()=>requestAnimationFrame(()=>card.style.removeProperty("transform")))};
}
function closePaperFocus(card=document.querySelector(".throwable-paper.is-expanded")){
  if(!card||!card._focusPose)return;
  const pose=card._focusPose;card._focusPose=null;card.classList.add("is-focus-returning");card.classList.remove("is-expanded");card.setAttribute("aria-expanded","false");card.style.left=pose.left;card.style.top=pose.top;card.style.zIndex=pose.zIndex;clearTimeout(card._focusReturnTimer);card._focusReturnTimer=setTimeout(()=>card.classList.remove("is-focus-returning"),520);
  const layer=card.parentElement,backdrop=layer.querySelector(".paper-focus-backdrop");backdrop?.remove();layer.classList.remove("is-paper-focus-mode");
}
function openPaperFocus(card){
  const active=document.querySelector(".throwable-paper.is-expanded");if(active&&active!==card)closePaperFocus(active);
  const layer=card.parentElement,r=layer.getBoundingClientRect();card._focusPose={left:card.style.left,top:card.style.top,zIndex:card.style.zIndex};
  const backdrop=document.createElement("button");backdrop.type="button";backdrop.className="paper-focus-backdrop";backdrop.setAttribute("aria-label","关闭放大预览");backdrop.onclick=e=>{e.stopPropagation();closePaperFocus(card)};layer.prepend(backdrop);layer.classList.add("is-paper-focus-mode");
  card.classList.add("is-expanded");card.setAttribute("aria-expanded","true");card.style.left=`${r.width/2}px`;card.style.top=`${r.height/2}px`;card.style.zIndex=String(++state.zIndex+12000);
}
function togglePaperFocus(card){if(card.classList.contains("is-expanded"))closePaperFocus(card);else openPaperFocus(card)}
function bindBusinessCard(card){
  let drag=null,moved=false,raf=0;
  const follow=()=>{if(!drag)return;drag.cx+=(drag.tx-drag.cx)*.12;drag.cy+=(drag.ty-drag.cy)*.12;drag.sway+=(drag.swayTarget-drag.sway)*.15;drag.swayTarget*=.91;card.style.left=`${drag.cx}px`;card.style.top=`${drag.cy}px`;card.style.setProperty("--drag-tilt",`${drag.sway.toFixed(2)}deg`);raf=requestAnimationFrame(follow)};
  card.onpointerdown=e=>{if(e.button!==0||card.classList.contains("is-printing-card")||card.classList.contains("is-crumpling")||card.classList.contains("is-card-dropping")||card.classList.contains("is-printing-document")||card.classList.contains("is-expanded"))return;stampPrintOrder(card);if(card.classList.contains("is-paper-ball")){beginBallAim(card,e);return}const layer=card.parentElement.getBoundingClientRect(),r=card.getBoundingClientRect(),monitor=document.querySelector(".monitor").getBoundingClientRect(),maxX=Math.max(45,monitor.left-layer.left-r.width/2-10);drag={maxX,sx:e.clientX,sy:e.clientY,x:r.left+r.width/2-layer.left,y:r.top+r.height/2-layer.top,cx:r.left+r.width/2-layer.left,cy:r.top+r.height/2-layer.top,tx:r.left+r.width/2-layer.left,ty:r.top+r.height/2-layer.top,lx:e.clientX,ly:e.clientY,lt:e.timeStamp,sway:0,swayTarget:0,releaseVX:0,releaseVY:0,layer};moved=false;card.classList.remove("is-card-landing");card.setPointerCapture(e.pointerId);card.style.zIndex=Math.max(+(card.dataset.printOrder||0),++state.zIndex+120);cancelAnimationFrame(raf);follow()};
  card.onpointermove=e=>{if(card.classList.contains("is-paper-ball")){updateBallAim(card,e);return}if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy,step=e.clientX-drag.lx,stepY=e.clientY-drag.ly,dt=Math.max(8,e.timeStamp-drag.lt),vx=step/dt,vy=stepY/dt;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;card.classList.remove("is-on-desk");card.classList.add("is-dragging-card")}drag.tx=Math.min(drag.maxX,drag.x+dx);drag.ty=drag.y+dy;drag.swayTarget=Math.max(-13,Math.min(13,vx*21));drag.releaseVX=vx;drag.releaseVY=vy;drag.lx=e.clientX;drag.ly=e.clientY;drag.lt=e.timeStamp};
  const release=e=>{if(card.classList.contains("is-paper-ball")){releaseBallAim(card);return}if(!drag)return;cancelAnimationFrame(raf);if(moved){const deskY=drag.layer.height*.82,finalX=Math.max(45,Math.min(drag.maxX,drag.tx+drag.releaseVX*72)),finalY=Math.max(deskY,Math.min(drag.layer.height-45,drag.ty+Math.max(0,drag.releaseVY)*38)),rotation=Math.max(-18,Math.min(18,(+card.dataset.rotation||0)+drag.sway*.42));card.dataset.rotation=rotation;card.style.setProperty("--card-rotation",`${rotation}deg`);card.style.setProperty("--document-rotation",`${rotation}deg`);animateCardDrop(card,drag,finalX,finalY,rotation)}else{clearTimeout(card._singleClickTimer);card._singleClickTimer=setTimeout(()=>{markInteraction("paper-guide");card.classList.remove("is-expanded");crumpleBusinessCard(card)},260)}drag=null};
  card.onpointerup=release;card.onpointercancel=release;card.ondblclick=e=>{e.preventDefault();e.stopPropagation();clearTimeout(card._singleClickTimer);if(card.classList.contains("is-paper-ball")||card.classList.contains("is-crumpling"))return;markInteraction("paper-guide");stampPrintOrder(card);togglePaperFocus(card)};card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();crumpleBusinessCard(card)}};
}
function toggleBusinessCard(card){crumpleBusinessCard(card)}

function applyDesktopMode(announce=false){state.codeMode=true;localStorage.setItem(STORAGE.desktopMode,"code");els.body.classList.add("code-desktop-mode");els.windowLayer.querySelectorAll(".retro-window").forEach(w=>{if(state.innerItems.find(i=>i.id===w.dataset.itemId)?.kind==="folder")w.remove()});const off=els.body.classList.contains("screen-off");els.powerButton.setAttribute("aria-pressed",String(!off));els.powerButton.setAttribute("aria-label",off?"打开电脑":"关闭电脑");els.powerButton.title=off?"开机":"关机";if(announce)toast("代码桌面已就绪")}
function togglePower(){
  if(els.body.classList.contains("powering-off")||els.body.classList.contains("powering-on"))return;
  const turningOn=els.body.classList.contains("screen-off");
  if(turningOn){
    els.body.classList.remove("screen-off","powering-off");els.body.classList.add("powering-on");
    els.powerButton.setAttribute("aria-pressed","true");els.powerButton.setAttribute("aria-label","关闭电脑");els.powerButton.title="关机";
    setTimeout(()=>els.body.classList.remove("powering-on"),650);toast("电脑已开机");
  }else{
    els.body.classList.remove("powering-on");els.body.classList.add("powering-off");
    els.powerButton.setAttribute("aria-pressed","false");els.powerButton.setAttribute("aria-label","打开电脑");els.powerButton.title="开机";
    setTimeout(()=>{els.body.classList.remove("powering-off");els.body.classList.add("screen-off")},540);toast("电脑已关机");
  }
}
function createDesktopItemInline(kind,x=.5,y=.5){
  const slot=nearestDesktopSlot(x,y),item={id:crypto.randomUUID(),kind,title:kind==="file"?"\u672a\u547d\u540d.md":"\u65b0\u5efa\u6587\u4ef6\u5939",content:kind==="file"?"> \u8fd9\u662f\u4e00\u4efd\u65b0\u5efa\u7684 Markdown \u6587\u4ef6\u3002\n\n## \u5f00\u59cb\u8bb0\u5f55\n- \u5728\u8fd9\u91cc\u5199\u4e0b\u60f3\u6cd5":"> \u7528\u4e8e\u6574\u7406 Markdown \u6587\u4ef6\u4e0e\u5b50\u6587\u4ef6\u5939\u3002",parentId:null,x:slot.x,y:slot.y};
  state.innerItems.push(item);persist();renderInnerItems();const node=els.customInnerItems.querySelector(`[data-inner-id="${item.id}"]`),label=node?.querySelector(":scope > span:last-child");if(!node||!label)return;
  const input=document.createElement("input");input.className="desktop-inline-name";input.value=item.title;label.replaceWith(input);let done=false;
  const finish=(cancel=false)=>{if(done)return;done=true;if(cancel){state.innerItems=state.innerItems.filter(i=>i.id!==item.id)}else{let title=input.value.trim()||item.title;if(kind==="file"&&!/\.md$/i.test(title))title+=".md";item.title=title}persist();renderInnerItems()};
  input.onpointerdown=e=>e.stopPropagation();input.ondblclick=e=>e.stopPropagation();input.onkeydown=e=>{e.stopPropagation();if(e.key==="Enter")finish();if(e.key==="Escape")finish(true)};input.onblur=()=>finish();requestAnimationFrame(()=>{input.focus();input.select()});
}
function systemWindow(title){
  const w=document.createElement("article"),n=els.windowLayer.children.length%5;w.className="retro-window";w.dataset.systemApp="printer";w.style.left=`${18+n*2}%`;w.style.top=`${7+n*2}%`;w.style.width="62%";w.style.height="79%";w.innerHTML=`<header class="retro-window__bar"><div class="window-title-group"><button class="window-back" hidden>\u2190</button><span class="window-title">${esc(title)}</span></div><div class="window-controls"><button class="window-maximize">\u25a1</button><button class="window-close">\u00d7</button></div></header><div class="retro-window__body"></div><footer class="retro-window__status"><span>\u6253\u5370\u673a\u5c31\u7eea</span><span>\u672c\u5730 / Markdown</span></footer>${["n","e","s","w","ne","nw","se","sw"].map(d=>`<i class="window-resize resize-${d}" data-resize="${d}" aria-hidden="true"></i>`).join("")}`;els.windowLayer.append(w);bindFrame(w);front(w);return w;
}
function paginateMarkdown(content){
  const source=(content||"").trim();if(!source)return[""];
  const probe=document.createElement("article");probe.className="printed-document print-measure";probe.innerHTML='<div class="printed-document__content"></div>';document.body.append(probe);const box=probe.firstElementChild;
  const fits=text=>{box.innerHTML=markdownToHTML(text);return box.scrollHeight<=box.clientHeight+1};
  const blocks=source.split(/\n\s*\n/).map(block=>block.trim()).filter(Boolean),units=[];
  const splitLongText=text=>{
    const parts=text.split(/(?<=[。！？；：])(?=\S)/).map(part=>part.trim()).filter(Boolean);return parts.length>1?parts:[text]
  };
  blocks.forEach(block=>{
    if(fits(block)){units.push(block);return}
    const lines=block.split("\n").map(line=>line.trim()).filter(Boolean);
    lines.forEach(line=>{
      if(fits(line)){units.push(line);return}
      const marker=line.match(/^(#{1,3}\s+|[-*+]\s+|\d+[.)]\s+|>\s*)/),prefix=marker?.[0]||"",body=marker?line.slice(prefix.length):line;
      splitLongText(body).forEach((part,index)=>units.push(`${index===0?prefix:""}${part}`));
    });
  });
  const pages=[];let current="";
  const pushCurrent=()=>{if(current.trim())pages.push(current.trim());current=""};
  units.forEach(unit=>{
    const candidate=current?`${current}\n\n${unit}`:unit;
    if(fits(candidate)){current=candidate;return}
    pushCurrent();
    if(fits(unit)){current=unit;return}
    const chars=[...unit];let chunk="";chars.forEach(char=>{const next=chunk+char;if(chunk&&!fits(next)){pages.push(chunk.trim());chunk=char}else chunk=next});current=chunk
  });
  pushCurrent();probe.remove();return pages.length?pages:[source]
}
function printJobs(items){return items.flatMap(item=>{const pages=paginateMarkdown(item.content),total=pages.length;return pages.map((content,page)=>({...structuredClone(item),content,_pageNumber:page+1,_pageTotal:total,_longDocument:total>1}))})}
function openPrinterWindow(){
  const existing=els.windowLayer.querySelector('[data-system-app="printer"]');if(existing){front(existing);return}
  const w=systemWindow("\u6253\u5370\u673a"),files=state.innerItems.filter(i=>i.kind==="file"),pageCounts=new Map(files.map(file=>[file.id,paginateMarkdown(file.content).length]));
  w.querySelector(".retro-window__body").innerHTML=`<section class="printer-app"><div class="printer-app__head"><span class="printer-app__glyph"><i></i></span><div><small>\u672c\u5730\u6253\u5370\u670d\u52a1</small><h2>\u9009\u62e9 Markdown \u6587\u4ef6</h2><p>\u6587\u4ef6\u5c06\u81ea\u52a8\u5206\u9875\uff0c\u5e76\u4ece\u5c4f\u5e55\u5916\u7684\u5b9e\u4f53\u6253\u5370\u673a\u8f93\u51fa\u3002</p></div></div><div class="printer-file-list">${files.map((file,index)=>`<label class="printer-file-row"><input type="checkbox" name="print-file" value="${file.id}" ${index===0?"checked":""}><span class="pixel-icon pixel-file"></span><span><b>${esc(file.title)}</b><small>Markdown \u6587\u4ef6 \u00b7 ${pageCounts.get(file.id)} \u9875</small></span></label>`).join("")||'<p class="printer-empty">\u6682\u65e0 Markdown \u6587\u4ef6</p>'}</div><div class="printer-app__footer"><span class="printer-page-summary"><b data-page-total>\u5171\u6253\u5370 ${files.length?pageCounts.get(files[0].id):0} \u9875</b><small data-file-total>${files.length?1:0} \u4e2a\u6587\u4ef6</small></span><button type="button" data-print ${files.length?"":"disabled"}>\u6253\u5370\u6240\u9009\u6587\u4ef6</button></div></section>`;
  const updateTotal=()=>{const ids=[...w.querySelectorAll('[name="print-file"]:checked')].map(input=>input.value),pages=ids.reduce((sum,id)=>sum+(pageCounts.get(id)||0),0);w.querySelector("[data-page-total]").textContent=`\u5171\u6253\u5370 ${pages} \u9875`;w.querySelector("[data-file-total]").textContent=`${ids.length} \u4e2a\u6587\u4ef6`;w.querySelector("[data-print]").disabled=!ids.length};
  w.querySelectorAll('[name="print-file"]').forEach(input=>input.addEventListener("change",updateTotal));
  w.querySelector("[data-print]")?.addEventListener("click",()=>{const ids=[...w.querySelectorAll('[name="print-file"]:checked')].map(input=>input.value),items=ids.map(id=>state.innerItems.find(i=>i.id===id)).filter(Boolean);if(!items.length){toast("\u8bf7\u81f3\u5c11\u9009\u62e9\u4e00\u4e2a\u6587\u4ef6");return}const jobs=printJobs(items);state.printQueue.push(...jobs);toast(`\u5df2\u53d1\u9001 ${items.length} \u4e2a\u6587\u4ef6\uff0c\u5171 ${jobs.length} \u9875`);w.remove();setTimeout(()=>{setLevel(0);setTimeout(flushPrintQueue,1350)},180)});
}
let printedDocumentCount=0;
function flushPrintQueue(){if(state.level!==0||!state.printQueue.length)return;const item=state.printQueue.shift();printMarkdownDocument(item);if(state.printQueue.length)setTimeout(flushPrintQueue,1800)}
function printMarkdownDocument(item){
  window.dispatchEvent(new CustomEvent("portfolio-stat",{detail:{type:"prints",count:1}}));
  const printer=document.getElementById("deskPrinter"),layer=document.getElementById("businessCardLayer"),slot=printer.querySelector(".printer-slot"),lr=layer.getBoundingClientRect(),sr=slot.getBoundingClientRect(),paper=document.createElement("article"),index=++printedDocumentCount,rotation=-5+(index%5)*2;
  paper.className="printed-document throwable-paper is-printing-document";if(item._longDocument)paper.classList.add("is-long-document");paper.tabIndex=0;paper.dataset.rotation=rotation;paper.dataset.paperRadius="32";stampPrintOrder(paper);paper.style.setProperty("--document-rotation",`${rotation}deg`);paper.style.setProperty("--card-rotation",`${rotation}deg`);paper.style.transformOrigin="50% 50%";const pageNumber=item._pageNumber||1,pageTotal=item._pageTotal||1,meta=item._longDocument?"":`<span class="printed-document__meta">Markdown / \u672c\u5730\u6253\u5370</span>`;paper.innerHTML=`${meta}<h2>${esc(item.title)}</h2><div class="printed-document__content">${markdownToHTML(item.content)}</div><small>\u7b2c ${String(pageNumber).padStart(2,"0")} \u9875 / \u5171 ${String(pageTotal).padStart(2,"0")} \u9875</small>`;layer.append(paper);bindBusinessCard(paper);
  const originX=sr.left+sr.width*.5-lr.left,originY=sr.top+sr.height*.5-lr.top,targetX=Math.max(155,Math.min(lr.width-155,originX+24+(index%3)*5)),targetY=Math.min(lr.height-145,lr.height*.84+(index%3)*5),curve=index%2?1:-1;paper.style.left=`${originX}px`;paper.style.top=`${originY}px`;printer.classList.remove("is-printing");void printer.offsetWidth;printer.classList.add("is-printing");clearTimeout(printer._printingTimer);printer._printingTimer=setTimeout(()=>printer.classList.remove("is-printing"),2600);
  const paperHeight=paper.offsetHeight,printerAngle=-11,printerRect=printer.getBoundingClientRect(),smallScale=.72,outputX=printerRect.left+printerRect.width*.5-lr.left+28,outputTop=printerRect.bottom-lr.top-102,printY=outputTop+paperHeight*smallScale*.5,releaseY=Math.min(targetY-54,printY+54),fallDistance=targetY-releaseY;
  const motion=paper.animate([
    {left:`${outputX}px`,top:`${printY}px`,opacity:0,clipPath:"inset(0)",transform:`translate(-50%,-50%) scale(${smallScale}) rotateZ(${printerAngle}deg)`,offset:0,easing:"linear"},
    {left:`${outputX}px`,top:`${printY+18}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) scale(${smallScale}) rotateZ(${printerAngle}deg)`,offset:.216,easing:"linear"},
    {left:`${outputX}px`,top:`${printY+36}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) scale(${smallScale}) rotateZ(${printerAngle}deg)`,offset:.48,easing:"linear"},
    {left:`${outputX}px`,top:`${releaseY}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) scale(${smallScale}) rotateZ(${printerAngle}deg)`,offset:.696,easing:"linear"},
    {left:`${outputX}px`,top:`${releaseY+fallDistance*.08}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) scale(${smallScale}) rotateX(0) rotateZ(${printerAngle*.82}deg)`,offset:.8,easing:"linear"},
    {left:`${outputX}px`,top:`${releaseY+fallDistance*.3}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) scale(${smallScale}) rotateX(2deg) rotateZ(${printerAngle*.55}deg)`,offset:.9,easing:"linear"},
    {left:`${outputX-2}px`,top:`${releaseY+fallDistance*.68}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) scale(${smallScale}) rotateX(9deg) rotateZ(${rotation*.7}deg)`,offset:.97,easing:"linear"},
    {left:`${outputX-8}px`,top:`${targetY}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) scale(${smallScale}) rotateX(28deg) rotateZ(${rotation}deg)`,offset:1}
  ],{duration:2500,fill:"forwards"});motion.onfinish=()=>{motion.commitStyles();motion.cancel();paper.classList.remove("is-printing-document");paper.classList.add("is-printed-document");requestAnimationFrame(()=>requestAnimationFrame(()=>paper.style.removeProperty("transform")))};
}
function bindDesktopContextMenu(){
  const desktop=els.retroDesktop,menu=document.createElement("div");menu.className="retro-context-menu";menu.hidden=true;menu.innerHTML=`<button type="button" data-create="file"><span class="context-mini-file"></span>\u65b0\u5efa\u6587\u4ef6</button><button type="button" data-create="folder"><span class="context-mini-folder"></span>\u65b0\u5efa\u6587\u4ef6\u5939</button>`;desktop.append(menu);
  const close=()=>{menu.hidden=true;menu.classList.remove("is-visible")};
  desktop.addEventListener("contextmenu",e=>{if(state.level!==2||e.target.closest(".retro-window,.custom-inner-icon,.retro-icon,.retro-context-menu"))return;e.preventDefault();state.activeFolderId=null;const r=desktop.getBoundingClientRect();menu.hidden=false;menu.classList.add("is-visible");const rawX=e.clientX-r.left,rawY=e.clientY-r.top,x=Math.max(8,Math.min(r.width-190,rawX)),y=Math.max(8,Math.min(r.height-96,rawY));menu.dataset.createX=String(rawX/r.width);menu.dataset.createY=String(rawY/r.height);menu.style.left=`${x}px`;menu.style.top=`${y}px`});
  menu.querySelectorAll("[data-create]").forEach(button=>button.onclick=e=>{e.stopPropagation();const kind=button.dataset.create,x=+menu.dataset.createX||.5,y=+menu.dataset.createY||.5;close();createDesktopItemInline(kind,x,y)});
  document.addEventListener("pointerdown",e=>{if(!e.target.closest(".retro-context-menu"))close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});window.addEventListener("blur",close);
}
function bindEvents(){els.enterMouse.onclick=()=>{markInteraction("mouse");if(state.level<2)setLevel(2)};document.querySelectorAll("[data-open-app]").forEach(b=>b.onclick=()=>{setLevel(2);openItemWindow(b.dataset.openApp)});document.querySelectorAll(".desktop-icon").forEach(b=>b.onclick=()=>{setLevel(2);openItemWindow(b.dataset.app)});document.getElementById("addNote").onclick=()=>openItemDialog({scope:"outer",action:"create"});document.getElementById("newFile").onclick=()=>createDesktopItemInline("file");document.getElementById("newFolder").onclick=()=>createDesktopItemInline("folder");document.getElementById("resetWorkspace").onclick=resetAll;document.querySelectorAll(".dialog-close").forEach(b=>b.onclick=closeDialog);els.itemForm.onsubmit=saveDialog;els.dialog.oncancel=e=>{e.preventDefault();closeDialog()};els.retroDesktop.ondragover=e=>{if(state.draggedInnerId)e.preventDefault()};els.retroDesktop.ondrop=e=>{if(state.draggedInnerId){e.preventDefault();moveItem(e.dataTransfer.getData("text/plain")||state.draggedInnerId,null);state.draggedInnerId=null}};els.windowLayer.addEventListener("pointerdown",e=>{const w=e.target.closest(".retro-window");if(w){const i=state.innerItems.find(x=>x.id===w.dataset.itemId);state.activeFolderId=i?.kind==="folder"?i.id:null}});els.powerButton.onclick=e=>{e.stopPropagation();markInteraction("power");togglePower()};bindPrinter();bindDesktopContextMenu();bindInteractionHints();bindOutsideSwipe();window.addEventListener("wheel",handleWheel,{passive:false});window.onresize=alignOuterMonitorStand}
function clock(){const c=document.getElementById("retroClock");if(c)c.textContent=new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())}
els.itemForm.addEventListener("submit",()=>{if(state.dialogContext?.scope==="outer"){state.noteDoodleDirty=false;state.noteDoodleData=""}},{capture:true});
window.addEventListener("feltboardnotice",event=>toast(event.detail?.message||"留言状态已更新"));
bindNoteMedia();renderOuterItems();renderInnerItems();bindEvents();applyDesktopMode();clock();setLevel(0);setInterval(clock,30000);
