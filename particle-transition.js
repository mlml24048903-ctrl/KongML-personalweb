/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5 */
class PagePaperTransition {
  constructor(){
    this.running=false;
    this.stage=null;
    this.cover=null;
    this.scene=null;
    this.scrubProgress=0;
    this.longScrollScene=null;
    this.longScrollPair=null;
    this.longScrollProgress=0;
    this.longScrollRequest=0;
    this.cache=new Map();
    this.assetImages=new Map();
    this.assetSources={home:"./assets/snapshots/home.webp?v=3","profile:about":"./assets/snapshots/about.webp?v=3","profile:now":"./assets/snapshots/now.webp?v=3","profile:contact":"./assets/snapshots/contact.webp?v=3"};
    addEventListener("resize",()=>this.cache.clear(),{passive:true});
    addEventListener("load",()=>Object.keys(this.assetSources).forEach(key=>this.loadAssetImage(key)),{once:true});
  }
  reduced(){return matchMedia("(prefers-reduced-motion: reduce)").matches}
  viewKey(){const page=document.querySelector(".profile-page.is-current:not([hidden])");return document.body.classList.contains("profile-open")&&page?`profile:${page.dataset.profileContent}`:"home"}
  visualState(){if(document.body.classList.contains("profile-open"))return this.viewKey();return document.body.classList.contains("code-desktop-mode")?"code-desktop":"classic-desktop"}
  validSnapshot(snapshot){return snapshot&&snapshot.width===innerWidth&&snapshot.height===innerHeight}
  loadAssetImage(key){
    if(!this.assetSources[key])return Promise.resolve(null);if(this.assetImages.has(key))return this.assetImages.get(key);
    const promise=new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=this.assetSources[key]});this.assetImages.set(key,promise);return promise;
  }
  async loadAssetSnapshot(key){
    if(innerWidth/innerHeight<1.12)return null;const image=await this.loadAssetImage(key);if(!image)return null;
    const canvas=document.createElement("canvas"),context=canvas.getContext("2d");canvas.width=innerWidth;canvas.height=innerHeight;context.drawImage(image,0,0,innerWidth,innerHeight);return canvas;
  }
  async capture(){
    if(typeof window.htmlToImage?.toCanvas!=="function")throw new Error("snapshot renderer unavailable");
    const profileOpen=document.body.classList.contains("profile-open"),styleProperties=[
      "position","inset","top","right","bottom","left","z-index","display","visibility","opacity","overflow","overflow-x","overflow-y",
      "width","height","min-width","min-height","max-width","max-height","box-sizing","margin","padding","transform","transform-origin",
      "background","background-color","background-image","background-size","background-position","background-repeat","background-blend-mode",
      "border","border-width","border-style","border-color","border-radius","box-shadow","clip-path","filter","mask-image","mask-size","mask-position",
      "color","font","font-family","font-size","font-style","font-weight","line-height","letter-spacing","text-align","text-shadow","text-transform","white-space",
      "grid-template-columns","grid-template-rows","grid-column","grid-row","place-items","align-items","align-self","justify-items","justify-content","justify-self","gap",
      "flex","flex-direction","flex-wrap","align-content","object-fit","object-position","content","list-style","pointer-events"
    ];
    document.documentElement.classList.add("snapshot-capture");
    try{
      await new Promise(resolve=>requestAnimationFrame(resolve));
      return await window.htmlToImage.toCanvas(document.body,{
        width:innerWidth,height:innerHeight,canvasWidth:innerWidth,canvasHeight:innerHeight,pixelRatio:1,skipFonts:true,cacheBust:false,
        includeStyleProperties:styleProperties,backgroundColor:getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim(),
        filter:element=>{
          if(element.classList?.contains("paper-transition-layer")||element.hidden)return false;
          if(element.id==="profileLayer"&&!profileOpen)return false;
          if(element.matches?.("dialog:not([open])"))return false;
          if(profileOpen&&element.matches?.(".masthead,.hero-copy,#computerStage,#deskPrinter,#deskTrash,#businessCardLayer,#throwTrajectory,#confettiLayer,#workspaceToolbar,#modeGuide,#zoomMeter,#itemDialog,#toast"))return false;
          return true;
        }
      });
    }finally{document.documentElement.classList.remove("snapshot-capture")}
  }
  async captureProfilePage(key,viewport){
    const name=key.replace(/^profile:/,""),page=document.querySelector(`[data-profile-content="${name}"]`);if(!page)throw new Error(`profile page unavailable: ${name}`);
    const rect=page.getBoundingClientRect(),width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(Math.max(rect.height,viewport.height))),paper=getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim();
    const pageShot=await window.htmlToImage.toCanvas(page,{width,height,canvasWidth:width,canvasHeight:height,pixelRatio:1,skipFonts:true,cacheBust:false,backgroundColor:"transparent",filter:element=>!element.hidden});
    const snapshot=document.createElement("canvas"),context=snapshot.getContext("2d");snapshot.width=Math.max(1,Math.round(viewport.width));snapshot.height=Math.max(1,Math.round(viewport.height));context.fillStyle=paper;context.fillRect(0,0,snapshot.width,snapshot.height);context.drawImage(pageShot,Math.round(rect.left-viewport.left),0);return snapshot;
  }
  makeCover(snapshot){
    const canvas=document.createElement("canvas"),context=canvas.getContext("2d");canvas.className="paper-transition-layer paper-transition-cover";canvas.setAttribute("aria-hidden","true");canvas.width=snapshot.width;canvas.height=snapshot.height;context.drawImage(snapshot,0,0);document.body.append(canvas);this.cover=canvas;
  }
  shader(gl,type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||"paper shader failed");return shader;
  }
  texture(gl,image){
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);return texture;
  }
  paperColor(){
    const probe=document.createElement("canvas").getContext("2d");probe.canvas.width=1;probe.canvas.height=1;probe.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim();probe.fillRect(0,0,1,1);return[...probe.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255);
  }
  cropSnapshot(snapshot,viewport){
    const canvas=document.createElement("canvas"),context=canvas.getContext("2d"),left=Math.max(0,Math.round(viewport.left)),top=Math.max(0,Math.round(viewport.top));canvas.width=Math.max(1,Math.round(viewport.width));canvas.height=Math.max(1,Math.round(viewport.height));context.drawImage(snapshot,left,top,canvas.width,canvas.height,0,0,canvas.width,canvas.height);return canvas;
  }
  mesh(columns,rows){
    const vertices=new Float32Array(columns*rows*12);let offset=0,push=(x,y)=>{vertices[offset++]=x;vertices[offset++]=y};
    for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){const x0=x/columns,x1=(x+1)/columns,y0=y/rows,y1=(y+1)/rows;push(x0,y0);push(x1,y0);push(x0,y1);push(x0,y1);push(x1,y0);push(x1,y1)}return vertices;
  }
  setupScene(oldShot,newShot,{viewport=null,fromKey="",toKey="",longScroll=false,sourceState=""}={}){
    const canvas=document.createElement("canvas"),width=Math.max(1,Math.round(viewport?.width||innerWidth)),height=Math.max(1,Math.round(viewport?.height||innerHeight)),compact=width<700,dpr=Math.min(devicePixelRatio||1,compact?1:1.2);
    canvas.className=`paper-transition-layer paper-turn-stage${longScroll?" is-profile-long-scroll":""}`;canvas.setAttribute("aria-hidden","true");canvas.dataset.fromKey=fromKey;canvas.dataset.toKey=toKey;canvas.dataset.renderMode="paper-crumple-turn";canvas.dataset.sourceCapture="live";canvas.dataset.sourceState=sourceState||fromKey;canvas.dataset.targetGeometry="flat";canvas.dataset.composition=longScroll?"live-dom-seam":"snapshot-page";
    if(viewport){canvas.style.inset="auto";canvas.style.left=`${viewport.left}px`;canvas.style.top=`${viewport.top}px`;canvas.style.width=`${viewport.width}px`;canvas.style.height=`${viewport.height}px`}
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    const gl=canvas.getContext("webgl",{alpha:longScroll,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false});if(!gl)throw new Error("WebGL unavailable");
    const vertex=this.shader(gl,gl.VERTEX_SHADER,`
      precision mediump float;
      attribute vec2 a_uv;
      uniform float u_progress;
      uniform float u_layer;
      uniform float u_long_scroll;
      varying vec2 v_uv;
      varying float v_fold;
      varying float v_ridge;
      void main(){
        vec2 uv=a_uv;float p=clamp(u_progress,0.0,1.0);float front=1.0-p;vec2 position=uv;float fold=0.0;float ridge=0.0;
        if(u_layer>.5){
          if(u_long_scroll>.5){
            float edgeT=clamp((uv.y-.80)/.20,0.0,1.0);fold=smoothstep(0.0,1.0,edgeT)*smoothstep(.015,.13,p);
            float broad=sin(edgeT*34.0+uv.x*8.0)+.48*sin(edgeT*67.0-uv.x*15.0)+.24*sin(uv.x*41.0+uv.y*23.0);
            ridge=broad/1.72;float band=mix(.19,.105,p);float foldedY=front+band*(.28*(1.0-edgeT)+.24*ridge);
            position.y=mix(uv.y-p,foldedY,fold);position.x+=fold*((sin(uv.y*29.0+uv.x*13.0)+.55*sin(uv.x*47.0-uv.y*17.0))*.007*p);
            position.x=.5+(position.x-.5)*(1.0-fold*.055*p);
          }else{
            float span=max(.001,p);float t=clamp((uv.y-front)/span,0.0,1.0);fold=smoothstep(front-.035,front+.025,uv.y)*smoothstep(.01,.15,p);
            float broad=sin(t*34.0+uv.x*8.0)+.48*sin(t*67.0-uv.x*15.0)+.24*sin(uv.x*41.0+uv.y*23.0);
            ridge=broad/1.72;float band=mix(.145,.068,p);
            float foldedY=front+band*(.36*t+.24*ridge);position.y=mix(uv.y,foldedY,fold);
            position.x+=fold*((sin(uv.y*29.0+uv.x*13.0)+.55*sin(uv.x*47.0-uv.y*17.0))*.0075*p);
            position.x=.5+(position.x-.5)*(1.0-fold*.085*p);
            position.y-=smoothstep(.88,1.0,p)*(p-.88)*.52;
          }
        }
        vec2 clip=position*2.0-1.0;clip.y=-clip.y;float depth=u_layer>.5?-.22-fold*(.08+.06*ridge):.35;gl_Position=vec4(clip,depth,1.0);v_uv=uv;v_fold=fold;v_ridge=ridge;
      }`);
    const fragment=this.shader(gl,gl.FRAGMENT_SHADER,`
      precision mediump float;
      uniform sampler2D u_page;
      uniform float u_progress;
      uniform float u_layer;
      uniform float u_long_scroll;
      varying vec2 v_uv;
      varying float v_fold;
      varying float v_ridge;
      void main(){
        float p=clamp(u_progress,0.0,1.0);float front=1.0-p;vec2 sampleUv=vec2(v_uv.x,1.0-v_uv.y);vec4 color=texture2D(u_page,sampleUv);
        float diagonalA=pow(.5+.5*sin(v_uv.x*58.0+v_uv.y*91.0+sin(v_uv.y*19.0)*2.2),18.0);
        float diagonalB=pow(.5+.5*sin(v_uv.x*83.0-v_uv.y*64.0+sin(v_uv.x*17.0)*1.8),24.0);
        float fine=sin(v_uv.x*126.0+v_uv.y*39.0)*sin(v_uv.y*117.0-v_uv.x*31.0);
        if(u_long_scroll>.5&&u_layer<.5)discard;
        if(u_long_scroll>.5&&v_fold<.012)discard;
        if(u_layer<.5){
          float shadow=smoothstep(front-.016,front+.03,v_uv.y)*(1.0-smoothstep(front+.03,front+.21,v_uv.y))*p;color.rgb*=1.0-shadow*.20;
        }else{
          float reveal=smoothstep(.008,.12,p);float wrinkle=reveal*(u_long_scroll>.5?.14*v_fold:.018+.125*v_fold);float light=(diagonalA*.7-diagonalB*.48+fine*.08+v_ridge*.28)*wrinkle;color.rgb*=1.0+light;
          color.rgb*=1.0-v_fold*pow(abs(v_ridge),3.0)*.055;
          color.a*=u_long_scroll>.5?smoothstep(.012,.28,v_fold):1.0-smoothstep(.95,1.0,p);
        }
        gl_FragColor=color;
      }`);
    const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||"paper program failed");
    const columns=compact?26:44,rows=compact?20:34,vertices=this.mesh(columns,rows),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.useProgram(program);const position=gl.getAttribLocation(program,"a_uv");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const oldTexture=this.texture(gl,oldShot),newTexture=this.texture(gl,newShot),locations={progress:gl.getUniformLocation(program,"u_progress"),layer:gl.getUniformLocation(program,"u_layer"),page:gl.getUniformLocation(program,"u_page"),longScroll:gl.getUniformLocation(program,"u_long_scroll")};
    document.body.append(canvas);return{canvas,gl,program,buffer,count:vertices.length/2,textures:[oldTexture,newTexture],locations,paper:this.paperColor(),longScroll};
  }
  render(scene,progress,allowStageFade=false){
    if(!scene)return;progress=Math.max(0,Math.min(1,progress));const gl=scene.gl;gl.viewport(0,0,scene.canvas.width,scene.canvas.height);gl.clearColor(scene.paper[0],scene.paper[1],scene.paper[2],scene.longScroll?0:1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.useProgram(scene.program);gl.uniform1f(scene.locations.progress,progress);gl.uniform1f(scene.locations.longScroll,scene.longScroll?1:0);
    gl.activeTexture(gl.TEXTURE0);gl.uniform1i(scene.locations.page,0);gl.disable(gl.BLEND);gl.bindTexture(gl.TEXTURE_2D,scene.textures[1]);gl.uniform1f(scene.locations.layer,0);gl.drawArrays(gl.TRIANGLES,0,scene.count);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.bindTexture(gl.TEXTURE_2D,scene.textures[0]);gl.uniform1f(scene.locations.layer,1);gl.drawArrays(gl.TRIANGLES,0,scene.count);scene.canvas.dataset.progress=progress.toFixed(3);scene.canvas.style.opacity=allowStageFade&&progress>.985?String(Math.max(0,(1-progress)/.015)):"1";
  }
  async setProfileLongScroll({fromKey,toKey,progress,viewport}){
    if(this.reduced()||innerWidth<700){this.clearProfileLongScroll();return false}const pair=`${fromKey}>${toKey}:${Math.round(viewport.width)}x${Math.round(viewport.height)}@${Math.round(viewport.top)}`;
    this.longScrollProgress=progress;
    if(this.longScrollPair===pair){if(this.longScrollScene)this.render(this.longScrollScene,progress);return!!this.longScrollScene}
    this.clearProfileLongScroll();this.longScrollProgress=progress;this.longScrollPair=pair;const request=++this.longScrollRequest;
    try{
      document.documentElement.classList.add("snapshot-capture");await new Promise(resolve=>requestAnimationFrame(resolve));
      const oldShot=await this.captureProfilePage(fromKey,viewport);document.documentElement.classList.remove("snapshot-capture");if(request!==this.longScrollRequest||this.longScrollPair!==pair)return false;
      const scene=this.setupScene(oldShot,oldShot,{viewport,fromKey,toKey,longScroll:true});if(request!==this.longScrollRequest){scene.canvas.remove();return false}this.longScrollScene=scene;this.render(scene,this.longScrollProgress);return true;
    }catch(error){document.documentElement.classList.remove("snapshot-capture");console.warn("Paper turn was disabled for this scroll segment.",error);this.clearProfileLongScroll();return false}
  }
  clearProfileLongScroll(){this.longScrollRequest++;this.longScrollScene?.canvas?.remove();this.longScrollScene=null;this.longScrollPair=null;this.longScrollProgress=0}
  animate(scene){
    return new Promise(resolve=>{const duration=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dur-page"))||1450,start=performance.now(),frame=now=>{const raw=Math.min(1,(now-start)/duration),progress=raw<.5?2.0*raw*raw:1.0-Math.pow(-2.0*raw+2.0,2.0)/2.0;this.render(scene,progress,true);if(raw<1)requestAnimationFrame(frame);else resolve()};requestAnimationFrame(frame)});
  }
  async beginScrub({fromKey,toKey,preview,restore}){
    if(this.running||this.reduced())return false;this.running=true;this.scrubProgress=0;
    try{
      const oldShot=await this.capture();this.makeCover(oldShot);document.body.classList.add("paper-transition-active");let newShot=null;
      if(preview){preview();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));newShot=await this.capture();restore?.();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))}if(!newShot)newShot=await this.loadAssetSnapshot(toKey)||await this.capture();
      this.scene=this.setupScene(oldShot,newShot,{fromKey,toKey});this.stage=this.scene.canvas;this.cache.set(toKey,newShot);this.render(this.scene,0);this.cover?.remove();this.cover=null;return true;
    }catch(error){console.warn("Paper scrub fell back to a direct page change.",error);this.cleanup();return false}
  }
  setScrubProgress(progress){this.scrubProgress=Math.max(0,Math.min(1,progress));if(this.scene)this.render(this.scene,this.scrubProgress)}
  async finishScrub({commit,update}){
    if(!this.running)return false;const scene=this.scene,target=commit?1:0,start=this.scrubProgress,distance=Math.abs(target-start);
    if(scene&&distance>.001){const duration=Math.max(120,360*distance),started=performance.now();await new Promise(resolve=>{const frame=now=>{const elapsed=Math.min(1,(now-started)/duration),eased=elapsed*elapsed*(3-2*elapsed),progress=start+(target-start)*eased;this.scrubProgress=progress;this.render(scene,progress);if(elapsed<1)requestAnimationFrame(frame);else resolve()};requestAnimationFrame(frame)})}if(commit)update?.();this.cleanup();return commit;
  }
  cleanup(){this.stage?.remove();this.cover?.remove();this.stage=null;this.cover=null;this.scene=null;this.scrubProgress=0;this.running=false;document.body.classList.remove("paper-transition-active")}
  async run({update,fromKey,toKey}){
    if(this.running){update();return}if(this.reduced()){update();return}this.running=true;let updated=false;
    try{
      const oldKey=fromKey||this.viewKey(),sourceState=this.visualState(),oldShot=await this.capture();this.makeCover(oldShot);document.body.classList.add("paper-transition-active");update();updated=true;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const newKey=toKey||this.viewKey(),newShot=await this.capture(),scene=this.setupScene(oldShot,newShot,{fromKey:oldKey,toKey:newKey,sourceState});this.scene=scene;this.stage=scene.canvas;this.render(scene,0);this.cover?.remove();this.cover=null;await this.animate(scene);
    }catch(error){console.warn("Paper turn fell back to a direct page swap.",error);if(!updated)update()}finally{this.cleanup()}
  }
}
window.pagePaperTransition=new PagePaperTransition();
