const nav = document.getElementById("nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Twinkling starfield ----------
(function () {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [], w, h, dpr;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.round((innerWidth * innerHeight) / 5000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.3 + 0.3) * dpr,
      s: Math.random() * 0.02 + 0.004,
      t: Math.random() * Math.PI * 2,
      c: ["255,255,255", "255,214,236", "214,208,255", "255,222,196"][Math.floor(Math.random() * 4)],
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const shift = (scrollY * 0.05 * dpr) % h;
    for (const st of stars) {
      st.t += st.s;
      const a = 0.35 + Math.sin(st.t) * 0.35 + 0.3;
      let y = st.y - shift; if (y < 0) y += h;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${st.c},${a})`;
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };
  resize();
  addEventListener("resize", resize);
  draw();
})();

// ---------- Prologue scroll story ----------
(function () {
  const pro = document.getElementById("prologue");
  const items = pro.querySelectorAll("[data-at]");
  const update = () => {
    const total = pro.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-pro.getBoundingClientRect().top / total, 0), 1);
    pro.style.setProperty("--p", p.toFixed(3));
    items.forEach((el) => el.classList.toggle("is-on", p >= parseFloat(el.dataset.at)));
    nav.classList.toggle("is-hidden", p < 0.97);
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

// ---------- Floating preview on works list ----------
(function () {
  const preview = document.getElementById("floatPreview");
  document.querySelectorAll(".orbit[data-preview]").forEach((row) => {
    row.addEventListener("mouseenter", () => { preview.src = row.dataset.preview; preview.classList.add("is-on"); });
    row.addEventListener("mouseleave", () => preview.classList.remove("is-on"));
    row.addEventListener("mousemove", (e) => {
      preview.style.left = e.clientX + 190 + "px";
      preview.style.top = e.clientY + "px";
    });
  });
})();

// ---------- 3D tilt on project images ----------
document.querySelectorAll(".card__img").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty("--ry", `${x * 8}deg`);
    card.style.setProperty("--rx", `${-y * 8}deg`);
  });
  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--rx", "0deg");
  });
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
