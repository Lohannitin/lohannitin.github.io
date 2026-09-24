// Dr. Nitin Lohan: small progressive enhancements (the site works without JS).
(function () {
  var root = document.documentElement;

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var links = document.getElementById('nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Light / dark toggle (remembered per browser when storage is available)
  var themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Figure lightbox
  var zooms = document.querySelectorAll('a.zoom');
  var dlg, img, cap, openLink;
  function buildLightbox() {
    dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Enlarged figure');
    dlg.innerHTML =
      '<div class="lb-inner"><button class="lb-close" type="button" aria-label="Close">&times;</button>' +
      '<div class="lb-img"><img alt=""></div>' +
      '<div class="lb-bar"><div class="lb-cap"></div><a class="lb-open" href="#" target="_blank" rel="noopener">Open full size</a></div></div>';
    document.body.appendChild(dlg);
    img = dlg.querySelector('img');
    cap = dlg.querySelector('.lb-cap');
    openLink = dlg.querySelector('.lb-open');
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); });
  }
  if (zooms.length && typeof HTMLDialogElement === 'function') {
    zooms.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (!dlg) buildLightbox();
        var fig = a.closest('figure');
        var fc = fig && fig.querySelector('figcaption');
        img.src = a.href;
        img.alt = (a.querySelector('img') || {}).alt || '';
        cap.innerHTML = fc ? fc.innerHTML : '';
        openLink.href = a.href;
        dlg.showModal();
      });
    });
  }

  // Publication filters
  var filterBtns = document.querySelectorAll('.filter[data-filter]');
  if (filterBtns.length) {
    var pubs = document.querySelectorAll('.pub');
    var years = document.querySelectorAll('.pub-year');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        pubs.forEach(function (p) {
          p.hidden = !(f === 'all' || (' ' + p.dataset.tags + ' ').indexOf(' ' + f + ' ') !== -1);
        });
        years.forEach(function (h) {
          var any = false, el = h.nextElementSibling;
          while (el && !el.classList.contains('pub-year')) {
            if (el.classList.contains('pub') && !el.hidden) { any = true; break; }
            el = el.nextElementSibling;
          }
          h.hidden = !any;
        });
      });
    });
  }

  // Copy citation
  document.querySelectorAll('button[data-cite]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.cite;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });
})();
