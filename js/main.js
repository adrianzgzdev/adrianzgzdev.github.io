/* ============================================================
   AdrianZgzDev · Portfolio v2 — interactions
   ============================================================ */
(() => {
  "use strict";

  // Año en el footer
  const yEl = document.getElementById("y");
  if (yEl) yEl.textContent = new Date().getFullYear();

  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const scrollBar = document.getElementById("scrollBar");

  // Menú móvil
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Nav "scrolled" + barra de progreso
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    if (scrollBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Contadores del hero
  const counters = document.querySelectorAll(".stat__num[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  // Barras de nivel de skills
  const levels = document.querySelectorAll(".lvl i[data-lvl]");
  if ("IntersectionObserver" in window && levels.length) {
    const lio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.setProperty("--w", e.target.dataset.lvl + "%");
            e.target.classList.add("animate");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    levels.forEach((el) => lio.observe(el));
  } else {
    levels.forEach((el) => {
      el.style.setProperty("--w", el.dataset.lvl + "%");
      el.classList.add("animate");
    });
  }

  /* ==========================================================
     Formulario de contacto + Cloudflare Turnstile (invisible)
     Envía FormData al webhook de n8n. Lógica portada de v1.
     ========================================================== */
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusMsg = document.getElementById("statusMessage");
  const submitBtn = document.getElementById("submitBtn");
  const webhookUrl = "https://n8n.adrianzgzdev.com/webhook/form_contact";
  const SITEKEY = "0x4AAAAAACNBcPIlgokieADp";

  let tsWidgetId = null;
  let tsResolve = null;
  let tsReject = null;

  function initTurnstileOnce() {
    if (!window.turnstile) return;
    const el = document.querySelector(".cf-turnstile");
    if (!el || tsWidgetId !== null) return;

    tsWidgetId = turnstile.render(el, {
      sitekey: SITEKEY,
      size: "invisible",
      callback: (token) => {
        if (tsResolve) { tsResolve(token); tsResolve = tsReject = null; }
      },
      "error-callback": () => {
        if (tsReject) { tsReject(new Error("Turnstile error")); tsResolve = tsReject = null; }
      },
      "expired-callback": () => {
        if (tsReject) { tsReject(new Error("Turnstile expired")); tsResolve = tsReject = null; }
      },
    });
  }
  window.addEventListener("load", initTurnstileOnce);

  function getTurnstileToken() {
    initTurnstileOnce();
    if (!window.turnstile || tsWidgetId === null) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      tsResolve = resolve;
      tsReject = reject;
      try {
        turnstile.reset(tsWidgetId);
        turnstile.execute(tsWidgetId);
      } catch (e) {
        tsResolve = tsReject = null;
        reject(e);
      }
      setTimeout(() => {
        if (tsReject) { tsReject(new Error("Turnstile timeout")); tsResolve = tsReject = null; }
      }, 8000);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const hp = form.querySelector('input[name="honeypot"]');
    if (hp && hp.value.trim() !== "") {
      statusMsg.textContent = "✅ ¡Recibido!";
      return;
    }

    statusMsg.textContent = "Verificando... 🛡️";
    statusMsg.style.color = "";
    submitBtn.disabled = true;

    try {
      const token = await getTurnstileToken();
      if (!token) throw new Error("No Turnstile token");

      statusMsg.textContent = "Enviando datos... 📡";

      const fd = new FormData(form);
      fd.append("cf-turnstile-response", token);
      fd.append("source", "adrianzgzdev.com");
      fd.append("page", location.href);
      fd.append("ts", new Date().toISOString());

      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(webhookUrl, { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(t);

      if (!res.ok) throw new Error("Server not OK");

      statusMsg.textContent = "✅ ¡Recibido! Me pondré en contacto contigo pronto.";
      statusMsg.style.color = "#22c55e";
      form.reset();
    } catch (err) {
      console.error(err);
      statusMsg.textContent = "❌ Ups, algo falló. Escríbeme a adrianzgzdev@gmail.com";
      statusMsg.style.color = "#ef4444";
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
