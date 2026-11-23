  document.documentElement.classList.add('js-reveal');
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    function show(el) { el.classList.add('is-visible'); }
    function showAll() { items.forEach(show); }

    if (reduce.matches || !('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px 10% 0px', threshold: 0.05 });

    items.forEach(function (el) { io.observe(el); });

    // страховка: при быстром скролле IntersectionObserver может пропустить элемент
    var queued = false;
    function sweep() {
      queued = false;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('is-visible')) continue;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { show(el); io.unobserve(el); }
      }
    }
    function queue() { if (!queued) { queued = true; window.requestAnimationFrame(sweep); } }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    sweep();
  })();

(() => {
  const preview = document.querySelector("[data-vault-preview]");
  const controls = preview.querySelector("[data-preview-controls]");
  const views = preview.querySelector(".preview-views");
  const overview = preview.querySelector("[data-vault-overview]");
  const module = preview.querySelector("[data-vault-module]");
  const lessons = preview.querySelector("[data-module-lessons]");
  const buttons = [...controls.querySelectorAll("[data-view]")];

  function select(view) {
    const showModule = view === "module";
    views.classList.toggle("is-module", showModule);
    overview.setAttribute("aria-hidden", String(showModule));
    module.setAttribute("aria-hidden", String(!showModule));
    lessons.classList.toggle("is-expanded", showModule);
    lessons.inert = !showModule;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.view === view));
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => select(button.dataset.view));
  }
  controls.hidden = false;
})();

(() => {
  const preview = document.querySelector("[data-package-preview]");
  const controls = preview.querySelector("[data-package-controls]");
  const engine = preview.querySelector("[data-package-engine]");
  const buttons = [...controls.querySelectorAll("[data-package]")];

  engine.classList.remove("is-expanded");
  engine.inert = true;
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const showEngine = button.dataset.package === "engine";
      engine.setAttribute("data-animate", "");
      engine.classList.toggle("is-expanded", showEngine);
      engine.inert = !showEngine;
      for (const option of buttons) {
        option.setAttribute("aria-pressed", String(option === button));
      }
    });
  }
  controls.hidden = false;
})();
