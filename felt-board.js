(() => {
  const canvas = document.getElementById("feltCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", `${canvas.getAttribute("aria-label") || "Canvas message board"}; double-click a receipt to delete it, or select it and press Delete`);
  const shell = canvas.parentElement;
  const tearButton = document.getElementById("feltTearButton");
  const pinButton = document.getElementById("feltPinButton");
  const receiptButton = document.getElementById("feltReceiptButton");
  const editor = document.getElementById("feltEditor");
  const form = document.getElementById("feltEditorForm");
  const markdown = document.getElementById("feltMarkdown");
  const markdownField = document.getElementById("feltMarkdownField");
  const doodleField = document.getElementById("feltDoodleField");
  const imageField = document.getElementById("feltImageField");
  const imageInput = document.getElementById("feltImageInput");
  const imagePreview = document.getElementById("feltImagePreview");
  const imageDropzone = document.getElementById("feltImageDropzone");
  const paperColorPicker = form.querySelector(".felt-paper-colors");
  const customColor = document.getElementById("feltCustomColor");
  const deleteButton = document.getElementById("feltEditorDelete");
  const saveButton = form.querySelector(".felt-editor-save");
  const doodleCanvas = document.getElementById("feltDoodleCanvas");
  const doodleCtx = doodleCanvas.getContext("2d");
  const doodlePen = document.getElementById("feltDoodlePen");
  const doodleUndo = document.getElementById("feltDoodleUndo");
  const doodleEraser = document.getElementById("feltDoodleEraser");
  const doodleExpand = document.getElementById("feltDoodleExpand");
  const doodleClear = document.getElementById("feltDoodleClear");
  const doodleSave = document.getElementById("feltDoodleSave");
  const doodleSize = document.getElementById("feltDoodleSize");
  const doodleSizeLabel = document.getElementById("feltDoodleSizeLabel");
  const doodleSizeValue = document.getElementById("feltDoodleSizeValue");
  const storageKey = "km-felt-canvas-notes-v1";
  const visitorKey = "km-portfolio-visitor-id-v1";
  const adminMigrationKey = "km-felt-admin-migrated-v3";
  const visitorId = localStorage.getItem(visitorKey) || crypto.randomUUID();
  localStorage.setItem(visitorKey, visitorId);
  const canUsePublicApi = /^https?:$/.test(location.protocol) && (!["127.0.0.1", "localhost"].includes(location.hostname) || new URLSearchParams(location.search).has("api-preview"));
  const palette = {
    yellow: "#f4dc52", blue: "#91c9e8", pink: "#efaaa8", mint: "#a9d9bd",
    lavender: "#c7b7df", bone: "#eee7d7", coral: "#f38a64", lime: "#cde95d"
  };
  const paperColors = ["yellow", "blue", "pink", "mint", "lavender", "bone", "coral"];
  const initialStackColor = paperColors[Math.floor(Math.random() * paperColors.length)];
  let initialNextStackColor = paperColors[Math.floor(Math.random() * paperColors.length)];
  while (initialNextStackColor === initialStackColor) initialNextStackColor = paperColors[Math.floor(Math.random() * paperColors.length)];
  const pinColors = ["#df2f35", "#1769aa", "#079552", "#efd315", "#dddcd7", "#d944a5", "#ef651f", "#191b1a"];
  const supplyPins = ["#df2f35", "#1769aa", "#079552", "#efd315", "#d944a5", "#ef651f", "#1769aa", "#191b1a", "#079552", "#dddcd7", "#efd315", "#d944a5", "#191b1a", "#1769aa", "#df2f35", "#079552"];
  const supplyPinLayout = [[.13,.18], [.39,.08], [.74,.16], [.91,.34], [.57,.30], [.25,.39], [.08,.61], [.43,.56], [.78,.53], [.94,.72], [.61,.76], [.31,.84], [.12,.91], [.47,.96], [.79,.93], [.24,.67]];

  const defaults = [
    { id: "felt-profile", owner: true, x: .19, y: .34, rotation: -.045, scale: 1.05, color: "bone", mode: "md", content: "# 孔米乐\n\n产品实践 · AI 开发 · 文化体验\n\n从人的感受出发，把判断做成真实的产品。", pinned: true, pinX: .52, pinY: .08, seed: 21, doodle: [] },
    { id: "felt-structure", owner: true, x: .51, y: .29, rotation: .035, scale: .94, color: "lime", mode: "md", content: "## 建立结构\n\n在模糊的问题里，找到一条清楚的路径。", pinned: true, pinX: .44, pinY: .09, seed: 46, doodle: [] },
    { id: "felt-now", owner: true, x: .42, y: .70, rotation: -.025, scale: 1, color: "coral", mode: "md", content: "## 此刻\n\n学习 AI 应用开发，也在寻找产品、技术与文化体验交会处的新实践。", pinned: true, pinX: .57, pinY: .08, seed: 73, doodle: [] }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  function loadNotes() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      const savedNotes = Array.isArray(saved) ? saved : [];
      const ownerIds = new Set(defaults.map(note => note.id));
      const source = [...defaults.map(note => ({ ...clone(note), ...clone(savedNotes.find(item => item.id === note.id) || {}), id: note.id, owner: true })), ...savedNotes.filter(note => !ownerIds.has(note.id))];
      return source.map((note, index) => ({
        ...note,
        pins: Array.isArray(note.pins) ? note.pins : note.pinned ? [{ x: note.pinX ?? .5, y: note.pinY ?? .08, color: !note.pinColor || note.pinColor === "#222827" ? pinColors[index % pinColors.length] : note.pinColor, angle: ((note.seed || index) % 9 - 4) * .12 }] : [],
        pinned: undefined, pinX: undefined, pinY: undefined, pinColor: undefined,
        physicsAngle: note.rotation || 0, angularVelocity: 0, floatIn: 0, birth: undefined
      }));
    } catch { return clone(defaults); }
  }

  const state = {
    notes: loadNotes(),
    width: 0,
    height: 0,
    dpr: 1,
    board: null,
    content: null,
    pad: null,
    pinTray: null,
    receiptRoll: null,
    draggingId: null,
    dragOffset: null,
    dragTarget: null,
    dragLast: null,
    dragRaf: 0,
    dragMoved: false,
    activeNoteId: null,
    holdingPin: false,
    selectedPinColor: pinColors[0],
    pointer: { x: 0, y: 0 },
    editingId: null,
    editingIsNew: false,
    editMode: "md",
    draftDoodle: [],
    draftImage: "",
    draftImageUrl: "",
    draftImageAspect: 1,
    drawingStroke: null,
    doodleTool: "pen",
    doodlePenSize: 5,
    doodleEraserSize: 38,
    doodleSizeOpen: false,
    clearedDoodle: null,
    tear: null,
    stackColor: initialStackColor,
    nextStackColor: initialNextStackColor,
    background: document.createElement("canvas"),
    backgroundDirty: true,
    lastFrame: performance.now(),
    renderRaf: 0,
    continuous: false,
    tearPointer: null,
    isAdmin: false,
    boardInitialized: false,
    serverHydrated: false,
    syncing: false,
    syncTimers: new Map()
  };

  function saveNotes() {
    localStorage.setItem(storageKey, JSON.stringify(state.notes.map(({ birth, floatIn, returning, angularVelocity, _image, _imageSource, _imageFailed, ...note }) => note)));
  }
  function cleanNote(note) {
    const { birth, floatIn, returning, angularVelocity, _image, _imageSource, _imageFailed, ...clean } = note;
    return clean;
  }
  function schedulePublicNoteSync(note, delay = 180) {
    if (!note || !canUsePublicApi || !canEditNote(note)) return;
    note.public = true; note.visitorId ||= visitorId; note.pendingSync = true; saveNotes();
    clearTimeout(state.syncTimers.get(note.id));
    state.syncTimers.set(note.id, setTimeout(() => {
      state.syncTimers.delete(note.id);
      publishPublicNote(note);
    }, delay));
  }
  function preloadImage(source) {
    return new Promise((resolve, reject) => {
      if (!source) return reject(new Error("missing image"));
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => image.naturalWidth >= 24 && image.naturalHeight >= 24 ? resolve(image) : reject(new Error("image too small"));
      image.onerror = () => reject(new Error("image failed to load"));
      image.src = source;
    });
  }
  async function publishPublicNote(note) {
    note.public = true; note.visitorId = visitorId;
    if (!canUsePublicApi) { note.pendingSync = true; saveNotes(); return false; }
    try {
      const response = await fetch("/api/felt-notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ visitorId, note: cleanNote(note) }) });
      const result = await response.json().catch(() => ({}));
      if (response.status === 422) {
        note.pendingSync = false; note.public = false; note.syncRejected = true; saveNotes();
        window.dispatchEvent(new CustomEvent("feltboardnotice", { detail: { message: "这张留言已保存在本机，但未发布到公共留言板。" } }));
        return false;
      }
      if (!response.ok || result.configured === false) throw new Error(`HTTP ${response.status}`);
      state.isAdmin = state.isAdmin || result.admin === true;
      if (result.note?.imageUrl) {
        const remoteImage = await preloadImage(result.note.imageUrl);
        note.imageUrl = result.note.imageUrl; note.imageData = ""; note._image = remoteImage; note._imageSource = result.note.imageUrl; note._imageFailed = "";
      }
      note.pendingSync = false; note.syncRejected = false; saveNotes(); scheduleRender(); return true;
    } catch {
      note.pendingSync = true; saveNotes();
      window.dispatchEvent(new CustomEvent("feltboardnotice", { detail: { message: note.mode === "image" ? "图片暂时未上传，已保存在本机，稍后会自动重试。" : "留言暂时未同步，稍后会自动重试。" } }));
      return false;
    }
  }
  async function syncPublicNotes() {
    if (!canUsePublicApi || state.syncing || state.draggingId || state.editingId) return;
    state.syncing = true;
    try {
      const response = await fetch("/api/felt-notes", { headers: { accept: "application/json", "x-visitor-id": visitorId } });
      if (!response.ok) return;
      const payload = await response.json();
      if (!Array.isArray(payload.notes)) return;
      state.isAdmin = payload.admin === true;
      state.boardInitialized = payload.initialized === true;
      const localSnapshot = state.notes.map(note => cleanNote(note));
      if (state.isAdmin && !localStorage.getItem(adminMigrationKey)) {
        const migrationResults = await Promise.all(localSnapshot.map(note => {
          note.owner = true; note.public = true; note.visitorId = visitorId; note.pendingSync = true;
          const live = state.notes.find(item => item.id === note.id);
          if (live) Object.assign(live, note);
          return publishPublicNote(live || note);
        }));
        if (migrationResults.every(Boolean)) {
          localStorage.setItem(adminMigrationKey, "1");
          saveNotes(); scheduleRender(); setTimeout(syncPublicNotes, 600); return;
        }
      }
      const localById = new Map(state.notes.map(note => [note.id, note]));
      const remoteIds = new Set(payload.notes.map(note => note.id));
      const localOnly = state.notes.filter(note => (!note.public || note.syncRejected) && !remoteIds.has(note.id) && !(state.boardInitialized && note.owner));
      const localPending = state.notes.filter(note => note.pendingSync);
      const remoteNotes = payload.notes.map(remote => {
        const local = localById.get(remote.id);
        const needsImageMigration = remote.visitorId === visitorId && remote.mode === "image" && !remote.imageUrl && Boolean(remote.imageData || local?.imageData);
        const merged = { ...remote, imageData: remote.imageData || local?.imageData || "", imageAspect: remote.imageAspect || local?.imageAspect || 1, public: true, pendingSync: needsImageMigration, physicsAngle: local?.physicsAngle ?? remote.rotation ?? 0, angularVelocity: local?.angularVelocity || 0, floatIn: 0, birth: undefined };
        if (!local) return merged;
        const runtime = { image: local._image, source: local._imageSource, failed: local._imageFailed };
        Object.assign(local, merged);
        if (runtime.image && runtime.source === (local.imageUrl || local.imageData)) { local._image = runtime.image; local._imageSource = runtime.source; local._imageFailed = runtime.failed; }
        else { delete local._image; delete local._imageSource; delete local._imageFailed; }
        return local;
      });
      for (const note of remoteNotes) if (note.pendingSync && !localPending.some(local => local.id === note.id)) localPending.push(note);
      const merged = new Map([...remoteNotes, ...localPending].map(note => [note.id, note]));
      state.notes = [...localOnly, ...merged.values()]; state.serverHydrated = true; saveNotes(); scheduleRender();
      localPending.forEach(publishPublicNote);
    } catch { /* Local notes remain usable while the backend is not configured. */ }
    finally { state.syncing = false; }
  }
  async function deletePublicNote(note) {
    if (!note?.public || (!state.isAdmin && note.visitorId !== visitorId)) return;
    try { await fetch(`/api/felt-notes?id=${encodeURIComponent(note.id)}&visitorId=${encodeURIComponent(visitorId)}`, { method: "DELETE" }); } catch { /* It stays removed locally for this browser. */ }
  }
  function scheduleRender() {
    if (state.renderRaf) return;
    state.renderRaf = requestAnimationFrame(time => { state.renderRaf = 0; render(time); });
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function seeded(seed) {
    let value = seed >>> 0;
    return () => ((value = Math.imul(1664525, value) + 1013904223 >>> 0) / 4294967296);
  }
  function roundedRectPath(context, x, y, w, h, radius) {
    const r = Math.min(radius, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  function notePath(w, h) {
    const path = new Path2D();
    path.rect(0, 0, w, h);
    path.closePath();
    return path;
  }

  function receiptNotePath(w, h) {
    const path = new Path2D(), tooth = Math.max(3, w / 18);
    path.moveTo(0, 0); path.lineTo(w, 0); path.lineTo(w, h - tooth * .58);
    for (let x = w; x > 0; x -= tooth) { path.lineTo(Math.max(0, x - tooth / 2), h); path.lineTo(Math.max(0, x - tooth), h - tooth * .58); }
    path.lineTo(0, 0); path.closePath();
    return path;
  }

  function buildBackground() {
    const bg = state.background;
    bg.width = Math.max(1, Math.round(state.width * state.dpr));
    bg.height = Math.max(1, Math.round(state.height * state.dpr));
    const bctx = bg.getContext("2d");
    bctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    bctx.clearRect(0, 0, state.width, state.height);

    const marginX = clamp(state.width * .055, 28, 82);
    // Keep the wooden frame clear of the persistent scene header.
    const marginTop = state.width <= 560
      ? clamp(state.height * .085, 64, 76)
      : clamp(state.height * .09, 76, 92);
    const bottom = clamp(state.height * .1, 70, 95);
    state.board = { x: marginX, y: marginTop, w: state.width - marginX * 2, h: state.height - marginTop - bottom };
    const board = state.board;
    const frame = clamp(Math.min(board.w, board.h) * .026, 13, 24);
    const inner = { x: board.x + frame, y: board.y + frame, w: board.w - frame * 2, h: board.h - frame * 2 };
    const supplyW = clamp(inner.w * .17, 145, 218);
    state.content = { x: inner.x + 28, y: inner.y + 72, w: inner.w - supplyW - 62, h: inner.h - 96 };

    bctx.save();
    bctx.shadowColor = "rgba(0,0,0,.48)"; bctx.shadowBlur = 34; bctx.shadowOffsetY = 17;
    roundedRectPath(bctx, board.x, board.y, board.w, board.h, 12);
    const wood = bctx.createLinearGradient(board.x, board.y, board.x + board.w, board.y + board.h);
    wood.addColorStop(0, "#68452f"); wood.addColorStop(.25, "#3b281f"); wood.addColorStop(.72, "#5b3928"); wood.addColorStop(1, "#2b1d18");
    bctx.fillStyle = wood; bctx.fill();
    bctx.restore();
    bctx.save();
    roundedRectPath(bctx, board.x, board.y, board.w, board.h, 12); bctx.clip();
    const frameFibers = seeded(17041 + Math.round(state.height));
    for (let i = 0; i < Math.min(1900, (board.w * frame + board.h * frame) / 15); i++) {
      const side = Math.floor(frameFibers() * 4); let x, y;
      if (side < 2) { x = board.x + frameFibers() * board.w; y = side ? board.y + board.h - frameFibers() * frame : board.y + frameFibers() * frame; }
      else { x = side === 2 ? board.x + frameFibers() * frame : board.x + board.w - frameFibers() * frame; y = board.y + frameFibers() * board.h; }
      const len = 2 + frameFibers() * 6, angle = frameFibers() * Math.PI;
      bctx.strokeStyle = frameFibers() > .5 ? `rgba(223,178,132,${.035 + frameFibers() * .07})` : `rgba(20,13,10,${.04 + frameFibers() * .08})`;
      bctx.lineWidth = .45 + frameFibers() * .7; bctx.beginPath(); bctx.moveTo(x, y); bctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len); bctx.stroke();
    }
    bctx.restore();

    roundedRectPath(bctx, inner.x, inner.y, inner.w, inner.h, 5);
    const felt = bctx.createLinearGradient(inner.x, inner.y, inner.x + inner.w, inner.y + inner.h);
    felt.addColorStop(0, "#bca78a"); felt.addColorStop(.45, "#a98f70"); felt.addColorStop(1, "#94785c");
    bctx.fillStyle = felt; bctx.fill();
    bctx.save(); bctx.clip();
    const random = seeded(9207 + Math.round(state.width));
    for (let i = 0; i < Math.min(9000, inner.w * inner.h / 65); i++) {
      const x = inner.x + random() * inner.w, y = inner.y + random() * inner.h;
      const len = 1.5 + random() * 7, angle = random() * Math.PI;
      bctx.strokeStyle = random() > .48 ? `rgba(255,246,224,${.045 + random() * .09})` : `rgba(54,37,25,${.035 + random() * .075})`;
      bctx.lineWidth = .35 + random() * .85;
      bctx.beginPath(); bctx.moveTo(x, y); bctx.quadraticCurveTo(x + Math.cos(angle) * len * .48, y + Math.sin(angle) * len * .48 + (random() - .5) * 2, x + Math.cos(angle) * len, y + Math.sin(angle) * len); bctx.stroke();
    }
    const nap = bctx.createRadialGradient(inner.x + inner.w * .45, inner.y + inner.h * .3, 20, inner.x + inner.w * .45, inner.y + inner.h * .3, inner.w * .72);
    nap.addColorStop(0, "rgba(255,245,222,.08)"); nap.addColorStop(.55, "rgba(255,255,255,0)"); nap.addColorStop(1, "rgba(46,29,20,.12)");
    bctx.fillStyle = nap; bctx.fillRect(inner.x, inner.y, inner.w, inner.h);
    bctx.restore();

    bctx.fillStyle = "#2d251d";
    bctx.font = `600 ${clamp(state.width * .025, 22, 36)}px "Noto Serif SC", serif`;
    bctx.fillText("留言板", inner.x + 34, inner.y + 47);

    bctx.strokeStyle = "rgba(40,29,21,.22)"; bctx.lineWidth = 1;
    bctx.beginPath(); bctx.moveTo(inner.x + inner.w - supplyW - 16, inner.y + 24); bctx.lineTo(inner.x + inner.w - supplyW - 16, inner.y + inner.h - 24); bctx.stroke();
    state.backgroundDirty = false;
  }

  function layoutSupplies() {
    const board = state.board;
    const padW = clamp(state.content.w * .158, 104, 153), padH = padW;
    const supplyCenter = board.x + board.w - 121;
    state.pad = { x: supplyCenter - padW / 2, y: board.y + board.h * .095, w: padW, h: padH };
    state.receiptRoll = { x: supplyCenter - 75, y: board.y + board.h * .405, w: 150, h: 154 };
    state.pinTray = { x: supplyCenter - 96, y: board.y + board.h * .70, w: 192, h: 142 };
    for (const [button, rect] of [[tearButton, state.pad], [receiptButton, state.receiptRoll], [pinButton, state.pinTray]]) {
      button.style.left = `${rect.x}px`; button.style.top = `${rect.y}px`; button.style.width = `${rect.w}px`; button.style.height = `${rect.h}px`;
    }
  }

  function drawSupplies() {
    const pad = state.pad, tray = state.pinTray;
    ctx.save();
    ctx.textAlign = "center";
    const stackColors = ["lavender", "mint", "pink", "yellow", "blue", "bone", "coral", "lime", "blue"];
    for (let i = stackColors.length - 1; i >= 0; i--) {
      ctx.save();
      const random = seeded(510 + i * 97);
      const angle = i === 0 ? -.025 : (random() - .5) * .17;
      const dx = (random() - .5) * pad.w * .13;
      const dy = pad.h - (Math.sin(Math.abs(angle)) * pad.w + Math.cos(angle) * pad.h) / 2;
      ctx.translate(pad.x + pad.w / 2 + dx, pad.y + dy); ctx.rotate(angle); ctx.translate(-pad.w / 2, -pad.h / 2);
      ctx.shadowColor = "rgba(45,31,20,.22)"; ctx.shadowBlur = i === 0 ? 8 : 2; ctx.shadowOffsetY = i === 0 ? 4 : 1;
      ctx.fillStyle = i === 0 ? palette[state.stackColor] : palette[stackColors[i]]; ctx.fillRect(0, 0, pad.w, pad.h);
      ctx.restore();
    }
    if (state.tear) drawFlyingSheet(pad, state.tear);
    drawStorageBasket(pad);
    drawReceiptRoll(state.receiptRoll);
    supplyPins.forEach((color, index) => {
      const random = seeded(804 + index * 31), position = supplyPinLayout[index];
      const x = tray.x + 13 + position[0] * (tray.w - 26), y = tray.y + 10 + position[1] * (tray.h - 20);
      drawPushPin(x, y, color, 10, -.58 + random() * 1.16);
    });
    ctx.restore();
    return false;
  }

  function drawReceiptRoll(roll) {
    const { x, y, w, h } = roll, cx = x + w / 2;
    const backingW = 118, backingH = 57, backingX = cx - backingW / 2;
    const rollX = cx - 50, rollY = y + 16, rollBodyW = 92, rollH = 42;
    const capX = rollX + rollBodyW, capRadiusX = 8, axisY = rollY + rollH / 2;
    const ticketLeft = rollX, ticketRight = capX + capRadiusX, bottom = y + h - 10;
    ctx.save();
    ctx.shadowColor = "rgba(35,23,16,.34)"; ctx.shadowBlur = 15; ctx.shadowOffsetY = 9;
    const backing = ctx.createLinearGradient(backingX, y, backingX + backingW, y + backingH);
    backing.addColorStop(0, "#5b3d2e"); backing.addColorStop(.55, "#38251e"); backing.addColorStop(1, "#6c4832");
    ctx.fillStyle = backing; roundedRectPath(ctx, backingX, y + 3, backingW, backingH, 10); ctx.fill();
    ctx.shadowColor = "transparent";
    const metal = ctx.createLinearGradient(x, y, x + w, y); metal.addColorStop(0, "#74501f"); metal.addColorStop(.45, "#c7a45f"); metal.addColorStop(1, "#694719");
    const paper = ctx.createLinearGradient(x, rollY + rollH, x + w, y + h);
    paper.addColorStop(0, "#fffef9"); paper.addColorStop(.65, "#f1eee6"); paper.addColorStop(1, "#d9d4c9");
    const tooth = 5;
    ctx.fillStyle = paper; ctx.beginPath(); ctx.moveTo(ticketLeft, axisY); ctx.lineTo(ticketRight, axisY); ctx.lineTo(ticketRight, bottom - 3);
    for (let zx = ticketRight; zx > ticketLeft; zx -= tooth) { ctx.lineTo(Math.max(ticketLeft, zx - tooth / 2), bottom); ctx.lineTo(Math.max(ticketLeft, zx - tooth), bottom - 3); }
    ctx.lineTo(ticketLeft, axisY); ctx.closePath(); ctx.fill();
    const paperRandom = seeded(992);
    for (let index = 0; index < 54; index += 1) {
      const px = ticketLeft + 4 + paperRandom() * (ticketRight - ticketLeft - 8), py = axisY + 5 + paperRandom() * Math.max(8, bottom - axisY - 13), length = 1 + paperRandom() * 4;
      ctx.globalAlpha = .035 + paperRandom() * .04; ctx.strokeStyle = paperRandom() > .45 ? "#756d61" : "#ffffff"; ctx.lineWidth = .35;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + length, py + (paperRandom() - .5) * 1.8); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = metal; roundedRectPath(ctx, backingX + 8, axisY - 2.5, backingW - 16, 5, 2.5); ctx.fill();
    const rollGradient = ctx.createLinearGradient(0, rollY, 0, rollY + rollH);
    rollGradient.addColorStop(0, "#fffef9"); rollGradient.addColorStop(.36, "#f2eee4"); rollGradient.addColorStop(.72, "#d7d1c5"); rollGradient.addColorStop(1, "#b9b2a5");
    ctx.fillStyle = rollGradient; ctx.beginPath(); ctx.moveTo(rollX + 9, rollY); ctx.lineTo(capX, rollY); ctx.lineTo(capX, rollY + rollH); ctx.lineTo(rollX + 9, rollY + rollH); ctx.quadraticCurveTo(rollX, rollY + rollH, rollX, rollY + rollH - 9); ctx.lineTo(rollX, rollY + 9); ctx.quadraticCurveTo(rollX, rollY, rollX + 9, rollY); ctx.closePath(); ctx.fill();
    const cap = ctx.createLinearGradient(capX - capRadiusX, 0, capX + capRadiusX, 0); cap.addColorStop(0, "#9a9387"); cap.addColorStop(1, "#6f6a62");
    ctx.fillStyle = cap; ctx.beginPath(); ctx.ellipse(capX, axisY, capRadiusX, rollH / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#574b3d"; ctx.beginPath(); ctx.ellipse(capX, axisY, 3.5, rollH * .27, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = metal; roundedRectPath(ctx, capX, axisY - 2.5, backingX + backingW - 8 - capX, 5, 2.5); ctx.fill();
    ctx.restore();
  }

  function drawStorageBasket(pad) {
    const x = pad.x - 20, y = pad.y + pad.h * .48, w = pad.w + 40, h = pad.h * .58;
    ctx.save();
    ctx.shadowColor = "rgba(27,22,18,.28)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 10;
    const front = ctx.createLinearGradient(0, y, 0, y + h);
    front.addColorStop(0, "rgba(235,244,242,.08)"); front.addColorStop(.48, "rgba(221,232,230,.16)"); front.addColorStop(1, "rgba(132,151,148,.34)");
    ctx.fillStyle = front; roundedRectPath(ctx, x + 3, y + 2, w - 6, h - 3, 12); ctx.fill();
    ctx.shadowColor = "transparent";
    const sideShade = ctx.createLinearGradient(x, 0, x + w, 0);
    sideShade.addColorStop(0, "rgba(119,138,136,.30)"); sideShade.addColorStop(.12, "rgba(255,255,255,.12)"); sideShade.addColorStop(.88, "rgba(255,255,255,.08)"); sideShade.addColorStop(1, "rgba(105,124,122,.32)");
    ctx.fillStyle = sideShade; roundedRectPath(ctx, x + 4, y + 7, w - 8, h - 10, 9); ctx.fill();
    const lip = ctx.createLinearGradient(0, y, 0, y + 10);
    lip.addColorStop(0, "rgba(255,255,255,.94)"); lip.addColorStop(.42, "rgba(211,224,221,.62)"); lip.addColorStop(1, "rgba(117,137,134,.52)");
    ctx.strokeStyle = lip; ctx.lineWidth = 5; roundedRectPath(ctx, x, y, w, h, 13); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.58)"; ctx.lineWidth = 1.1; roundedRectPath(ctx, x + 6, y + 6, w - 12, h - 12, 8); ctx.stroke();
    const base = ctx.createLinearGradient(0, y + h - 18, 0, y + h);
    base.addColorStop(0, "rgba(255,255,255,0)"); base.addColorStop(1, "rgba(94,116,113,.38)");
    ctx.fillStyle = base; roundedRectPath(ctx, x + 7, y + h - 23, w - 14, 17, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.24)"; roundedRectPath(ctx, x + 10, y + 10, 3, h - 24, 2); ctx.fill();
    ctx.restore();
  }

  function drawFlyingSheet(pad, tear) {
    const p = tear.progress;
    const color = palette[tear.color || state.stackColor];
    ctx.save();
    const eased = 1 - Math.pow(1 - p, 3), dx = (tear.drift || 0) * pad.w * .13 * eased;
    const dy = -pad.h * .7 * eased - Math.sin(p * Math.PI) * pad.h * .08;
    ctx.translate(pad.x + dx + pad.w / 2, pad.y + dy + pad.h / 2); ctx.rotate((tear.startAngle || 0) + (tear.spin || .16) * eased); ctx.scale(1 - .025 * Math.sin(p * Math.PI), 1 + .018 * Math.sin(p * Math.PI)); ctx.translate(-pad.w / 2, -pad.h / 2);
    ctx.shadowColor = "rgba(42,28,18,.28)"; ctx.shadowBlur = 8 + p * 10; ctx.shadowOffsetY = 5 + p * 7; ctx.fillStyle = color; ctx.fillRect(0, 0, pad.w, pad.h);
    ctx.restore();
  }

  function noteGeometry(note) {
    const baseW = clamp(state.content.w * .158, 104, 153) * (note.scale || 1);
    let w = note.kind === "receipt" ? baseW * .76 : baseW;
    let h = note.kind === "receipt" ? baseW * 1.48 : baseW;
    if (note.mode === "image" && (note.imageUrl || note.imageData)) {
      const aspect = Math.max(.12, Math.min(8, Number(note.imageAspect) || 1));
      h = w / aspect;
      const maxHeight = Math.max(190, state.content.h * .52);
      if (h > maxHeight) { const fit = maxHeight / h; w *= fit; h *= fit; }
    }
    const angle = note.physicsAngle ?? note.rotation ?? 0;
    let cx = state.content.x + note.x * state.content.w, cy = state.content.y + note.y * state.content.h;
    const pivot = note.pins?.[0];
    if (pivot) {
      pivot.ax ??= (cx + (pivot.x - .5) * w) / state.width;
      pivot.ay ??= (cy + (pivot.y - .5) * h) / state.height;
      const vx = (pivot.x - .5) * w, vy = (pivot.y - .5) * h, cos = Math.cos(angle), sin = Math.sin(angle);
      cx = pivot.ax * state.width - (cos * vx - sin * vy); cy = pivot.ay * state.height - (sin * vx + cos * vy);
    }
    return { w, h, cx, cy, angle };
  }
  function worldToLocal(note, x, y) {
    const g = noteGeometry(note), angle = -g.angle, dx = x - g.cx, dy = y - g.cy;
    return { x: Math.cos(angle) * dx - Math.sin(angle) * dy + g.w / 2, y: Math.sin(angle) * dx + Math.cos(angle) * dy + g.h / 2, g };
  }
  function localToWorld(g, x, y) {
    const vx = x - g.w / 2, vy = y - g.h / 2, cos = Math.cos(g.angle), sin = Math.sin(g.angle);
    return { x: g.cx + cos * vx - sin * vy, y: g.cy + sin * vx + cos * vy };
  }
  function hitNote(x, y) {
    for (let i = state.notes.length - 1; i >= 0; i--) {
      const note = state.notes[i], local = worldToLocal(note, x, y);
      if (local.x >= 0 && local.x <= local.g.w && local.y >= 0 && local.y <= local.g.h) return { note, local };
    }
    return null;
  }

  function drawPushPin(x, y, color, radius = 8, angle = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.strokeStyle = "#c6c7c3"; ctx.lineWidth = Math.max(1, radius * .12); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, radius * .82); ctx.lineTo(0, radius * 1.55); ctx.stroke();
    ctx.shadowColor = "rgba(28,18,12,.38)"; ctx.shadowBlur = 7; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 4;
    const stem = ctx.createLinearGradient(-radius, 0, radius, 0); stem.addColorStop(0, color); stem.addColorStop(.72, color); stem.addColorStop(1, "rgba(15,15,15,.34)");
    ctx.fillStyle = stem; roundedRectPath(ctx, -radius * .34, radius * .28, radius * .68, radius * .82, radius * .24); ctx.fill();
    const head = ctx.createRadialGradient(-radius * .24, -radius * .28, 1, 0, 0, radius * 1.08);
    head.addColorStop(0, "#fff4df"); head.addColorStop(.16, color); head.addColorStop(.72, color); head.addColorStop(1, "#35332f");
    ctx.fillStyle = head; ctx.beginPath(); ctx.arc(0, 0, radius * 1.04, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function wrapText(text, maxWidth, fontSize, maxLines) {
    const lines = [];
    for (const sourceLine of text.split("\n")) {
      if (!sourceLine) { lines.push({ text: "", type: "space" }); continue; }
      let type = "body", value = sourceLine;
      if (/^#\s+/.test(value)) { type = "h1"; value = value.replace(/^#\s+/, ""); }
      else if (/^##\s+/.test(value)) { type = "h2"; value = value.replace(/^##\s+/, ""); }
      else if (/^[-*]\s+/.test(value)) { type = "bullet"; value = `· ${value.replace(/^[-*]\s+/, "")}`; }
      value = value.replace(/[*_`]/g, "");
      const chars = [...value]; let current = "";
      const size = type === "h1" ? fontSize * 1.42 : type === "h2" ? fontSize * 1.18 : fontSize;
      ctx.font = `${type.startsWith("h") ? 700 : 500} ${size}px "Noto Serif SC", serif`;
      for (const char of chars) {
        const closingPunctuation = /[，。！？；：、,.!?;:）】》]/.test(char);
        if (ctx.measureText(current + char).width > maxWidth && current && !closingPunctuation) { lines.push({ text: current, type }); current = char; }
        else current += char;
      }
      if (current) lines.push({ text: current, type });
      if (lines.length >= maxLines) break;
    }
    return lines.slice(0, maxLines);
  }

  function drawMarkdown(note, w, h) {
    const fontSize = clamp(w * .056 * (note.fontScale || 1), 11, 20), lines = wrapText(note.content || "一张空白留言", w - 40, fontSize, 8);
    let y = 30;
    ctx.fillStyle = "#24231f"; ctx.textBaseline = "top";
    for (const line of lines) {
      if (line.type === "space") { y += fontSize * .48; continue; }
      const size = line.type === "h1" ? fontSize * 1.42 : line.type === "h2" ? fontSize * 1.18 : fontSize;
      ctx.font = `${line.type.startsWith("h") ? 700 : 500} ${size}px "Noto Serif SC", serif`;
      ctx.fillText(line.text, 21, y);
      y += size * (line.type.startsWith("h") ? 1.42 : 1.58);
      if (y > h - 28) break;
    }
  }

  function drawDoodle(note, w, h) {
    const layer = document.createElement("canvas"); layer.width = 720; layer.height = 720;
    const layerCtx = layer.getContext("2d"); layerCtx.lineCap = "round"; layerCtx.lineJoin = "round";
    for (const stroke of note.doodle || []) {
      if (!stroke.points?.length) continue;
      layerCtx.save(); layerCtx.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
      layerCtx.strokeStyle = "#252522"; layerCtx.lineWidth = stroke.width || 5;
      layerCtx.beginPath(); layerCtx.moveTo(stroke.points[0][0], stroke.points[0][1]);
      for (const point of stroke.points.slice(1)) layerCtx.lineTo(point[0], point[1]);
      layerCtx.stroke(); layerCtx.restore();
    }
    ctx.drawImage(layer, 17, 17, w - 34, h - 34);
  }

  function drawNoteImage(note, w, h) {
    const preferredSource = note.imageUrl || note.imageData;
    const source = note._imageFailed === note.imageUrl && note.imageData ? note.imageData : preferredSource;
    if (!source) return drawMarkdown({ content: "图片正在同步" }, w, h);
    if (note._imageFailed === source) return drawMarkdown({ content: note.imageData && source === note.imageData ? "图片无法读取" : "图片需要重新上传" }, w, h);
    note._image ||= new Image();
    if (note._imageSource !== source) {
      note._image.crossOrigin = "anonymous";
      note._image.onload = () => {
        if (note._image.naturalWidth < 24 || note._image.naturalHeight < 24) {
          note._imageFailed = source; delete note._image; delete note._imageSource; scheduleRender(); return;
        }
        note._imageFailed = "";
        if (!note.imageAspect && note._image.naturalHeight) {
          note.imageAspect = note._image.naturalWidth / note._image.naturalHeight;
          saveNotes();
        }
        scheduleRender();
      };
      note._image.onerror = () => { note._imageFailed = source; delete note._image; delete note._imageSource; scheduleRender(); };
      note._imageSource = source;
      note._image.src = source;
    }
    if (!note._image.complete || note._image.naturalWidth < 24 || note._image.naturalHeight < 24) {
      return drawMarkdown({ content: note.imageData ? "图片正在恢复" : "图片需要重新上传" }, w, h);
    }
    ctx.drawImage(note._image, 0, 0, w, h);
    ctx.strokeStyle = "rgba(0,0,0,.1)"; ctx.lineWidth = 1;
    ctx.strokeRect(.5, .5, Math.max(0, w - 1), Math.max(0, h - 1));
  }

  function drawReceiptNote(note, w, h) {
    const data = note.receiptData || {}, pad = w * .13;
    ctx.fillStyle = "rgba(41,42,38,.72)"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.font = `600 ${Math.max(5, w * .047)}px monospace`; ctx.fillText("KML / VISIT", w / 2, h * .08);
    ctx.font = `700 ${Math.max(11, w * .12)}px "Noto Serif SC",serif`; ctx.fillText("访问小票", w / 2, h * .15);
    ctx.strokeStyle = "rgba(45,46,41,.34)"; ctx.lineWidth = .7; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(pad, h * .27); ctx.lineTo(w - pad, h * .27); ctx.stroke(); ctx.setLineDash([]);
    const rows = [["点击", data.clicks ?? 0], ["停留", `${data.minutes ?? 0}分`], ["打印", data.prints ?? 0], ["留言", data.notes ?? 0]];
    ctx.textAlign = "left"; ctx.font = `500 ${Math.max(7, w * .075)}px sans-serif`;
    rows.forEach((row, index) => { const y = h * (.34 + index * .105); ctx.fillStyle = "#373832"; ctx.fillText(row[0], pad, y); ctx.textAlign = "right"; ctx.fillText(String(row[1]), w - pad, y); ctx.textAlign = "left"; });
    ctx.fillStyle = "rgba(42,43,39,.78)";
    const barY = h * .79, barH = h * .09, random = seeded(Number(data.barcodeSeed) || note.seed || 1); let bx = pad;
    while (bx < w - pad) { const gap = .7 + random() * 1.8, width = .7 + Math.floor(random() * 4) * .7; bx += gap; ctx.fillRect(bx, barY, width, barH); bx += width; }
    ctx.textAlign = "center"; ctx.font = `600 ${Math.max(4, w * .038)}px monospace`; ctx.fillText("THANKS FOR STOPPING BY", w / 2, h * .91);
  }

  function drawNote(note, now) {
    const g = noteGeometry(note);
    const age = note.birth ? Math.min(1, (now - note.birth) / 360) : 1;
    const floatAge = note.floatIn ? Math.min(1, (now - note.floatIn) / 620) : 1;
    const scale = .91 + age * .09, floatY = (1 - (1 - Math.pow(1 - floatAge, 3))) * 105;
    const pins = note.pins || [], pinned = pins.length > 0;
    ctx.save(); ctx.translate(g.cx, g.cy + floatY); ctx.rotate(g.angle); ctx.scale(scale, scale); ctx.translate(-g.w / 2, -g.h / 2);
    const isPhoto = note.mode === "image" && Boolean(note.imageUrl || note.imageData);
    const path = note.kind === "receipt" ? receiptNotePath(g.w, g.h) : notePath(g.w, g.h);
    ctx.shadowColor = "rgba(55,38,25,.31)"; ctx.shadowBlur = pinned ? 11 : 20; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = pinned ? 7 : 13;
    ctx.fillStyle = isPhoto ? "rgba(255,255,255,.96)" : note.color === "custom" ? note.customColor || "#f6d365" : palette[note.color] || palette.bone; ctx.fill(path);
    ctx.shadowColor = "transparent";

    ctx.save(); ctx.clip(path);
    if (!isPhoto) {
      const random = seeded((note.seed || 1) * 91);
      for (let i = 0; i < 72; i++) {
        const x = random() * g.w, y = random() * g.h, len = 2 + random() * 8;
        ctx.strokeStyle = random() > .5 ? "rgba(255,255,255,.075)" : "rgba(65,52,40,.045)";
        ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + (random() - .5) * 2); ctx.stroke();
      }
    }
    if (note.kind === "receipt") drawReceiptNote(note, g.w, g.h);
    else if (note.mode === "doodle") drawDoodle(note, g.w, g.h);
    else if (note.mode === "image") drawNoteImage(note, g.w, g.h);
    else drawMarkdown(note, g.w, g.h);
    if (!isPhoto) {
      const paperLight = ctx.createLinearGradient(0, g.h * .56, 0, g.h + 8);
      paperLight.addColorStop(0, "rgba(255,255,255,0)"); paperLight.addColorStop(.72, "rgba(255,255,255,.12)"); paperLight.addColorStop(1, "rgba(66,45,29,.11)");
      ctx.fillStyle = paperLight; ctx.fillRect(0, g.h * .5, g.w, g.h * .55);
    }
    ctx.restore();

    ctx.restore();
    if (floatAge >= 1) drawNotePins(note, g);
    return age < 1 || floatAge < 1 || updateNotePhysics(note, Math.min(.032, Math.max(.001, (now - state.lastFrame) / 1000)));
  }

  function drawNotePins(note, g) {
    const cos = Math.cos(g.angle), sin = Math.sin(g.angle);
    for (const pin of note.pins || []) {
      let x, y;
      if (pin.ax != null && pin.ay != null) { x = pin.ax * state.width; y = pin.ay * state.height; }
      else {
        const vx = (pin.x - .5) * g.w, vy = (pin.y - .5) * g.h;
        x = g.cx + cos * vx - sin * vy; y = g.cy + sin * vx + cos * vy;
        pin.ax = x / state.width; pin.ay = y / state.height;
      }
      drawPushPin(x, y, pin.color || pinColors[0], clamp(g.w * .065, 9, 12), pin.angle || 0);
    }
  }

  function updateNotePhysics(note, dt) {
    const pins = note.pins || [];
    if (!pins.length) {
      if (!note.returning || state.draggingId === note.id) return false;
      note.angularVelocity ??= 0;
      note.angularVelocity = (note.angularVelocity - note.physicsAngle * 24 * dt) * Math.pow(.035, dt);
      note.physicsAngle += note.angularVelocity * dt;
      if (Math.abs(note.physicsAngle) < .0015 && Math.abs(note.angularVelocity) < .002) { note.physicsAngle = 0; note.angularVelocity = 0; note.returning = false; return false; }
      return true;
    }
    if (state.draggingId === note.id) return false;
    note.physicsAngle ??= note.rotation || 0; note.angularVelocity ??= 0;
    if (pins.length > 1) { note.angularVelocity = 0; return false; }
    const pin = pins[0];
    let target = 0;
    if (pin.y > .5) {
      const centerVector = Math.atan2(.5 - pin.y, .5 - pin.x);
      target = Math.atan2(Math.sin(Math.PI / 2 - centerVector), Math.cos(Math.PI / 2 - centerVector));
    }
    else if (pin.y <= .4 && pin.x >= .34 && pin.x <= .66) target = 0;
    else target = clamp((.5 - pin.x) * 1.15, -.56, .56);
    const error = Math.atan2(Math.sin(target - note.physicsAngle), Math.cos(target - note.physicsAngle));
    const gravity = pin.y > .5 ? 22 : 12, damping = Math.pow(pin.y > .5 ? .08 : .035, dt);
    note.angularVelocity = (note.angularVelocity + Math.sin(error) * gravity * dt) * damping;
    note.physicsAngle += note.angularVelocity * dt;
    if (Math.abs(error) < .002 && Math.abs(note.angularVelocity) < .002) { note.physicsAngle = target; note.angularVelocity = 0; return false; }
    return true;
  }

  function render(time = performance.now()) {
    if (!state.width || !state.height) return;
    if (state.tear) {
      state.tear.progress = Math.min(1, (time - state.tear.started) / 520);
      if (state.tear.progress >= 1) {
        const color = state.tear.color; state.tear = null; scheduleRender();
        setTimeout(() => { if (!state.tear && !state.editingId && !editor.open) createNote(color); }, 130);
      }
    }
    if (state.backgroundDirty) buildBackground();
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.drawImage(state.background, 0, 0, state.width, state.height);
    layoutSupplies();
    let animating = Boolean(state.tear);
    for (const note of state.notes) animating = drawNote(note, time) || animating;
    animating = drawSupplies() || animating;
    if (state.holdingPin) {
      drawPushPin(state.pointer.x, state.pointer.y, state.selectedPinColor, 9, -.55);
      ctx.fillStyle = "rgba(30,26,22,.7)"; ctx.font = "600 12px sans-serif"; ctx.textAlign = "left"; ctx.fillText("点击一张便签固定", state.pointer.x + 16, state.pointer.y - 12);
    }
    state.continuous = animating;
    if (animating) scheduleRender();
    state.lastFrame = time;
  }

  function resize() {
    const rect = shell.getBoundingClientRect();
    state.width = Math.max(1, rect.width); state.height = Math.max(1, rect.height); state.dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(state.width * state.dpr); canvas.height = Math.round(state.height * state.dpr);
    state.backgroundDirty = true; scheduleRender();
  }

  function switchMode(mode) {
    state.editMode = mode;
    form.querySelectorAll("[data-felt-mode]").forEach(button => {
      const active = button.dataset.feltMode === mode;
      button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1;
    });
    markdownField.hidden = mode !== "md"; doodleField.hidden = mode !== "doodle"; imageField.hidden = mode !== "image";
    paperColorPicker.hidden = mode === "image";
    if (mode === "doodle") redrawDoodleEditor();
    else setDoodleExpanded(false);
  }

  function redrawDoodleEditor() {
    doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
    doodleCtx.lineCap = "round"; doodleCtx.lineJoin = "round";
    for (const stroke of state.draftDoodle) {
      if (!stroke.points?.length) continue;
      doodleCtx.save(); doodleCtx.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
      doodleCtx.strokeStyle = "#252522"; doodleCtx.lineWidth = stroke.width || 5;
      doodleCtx.beginPath(); doodleCtx.moveTo(stroke.points[0][0], stroke.points[0][1]);
      for (const point of stroke.points.slice(1)) doodleCtx.lineTo(point[0], point[1]);
      doodleCtx.stroke(); doodleCtx.restore();
    }
    doodleUndo.disabled = state.draftDoodle.length === 0 && !state.clearedDoodle;
  }

  function updateDoodleSizeControl() {
    const erasing = state.doodleTool === "eraser";
    doodleSize.min = erasing ? "10" : "2";
    doodleSize.max = erasing ? "80" : "24";
    doodleSize.value = String(erasing ? state.doodleEraserSize : state.doodlePenSize);
    doodleSizeLabel.textContent = erasing ? "橡皮大小" : "画笔粗细";
    doodleSize.setAttribute("aria-label", doodleSizeLabel.textContent);
    doodleSizeValue.value = doodleSize.value;
    doodleSizeValue.textContent = doodleSize.value;
  }

  function setDoodleSizeOpen(open) {
    state.doodleSizeOpen = Boolean(open);
    const container = doodleSize.closest(".felt-tool-size");
    container.classList.toggle("is-open", state.doodleSizeOpen);
    container.setAttribute("aria-hidden", String(!state.doodleSizeOpen));
    container.dataset.tool = state.doodleTool;
    doodleSize.tabIndex = state.doodleSizeOpen ? 0 : -1;
    if (state.doodleSizeOpen) requestAnimationFrame(() => doodleSize.focus({ preventScroll: true }));
  }

  function setDoodleTool(tool) {
    state.doodleTool = tool;
    const erasing = tool === "eraser";
    doodlePen.setAttribute("aria-pressed", String(!erasing));
    doodleEraser.setAttribute("aria-pressed", String(erasing));
    doodleCanvas.classList.toggle("is-erasing", erasing);
    updateDoodleSizeControl();
  }

  function activateDoodleTool(tool) {
    if (state.doodleTool === tool) setDoodleSizeOpen(!state.doodleSizeOpen);
    else { setDoodleTool(tool); setDoodleSizeOpen(false); }
  }

  function setDoodleExpanded(expanded) {
    setDoodleSizeOpen(false);
    editor.classList.toggle("is-doodle-expanded", expanded);
    doodleExpand.setAttribute("aria-pressed", String(expanded));
    doodleExpand.setAttribute("aria-label", expanded ? "退出全屏涂鸦" : "进入全屏涂鸦");
    doodleExpand.title = expanded ? "退出全屏" : "全屏";
    const label = doodleExpand.querySelector("span");
    if (label) label.textContent = expanded ? "退出" : "全屏";
    if (expanded) requestAnimationFrame(redrawDoodleEditor);
  }

  function createNote(color = state.stackColor) {
    const note = { id: crypto.randomUUID(), public: true, visitorId, pendingSync: true, x: .68, y: .57, rotation: (Math.random() - .5) * .06, physicsAngle: 0, angularVelocity: 0, scale: .96, color, mode: "md", content: "# 新留言\n\n写下一点此刻的想法。", pins: [], seed: Math.floor(Math.random() * 9000) + 100, doodle: [], imageData: "" };
    state.notes.push(note); state.editingIsNew = true; openEditor(note);
  }

  function createReceiptNote(detail = {}) {
    const direction = detail.direction || { x: 0, y: 1 }, length = Math.hypot(direction.x, direction.y) || 1;
    const note = {
      id: crypto.randomUUID(), public: true, visitorId, pendingSync: true, kind: "receipt", x: clamp(.55 + direction.x / length * .12, .18, .78), y: clamp(.45 + direction.y / length * .12, .22, .75),
      rotation: clamp(Math.atan2(direction.y, direction.x) * .08, -.13, .13), physicsAngle: 0, angularVelocity: 0, scale: 1.02,
      color: "bone", mode: "receipt", receiptData: detail.stats || {}, pins: [], seed: Math.floor(Math.random() * 9000) + 100,
      birth: performance.now(), floatIn: performance.now()
    };
    state.notes.push(note); saveNotes(); scheduleRender(); schedulePublicNoteSync(note, 0);
  }

  function deleteReceiptNote(note) {
    if (!note || note.kind !== "receipt" || !canEditNote(note)) return false;
    state.notes = state.notes.filter(item => item.id !== note.id);
    if (state.activeNoteId === note.id) state.activeNoteId = null;
    saveNotes(); deletePublicNote(note); scheduleRender();
    return true;
  }

  function canEditNote(note) {
    return Boolean(note && (state.isAdmin || (!canUsePublicApi && note.owner) || (!note.owner && (!note.public || note.visitorId === visitorId))));
  }

  function openEditor(note) {
    if (!canEditNote(note)) return;
    state.editingId = note.id; state.editMode = note.mode || "md"; state.draftDoodle = clone(note.doodle || []); state.draftImage = note.imageData || ""; state.draftImageUrl = note.imageUrl || ""; state.draftImageAspect = Number(note.imageAspect) || 1; state.clearedDoodle = null; markdown.value = note.content || "";
    const radio = form.querySelector(`[name="feltColor"][value="${note.color || "bone"}"]`); if (radio) radio.checked = true;
    deleteButton.hidden = state.editingIsNew;
    customColor.value = note.customColor || "#f6d365";
    setDoodleTool("pen"); setDoodleSizeOpen(false); setDoodleExpanded(false); updateImagePreview(); switchMode(state.editMode); editor.showModal(); document.body.classList.add("felt-editor-open");
    if (state.editMode === "md") setTimeout(() => markdown.focus(), 20);
  }

  function cancelEditor() {
    if (state.editingIsNew) state.notes = state.notes.filter(note => note.id !== state.editingId);
    state.editingId = null; state.editingIsNew = false; setDoodleExpanded(false); editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
  }

  async function saveEditor() {
    const note = state.notes.find(item => item.id === state.editingId); if (!note) return cancelEditor();
    if (!canEditNote(note)) return cancelEditor();
    const wasNew = state.editingIsNew;
    note.mode = state.editMode; note.content = markdown.value.trim() || "一张空白留言"; note.doodle = clone(state.draftDoodle); note.imageData = state.draftImage; note.imageUrl = state.draftImageUrl; note.imageAspect = state.draftImageAspect;
    note.color = new FormData(form).get("feltColor") || "bone"; note.birth = performance.now(); note.floatIn = performance.now();
    note.customColor = customColor.value;
    saveNotes();
    const previousLabel = saveButton.textContent; saveButton.disabled = true; saveButton.textContent = note.mode === "image" && state.draftImage ? "上传中…" : "保存中…";
    await publishPublicNote(note);
    saveButton.disabled = false; saveButton.textContent = previousLabel;
    state.editingId = null; state.editingIsNew = false; if(wasNew)window.dispatchEvent(new CustomEvent("portfolio-stat",{detail:{type:"notes",count:1}})); setDoodleExpanded(false); editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    saveEditor();
  });
  document.getElementById("feltEditorCancel").onclick = cancelEditor;
  document.getElementById("feltEditorClose").onclick = cancelEditor;
  deleteButton.onclick = () => {
    if (!state.editingId || state.editingIsNew) return;
    const note = state.notes.find(item => item.id === state.editingId); if (!canEditNote(note)) return cancelEditor();
    state.notes = state.notes.filter(item => item.id !== state.editingId); saveNotes(); deletePublicNote(note);
    state.editingId = null; setDoodleExpanded(false); editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
  };
  editor.addEventListener("cancel", event => { event.preventDefault(); cancelEditor(); });
  const modeTabs = [...form.querySelectorAll("[data-felt-mode]")];
  modeTabs.forEach((button, index) => {
    button.onclick = () => switchMode(button.dataset.feltMode);
    button.onkeydown = event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? modeTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + modeTabs.length) % modeTabs.length;
      switchMode(modeTabs[next].dataset.feltMode); modeTabs[next].focus();
    };
  });
  doodlePen.onclick = () => activateDoodleTool("pen");
  doodleEraser.onclick = () => activateDoodleTool("eraser");
  doodleUndo.onclick = () => {
    if (state.draftDoodle.length) state.draftDoodle.pop();
    else if (state.clearedDoodle) { state.draftDoodle = state.clearedDoodle; state.clearedDoodle = null; }
    redrawDoodleEditor();
  };
  doodleExpand.onclick = () => setDoodleExpanded(!editor.classList.contains("is-doodle-expanded"));
  doodleClear.onclick = () => {
    if (!state.draftDoodle.length) return;
    state.clearedDoodle = clone(state.draftDoodle); state.draftDoodle = []; redrawDoodleEditor();
  };
  doodleSave.onclick = saveEditor;
  doodleSize.addEventListener("input", () => {
    const value = Number(doodleSize.value);
    if (state.doodleTool === "eraser") state.doodleEraserSize = value;
    else state.doodlePenSize = value;
    doodleSizeValue.value = String(value); doodleSizeValue.textContent = String(value);
  });
  editor.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !state.doodleSizeOpen) return;
    event.preventDefault(); event.stopPropagation(); setDoodleSizeOpen(false);
    (state.doodleTool === "eraser" ? doodleEraser : doodlePen).focus();
  }, true);

  function updateImagePreview() {
    const source = state.draftImage || state.draftImageUrl;
    imagePreview.hidden = !source;
    imagePreview.innerHTML = source ? `<img src="${source}" alt="已选择的便签图片">` : "";
    imageDropzone.classList.toggle("has-image", Boolean(source));
  }
  function importImage(file) {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        if (image.width < 24 || image.height < 24) {
          window.dispatchEvent(new CustomEvent("feltboardnotice", { detail: { message: "图片尺寸过小，请重新选择。" } }));
          return;
        }
        const target = document.createElement("canvas"), max = 1100, ratio = Math.min(1, max / Math.max(image.width, image.height));
        target.width = Math.max(1, Math.round(image.width * ratio)); target.height = Math.max(1, Math.round(image.height * ratio));
        target.getContext("2d").drawImage(image, 0, 0, target.width, target.height);
        let quality = .84, encoded = target.toDataURL("image/jpeg", quality);
        while (encoded.length > 2600000 && quality > .52) { quality -= .08; encoded = target.toDataURL("image/jpeg", quality); }
        state.draftImage = encoded; state.draftImageUrl = ""; state.draftImageAspect = image.width / image.height; updateImagePreview();
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  imageInput.addEventListener("change", () => importImage(imageInput.files?.[0]));
  imageDropzone.addEventListener("dragover", event => { event.preventDefault(); imageDropzone.classList.add("is-dragover"); });
  imageDropzone.addEventListener("dragleave", () => imageDropzone.classList.remove("is-dragover"));
  imageDropzone.addEventListener("drop", event => { event.preventDefault(); imageDropzone.classList.remove("is-dragover"); importImage(event.dataTransfer.files?.[0]); });
  customColor.addEventListener("input", () => { form.querySelector('[name="feltColor"][value="custom"]').checked = true; });

  function doodlePoint(event) {
    const rect = doodleCanvas.getBoundingClientRect();
    return [(event.clientX - rect.left) * doodleCanvas.width / rect.width, (event.clientY - rect.top) * doodleCanvas.height / rect.height];
  }
  doodleCanvas.addEventListener("pointerdown", event => {
    setDoodleSizeOpen(false); doodleCanvas.setPointerCapture(event.pointerId); state.clearedDoodle = null;
    state.drawingStroke = { points: [doodlePoint(event)], width: state.doodleTool === "eraser" ? state.doodleEraserSize : state.doodlePenSize, erase: state.doodleTool === "eraser" };
    state.draftDoodle.push(state.drawingStroke); redrawDoodleEditor();
  });
  doodleCanvas.addEventListener("pointermove", event => { if (!state.drawingStroke) return; state.drawingStroke.points.push(doodlePoint(event)); redrawDoodleEditor(); });
  doodleCanvas.addEventListener("pointerup", () => { state.drawingStroke = null; });
  doodleCanvas.addEventListener("pointercancel", () => { state.drawingStroke = null; });

  function animateTear() {
    if (state.tear || state.editingId || editor.open) return;
    const color = state.stackColor;
    state.stackColor = state.nextStackColor;
    do { state.nextStackColor = paperColors[Math.floor(Math.random() * paperColors.length)]; } while (state.nextStackColor === state.stackColor && paperColors.length > 1);
    state.tear = { progress: 0, started: performance.now(), color, startAngle: (Math.random() - .5) * .16, spin: (Math.random() - .5) * .3, drift: (Math.random() - .5) * .7 };
    scheduleRender();
  }
  tearButton.addEventListener("pointerdown", event => { state.tearPointer = { id: event.pointerId, x: event.clientX, y: event.clientY }; });
  tearButton.addEventListener("pointercancel", () => { state.tearPointer = null; });
  tearButton.addEventListener("pointerup", event => {
    const start = state.tearPointer; state.tearPointer = null;
    if (!start || start.id !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 9) return;
    animateTear();
  });
  tearButton.addEventListener("click", event => { if (event.detail === 0) animateTear(); });
  tearButton.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); animateTear(); } });
  pinButton.onclick = event => {
    const rect = pinButton.getBoundingClientRect();
    const nx = (event.clientX - rect.left - 13) / Math.max(1, rect.width - 26), ny = (event.clientY - rect.top - 10) / Math.max(1, rect.height - 20);
    let nearest = 0, distance = Infinity;
    supplyPinLayout.forEach((position, index) => { const next = Math.hypot(nx - position[0], ny - position[1]); if (next < distance) { distance = next; nearest = index; } });
    state.selectedPinColor = supplyPins[nearest]; state.holdingPin = true; scheduleRender();
  };
  receiptButton.onclick = () => window.dispatchEvent(new CustomEvent("openvisitorreceipt"));

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * state.width / rect.width, y: (event.clientY - rect.top) * state.height / rect.height };
  }
  canvas.addEventListener("pointerdown", event => {
    const point = canvasPoint(event); state.pointer = point;
    const hit = hitNote(point.x, point.y); if (!hit) return;
    const { note, local } = hit;
    state.activeNoteId = note.id;
    canvas.focus({ preventScroll: true });
    if (!canEditNote(note)) return;
    if (state.holdingPin) {
      note.pins ||= [];
      const pin = { x: clamp(local.x / local.g.w, .02, .98), y: clamp(local.y / local.g.h, .02, .98), color: state.selectedPinColor, angle: -.75 + Math.random() * 1.5 };
      if (!note.pins.length) { pin.ax = point.x / state.width; pin.ay = point.y / state.height; note.physicsAngle = local.g.angle; note.angularVelocity = 0; }
      note.pins.push(pin); state.holdingPin = false; saveNotes(); schedulePublicNoteSync(note); scheduleRender(); return;
    }
    const pinIndex = (note.pins || []).findIndex(pin => {
      const px = pin.ax != null ? pin.ax * state.width : localToWorld(local.g, local.g.w * pin.x, local.g.h * pin.y).x;
      const py = pin.ay != null ? pin.ay * state.height : localToWorld(local.g, local.g.w * pin.x, local.g.h * pin.y).y;
      return Math.hypot(point.x - px, point.y - py) < 20;
    });
    if (pinIndex >= 0) {
      const before = note.pins.length, removedFirst = pinIndex === 0, pose = noteGeometry(note); note.pins.splice(pinIndex, 1);
      if (removedFirst && note.pins.length === 1) {
        const next = note.pins[0], anchor = localToWorld(pose, pose.w * next.x, pose.h * next.y);
        next.ax = anchor.x / state.width; next.ay = anchor.y / state.height; note.angularVelocity = 0;
      } else if (removedFirst && note.pins.length > 1) {
        const next = note.pins[0], anchor = localToWorld(pose, pose.w * next.x, pose.h * next.y);
        next.ax = anchor.x / state.width; next.ay = anchor.y / state.height; note.angularVelocity = 0;
      }
      if (before === 1) {
        const centerX = pose.cx / state.width, centerY = pose.cy / state.height;
        note.x = (centerX * state.width - state.content.x) / state.content.w;
        note.y = (centerY * state.height - state.content.y) / state.content.h;
        note.returning = false; note.angularVelocity = 0;
      }
      saveNotes(); schedulePublicNoteSync(note); scheduleRender(); return;
    }
    if (note.pins?.length) return;
    note.returning = true; note.floatIn = 0;
    state.draggingId = note.id; state.dragOffset = { x: point.x - local.g.cx, y: point.y - local.g.cy }; state.dragTarget = point; state.dragLast = { x: point.x, time: event.timeStamp }; canvas.setPointerCapture(event.pointerId);
    state.dragMoved = false;
    state.notes = state.notes.filter(item => item.id !== note.id); state.notes.push(note); scheduleRender();
  });
  canvas.addEventListener("pointermove", event => {
    const point = canvasPoint(event); state.pointer = point;
    if (state.draggingId) {
      const note = state.notes.find(item => item.id === state.draggingId); if (!note) return;
      const dt = Math.max(8, event.timeStamp - state.dragLast.time), vx = (point.x - state.dragLast.x) / dt;
      state.dragTarget = point; state.dragLast = { x: point.x, time: event.timeStamp };
      state.dragMoved = true; note.physicsAngle += (clamp(vx * .12, -.12, .12) - note.physicsAngle) * .17;
      queueSmoothDrag(note);
    }
    if (state.draggingId || state.holdingPin) scheduleRender();
  });
  function queueSmoothDrag(note) {
    if (state.dragRaf) return;
    state.dragRaf = requestAnimationFrame(() => { state.dragRaf = 0; smoothDrag(note); });
  }
  function smoothDrag(note) {
    if (!state.dragTarget || state.draggingId !== note.id) return;
    const geometry = noteGeometry(note), halfX = geometry.w / state.content.w / 2, halfY = geometry.h / state.content.h / 2;
    const tx = clamp((state.dragTarget.x - state.dragOffset.x - state.content.x) / state.content.w, halfX, 1 - halfX);
    const ty = clamp((state.dragTarget.y - state.dragOffset.y - state.content.y) / state.content.h, halfY, 1 - halfY);
    note.x += (tx - note.x) * .17; note.y += (ty - note.y) * .17;
    note.physicsAngle *= .93;
    scheduleRender();
    if (Math.abs(tx - note.x) + Math.abs(ty - note.y) > .001) queueSmoothDrag(note);
  }
  const releaseDrag = () => {
    if (state.draggingId) {
      const note = state.notes.find(item => item.id === state.draggingId);
      if (note) { note.returning = true; note.angularVelocity = 0; schedulePublicNoteSync(note, 0); }
      saveNotes();
    }
    state.draggingId = null; state.dragOffset = null; state.dragTarget = null; state.dragLast = null; state.dragMoved = false; cancelAnimationFrame(state.dragRaf); state.dragRaf = 0; scheduleRender();
  };
  canvas.addEventListener("pointerup", releaseDrag);
  canvas.addEventListener("pointercancel", releaseDrag);
  canvas.addEventListener("dblclick", event => {
    const point = canvasPoint(event), hit = hitNote(point.x, point.y);
    if (!hit) return;
    if (hit.note.kind === "receipt") deleteReceiptNote(hit.note);
    else openEditor(hit.note);
  });
  canvas.addEventListener("keydown", event => {
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    const note = state.notes.find(item => item.id === state.activeNoteId);
    if (deleteReceiptNote(note)) event.preventDefault();
  });

  new ResizeObserver(resize).observe(shell);
  window.addEventListener("feltboardvisibility", scheduleRender);
  window.addEventListener("felt-receipt-torn", event => createReceiptNote(event.detail));
  resize(); syncPublicNotes();
  setInterval(() => { if (!document.hidden) syncPublicNotes(); }, 12000);
})();
