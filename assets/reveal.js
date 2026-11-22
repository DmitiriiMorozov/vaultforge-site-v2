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
