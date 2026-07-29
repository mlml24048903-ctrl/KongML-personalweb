const STORAGE={outerItems:"km-portfolio-outer-items-v2",connections:"km-portfolio-connections-v2",innerItems:"km-portfolio-inner-items-v2"};
const defaultOuterItems=[
{id:"note-curiosity",color:"lime",title:"KEEP CURIOSITY / \u597d\u5947",content:"\u597d\u5947\u5fc3\u662f\u6301\u7eed\u751f\u957f\u7684\u63a5\u53e3\u3002",x:.205,y:.2,rotation:-3},
{id:"note-impact",color:"orange",title:"BUILD IMPACT",content:"\u4ece\u60f3\u6cd5\uff0c\u5230\u771f\u5b9e\u4e0a\u7ebf\u3002",x:.75,y:.56,rotation:2},
{id:"note-now",color:"bone",title:"NOW / \u63a2\u7d22\u5b63",content:"H5 / \u5c0f\u7a0b\u5e8f / \u5546\u5bb6\u7aef / \u540e\u53f0\n\u6301\u7eed\u8fed\u4ee3\u4e2d",x:.14,y:.6,rotation:-1}
];
const defaultConnections=[{id:"line-1",from:"note-curiosity",to:"note-now"},{id:"line-2",from:"note-now",to:"note-impact"}];
const defaultInnerItems=[
{id:"explore",kind:"folder",title:"\u63a2\u7d22\u5b63 H5",content:"> \u4ece\u4ea7\u54c1\u6982\u5ff5\u5230\u5ba2\u6237\u7aef\u3001\u5546\u5bb6\u7aef\u548c\u540e\u53f0\u843d\u5730\u7684\u5b8c\u6574\u6863\u6848\u3002\n\n## \u9879\u76ee\u7ed3\u6784\n- \u4ea7\u54c1\u603b\u89c8\n- \u5ba2\u6237\u7aef\u4f53\u9a8c\n- \u5546\u5bb6\u7aef\u4e0e\u540e\u53f0\n- \u8fed\u4ee3\u8bb0\u5f55\n\n`0 TO 1` `FULL STACK`",parentId:null,x:.12,y:.18},
{id:"about",kind:"file",title:"\u5173\u4e8e\u6211",content:"> \u5357\u5f00\u5927\u5b66\u6c49\u8bed\u56fd\u9645\u6559\u80b2\u4e13\u4e1a\u672c\u79d1\u751f\uff0c\u6b63\u5728\u5929\u6d25\u521d\u521b\u79d1\u6280\u516c\u53f8\u62c5\u4efb\u4ea7\u54c1\u7ecf\u7406\u3002\n\n## \u6211\u662f\u8c01\n\u6211\u559c\u6b22\u628a **\u8fd8\u4e0d\u6e05\u6670\u7684\u60f3\u6cd5** \u53d8\u6210\u771f\u6b63\u88ab\u4f7f\u7528\u7684\u4ea7\u54c1\u3002\n\n## \u4e2a\u4eba\u7279\u8d28\n- **\u91ce\u5fc3**\uff1a\u6269\u5927\u80fd\u591f\u89e3\u51b3\u7684\u95ee\u9898\n- *\u521b\u65b0*\uff1a\u5bf9\u65b0\u5de5\u5177\u4e0e\u65b0\u4ea4\u4e92\u4fdd\u6301\u654f\u611f\n- \u6f8e\u6e43\uff1a\u5feb\u901f\u5b66\u4e60\u548c\u9ad8\u5f3a\u5ea6\u884c\u52a8\n\n`PRODUCT` `LANGUAGE` `AI`",parentId:null,x:.12,y:.48},
{id:"notebook",kind:"file",title:"AI \u667a\u80fd\u7b14\u8bb0",content:"> \u8ba9\u7075\u611f\u53ef\u4ee5\u88ab\u8fde\u63a5\u3001\u6574\u7406\u548c\u518d\u53d1\u73b0\u7684\u4ea7\u54c1\u6982\u5ff5\u3002\n\n## \u6838\u5fc3\u6d41\u7a0b\n1. \u5feb\u901f\u6355\u6349\u60f3\u6cd5\n2. \u7528 AI \u8fdb\u884c\u7ed3\u6784\u5316\u6574\u7406\n3. \u901a\u8fc7\u53cc\u5411\u8fde\u63a5\u91cd\u65b0\u53d1\u73b0\u5185\u5bb9\n\n`AI NOTE` `KNOWLEDGE GRAPH`",parentId:null,x:.12,y:.78},
{id:"longlu",kind:"folder",title:"\u957f\u82a6\u76d0\u4e1a",content:"> \u5728\u5730\u6587\u5316\u3001AR \u53d9\u4e8b\u4e0e\u7ebf\u4e0b\u6e38\u89c8\u4f53\u9a8c\u7684\u4ea7\u54c1\u63a2\u7d22\u3002\n\n## \u6587\u4ef6\u5939\u5185\u5bb9\n- \u9879\u76ee\u6982\u89c8\n- AR \u5267\u672c\u6e38\u6d41\u7a0b\n- \u5b9e\u5730\u8c03\u7814\u7b14\u8bb0",parentId:null,x:.34,y:.18},
{id:"resume",kind:"file",title:"\u4e2a\u4eba\u5c65\u5386",content:"> \u4ea7\u54c1\u3001\u5f00\u53d1\u4e0e\u8bed\u8a00\u7684\u4ea4\u53c9\u70b9\u3002\n\n## \u5f53\u524d\u7ecf\u5386\n**\u4ea7\u54c1\u7ecf\u7406 / \u5929\u6d25\u521d\u521b\u79d1\u6280\u516c\u53f8**\n- \u63a2\u7d22\u5b63 H5 \u5168\u6d41\u7a0b\u4ea7\u54c1\u4e0e\u72ec\u7acb\u5f00\u53d1\n- \u5c0f\u7a0b\u5e8f\u5efa\u8bbe\u4e0e\u6574\u4f53 UI \u4f18\u5316\n- \u5ba2\u6237\u7aef\u3001\u5546\u5bb6\u7aef\u4e0e\u540e\u53f0\u534f\u540c\n\n## \u6559\u80b2\n\u5357\u5f00\u5927\u5b66 / \u6c49\u8bed\u56fd\u9645\u6559\u80b2 / \u672c\u79d1\n\n`PRODUCT MANAGER` `H5` `MINI PROGRAM`",parentId:null,x:.34,y:.48},
{id:"explore-overview",kind:"file",title:"\u9879\u76ee\u603b\u89c8",content:"> \u9762\u5411\u7ebf\u4e0b\u5a31\u4e50\u573a\u666f\u7684\u57ce\u5e02\u63a2\u7d22\u4e0e\u4efb\u52a1\u4ea7\u54c1\u3002\n\n## \u6211\u7684\u8d23\u4efb\n- \u9700\u6c42\u62c6\u89e3\u3001\u4fe1\u606f\u67b6\u6784\u4e0e\u4ea4\u4e92\u539f\u578b\n- H5 \u5ba2\u6237\u7aef\u4e0e\u5546\u5bb6\u7aef\u72ec\u7acb\u5f00\u53d1\n- \u540e\u53f0\u6570\u636e\u7ed3\u6784\u548c\u534f\u540c\u6d41\u7a0b\n- \u6d4b\u8bd5\u3001\u90e8\u7f72\u548c\u8fed\u4ee3\n\n`END TO END` `OWNER`",parentId:"explore",x:.5,y:.5},
{id:"explore-client",kind:"file",title:"\u5ba2\u6237\u7aef\u4f53\u9a8c",content:"> \u628a\u7ebf\u4e0b\u4efb\u52a1\u3001\u626b\u63cf\u548c\u6210\u5c31\u8f6c\u5316\u4e3a\u6d41\u7545\u7684\u624b\u673a\u4f53\u9a8c\u3002\n\n## \u529f\u80fd\u6a21\u5757\n1. Onboarding \u4e0e\u6d3b\u52a8\u5165\u53e3\n2. AR Scan \u4e0e\u5267\u60c5\u89e6\u53d1\n3. Tasks / Album / Achievement\n4. \u79ef\u5206\u4e0e\u5c0f\u6e38\u620f\n\n**\u76ee\u6807\uff1a** \u964d\u4f4e\u73b0\u573a\u7406\u89e3\u6210\u672c\uff0c\u4fdd\u6301\u6e38\u73a9\u8282\u594f\u3002",parentId:"explore",x:.5,y:.5},
{id:"explore-merchant",kind:"file",title:"\u5546\u5bb6\u7aef\u4e0e\u540e\u53f0",content:"> \u5c06\u6d3b\u52a8\u5185\u5bb9\u3001\u4efb\u52a1\u548c\u73b0\u573a\u6267\u884c\u8f6c\u8bd1\u4e3a\u53ef\u7ba1\u7406\u3001\u53ef\u914d\u7f6e\u7684\u5de5\u4f5c\u53f0\u3002\n\n## \u5546\u5bb6\u7aef\n- \u6d3b\u52a8\u4e0e\u5185\u5bb9\u914d\u7f6e\n- \u7528\u6237\u8fdb\u5ea6\u4e0e\u73b0\u573a\u8fd0\u8425\n\n## \u540e\u53f0\n- \u6570\u636e\u7ed3\u6784\u4e0e\u63a5\u53e3\n- \u6743\u9650\u3001\u72b6\u6001\u548c\u90e8\u7f72\u534f\u540c\n\n`MERCHANT` `ADMIN`",parentId:"explore",x:.5,y:.5},
{id:"explore-research",kind:"folder",title:"\u8fed\u4ee3\u8bb0\u5f55",content:"> \u6536\u96c6\u6d4b\u8bd5\u53cd\u9988\u3001\u4ea7\u54c1\u5224\u65ad\u4e0e\u7248\u672c\u8fed\u4ee3\u3002\n\n## \u5f53\u524d\u5173\u6ce8\n- \u5c0f\u7a0b\u5e8f\u6574\u4f53 UI \u4f18\u5316\n- \u73b0\u573a\u4f7f\u7528\u8def\u5f84\u4e0e\u5f02\u5e38\u72b6\u6001",parentId:"explore",x:.5,y:.5},
{id:"iteration-log",kind:"file",title:"\u4ea7\u54c1\u8fed\u4ee3\u65e5\u5fd7",content:"> \u6bcf\u6b21\u8fed\u4ee3\u90fd\u662f\u5728\u7f29\u77ed\u7528\u6237\u5230\u8fbe\u76ee\u6807\u7684\u8def\u5f84\u3002\n\n## \u8bb0\u5f55\u65b9\u6cd5\n- \u73b0\u8c61\uff1a\u7528\u6237\u5728\u54ea\u6b65\u505c\u987f\n- \u5047\u8bbe\uff1a\u4fe1\u606f\u3001\u53cd\u9988\u8fd8\u662f\u64cd\u4f5c\u95ee\u9898\n- \u9a8c\u8bc1\uff1a\u6700\u5c0f\u8303\u56f4\u5feb\u901f\u8c03\u6574\n\n`ITERATION` `EVIDENCE`",parentId:"explore-research",x:.5,y:.5},
{id:"longlu-overview",kind:"file",title:"\u957f\u82a6\u9879\u76ee\u6982\u89c8",content:"> \u7528\u6570\u5b57\u4ea4\u4e92\u8ba9\u5728\u5730\u6587\u5316\u4e0d\u53ea\u88ab\u9605\u8bfb\uff0c\u800c\u662f\u88ab\u53c2\u4e0e\u3002\n\n## \u4ea7\u54c1\u7ed3\u6784\n- \u7ebf\u4e0b\u5730\u70b9\u4e0e\u6587\u5316\u7ebf\u7d22\n- AR \u8bc6\u522b\u4e0e\u5267\u60c5\u89e6\u53d1\n- \u4efb\u52a1\u3001\u79ef\u5206\u548c\u5fbd\u7ae0\n\n`CULTURE` `AR` `FIELDWORK`",parentId:"longlu",x:.5,y:.5},
{id:"ar-story",kind:"file",title:"AR \u5267\u672c\u6e38\u6d41\u7a0b",content:"> \u626b\u7801\u8fdb\u5165\u3001\u9886\u53d6\u4efb\u52a1\uff0c\u901a\u8fc7 AR \u8bc6\u522b\u7ebf\u4e0b\u7269\u54c1\u89e6\u53d1\u5267\u60c5\u3002\n\n## \u7528\u6237\u8def\u5f84\n1. \u626b\u63cf\u8bbe\u5907\u4e8c\u7ef4\u7801\n2. \u9009\u62e9\u5267\u672c\u5e76\u9886\u53d6\u4efb\u52a1\n3. AR \u8bc6\u522b\u73b0\u573a\u7269\u54c1\n4. \u89e3\u9501\u5267\u60c5\u3001\u79ef\u5206\u4e0e\u6210\u5c31\n\n**\u539f\u5219\uff1a** \u6570\u5b57\u5185\u5bb9\u670d\u52a1\u4e8e\u7ebf\u4e0b\u63a2\u7d22\u3002",parentId:"longlu",x:.5,y:.5},
{id:"field-notes",kind:"file",title:"\u5b9e\u5730\u8c03\u7814\u7b14\u8bb0",content:"> \u4ea7\u54c1\u5224\u65ad\u9700\u8981\u6765\u81ea\u73b0\u573a\uff0c\u800c\u4e0d\u53ea\u662f\u684c\u9762\u63a8\u6f14\u3002\n\n## \u89c2\u5bdf\u7ef4\u5ea6\n- \u6e38\u5ba2\u505c\u7559\u65f6\u95f4\n- \u573a\u5730\u52a8\u7ebf\u548c\u7f51\u7edc\u6761\u4ef6\n- \u5185\u5bb9\u7406\u89e3\u95e8\u69db\n- \u73b0\u573a\u6267\u884c\u6210\u672c\n\n`OBSERVATION` `CONTEXT`",parentId:"longlu",x:.5,y:.5}
];
const clone=v=>structuredClone(v);
function load(k,f){try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:clone(f)}catch{return clone(f)}}
const state={level:0,outerItems:load(STORAGE.outerItems,defaultOuterItems),connections:load(STORAGE.connections,defaultConnections),innerItems:load(STORAGE.innerItems,defaultInnerItems),connectMode:false,selected:[],dialogContext:null,wheelAmount:0,wheelDirection:0,wheelLocked:false,activeFolderId:null,draggedInnerId:null,zIndex:60,powerOn:true,noteImageData:"",noteDoodleData:"",noteDoodleDirty:false,printQueue:[]};
const els={body:document.body,stage:document.getElementById("computerStage"),enterMouse:document.getElementById("enterMouse"),toolbar:document.getElementById("workspaceToolbar"),modeGuide:document.getElementById("modeGuide"),modeLabel:document.getElementById("modeLabel"),modeDescription:document.getElementById("modeDescription"),outerItems:document.getElementById("outerItems"),outerConnections:document.getElementById("outerConnections"),retroDesktop:document.getElementById("retroDesktop"),customInnerItems:document.getElementById("customInnerItems"),windowLayer:document.getElementById("windowLayer"),dialog:document.getElementById("itemDialog"),dialogTitle:document.getElementById("dialogTitle"),itemForm:document.getElementById("itemForm"),itemTitle:document.getElementById("itemTitle"),itemContent:document.getElementById("itemContent"),colorField:document.getElementById("colorField"),zoomMeter:document.querySelector("#zoomMeter span"),zoomLabel:document.querySelector("#zoomMeter small"),toast:document.getElementById("toast"),powerButton:document.getElementById("powerButton"),noteMediaTools:document.getElementById("noteMediaTools"),noteImageInput:document.getElementById("noteImageInput"),noteImagePreview:document.getElementById("noteImagePreview"),noteDoodle:document.getElementById("noteDoodle"),clearNoteImage:document.getElementById("clearNoteImage"),clearDoodle:document.getElementById("clearDoodle")};
function persist(){localStorage.setItem(STORAGE.outerItems,JSON.stringify(state.outerItems));localStorage.setItem(STORAGE.connections,JSON.stringify(state.connections));localStorage.setItem(STORAGE.innerItems,JSON.stringify(state.innerItems))}
function esc(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function inlineMd(v){return esc(v).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/`([^`]+)`/g,'<span class="md-tag">$1</span>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*]+)\*/g,"$1<em>$2</em>")}
function markdownToHTML(md=""){const lines=String(md).replace(/\r/g,"").split("\n");let h="",list=null;const close=()=>{if(list){h+=`</${list}>`;list=null}};for(const line of lines){const hd=line.match(/^(#{1,3})\s+(.+)$/),ul=line.match(/^[-*]\s+(.+)$/),ol=line.match(/^\d+\.\s+(.+)$/);if(hd){close();h+=`<h${hd[1].length}>${inlineMd(hd[2])}</h${hd[1].length}>`}else if(line.startsWith("> ")){close();h+=`<blockquote>${inlineMd(line.slice(2))}</blockquote>`}else if(ul){if(list!=="ul"){close();list="ul";h+="<ul>"}h+=`<li>${inlineMd(ul[1])}</li>`}else if(ol){if(list!=="ol"){close();list="ol";h+="<ol>"}h+=`<li>${inlineMd(ol[1])}</li>`}else if(!line.trim())close();else{close();h+=`<p>${inlineMd(line)}</p>`}}close();return h||"<p>NO CONTENT</p>"}

function setLevel(n,openId){const l=Math.max(0,Math.min(2,n));state.level=l;els.body.classList.toggle("workspace-entered",l>0);els.body.classList.toggle("inner-mode",l===2);els.stage.classList.toggle("entered",l>0);els.toolbar.hidden=l!==1;els.modeGuide.hidden=l===0;if(l===0){state.connectMode=false;state.selected=[];document.getElementById("connectItems").classList.remove("is-active")}else if(l===1){els.modeLabel.textContent="OUTSIDE MODE / 01";els.modeDescription.textContent="\u62d6\u52a8\u4fbf\u7b7e\uff0c\u7ee7\u7eed\u5411\u524d\u6eda\u52a8\u8fdb\u5165\u5c4f\u5e55\u3002"}else{els.modeLabel.textContent="PIXEL DESKTOP / 02";els.modeDescription.textContent="\u5411\u540e\u6eda\u52a8\u53ef\u9000\u56de\u5c4f\u5e55\u5916\u3002";renderInnerItems();if(openId)openItemWindow(openId)}state.wheelAmount=0;els.zoomMeter.style.width="0"}
function renderOuterItems(){
  els.outerItems.innerHTML="";
  state.outerItems.forEach(item=>{
    const n=document.createElement("article"),image=safeImage(item.imageData),doodle=safeImage(item.doodleData);
    n.className="outer-item";n.dataset.id=item.id;n.dataset.color=item.color;n.dataset.shape=[...item.id].reduce((a,c)=>a+c.charCodeAt(0),0)%3;
    n.style.left=`${item.x*100}%`;n.style.top=`${item.y*100}%`;n.style.setProperty("--rotation",`${item.rotation||0}deg`);
    const media=image||doodle?`<div class="sticky-media${doodle&&!image?" is-doodle-only":""}">${image?`<img src="${image}" alt="" />`:""}${doodle?`<img class="sticky-doodle" src="${doodle}" alt="" />`:""}</div>`:"";
    n.classList.toggle("has-media",!!media);
    n.innerHTML=`<span class="sticky-paper" aria-hidden="true"></span><span class="sticky-grain" aria-hidden="true"></span>${media}<button class="delete-item" type="button">\u00d7</button><div class="sticky-copy"><h3>${esc(item.title)}</h3><p>${esc(item.content)}</p></div><small>STICKY NOTE / DOUBLE CLICK TO EDIT</small>`;
    n.classList.toggle("is-selected",state.selected.includes(item.id));bindOuterItem(n,item);els.outerItems.append(n);
  });
  requestAnimationFrame(renderConnections);
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
    renderConnections();
    raf=requestAnimationFrame(follow);
  };
  n.addEventListener("pointerdown",e=>{
    if(e.target.closest(".delete-item"))return;
    if(state.connectMode){e.preventDefault();toggleConnection(item.id);return}
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
    if(trash){cancelAnimationFrame(raf);d=null;n.classList.remove("is-pressed","is-dragging");n.classList.add("is-note-discarding");setTimeout(()=>{state.outerItems=state.outerItems.filter(x=>x.id!==item.id);state.connections=state.connections.filter(x=>x.from!==item.id&&x.to!==item.id);persist();renderOuterItems()},520);return}
    const targetX=d.tx,targetY=d.ty,releaseSway=d.sway,landedRotation=Math.max(-13,Math.min(13,(item.rotation||0)+releaseSway*.72));
    cancelAnimationFrame(raf);d=null;
    item.x=targetX;item.y=targetY;item.rotation=landedRotation;
    n.style.setProperty("--rotation",`${landedRotation.toFixed(2)}deg`);n.style.setProperty("--sway","0deg");
    n.style.left=`${targetX*100}%`;n.style.top=`${targetY*100}%`;
    n.classList.remove("is-pressed","is-dragging");n.classList.add("is-landing");
    setTimeout(()=>{n.classList.remove("is-landing");n.style.setProperty("--sway","0deg")},920);
    renderConnections();persist();
  };
  n.addEventListener("pointerup",land);n.addEventListener("pointercancel",land);n.addEventListener("dblclick",e=>{e.stopPropagation();openItemDialog({scope:"outer",action:"edit",item})});
  n.querySelector(".delete-item").addEventListener("click",e=>{e.stopPropagation();state.outerItems=state.outerItems.filter(x=>x.id!==item.id);state.connections=state.connections.filter(x=>x.from!==item.id&&x.to!==item.id);persist();renderOuterItems()});
}
function toggleConnection(id){state.selected=state.selected.includes(id)?state.selected.filter(x=>x!==id):[...state.selected,id];if(state.selected.length===2){const[a,b]=state.selected;if(!state.connections.some(x=>(x.from===a&&x.to===b)||(x.from===b&&x.to===a)))state.connections.push({id:crypto.randomUUID(),from:a,to:b});state.selected=[];state.connectMode=false;document.getElementById("connectItems").classList.remove("is-active");persist()}renderOuterItems()}
function renderConnections(){const r=els.outerConnections.getBoundingClientRect();if(!r.width)return;els.outerConnections.setAttribute("viewBox",`0 0 ${r.width} ${r.height}`);els.outerConnections.innerHTML="";state.connections.forEach(line=>{const a=state.outerItems.find(x=>x.id===line.from),b=state.outerItems.find(x=>x.id===line.to);if(!a||!b)return;const x1=a.x*r.width,y1=a.y*r.height,x2=b.x*r.width,y2=b.y*r.height,dx=x2-x1,dy=y2-y1,len=Math.max(1,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len,sign=[...line.id].reduce((s,c)=>s+c.charCodeAt(0),0)%2?1:-1,bend=Math.min(138,Math.max(42,len*.22))*sign,c1x=x1+dx*.28+nx*bend,c1y=y1+dy*.28+ny*bend,c2x=x1+dx*.72+nx*bend,c2y=y1+dy*.72+ny*bend,p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",`M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`);els.outerConnections.append(p)})}
const COMPACT_DESKTOP=matchMedia("(max-width:720px)").matches,DESKTOP_GRID=(COMPACT_DESKTOP?[.12,.37,.62,.87].flatMap(x=>[.17,.39,.61,.83].map(y=>({x,y}))):[.1,.25,.4,.55,.7,.85].flatMap(x=>[.2,.45,.7].map(y=>({x,y})))),PRINTER_DESKTOP_SLOT=COMPACT_DESKTOP?{x:.87,y:.83}:{x:.85,y:.7};
function desktopGridIndex(x,y){let best=0,score=Infinity;DESKTOP_GRID.forEach((p,index)=>{const d=(p.x-x)**2+(p.y-y)**2;if(d<score){score=d;best=index}});return best}
function nearestDesktopSlot(x=.1,y=.2,excludeId){const occupied=new Set([desktopGridIndex(PRINTER_DESKTOP_SLOT.x,PRINTER_DESKTOP_SLOT.y)]);state.innerItems.filter(i=>!i.parentId&&i.id!==excludeId).forEach(i=>occupied.add(desktopGridIndex(i.x,i.y)));const ranked=DESKTOP_GRID.map((p,index)=>({p,index,d:(p.x-x)**2+(p.y-y)**2})).sort((a,b)=>a.d-b.d);return clone((ranked.find(v=>!occupied.has(v.index))||ranked[0]).p)}
function normalizeDesktopGrid(){const used=new Set([desktopGridIndex(PRINTER_DESKTOP_SLOT.x,PRINTER_DESKTOP_SLOT.y)]);state.innerItems.filter(i=>!i.parentId).forEach(i=>{const ranked=DESKTOP_GRID.map((p,index)=>({p,index,d:(p.x-i.x)**2+(p.y-i.y)**2})).sort((a,b)=>a.d-b.d),slot=ranked.find(v=>!used.has(v.index))||ranked[0];used.add(slot.index);i.x=slot.p.x;i.y=slot.p.y})}
function nextPos(excludeId){return nearestDesktopSlot(.1,.2,excludeId)}
function iconHTML(i){return `<span class="pixel-icon ${i.kind==="folder"?"pixel-folder":"pixel-file"}"></span><span>${esc(i.title)}</span>`}
let desktopGridReady=false;
function renderInnerItems(){if(!desktopGridReady){normalizeDesktopGrid();desktopGridReady=true;persist()}els.customInnerItems.innerHTML="";state.innerItems.filter(i=>!i.parentId).forEach(i=>{const n=document.createElement("div");n.className="retro-icon custom-inner-icon";n.tabIndex=0;n.dataset.innerId=i.id;n.dataset.kind=i.kind;n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);n.innerHTML=iconHTML(i);bindDesktopItem(n,i);els.customInnerItems.append(n)});const printer=document.createElement("button");printer.type="button";printer.className="retro-icon system-printer-icon";printer.style.setProperty("--x",`${PRINTER_DESKTOP_SLOT.x*100}%`);printer.style.setProperty("--y",`${PRINTER_DESKTOP_SLOT.y*100}%`);printer.innerHTML=`<span class="pixel-icon pixel-printer-icon"><i></i></span><span>\u6253\u5370\u673a</span>`;printer.onclick=openPrinterWindow;els.customInnerItems.append(printer)}
function bindDesktopItem(n,i){let d=null,moved=false;n.addEventListener("pointerdown",e=>{const r=els.retroDesktop.getBoundingClientRect();d={sx:e.clientX,sy:e.clientY,x:i.x*r.width,y:i.y*r.height,r};moved=false;n.setPointerCapture(e.pointerId)});n.addEventListener("pointermove",e=>{if(!d)return;const dx=e.clientX-d.sx,dy=e.clientY-d.sy;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;n.classList.add("is-dragging")}i.x=Math.max(.04,Math.min(.96,(d.x+dx)/d.r.width));i.y=Math.max(.08,Math.min(.9,(d.y+dy)/d.r.height));n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`)});n.addEventListener("pointerup",e=>{if(!d)return;n.classList.remove("is-dragging");const f=[...els.customInnerItems.querySelectorAll('[data-kind="folder"]')].find(x=>{if(x===n)return false;const r=x.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});if(moved&&f)moveItem(i.id,f.dataset.innerId);else{if(moved){const slot=nearestDesktopSlot(i.x,i.y,i.id);i.x=slot.x;i.y=slot.y;n.classList.add("is-snapping");n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);setTimeout(()=>n.classList.remove("is-snapping"),360)}persist()}d=null});n.addEventListener("pointercancel",()=>{if(!d)return;const slot=nearestDesktopSlot(i.x,i.y,i.id);i.x=slot.x;i.y=slot.y;n.classList.remove("is-dragging");n.style.setProperty("--x",`${i.x*100}%`);n.style.setProperty("--y",`${i.y*100}%`);persist();d=null});n.addEventListener("dblclick",()=>{if(!moved)openItemWindow(i.id)})}
function descendant(candidate,ancestor){let c=state.innerItems.find(x=>x.id===candidate);while(c){if(c.parentId===ancestor)return true;c=state.innerItems.find(x=>x.id===c.parentId)}return false}
function moveItem(id,parent){if(!id||id===parent||descendant(parent,id))return;const i=state.innerItems.find(x=>x.id===id);if(!i)return;i.parentId=parent||null;if(!parent)Object.assign(i,nextPos(i.id));persist();renderInnerItems();refreshWindows();toast(parent?"\u5df2\u653e\u5165\u6587\u4ef6\u5939":"\u5df2\u79fb\u56de\u684c\u9762")}
function deleteItem(id){const i=state.innerItems.find(x=>x.id===id);if(!i||!confirm(i.kind==="folder"?"\u5220\u9664\u6587\u4ef6\u5939\u53ca\u5176\u5168\u90e8\u5185\u5bb9\uff1f":"\u5220\u9664\u8fd9\u4e2a\u6587\u4ef6\uff1f"))return;const rm=new Set([id]);let again=true;while(again){again=false;state.innerItems.forEach(x=>{if(rm.has(x.parentId)&&!rm.has(x.id)){rm.add(x.id);again=true}})}state.innerItems=state.innerItems.filter(x=>!rm.has(x.id));els.windowLayer.querySelectorAll(".retro-window").forEach(w=>{if(rm.has(w.dataset.itemId))w.remove()});persist();renderInnerItems();refreshWindows()}
function front(w){state.zIndex++;w.style.zIndex=state.zIndex;els.windowLayer.querySelectorAll(".retro-window").forEach(x=>x.classList.toggle("is-active",x===w))}
function openItemWindow(id){if(state.level!==2)setLevel(2);const i=state.innerItems.find(x=>x.id===id);if(!i)return;const w=document.createElement("article"),n=els.windowLayer.children.length%6;w.className="retro-window";w.dataset.itemId=id;w.style.left=`${18+n*4}%`;w.style.top=`${12+n*4}%`;w.style.width=i.kind==="folder"?"58%":"62%";w.style.height=i.kind==="folder"?"62%":"68%";w.innerHTML=`<header class="retro-window__bar"><div class="window-title-group"><button class="window-back">\u2190</button><span class="window-title"></span></div><div class="window-controls"><button class="window-maximize">\u25a1</button><button class="window-close">\u00d7</button></div></header><div class="retro-window__body"></div><footer class="retro-window__status"><span>READY</span><span>MARKDOWN / LOCAL</span></footer>${["n","e","s","w","ne","nw","se","sw"].map(d=>`<i class="window-resize resize-${d}" data-resize="${d}" aria-hidden="true"></i>`).join("")}`;els.windowLayer.append(w);bindFrame(w);renderWindow(w,id);front(w)}
function bindFrame(w){
  const b=w.querySelector(".retro-window__bar");let d=null;w.onpointerdown=()=>front(w);
  b.onpointerdown=e=>{if(e.target.closest("button"))return;const p=els.windowLayer.getBoundingClientRect(),r=w.getBoundingClientRect();d={sx:e.clientX,sy:e.clientY,left:r.left-p.left,top:r.top-p.top,p,r};b.setPointerCapture(e.pointerId)};
  b.onpointermove=e=>{if(!d||w.classList.contains("is-maximized"))return;w.style.left=`${Math.max(0,Math.min(d.p.width-d.r.width,d.left+e.clientX-d.sx))}px`;w.style.top=`${Math.max(31,Math.min(d.p.height-d.r.height,d.top+e.clientY-d.sy))}px`};b.onpointerup=()=>d=null;
  w.querySelectorAll("[data-resize]").forEach(h=>{let s=null;h.onpointerdown=e=>{e.preventDefault();e.stopPropagation();if(w.classList.contains("is-maximized"))return;front(w);const p=els.windowLayer.getBoundingClientRect(),r=w.getBoundingClientRect();s={sx:e.clientX,sy:e.clientY,left:r.left-p.left,top:r.top-p.top,width:r.width,height:r.height,p,dir:h.dataset.resize};h.setPointerCapture(e.pointerId)};h.onpointermove=e=>{if(!s)return;const dx=e.clientX-s.sx,dy=e.clientY-s.sy,minW=300,minH=190;let x=s.left,y=s.top,ww=s.width,hh=s.height;if(s.dir.includes("e"))ww=Math.max(minW,Math.min(s.p.width-s.left,s.width+dx));if(s.dir.includes("s"))hh=Math.max(minH,Math.min(s.p.height-s.top,s.height+dy));if(s.dir.includes("w")){x=Math.max(0,Math.min(s.left+dx,s.left+s.width-minW));ww=s.width+(s.left-x)}if(s.dir.includes("n")){y=Math.max(31,Math.min(s.top+dy,s.top+s.height-minH));hh=s.height+(s.top-y)}w.style.left=`${x}px`;w.style.top=`${y}px`;w.style.width=`${ww}px`;w.style.height=`${hh}px`};h.onpointerup=()=>s=null;h.onpointercancel=()=>s=null});
  w.querySelector(".window-close").onclick=()=>w.remove();w.querySelector(".window-maximize").onclick=()=>{w.classList.toggle("is-maximized");front(w)};w.querySelector(".window-back").onclick=()=>{const i=state.innerItems.find(x=>x.id===w.dataset.itemId);if(i?.parentId)renderWindow(w,i.parentId)};
}
function entryHTML(i){return `<div class="folder-entry" draggable="true" data-inner-id="${i.id}" data-kind="${i.kind}"><span class="pixel-icon ${i.kind==="folder"?"pixel-folder":"pixel-file"}"></span><div class="folder-entry__label"><b>${esc(i.title)}</b><small>${i.kind.toUpperCase()} / MARKDOWN</small></div></div>`}
function renderWindow(w,id){const i=state.innerItems.find(x=>x.id===id);if(!i){w.remove();return}w.dataset.itemId=id;w.querySelector(".window-title").textContent=`${i.title} / ${i.kind.toUpperCase()}`;w.querySelector(".window-back").hidden=!(i.kind==="folder"&&i.parentId);const b=w.querySelector(".retro-window__body");if(i.kind==="file")b.innerHTML=`<div class="window-file-tools"><span>MARKDOWN FILE</span><div><button data-edit>EDIT</button><button data-delete>DELETE</button></div></div><div class="markdown-view">${markdownToHTML(i.content)}</div>`;else{const kids=state.innerItems.filter(x=>x.parentId===i.id);b.innerHTML=`<div class="window-file-tools"><span>FOLDER / ${kids.length} ITEMS</span><div><button data-edit>EDIT</button><button data-delete>DELETE</button></div></div><div class="folder-description markdown-view">${markdownToHTML(i.content)}</div><div class="folder-dropzone">${kids.map(entryHTML).join("")||'<p class="empty-folder">EMPTY FOLDER</p>'}</div>`;bindFolder(w,i)}b.querySelector(".window-file-tools [data-edit]").onclick=()=>openItemDialog({scope:"inner",action:"edit",kind:i.kind,item:i});b.querySelector(".window-file-tools [data-delete]").onclick=()=>deleteItem(i.id);front(w)}
function bindFolder(w,folder){w.querySelectorAll(".folder-entry").forEach(e=>{e.ondblclick=x=>{openItemWindow(e.dataset.innerId)};e.ondragstart=x=>{state.draggedInnerId=e.dataset.innerId;x.dataTransfer.setData("text/plain",e.dataset.innerId)};if(e.dataset.kind==="folder"){e.ondragover=x=>x.preventDefault();e.ondrop=x=>{x.preventDefault();x.stopPropagation();moveItem(x.dataTransfer.getData("text/plain")||state.draggedInnerId,e.dataset.innerId)}}});const z=w.querySelector(".folder-dropzone");z.ondragover=e=>{e.preventDefault();z.classList.add("is-drop-target")};z.ondragleave=()=>z.classList.remove("is-drop-target");z.ondrop=e=>{e.preventDefault();moveItem(e.dataTransfer.getData("text/plain")||state.draggedInnerId,folder.id)}}
function safeImage(v){return typeof v==="string"&&/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(v)?v:""}
function updateNoteImagePreview(){const src=safeImage(state.noteImageData);els.noteImagePreview.hidden=!src;els.noteImagePreview.innerHTML=src?`<img src="${src}" alt="\u5df2\u5bfc\u5165\u7684\u4fbf\u7b7e\u56fe\u7247" />`:""}
function resetDoodle(src=""){const c=els.noteDoodle,ctx=c.getContext("2d");ctx.clearRect(0,0,c.width,c.height);state.noteDoodleData=safeImage(src);state.noteDoodleDirty=false;if(state.noteDoodleData){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,c.width,c.height);img.src=state.noteDoodleData}}
function fileToNoteImage(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{const max=720,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(c.toDataURL("image/jpeg",.84))};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("image"))};img.src=url})}
function bindNoteMedia(){const c=els.noteDoodle,ctx=c.getContext("2d");let drawing=false;const point=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}};c.onpointerdown=e=>{drawing=true;state.noteDoodleDirty=true;const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=7;ctx.strokeStyle="#151713";c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke()};c.onpointerup=c.onpointercancel=()=>drawing=false;els.noteImageInput.onchange=async()=>{const file=els.noteImageInput.files?.[0];if(!file)return;try{state.noteImageData=await fileToNoteImage(file);updateNoteImagePreview()}catch{toast("\u56fe\u7247\u5bfc\u5165\u5931\u8d25")}};els.clearNoteImage.onclick=()=>{state.noteImageData="";els.noteImageInput.value="";updateNoteImagePreview()};els.clearDoodle.onclick=()=>{state.noteDoodleData="";state.noteDoodleDirty=false;ctx.clearRect(0,0,c.width,c.height)}}
function refreshWindows(){els.windowLayer.querySelectorAll(".retro-window:not([data-system-app])").forEach(w=>renderWindow(w,w.dataset.itemId))}
function openItemDialog(c){state.dialogContext=c;const inner=c.scope==="inner",edit=c.action==="edit",kind=c.kind||"file";els.dialogTitle.textContent=edit?(inner?"\u7f16\u8f91\u6587\u4ef6\u7cfb\u7edf\u9879":"\u7f16\u8f91\u4fbf\u7b7e"):(inner?`\u65b0\u5efa${kind==="folder"?"\u6587\u4ef6\u5939":"\u6587\u4ef6"}`:"\u65b0\u5efa\u4fbf\u7b7e");els.itemTitle.value=c.item?.title||"";els.itemContent.value=c.item?.content||"";els.colorField.hidden=inner;els.noteMediaTools.hidden=inner;els.itemContent.placeholder=inner&&kind==="file"?"Markdown: > \u6458\u8981 / ## \u6807\u9898 / **\u7c97\u4f53** / *\u659c\u4f53* / `\u6807\u7b7e` / - \u5217\u8868":"";state.noteImageData=inner?"":safeImage(c.item?.imageData);updateNoteImagePreview();resetDoodle(inner?"":c.item?.doodleData);if(!inner){const r=els.itemForm.querySelector(`[name="color"][value="${c.item?.color||"lime"}"]`);if(r)r.checked=true}els.dialog.showModal();setTimeout(()=>els.itemTitle.focus())}
function closeDialog(){state.dialogContext=null;state.noteImageData="";state.noteDoodleData="";state.noteDoodleDirty=false;els.itemForm.reset();resetDoodle();updateNoteImagePreview();if(els.dialog.open)els.dialog.close()}
function saveDialog(e){e.preventDefault();if(!els.itemTitle.value.trim())return;const c=state.dialogContext,title=els.itemTitle.value.trim();let content=els.itemContent.value.trim();if(c.scope==="inner"){if(!content)content=c.kind==="folder"?"> \u7528\u4e8e\u6574\u7406\u4e00\u7ec4\u76f8\u5173\u6587\u4ef6\u4e0e\u601d\u8003\u3002\n\n## \u6587\u4ef6\u5939\u8bf4\u660e\n- \u53ef\u4ee5\u62d6\u5165\u6587\u4ef6\u6216\u5b50\u6587\u4ef6\u5939\n- \u53cc\u51fb\u9879\u76ee\u6253\u5f00\u65b0\u7a97\u53e3":"> \u8fd9\u662f\u4e00\u4efd\u53ef\u7ee7\u7eed\u7f16\u8f91\u7684 Markdown \u6587\u4ef6\u3002\n\n## \u6838\u5fc3\u8bb0\u5f55\n- \u5199\u4e0b\u4e00\u4e2a\u5177\u4f53\u95ee\u9898\n- \u8bb0\u5f55\u5224\u65ad\u4e0e\u4e0b\u4e00\u6b65\n\n`NEW FILE`";if(c.action==="edit"){c.item.title=title;c.item.content=content}else{const p=state.activeFolderId?{x:.5,y:.5}:nextPos();state.innerItems.push({id:crypto.randomUUID(),kind:c.kind,title,content,parentId:state.activeFolderId||null,...p})}persist();renderInnerItems();refreshWindows()}else{if(state.noteDoodleDirty)state.noteDoodleData=els.noteDoodle.toDataURL("image/png");const media={imageData:safeImage(state.noteImageData),doodleData:safeImage(state.noteDoodleData)};if(c.action==="edit"){c.item.title=title;c.item.content=content;c.item.color=new FormData(els.itemForm).get("color");Object.assign(c.item,media)}else{state.outerItems.push({id:crypto.randomUUID(),color:new FormData(els.itemForm).get("color"),title,content,x:.5,y:.4,rotation:1,...media})}persist();renderOuterItems()}closeDialog()}
function toast(m){els.toast.textContent=m;els.toast.classList.add("is-visible");clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove("is-visible"),1800)}
function resetAll(){if(!confirm("\u91cd\u7f6e\u4fbf\u7b7e\u3001\u6587\u4ef6\u548c\u6587\u4ef6\u5939\uff1f"))return;Object.values(STORAGE).forEach(k=>localStorage.removeItem(k));state.outerItems=clone(defaultOuterItems);state.connections=clone(defaultConnections);state.innerItems=clone(defaultInnerItems);els.windowLayer.innerHTML="";persist();renderOuterItems();renderInnerItems()}
function wheelAllowed(e){return !(state.level===2&&e.target.closest(".retro-window,.item-dialog"))}
function handleWheel(e){if(!wheelAllowed(e)||state.wheelLocked)return;const d=e.deltaY<0?1:-1;if((state.level===0&&d<0)||(state.level===2&&d>0))return;e.preventDefault();if(state.wheelDirection!==d){state.wheelDirection=d;state.wheelAmount=0}state.wheelAmount=Math.min(180,state.wheelAmount+Math.abs(e.deltaY));els.zoomLabel.textContent=d>0?"ENTER / SCROLL FORWARD":"EXIT / SCROLL BACK";els.zoomMeter.style.width=`${Math.min(100,state.wheelAmount/1.4)}%`;clearTimeout(handleWheel.t);handleWheel.t=setTimeout(()=>{state.wheelAmount=0;els.zoomMeter.style.width="0"},450);if(state.wheelAmount>=140){state.wheelLocked=true;setLevel(state.level+d);setTimeout(()=>state.wheelLocked=false,700)}}

let printedCardCount=0,printedLayerOrder=1000;
function stampPrintOrder(paper){const order=++printedLayerOrder;paper.dataset.printOrder=String(order);paper.style.zIndex=order}
function businessCardHTML(index){return `<span class="card-index">\u4e2a\u4eba\u540d\u7247</span><strong>\u5b54\u7c73\u4e50</strong><span class="card-role">\u4ea7\u54c1\u7ecf\u7406 \u00b7 \u72ec\u7acb\u5f00\u53d1</span><span class="card-school">\u5357\u5f00\u5927\u5b66 \u00b7 \u5929\u6d25</span>`}
function bindPrinter(){const printer=document.getElementById("deskPrinter");printer.onclick=()=>printBusinessCard(printer)}
function printBusinessCard(printer){
  const layer=document.getElementById("businessCardLayer"),slot=printer.querySelector(".printer-slot"),lr=layer.getBoundingClientRect(),sr=slot.getBoundingClientRect();
  const index=++printedCardCount,card=document.createElement("article"),rotation=-7+((index*5)%15);
  card.className="business-card throwable-paper is-printing-card";card.tabIndex=0;card.dataset.rotation=rotation;card.dataset.paperRadius="29";stampPrintOrder(card);card.style.setProperty("--card-rotation",`${rotation}deg`);card.innerHTML=businessCardHTML(index);layer.append(card);bindBusinessCard(card);
  const originX=sr.left+sr.width*.5-lr.left,originY=sr.top+sr.height*.5-lr.top,deskY=lr.height*.82;
  const spread=((index-1)%5-2)*24,targetX=Math.max(125,Math.min(lr.width-125,originX+54+spread)),targetY=Math.min(lr.height-74,deskY+((index-1)%3)*6),curve=index%2?1:-1,printerAngle=-11;
  card.style.left=`${originX}px`;card.style.top=`${originY}px`;
  printer.classList.remove("is-printing");void printer.offsetWidth;printer.classList.add("is-printing");setTimeout(()=>printer.classList.remove("is-printing"),1050);
  const motion=card.animate([
    {left:`${originX}px`,top:`${originY}px`,opacity:0,transform:`translate(-50%,-50%) scaleX(.78) scaleY(.06) rotateZ(${printerAngle}deg)`},
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
  const sides=11+Math.floor(Math.random()*7),centerX=rand(47,53),centerY=rand(46,54);for(let i=0;i<sides;i++){const a=Math.PI*2*(i+rand(-.28,.28))/sides-Math.PI/2,r=rand(.34,.55);points.push(`${(centerX+Math.cos(a)*r*100).toFixed(1)}% ${(centerY+Math.sin(a)*r*100).toFixed(1)}%`)}
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
  randomizePaperBall(card);card.classList.remove("is-on-desk");card.classList.add("is-crumpling");
  setTimeout(()=>{card.classList.remove("is-crumpling");card.classList.add("is-paper-ball");card.setAttribute("aria-label","\u7eb8\u56e2\uff0c\u6309\u4f4f\u62d6\u52a8\u53ef\u629b\u51fa")},1080);
}
function paperRadius(card){return +(card.dataset.paperRadius||29)}
function throwPlan(card,dx,dy){
  const layer=card.parentElement.getBoundingClientRect(),origin={x:parseFloat(card.style.left),y:parseFloat(card.style.top)},g=880,tr=document.getElementById("deskTrash").getBoundingClientRect(),radius=paperRadius(card),deskY=Math.min(layer.height-30,tr.bottom-layer.top-radius);
  let vx=-dx*4.8,vy=Math.max(-980,Math.min(-330,-520-dy*2.8));
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
  const body={x:plan.origin.x,y:plan.origin.y,vx:plan.vx,vy:plan.vy,spin:Math.max(-720,Math.min(720,plan.vx*1.25)),angle:0,bounces:0};
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
    card.style.left=`${body.x}px`;card.style.top=`${body.y}px`;card.style.setProperty("--ball-spin",`${body.angle}deg`);
    if(captured){token.running=false;trashCollision(card,trash);return}
    const sleeping=body.y>=deskY-.5&&Math.abs(body.vy)<5&&Math.abs(body.vx)<10;
    if(sleeping||(body.bounces>24&&body.y>=deskY-.5)){token.running=false;body.vx=0;body.vy=0;trash.classList.remove("is-open");card.classList.remove("is-ball-flying");card.classList.add("is-ball-resting");return}
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
  const startX=drag.cx,startY=drag.cy,fall=finalY-startY,curve=Math.sign(drag.releaseVX||drag.sway||1);
  card.classList.remove("is-dragging-card");card.classList.add("is-card-dropping");
  const motion=card.animate([
    {left:`${startX}px`,top:`${startY}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${rotation+drag.sway*.45}deg)`,offset:0},
    {left:`${startX+curve*82}px`,top:`${startY+fall*.34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*5}deg)`,offset:.38},
    {left:`${finalX+curve*58}px`,top:`${startY+fall*.67}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*2.5}deg)`,offset:.66},
    {left:`${finalX-curve*16}px`,top:`${finalY-34}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(2deg) rotateZ(${rotation}deg)`,offset:.87},
    {left:`${finalX}px`,top:`${finalY}px`,opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateX(28deg) rotateZ(${rotation}deg)`,offset:1}
  ],{duration:3200,easing:"cubic-bezier(.18,.68,.16,1)",fill:"forwards"});
  motion.onfinish=()=>{motion.commitStyles();motion.cancel();card.classList.remove("is-card-dropping");card.classList.add("is-on-desk");requestAnimationFrame(()=>requestAnimationFrame(()=>card.style.removeProperty("transform")))};
}
function bindBusinessCard(card){
  let drag=null,moved=false,raf=0;
  const follow=()=>{if(!drag)return;drag.cx+=(drag.tx-drag.cx)*.12;drag.cy+=(drag.ty-drag.cy)*.12;drag.sway+=(drag.swayTarget-drag.sway)*.15;drag.swayTarget*=.91;card.style.left=`${drag.cx}px`;card.style.top=`${drag.cy}px`;card.style.setProperty("--drag-tilt",`${drag.sway.toFixed(2)}deg`);raf=requestAnimationFrame(follow)};
  card.onpointerdown=e=>{if(e.button!==0||card.classList.contains("is-printing-card")||card.classList.contains("is-crumpling")||card.classList.contains("is-card-dropping")||card.classList.contains("is-printing-document"))return;stampPrintOrder(card);if(card.classList.contains("is-paper-ball")){beginBallAim(card,e);return}const layer=card.parentElement.getBoundingClientRect(),r=card.getBoundingClientRect(),monitor=document.querySelector(".monitor").getBoundingClientRect(),maxX=Math.max(45,monitor.left-layer.left-r.width/2-10);drag={maxX,sx:e.clientX,sy:e.clientY,x:r.left+r.width/2-layer.left,y:r.top+r.height/2-layer.top,cx:r.left+r.width/2-layer.left,cy:r.top+r.height/2-layer.top,tx:r.left+r.width/2-layer.left,ty:r.top+r.height/2-layer.top,lx:e.clientX,ly:e.clientY,lt:e.timeStamp,sway:0,swayTarget:0,releaseVX:0,releaseVY:0,layer};moved=false;card.classList.remove("is-card-landing","is-on-desk");card.setPointerCapture(e.pointerId);card.style.zIndex=Math.max(+(card.dataset.printOrder||0),++state.zIndex+120);cancelAnimationFrame(raf);follow()};
  card.onpointermove=e=>{if(card.classList.contains("is-paper-ball")){updateBallAim(card,e);return}if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy,step=e.clientX-drag.lx,stepY=e.clientY-drag.ly,dt=Math.max(8,e.timeStamp-drag.lt),vx=step/dt,vy=stepY/dt;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;card.classList.remove("is-on-desk");card.classList.add("is-dragging-card")}drag.tx=Math.min(drag.maxX,drag.x+dx);drag.ty=drag.y+dy;drag.swayTarget=Math.max(-13,Math.min(13,vx*21));drag.releaseVX=vx;drag.releaseVY=vy;drag.lx=e.clientX;drag.ly=e.clientY;drag.lt=e.timeStamp};
  const release=e=>{if(card.classList.contains("is-paper-ball")){releaseBallAim(card);return}if(!drag)return;cancelAnimationFrame(raf);if(moved){const deskY=drag.layer.height*.82,finalX=Math.max(45,Math.min(drag.maxX,drag.tx+drag.releaseVX*72)),finalY=Math.max(deskY,Math.min(drag.layer.height-45,drag.ty+Math.max(0,drag.releaseVY)*38)),rotation=Math.max(-18,Math.min(18,(+card.dataset.rotation||0)+drag.sway*.42));card.dataset.rotation=rotation;card.style.setProperty("--card-rotation",`${rotation}deg`);card.style.setProperty("--document-rotation",`${rotation}deg`);animateCardDrop(card,drag,finalX,finalY,rotation)}else crumpleBusinessCard(card);drag=null};
  card.onpointerup=release;card.onpointercancel=release;card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();crumpleBusinessCard(card)}};
}
function toggleBusinessCard(card){crumpleBusinessCard(card)}

function togglePower(){if(state.powerOn){els.body.classList.add("powering-off");setTimeout(()=>{state.powerOn=false;els.body.classList.add("screen-off");els.body.classList.remove("powering-off")},520)}else{state.powerOn=true;els.body.classList.remove("screen-off");els.body.classList.add("powering-on");setTimeout(()=>els.body.classList.remove("powering-on"),620)}}
function createDesktopItemInline(kind,x=.5,y=.5){
  const slot=nearestDesktopSlot(x,y),item={id:crypto.randomUUID(),kind,title:kind==="file"?"\u672a\u547d\u540d.md":"\u65b0\u5efa\u6587\u4ef6\u5939",content:kind==="file"?"> \u8fd9\u662f\u4e00\u4efd\u65b0\u5efa\u7684 Markdown \u6587\u4ef6\u3002\n\n## \u5f00\u59cb\u8bb0\u5f55\n- \u5728\u8fd9\u91cc\u5199\u4e0b\u60f3\u6cd5":"> \u7528\u4e8e\u6574\u7406 Markdown \u6587\u4ef6\u4e0e\u5b50\u6587\u4ef6\u5939\u3002",parentId:null,x:slot.x,y:slot.y};
  state.innerItems.push(item);persist();renderInnerItems();const node=els.customInnerItems.querySelector(`[data-inner-id="${item.id}"]`),label=node?.querySelector(":scope > span:last-child");if(!node||!label)return;
  const input=document.createElement("input");input.className="desktop-inline-name";input.value=item.title;label.replaceWith(input);let done=false;
  const finish=(cancel=false)=>{if(done)return;done=true;if(cancel){state.innerItems=state.innerItems.filter(i=>i.id!==item.id)}else{let title=input.value.trim()||item.title;if(kind==="file"&&!/\.md$/i.test(title))title+=".md";item.title=title}persist();renderInnerItems()};
  input.onpointerdown=e=>e.stopPropagation();input.ondblclick=e=>e.stopPropagation();input.onkeydown=e=>{e.stopPropagation();if(e.key==="Enter")finish();if(e.key==="Escape")finish(true)};input.onblur=()=>finish();requestAnimationFrame(()=>{input.focus();input.select()});
}
function systemWindow(title){
  const w=document.createElement("article"),n=els.windowLayer.children.length%5;w.className="retro-window";w.dataset.systemApp="printer";w.style.left=`${20+n*3}%`;w.style.top=`${13+n*3}%`;w.style.width="58%";w.style.height="65%";w.innerHTML=`<header class="retro-window__bar"><div class="window-title-group"><button class="window-back" hidden>\u2190</button><span class="window-title">${esc(title)}</span></div><div class="window-controls"><button class="window-maximize">\u25a1</button><button class="window-close">\u00d7</button></div></header><div class="retro-window__body"></div><footer class="retro-window__status"><span>PRINTER READY</span><span>LOCAL / MARKDOWN</span></footer>${["n","e","s","w","ne","nw","se","sw"].map(d=>`<i class="window-resize resize-${d}" data-resize="${d}" aria-hidden="true"></i>`).join("")}`;els.windowLayer.append(w);bindFrame(w);front(w);return w;
}
function paginateMarkdown(content){
  const source=(content||"").trim();if(!source)return[""];
  const probe=document.createElement("article");probe.className="printed-document print-measure";probe.innerHTML='<div class="printed-document__content"></div>';document.body.append(probe);const box=probe.firstElementChild;
  const fits=text=>{box.innerHTML=markdownToHTML(text);return box.scrollHeight<=box.clientHeight+1},raw=source.split(/\n\s*\n/),units=[];
  raw.forEach(block=>{if(block.length<=260)units.push(block);else{const lines=block.split("\n");lines.forEach(line=>{if(line.length<=110)units.push(line);else for(let i=0;i<line.length;i+=90)units.push(line.slice(i,i+90))})}});
  const pages=[];let current="";units.forEach(unit=>{const candidate=current?`${current}\n\n${unit}`:unit;if(current&&!fits(candidate)){pages.push(current);current=unit}else current=candidate});if(current)pages.push(current);probe.remove();return pages.length?pages:[source]
}
function printJobs(items){return items.flatMap(item=>{const pages=paginateMarkdown(item.content),total=pages.length;return pages.map((content,page)=>({...structuredClone(item),content,_pageNumber:page+1,_pageTotal:total,_longDocument:total>1}))})}
function openPrinterWindow(){
  const existing=els.windowLayer.querySelector('[data-system-app="printer"]');if(existing){front(existing);return}
  const w=systemWindow("\u6253\u5370\u673a / PRINTER"),files=state.innerItems.filter(i=>i.kind==="file"),pageCounts=new Map(files.map(file=>[file.id,paginateMarkdown(file.content).length]));
  w.querySelector(".retro-window__body").innerHTML=`<section class="printer-app"><div class="printer-app__head"><span class="printer-app__glyph"><i></i></span><div><small>LOCAL PRINT SERVICE</small><h2>\u9009\u62e9 Markdown \u6587\u4ef6</h2><p>\u6587\u4ef6\u5c06\u81ea\u52a8\u5206\u9875\uff0c\u5e76\u4ece\u5c4f\u5e55\u5916\u7684\u5b9e\u4f53\u6253\u5370\u673a\u8f93\u51fa\u3002</p></div></div><div class="printer-file-list">${files.map((file,index)=>`<label class="printer-file-row"><input type="checkbox" name="print-file" value="${file.id}" ${index===0?"checked":""}><span class="pixel-icon pixel-file"></span><span><b>${esc(file.title)}</b><small>MARKDOWN FILE \u00b7 ${pageCounts.get(file.id)} \u9875</small></span></label>`).join("")||'<p class="printer-empty">NO MARKDOWN FILES</p>'}</div><div class="printer-app__footer"><span class="printer-page-summary"><b data-page-total>\u5171\u6253\u5370 ${files.length?pageCounts.get(files[0].id):0} \u9875</b><small data-file-total>${files.length?1:0} \u4e2a\u6587\u4ef6</small></span><button type="button" data-print ${files.length?"":"disabled"}>\u6253\u5370\u6240\u9009\u6587\u4ef6</button></div></section>`;
  const updateTotal=()=>{const ids=[...w.querySelectorAll('[name="print-file"]:checked')].map(input=>input.value),pages=ids.reduce((sum,id)=>sum+(pageCounts.get(id)||0),0);w.querySelector("[data-page-total]").textContent=`\u5171\u6253\u5370 ${pages} \u9875`;w.querySelector("[data-file-total]").textContent=`${ids.length} \u4e2a\u6587\u4ef6`;w.querySelector("[data-print]").disabled=!ids.length};
  w.querySelectorAll('[name="print-file"]').forEach(input=>input.addEventListener("change",updateTotal));
  w.querySelector("[data-print]")?.addEventListener("click",()=>{const ids=[...w.querySelectorAll('[name="print-file"]:checked')].map(input=>input.value),items=ids.map(id=>state.innerItems.find(i=>i.id===id)).filter(Boolean);if(!items.length){toast("\u8bf7\u81f3\u5c11\u9009\u62e9\u4e00\u4e2a\u6587\u4ef6");return}const jobs=printJobs(items);state.printQueue.push(...jobs);toast(`\u5df2\u53d1\u9001 ${items.length} \u4e2a\u6587\u4ef6\uff0c\u5171 ${jobs.length} \u9875`);w.remove();setTimeout(()=>{setLevel(0);setTimeout(flushPrintQueue,1350)},180)});
}
let printedDocumentCount=0;
function flushPrintQueue(){if(state.level!==0||!state.printQueue.length)return;const item=state.printQueue.shift();printMarkdownDocument(item);if(state.printQueue.length)setTimeout(flushPrintQueue,1800)}
function printMarkdownDocument(item){
  const printer=document.getElementById("deskPrinter"),layer=document.getElementById("businessCardLayer"),slot=printer.querySelector(".printer-slot"),lr=layer.getBoundingClientRect(),sr=slot.getBoundingClientRect(),paper=document.createElement("article"),index=++printedDocumentCount,rotation=-5+(index%5)*2;
  paper.className="printed-document throwable-paper is-printing-document";if(item._longDocument)paper.classList.add("is-long-document");paper.tabIndex=0;paper.dataset.rotation=rotation;paper.dataset.paperRadius="36";stampPrintOrder(paper);paper.style.setProperty("--document-rotation",`${rotation}deg`);paper.style.setProperty("--card-rotation",`${rotation}deg`);const pageNumber=item._pageNumber||1,pageTotal=item._pageTotal||1,meta=item._longDocument?"":`<span class="printed-document__meta">MARKDOWN / LOCAL PRINT</span>`;paper.innerHTML=`${meta}<h2>${esc(item.title)}</h2><div class="printed-document__content">${markdownToHTML(item.content)}</div><small>PAGE ${String(pageNumber).padStart(2,"0")} / ${String(pageTotal).padStart(2,"0")}</small>`;layer.append(paper);bindBusinessCard(paper);
  const originX=sr.left+sr.width*.5-lr.left,originY=sr.top+sr.height*.5-lr.top,targetX=Math.max(155,Math.min(lr.width-155,originX+130+(index%3)*20)),targetY=Math.min(lr.height-145,lr.height*.79+(index%3)*7),curve=index%2?1:-1;paper.style.left=`${originX}px`;paper.style.top=`${originY}px`;printer.classList.remove("is-printing");void printer.offsetWidth;printer.classList.add("is-printing");clearTimeout(printer._printingTimer);printer._printingTimer=setTimeout(()=>printer.classList.remove("is-printing"),3300);
  const launchY=originY+34;
  const motion=paper.animate([
    {left:`${originX}px`,top:`${launchY}px`,opacity:0,clipPath:"inset(0 18% 86% 18%)",transform:"translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(-7deg)",offset:0},
    {left:`${originX+curve*5}px`,top:`${launchY+74}px`,opacity:1,clipPath:"inset(0 12% 28% 12%)",transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*1.5}deg)`,offset:.2},
    {left:`${originX+curve*20}px`,top:`${launchY+132}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) rotateX(1deg) rotateZ(${curve*3}deg)`,offset:.34},
    {left:`${originX+curve*58}px`,top:`${launchY+(targetY-launchY)*.42}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) rotateX(0) rotateZ(${curve*3.5}deg)`,offset:.55},
    {left:`${targetX+curve*34}px`,top:`${targetY-48}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) rotateX(6deg) rotateZ(${curve*2}deg)`,offset:.78},
    {left:`${targetX-curve*9}px`,top:`${targetY-16}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) rotateX(19deg) rotateZ(${rotation+curve*.7}deg)`,offset:.93},
    {left:`${targetX}px`,top:`${targetY}px`,opacity:1,clipPath:"inset(0)",transform:`translate(-50%,-50%) perspective(700px) rotateX(28deg) rotateZ(${rotation}deg)`,offset:1}
  ],{duration:3400,easing:"cubic-bezier(.2,.64,.18,1)",fill:"forwards"});motion.onfinish=()=>{motion.commitStyles();motion.cancel();paper.classList.remove("is-printing-document");paper.classList.add("is-printed-document");requestAnimationFrame(()=>requestAnimationFrame(()=>paper.style.removeProperty("transform")))};
}
function bindDesktopContextMenu(){
  const desktop=els.retroDesktop,menu=document.createElement("div");menu.className="retro-context-menu";menu.hidden=true;menu.innerHTML=`<button type="button" data-create="file"><span class="context-mini-file"></span>\u65b0\u5efa\u6587\u4ef6</button><button type="button" data-create="folder"><span class="context-mini-folder"></span>\u65b0\u5efa\u6587\u4ef6\u5939</button>`;desktop.append(menu);
  const close=()=>{menu.hidden=true;menu.classList.remove("is-visible")};
  desktop.addEventListener("contextmenu",e=>{if(state.level!==2||e.target.closest(".retro-window,.custom-inner-icon,.retro-icon,.retro-context-menu"))return;e.preventDefault();state.activeFolderId=null;const r=desktop.getBoundingClientRect();menu.hidden=false;menu.classList.add("is-visible");const rawX=e.clientX-r.left,rawY=e.clientY-r.top,x=Math.max(8,Math.min(r.width-190,rawX)),y=Math.max(8,Math.min(r.height-96,rawY));menu.dataset.createX=String(rawX/r.width);menu.dataset.createY=String(rawY/r.height);menu.style.left=`${x}px`;menu.style.top=`${y}px`});
  menu.querySelectorAll("[data-create]").forEach(button=>button.onclick=e=>{e.stopPropagation();const kind=button.dataset.create,x=+menu.dataset.createX||.5,y=+menu.dataset.createY||.5;close();createDesktopItemInline(kind,x,y)});
  document.addEventListener("pointerdown",e=>{if(!e.target.closest(".retro-context-menu"))close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});window.addEventListener("blur",close);
}
function bindEvents(){els.enterMouse.onclick=()=>{if(state.level<2)setLevel(state.level+1)};document.querySelectorAll("[data-open-app]").forEach(b=>b.onclick=()=>{setLevel(2);openItemWindow(b.dataset.openApp)});document.querySelectorAll(".desktop-icon").forEach(b=>b.onclick=()=>{setLevel(2);openItemWindow(b.dataset.app)});document.getElementById("addNote").onclick=()=>openItemDialog({scope:"outer",action:"create"});document.getElementById("connectItems").onclick=e=>{state.connectMode=!state.connectMode;state.selected=[];e.currentTarget.classList.toggle("is-active",state.connectMode);renderOuterItems()};document.getElementById("newFile").onclick=()=>createDesktopItemInline("file");document.getElementById("newFolder").onclick=()=>createDesktopItemInline("folder");document.getElementById("resetWorkspace").onclick=resetAll;document.querySelectorAll(".dialog-close").forEach(b=>b.onclick=closeDialog);els.itemForm.onsubmit=saveDialog;els.dialog.oncancel=e=>{e.preventDefault();closeDialog()};els.retroDesktop.ondragover=e=>{if(state.draggedInnerId)e.preventDefault()};els.retroDesktop.ondrop=e=>{if(state.draggedInnerId){e.preventDefault();moveItem(e.dataTransfer.getData("text/plain")||state.draggedInnerId,null);state.draggedInnerId=null}};els.windowLayer.addEventListener("pointerdown",e=>{const w=e.target.closest(".retro-window");if(w){const i=state.innerItems.find(x=>x.id===w.dataset.itemId);state.activeFolderId=i?.kind==="folder"?i.id:null}});els.powerButton.onclick=e=>{e.stopPropagation();togglePower()};bindPrinter();bindDesktopContextMenu();window.addEventListener("wheel",handleWheel,{passive:false});window.onresize=renderConnections}
function clock(){const c=document.getElementById("retroClock");if(c)c.textContent=new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())}
bindNoteMedia();renderOuterItems();renderInnerItems();bindEvents();clock();setLevel(0);setInterval(clock,30000);