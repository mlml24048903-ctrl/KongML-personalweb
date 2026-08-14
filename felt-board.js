(() => {
  const canvas = document.getElementById("feltCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const shell = canvas.parentElement;
  const tearButton = document.getElementById("feltTearButton");
  const pinButton = document.getElementById("feltPinButton");
  const editor = document.getElementById("feltEditor");
  const form = document.getElementById("feltEditorForm");
  const markdown = document.getElementById("feltMarkdown");
  const markdownField = document.getElementById("feltMarkdownField");
  const doodleField = document.getElementById("feltDoodleField");
  const imageField = document.getElementById("feltImageField");
  const imageInput = document.getElementById("feltImageInput");
  const imagePreview = document.getElementById("feltImagePreview");
  const imageDropzone = document.getElementById("feltImageDropzone");
  const customColor = document.getElementById("feltCustomColor");
  const deleteButton = document.getElementById("feltEditorDelete");
  const doodleCanvas = document.getElementById("feltDoodleCanvas");
  const doodleCtx = doodleCanvas.getContext("2d");
  const storageKey = "km-felt-canvas-notes-v1";
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
    { id: "felt-profile", x: .19, y: .34, rotation: -.045, scale: 1.05, color: "bone", mode: "md", content: "# 孔米乐\n\n产品实践 · AI 开发 · 文化体验\n\n从人的感受出发，把判断做成真实的产品。", pinned: true, pinX: .52, pinY: .08, seed: 21, doodle: [] },
    { id: "felt-structure", x: .51, y: .29, rotation: .035, scale: .94, color: "lime", mode: "md", content: "## 建立结构\n\n在模糊的问题里，找到一条清楚的路径。", pinned: true, pinX: .44, pinY: .09, seed: 46, doodle: [] },
    { id: "felt-now", x: .42, y: .70, rotation: -.025, scale: 1, color: "coral", mode: "md", content: "## 此刻\n\n学习 AI 应用开发，也在寻找产品、技术与文化体验交会处的新实践。", pinned: true, pinX: .57, pinY: .08, seed: 73, doodle: [] }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  function loadNotes() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      const source = Array.isArray(saved) ? saved : clone(defaults);
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
    draggingId: null,
    dragOffset: null,
    dragTarget: null,
    dragLast: null,
    dragRaf: 0,
    dragMoved: false,
    holdingPin: false,
    selectedPinColor: pinColors[0],
    pointer: { x: 0, y: 0 },
    editingId: null,
    editingIsNew: false,
    editMode: "md",
    draftDoodle: [],
    draftImage: "",
    drawingStroke: null,
    tear: null,
    stackColor: initialStackColor,
    nextStackColor: initialNextStackColor,
    background: document.createElement("canvas"),
    backgroundDirty: true,
    lastFrame: performance.now(),
    renderRaf: 0,
    continuous: false,
    tearPointer: null
  };

  function saveNotes() {
    localStorage.setItem(storageKey, JSON.stringify(state.notes.map(({ birth, floatIn, returning, angularVelocity, ...note }) => note)));
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

  function buildBackground() {
    const bg = state.background;
    bg.width = Math.max(1, Math.round(state.width * state.dpr));
    bg.height = Math.max(1, Math.round(state.height * state.dpr));
    const bctx = bg.getContext("2d");
    bctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    bctx.clearRect(0, 0, state.width, state.height);

    const marginX = clamp(state.width * .055, 28, 82);
    const marginTop = clamp(state.height * .055, 24, 52);
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
    bctx.fillText("一些关于我的留言", inner.x + 34, inner.y + 47);
    bctx.fillStyle = "rgba(45,37,29,.62)";
    bctx.font = `500 ${clamp(state.width * .009, 10, 13)}px sans-serif`;
    bctx.fillText("撕下一张，写完以后，再把它钉在合适的位置。", inner.x + 35, inner.y + 68);

    bctx.strokeStyle = "rgba(40,29,21,.22)"; bctx.lineWidth = 1;
    bctx.beginPath(); bctx.moveTo(inner.x + inner.w - supplyW - 16, inner.y + 24); bctx.lineTo(inner.x + inner.w - supplyW - 16, inner.y + inner.h - 24); bctx.stroke();
    state.backgroundDirty = false;
  }

  function layoutSupplies() {
    const board = state.board;
    const padW = clamp(state.content.w * .158, 104, 153), padH = padW;
    state.pad = { x: board.x + board.w - padW - 66, y: board.y + board.h * .23, w: padW, h: padH };
    state.pinTray = { x: board.x + board.w - 230, y: board.y + board.h * .58, w: 190, h: 150 };
    for (const [button, rect] of [[tearButton, state.pad], [pinButton, state.pinTray]]) {
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
    supplyPins.forEach((color, index) => {
      const random = seeded(804 + index * 31), position = supplyPinLayout[index];
      const x = tray.x + 13 + position[0] * (tray.w - 26), y = tray.y + 10 + position[1] * (tray.h - 20);
      drawPushPin(x, y, color, 10, -.58 + random() * 1.16);
    });
    ctx.restore();
    return false;
  }

  function drawStorageBasket(pad) {
    const x = pad.x - 20, y = pad.y + pad.h * .48, w = pad.w + 40, h = pad.h * .58;
    ctx.save();
    ctx.shadowColor = "rgba(29,24,19,.23)"; ctx.shadowBlur = 13; ctx.shadowOffsetY = 9;
    const plastic = ctx.createLinearGradient(x, y, x + w, y + h);
    plastic.addColorStop(0, "rgba(244,249,247,.2)"); plastic.addColorStop(.45, "rgba(218,229,226,.09)"); plastic.addColorStop(1, "rgba(179,195,192,.27)");
    ctx.fillStyle = plastic; roundedRectPath(ctx, x, y, w, h, 13); ctx.fill();
    ctx.shadowColor = "transparent";
    const edge = ctx.createLinearGradient(x, y, x + w, y);
    edge.addColorStop(0, "rgba(233,241,239,.92)"); edge.addColorStop(.5, "rgba(139,153,150,.52)"); edge.addColorStop(1, "rgba(244,249,247,.88)");
    ctx.strokeStyle = edge; ctx.lineWidth = 3.4; roundedRectPath(ctx, x, y, w, h, 13); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.48)"; ctx.lineWidth = 1.2; roundedRectPath(ctx, x + 5, y + 5, w - 10, h - 10, 9); ctx.stroke();
    const base = ctx.createLinearGradient(0, y + h - 20, 0, y + h);
    base.addColorStop(0, "rgba(255,255,255,0)"); base.addColorStop(1, "rgba(124,143,139,.3)");
    ctx.fillStyle = base; roundedRectPath(ctx, x + 5, y + h - 25, w - 10, 20, 7); ctx.fill();
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
    const w = baseW, h = baseW, angle = note.physicsAngle ?? note.rotation ?? 0;
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
    const fontSize = clamp(w * .056, 11, 16), lines = wrapText(note.content || "一张空白留言", w - 40, fontSize, 8);
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
    ctx.save(); ctx.translate(17, 17); const scale = Math.min((w - 34) / 720, (h - 34) / 720); ctx.scale(scale, scale);
    ctx.strokeStyle = "#252522"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const stroke of note.doodle || []) {
      if (!stroke.points?.length) continue;
      ctx.lineWidth = stroke.width || 5; ctx.beginPath(); ctx.moveTo(stroke.points[0][0], stroke.points[0][1]);
      for (const point of stroke.points.slice(1)) ctx.lineTo(point[0], point[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawNoteImage(note, w, h) {
    if (!note.imageData) return drawMarkdown({ content: "图片便签" }, w, h);
    note._image ||= new Image();
    if (note._image.src !== note.imageData) { note._image.onload = scheduleRender; note._image.src = note.imageData; }
    if (!note._image.complete) return;
    const margin = 18, areaW = w - margin * 2, areaH = h - margin * 2;
    const ratio = Math.min(areaW / note._image.naturalWidth, areaH / note._image.naturalHeight);
    const dw = note._image.naturalWidth * ratio, dh = note._image.naturalHeight * ratio;
    ctx.save();
    ctx.shadowColor = "rgba(42,30,22,.2)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
    ctx.drawImage(note._image, margin + (areaW - dw) / 2, margin + (areaH - dh) / 2, dw, dh);
    ctx.restore();
  }

  function drawNote(note, now) {
    const g = noteGeometry(note);
    const age = note.birth ? Math.min(1, (now - note.birth) / 360) : 1;
    const floatAge = note.floatIn ? Math.min(1, (now - note.floatIn) / 620) : 1;
    const scale = .91 + age * .09, floatY = (1 - (1 - Math.pow(1 - floatAge, 3))) * 105;
    const pins = note.pins || [], pinned = pins.length > 0;
    ctx.save(); ctx.translate(g.cx, g.cy + floatY); ctx.rotate(g.angle); ctx.scale(scale, scale); ctx.translate(-g.w / 2, -g.h / 2);
    const path = notePath(g.w, g.h);
    ctx.shadowColor = "rgba(55,38,25,.31)"; ctx.shadowBlur = pinned ? 11 : 20; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = pinned ? 7 : 13;
    ctx.fillStyle = note.color === "custom" ? note.customColor || "#f6d365" : palette[note.color] || palette.bone; ctx.fill(path);
    ctx.shadowColor = "transparent";

    ctx.save(); ctx.clip(path);
    const random = seeded((note.seed || 1) * 91);
    for (let i = 0; i < 72; i++) {
      const x = random() * g.w, y = random() * g.h, len = 2 + random() * 8;
      ctx.strokeStyle = random() > .5 ? "rgba(255,255,255,.075)" : "rgba(65,52,40,.045)";
      ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + (random() - .5) * 2); ctx.stroke();
    }
    if (note.mode === "doodle") drawDoodle(note, g.w, g.h);
    else if (note.mode === "image") drawNoteImage(note, g.w, g.h);
    else drawMarkdown(note, g.w, g.h);
    const paperLight = ctx.createLinearGradient(0, g.h * .56, 0, g.h + 8);
    paperLight.addColorStop(0, "rgba(255,255,255,0)"); paperLight.addColorStop(.72, "rgba(255,255,255,.12)"); paperLight.addColorStop(1, "rgba(66,45,29,.11)");
    ctx.fillStyle = paperLight; ctx.fillRect(0, g.h * .5, g.w, g.h * .55);
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
    if (mode === "doodle") redrawDoodleEditor();
  }

  function redrawDoodleEditor() {
    doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
    doodleCtx.strokeStyle = "#252522"; doodleCtx.lineWidth = 5; doodleCtx.lineCap = "round"; doodleCtx.lineJoin = "round";
    for (const stroke of state.draftDoodle) {
      if (!stroke.points?.length) continue;
      doodleCtx.beginPath(); doodleCtx.moveTo(stroke.points[0][0], stroke.points[0][1]);
      for (const point of stroke.points.slice(1)) doodleCtx.lineTo(point[0], point[1]);
      doodleCtx.stroke();
    }
  }

  function createNote(color = state.stackColor) {
    const note = { id: crypto.randomUUID(), x: .68, y: .57, rotation: (Math.random() - .5) * .06, physicsAngle: 0, angularVelocity: 0, scale: .96, color, mode: "md", content: "# 新留言\n\n写下一点此刻的想法。", pins: [], seed: Math.floor(Math.random() * 9000) + 100, doodle: [], imageData: "" };
    state.notes.push(note); state.editingIsNew = true; openEditor(note);
  }

  function openEditor(note) {
    state.editingId = note.id; state.editMode = note.mode || "md"; state.draftDoodle = clone(note.doodle || []); state.draftImage = note.imageData || ""; markdown.value = note.content || "";
    const radio = form.querySelector(`[name="feltColor"][value="${note.color || "bone"}"]`); if (radio) radio.checked = true;
    deleteButton.hidden = state.editingIsNew;
    customColor.value = note.customColor || "#f6d365";
    updateImagePreview(); switchMode(state.editMode); editor.showModal(); document.body.classList.add("felt-editor-open");
    if (state.editMode === "md") setTimeout(() => markdown.focus(), 20);
  }

  function cancelEditor() {
    if (state.editingIsNew) state.notes = state.notes.filter(note => note.id !== state.editingId);
    state.editingId = null; state.editingIsNew = false; editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const note = state.notes.find(item => item.id === state.editingId); if (!note) return cancelEditor();
    note.mode = state.editMode; note.content = markdown.value.trim() || "一张空白留言"; note.doodle = clone(state.draftDoodle); note.imageData = state.draftImage;
    note.color = new FormData(form).get("feltColor") || "bone"; note.birth = performance.now(); note.floatIn = performance.now();
    note.customColor = customColor.value;
    state.editingId = null; state.editingIsNew = false; saveNotes(); editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
  });
  document.getElementById("feltEditorCancel").onclick = cancelEditor;
  document.getElementById("feltEditorClose").onclick = cancelEditor;
  deleteButton.onclick = () => {
    if (!state.editingId || state.editingIsNew) return;
    state.notes = state.notes.filter(note => note.id !== state.editingId); saveNotes();
    state.editingId = null; editor.close(); document.body.classList.remove("felt-editor-open"); scheduleRender();
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
  document.getElementById("feltDoodleClear").onclick = () => { state.draftDoodle = []; redrawDoodleEditor(); };

  function updateImagePreview() {
    imagePreview.hidden = !state.draftImage;
    imagePreview.innerHTML = state.draftImage ? `<img src="${state.draftImage}" alt="已选择的便签图片">` : "";
    imageDropzone.classList.toggle("has-image", Boolean(state.draftImage));
  }
  function importImage(file) {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const target = document.createElement("canvas"), max = 1100, ratio = Math.min(1, max / Math.max(image.width, image.height));
        target.width = Math.max(1, Math.round(image.width * ratio)); target.height = Math.max(1, Math.round(image.height * ratio));
        target.getContext("2d").drawImage(image, 0, 0, target.width, target.height);
        state.draftImage = target.toDataURL("image/jpeg", .84); updateImagePreview();
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
  doodleCanvas.addEventListener("pointerdown", event => { doodleCanvas.setPointerCapture(event.pointerId); state.drawingStroke = { points: [doodlePoint(event)], width: 5 }; state.draftDoodle.push(state.drawingStroke); });
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

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * state.width / rect.width, y: (event.clientY - rect.top) * state.height / rect.height };
  }
  canvas.addEventListener("pointerdown", event => {
    const point = canvasPoint(event); state.pointer = point;
    const hit = hitNote(point.x, point.y); if (!hit) return;
    const { note, local } = hit;
    if (state.holdingPin) {
      note.pins ||= [];
      const pin = { x: clamp(local.x / local.g.w, .02, .98), y: clamp(local.y / local.g.h, .02, .98), color: state.selectedPinColor, angle: -.75 + Math.random() * 1.5 };
      if (!note.pins.length) { pin.ax = point.x / state.width; pin.ay = point.y / state.height; note.physicsAngle = local.g.angle; note.angularVelocity = 0; }
      note.pins.push(pin); state.holdingPin = false; saveNotes(); scheduleRender(); return;
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
      saveNotes(); scheduleRender(); return;
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
      if (note) { note.returning = true; note.angularVelocity = 0; }
      saveNotes();
    }
    state.draggingId = null; state.dragOffset = null; state.dragTarget = null; state.dragLast = null; state.dragMoved = false; cancelAnimationFrame(state.dragRaf); state.dragRaf = 0; scheduleRender();
  };
  canvas.addEventListener("pointerup", releaseDrag);
  canvas.addEventListener("pointercancel", releaseDrag);
  canvas.addEventListener("dblclick", event => { const point = canvasPoint(event), hit = hitNote(point.x, point.y); if (hit) openEditor(hit.note); });

  new ResizeObserver(resize).observe(shell);
  window.addEventListener("feltboardvisibility", () => requestAnimationFrame(resize));
  resize();
})();
