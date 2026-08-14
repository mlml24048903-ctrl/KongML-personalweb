(() => {
  const key = "km-portfolio-visitor-stats-v1";
  const receipt = document.getElementById("visitorReceipt");
  if (!receipt) return;
  const empty = { clicks: 0, activeMs: 0, prints: 0, notes: 0 };
  let stats;
  try { stats = { ...empty, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { stats = { ...empty }; }
  let visibleSince = document.hidden ? 0 : performance.now();
  const texture = receipt.querySelector(".visitor-receipt__texture");
  const paperReveal = receipt.querySelector(".visitor-receipt__paper-reveal");
  const paper = receipt.querySelector(".visitor-receipt__paper");
  const barcode = receipt.querySelector(".visitor-receipt__paper footer i");
  let barcodeSeed = 0;

  const seededRandom = seedValue => {
    let seed = seedValue >>> 0;
    return () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
  };
  const makeBarcode = seedValue => {
    const random = seededRandom(seedValue), stops = [];
    let x = 0;
    while (x < 360) {
      const gap = 1 + Math.floor(random() * 3), width = 1 + Math.floor(random() * 4);
      stops.push(`transparent ${x}px ${x + gap}px`, `#272824 ${x + gap}px ${x + gap + width}px`);
      x += gap + width;
    }
    return `linear-gradient(90deg,${stops.join(",")})`;
  };
  const refreshBarcode = () => {
    const values = new Uint32Array(1);
    if (crypto?.getRandomValues) crypto.getRandomValues(values);
    barcodeSeed = values[0] || Math.floor(Math.random() * 0xffffffff);
    if (barcode) barcode.style.backgroundImage = makeBarcode(barcodeSeed);
  };

  const drawPaperTexture = () => {
    if (!texture) return;
    const paper = texture.parentElement, rect = paper.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
    if (texture.width === width && texture.height === height && texture.dataset.ready) return;
    texture.width = width; texture.height = height; texture.dataset.ready = "true";
    const context = texture.getContext("2d"); context.setTransform(dpr, 0, 0, dpr, 0, 0); context.clearRect(0, 0, rect.width, rect.height);
    let seed = 70419;
    const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
    for (let index = 0; index < 760; index += 1) {
      const x = random() * rect.width, y = random() * rect.height, length = 1.2 + random() * 5.2, angle = (random() - .5) * 1.4;
      context.strokeStyle = random() > .42 ? `rgba(76,67,54,${.012 + random() * .025})` : `rgba(255,255,255,${.025 + random() * .045})`;
      context.lineWidth = .35 + random() * .5; context.beginPath(); context.moveTo(x, y); context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length); context.stroke();
    }
    for (let index = 0; index < 13; index += 1) {
      const x = 18 + random() * (rect.width - 54), y = 28 + random() * (rect.height - 76), length = 12 + random() * 24;
      context.strokeStyle = `rgba(72,63,50,${.018 + random() * .018})`; context.lineWidth = .45;
      context.beginPath(); context.moveTo(x, y); context.quadraticCurveTo(x + length * .45, y + (random() - .5) * 4, x + length, y + (random() - .5) * 3); context.stroke();
      context.strokeStyle = `rgba(255,255,255,${.05 + random() * .035})`; context.beginPath(); context.moveTo(x, y + 1); context.quadraticCurveTo(x + length * .45, y + 1 + (random() - .5) * 3, x + length, y + 1 + (random() - .5) * 2); context.stroke();
    }
  };

  const save = () => localStorage.setItem(key, JSON.stringify(stats));
  const settleTime = () => {
    if (!visibleSince) return;
    stats.activeMs += performance.now() - visibleSince;
    visibleSince = performance.now();
  };
  const render = () => {
    settleTime();
    receipt.querySelector('[data-stat="clicks"]').textContent = String(stats.clicks);
    receipt.querySelector('[data-stat="minutes"]').textContent = (stats.activeMs / 60000).toFixed(stats.activeMs < 600000 ? 1 : 0);
    receipt.querySelector('[data-stat="prints"]').textContent = String(stats.prints);
    receipt.querySelector('[data-stat="notes"]').textContent = String(stats.notes);
    receipt.querySelector("[data-receipt-time]").textContent = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
    save();
  };
  let closeTimer = 0, readyTimer = 0, tearPointer = null;
  const open = () => {
    clearTimeout(closeTimer); clearTimeout(readyTimer);
    receipt.classList.remove("is-closing", "is-ready", "is-tearing");
    paper?.style.removeProperty("--receipt-drag-x"); paper?.style.removeProperty("--receipt-drag-y"); paper?.style.removeProperty("--receipt-drag-rotate");
    refreshBarcode(); render(); drawPaperTexture(); receipt.classList.add("is-open"); receipt.setAttribute("aria-hidden", "false");
    readyTimer = setTimeout(() => receipt.classList.add("is-ready"), 1030);
  };
  const close = () => {
    clearTimeout(readyTimer);
    receipt.classList.add("is-closing");
    receipt.classList.remove("is-open", "is-ready");
    receipt.setAttribute("aria-hidden", "true");
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => receipt.classList.remove("is-closing"), 180);
  };

  const tearReceipt = (dx = 0, dy = 110) => {
    if (!receipt.classList.contains("is-open") || receipt.classList.contains("is-tearing")) return;
    const distance = Math.hypot(dx, dy) || 1, force = Math.max(170, Math.min(300, distance * 1.75));
    receipt.classList.add("is-tearing");
    paper.style.setProperty("--receipt-drag-x", `${dx / distance * force}px`);
    paper.style.setProperty("--receipt-drag-y", `${dy / distance * force}px`);
    paper.style.setProperty("--receipt-drag-rotate", `${Math.max(-9, Math.min(9, dx * .035))}deg`);
    const snapshot = {
      clicks: stats.clicks,
      minutes: (stats.activeMs / 60000).toFixed(stats.activeMs < 600000 ? 1 : 0),
      prints: stats.prints,
      notes: stats.notes,
      barcodeSeed
    };
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("felt-receipt-torn", { detail: { stats: snapshot, direction: { x: dx, y: dy } } }));
      close();
    }, 190);
  };

  paperReveal?.addEventListener("pointerdown", event => {
    if (!receipt.classList.contains("is-ready") || event.button !== 0) return;
    tearPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    paperReveal.setPointerCapture(event.pointerId); receipt.classList.add("is-pulling");
  });
  paperReveal?.addEventListener("pointermove", event => {
    if (!tearPointer || tearPointer.id !== event.pointerId) return;
    event.preventDefault();
    const dx = event.clientX - tearPointer.x, dy = event.clientY - tearPointer.y;
    paper.style.setProperty("--receipt-drag-x", `${dx * .72}px`); paper.style.setProperty("--receipt-drag-y", `${dy * .72}px`); paper.style.setProperty("--receipt-drag-rotate", `${Math.max(-5, Math.min(5, dx * .018))}deg`);
  });
  const releaseTear = event => {
    if (!tearPointer || tearPointer.id !== event.pointerId) return;
    const dx = event.clientX - tearPointer.x, dy = event.clientY - tearPointer.y, distance = Math.hypot(dx, dy);
    tearPointer = null; receipt.classList.remove("is-pulling");
    if (distance >= 68) tearReceipt(dx, dy);
    else { paper.style.setProperty("--receipt-drag-x", "0px"); paper.style.setProperty("--receipt-drag-y", "0px"); paper.style.setProperty("--receipt-drag-rotate", "0deg"); }
  };
  paperReveal?.addEventListener("pointerup", releaseTear);
  paperReveal?.addEventListener("pointercancel", event => { if (tearPointer?.id === event.pointerId) { tearPointer = null; receipt.classList.remove("is-pulling"); paper.style.setProperty("--receipt-drag-x", "0px"); paper.style.setProperty("--receipt-drag-y", "0px"); paper.style.setProperty("--receipt-drag-rotate", "0deg"); } });
  paperReveal?.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); tearReceipt(0, 120); } });

  document.addEventListener("pointerup", event => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest("#visitorReceipt")) return;
    stats.clicks += 1; save();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { settleTime(); visibleSince = 0; save(); }
    else visibleSince = performance.now();
  });
  window.addEventListener("portfolio-stat", event => {
    const type = event.detail?.type, count = Number(event.detail?.count) || 1;
    if (type === "prints" || type === "notes") { stats[type] += count; save(); }
  });
  window.addEventListener("openvisitorreceipt", open);
  window.addEventListener("beforeunload", () => { settleTime(); save(); });
  receipt.addEventListener("click", event => { if (event.target === receipt) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && receipt.classList.contains("is-open")) close(); });
  window.addEventListener("resize", () => { if (texture) { delete texture.dataset.ready; drawPaperTexture(); } }, { passive: true });
  setInterval(() => { if (!document.hidden) { settleTime(); save(); } }, 10000);
})();
