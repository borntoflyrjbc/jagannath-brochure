/**
 * ==========================================================================
 * PREMIUM 3D FLIPBOOK ENGINE (WhatsApp-First, Full-Screen, Ambient Flute Audio)
 * Hyper-optimized swipe gestures, instant loading, peace-level audio loop
 * ==========================================================================
 */

(function () {
  'use strict';

  const state = {
    flip: null,
    totalPages: 0,
    currentPageIndex: 0,
    zoomLevel: 1.0,
    isAudioPlaying: false,
    audioInitialized: false,
    isDestroyed: false
  };

  const config = window.FLIPBOOK_CONFIG || {
    book: {
      aspectRatio: 595 / 842,
      hardCovers: true,
      flippingTime: 480
    },
    share: {
      title: 'जय जगन्नाथ मिशन अन्तर्राष्ट्रीय — भव्य आमंत्रण एवं विवरणिका',
      text: 'भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य — विशेष डिजिटल विवरणिका देखें।',
      whatsappCaption: 'जय जगन्नाथ! भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य कृति विमोचन समारोह की डिजिटल विवरणिका अवश्य देखें:'
    },
    pages: []
  };

  let dom = {};

  function cacheDom() {
    dom = {
      root: document.documentElement,
      preloader: document.getElementById('preloader'),
      viewportStage: document.getElementById('viewport-stage'),
      zoomWrapper: document.getElementById('zoom-wrapper'),
      bookStage: document.getElementById('book-stage'),
      book: document.getElementById('book'),
      tapPrev: document.getElementById('tap-prev'),
      tapNext: document.getElementById('tap-next'),
      toolbar: document.getElementById('toolbar'),
      btnPrev: document.getElementById('btn-prev'),
      btnNext: document.getElementById('btn-next'),
      counterCurrent: document.getElementById('counter-current'),
      counterTotal: document.getElementById('counter-total'),
      btnShare: document.getElementById('btn-share'),
      shareModal: document.getElementById('share-modal'),
      shareBackdrop: document.getElementById('share-backdrop'),
      shareCloseBtn: document.getElementById('share-close-btn'),
      shareWhatsapp: document.getElementById('share-whatsapp'),
      shareCopyBtn: document.getElementById('share-copy-btn'),
      toast: document.getElementById('toast'),
      bgAudio: document.getElementById('bg-audio'),
      btnSound: document.getElementById('btn-sound')
    };
  }

  function updateAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }

  function getPageSrc(pageObj) {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    return isMobile && pageObj.mobile ? pageObj.mobile : pageObj.desktop;
  }

  function generatePagesDOM() {
    const pages = config.pages || [];
    state.totalPages = pages.length;
    dom.counterTotal.textContent = state.totalPages;
    dom.book.innerHTML = '';
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    pages.forEach((page, index) => {
      const pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.dataset.pageIndex = index;

      const isFirst = index === 0;
      const isLast = index === pages.length - 1;
      if (config.book.hardCovers && (isFirst || isLast)) {
        pageEl.dataset.density = 'hard';
        pageEl.classList.add('page--cover');
      } else {
        pageEl.dataset.density = 'soft';
      }

      const img = document.createElement('img');
      img.src = getPageSrc(page);
      img.alt = page.alt || `पृष्ठ ${index + 1}`;
      img.width = isMobile ? 707 : 990;
      img.height = isMobile ? 1000 : 1400;
      img.decoding = 'async';

      if (isFirst) {
        img.setAttribute('fetchpriority', 'high');
      } else if (index > 1) {
        img.loading = 'lazy';
      }

      pageEl.appendChild(img);
      dom.book.appendChild(pageEl);
    });

    if (pages.length % 2 !== 0) {
      const fillerEl = document.createElement('div');
      fillerEl.className = 'page page--filler';
      fillerEl.dataset.density = 'soft';
      dom.book.appendChild(fillerEl);
    }
  }

  // --- Background Peaceful Flute Music (Low Volume, Smooth Loop) ---
  function setupAudio() {
    const audio = dom.bgAudio;
    const btn = dom.btnSound;
    if (!audio || !btn) return;

    // Peaceful low volume
    audio.volume = 0.25;

    const iconOn = btn.querySelector('.icon-sound-on');
    const iconOff = btn.querySelector('.icon-sound-off');

    function updateAudioUI(isPlaying) {
      state.isAudioPlaying = isPlaying;
      if (isPlaying) {
        btn.classList.add('playing');
        btn.classList.remove('muted');
        if (iconOn) iconOn.style.display = 'block';
        if (iconOff) iconOff.style.display = 'none';
      } else {
        btn.classList.remove('playing');
        btn.classList.add('muted');
        if (iconOn) iconOn.style.display = 'none';
        if (iconOff) iconOff.style.display = 'block';
      }
    }

    function tryPlayAudio() {
      if (state.audioInitialized) return;
      state.audioInitialized = true;
      audio.play().then(() => {
        updateAudioUI(true);
      }).catch(() => {
        updateAudioUI(false);
      });
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.audioInitialized = true;
      if (audio.paused) {
        audio.play().then(() => updateAudioUI(true)).catch(() => {});
      } else {
        audio.pause();
        updateAudioUI(false);
      }
    });

    // Auto-start on first user interaction anywhere
    const onFirstUserAction = () => {
      tryPlayAudio();
      window.removeEventListener('pointerdown', onFirstUserAction);
      window.removeEventListener('touchstart', onFirstUserAction);
    };

    window.addEventListener('pointerdown', onFirstUserAction, { once: true });
    window.addEventListener('touchstart', onFirstUserAction, { once: true });
  }

  // --- Ultra-Fast Asset Loader (Instant Reveal as Soon as Page 1 is Ready) ---
  function loadAssetsFast(onReady) {
    const pages = config.pages || [];
    if (pages.length === 0) {
      onReady();
      return;
    }

    const firstPage = pages[0];
    const img = new Image();
    img.src = getPageSrc(firstPage);

    const proceed = () => {
      onReady();
      dismissPreloader();
    };

    if (img.decode) {
      img.decode().then(proceed).catch(proceed);
    } else {
      img.onload = img.onerror = proceed;
    }
  }

  function dismissPreloader() {
    if (dom.preloader && !dom.preloader.classList.contains('hidden')) {
      dom.preloader.classList.add('hidden');
      dom.bookStage.classList.add('ready');
    }
  }

  // --- StPageFlip Initialization ---
  function initFlipBook() {
    if (typeof St === 'undefined' || !St.PageFlip) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const ratio = config.book.aspectRatio || (595 / 842);
    const targetWidth = isMobile ? Math.min(window.innerWidth * 0.96, 500) : 520;
    const targetHeight = Math.round(targetWidth / ratio);

    try {
      state.flip = new St.PageFlip(dom.book, {
        width: targetWidth,
        height: targetHeight,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 1100,
        minHeight: 360,
        maxHeight: 1450,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: config.book.flippingTime || 480,
        usePortrait: true,
        showCover: true,
        mobileScrollSupport: false,
        showPageCorners: true,
        useMouseEvents: true,
        swipeDistance: 20,
        autoSize: true
      });

      const pageNodes = document.querySelectorAll('#book .page');
      state.flip.loadFromHTML(pageNodes);

      state.flip.on('init', updatePageCounter);
      state.flip.on('flip', (e) => {
        state.currentPageIndex = e.data;
        updatePageCounter();
      });
      state.flip.on('changeOrientation', updatePageCounter);

    } catch (err) {
      console.warn('Flip initialization:', err);
    }
  }

  function updatePageCounter() {
    if (!state.flip) return;
    const currentIdx = state.flip.getCurrentPageIndex();
    const orientation = state.flip.getOrientation();
    const total = state.totalPages;

    if (orientation === 'portrait') {
      dom.counterCurrent.textContent = Math.min(currentIdx + 1, total);
    } else {
      if (currentIdx === 0) {
        dom.counterCurrent.textContent = '1';
      } else if (currentIdx >= total - 1) {
        dom.counterCurrent.textContent = total;
      } else {
        dom.counterCurrent.textContent = `${currentIdx}–${Math.min(currentIdx + 1, total)}`;
      }
    }
    dom.counterTotal.textContent = total;

    dom.btnPrev.disabled = currentIdx === 0;
    dom.btnNext.disabled = currentIdx >= total - 1;
  }

  // --- High-Sensitivity Touch Swipe Gestures ---
  function setupGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    dom.viewportStage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: true });

    dom.viewportStage.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const duration = Date.now() - touchStartTime;

        // If swipe gesture: horizontal distance > 28px, faster than 800ms, and mostly horizontal
        if (Math.abs(diffX) > 28 && Math.abs(diffX) > Math.abs(diffY) && duration < 800) {
          if (diffX < 0) {
            // Swipe Left -> Next Page
            if (state.flip) state.flip.flipNext();
          } else {
            // Swipe Right -> Previous Page
            if (state.flip) state.flip.flipPrev();
          }
        }
      }
    }, { passive: true });

    // Tap zones (left 32% = prev, right 32% = next)
    dom.tapPrev.addEventListener('click', (e) => {
      if (state.flip) state.flip.flipPrev();
    });
    dom.tapNext.addEventListener('click', (e) => {
      if (state.flip) state.flip.flipNext();
    });
  }

  // --- Share Sheet & WhatsApp Direct Integration ---
  function setupShare() {
    const shareData = {
      title: config.share.title,
      text: config.share.text,
      url: window.location.href
    };

    dom.btnShare.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }
      dom.shareModal.classList.add('active');
    });

    const waCaption = config.share.whatsappCaption || config.share.title;
    dom.shareWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(waCaption + ' ' + window.location.href)}`;

    dom.shareCopyBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(showToast);
      } else {
        showToast();
      }
    });

    dom.shareCloseBtn.addEventListener('click', () => dom.shareModal.classList.remove('active'));
    dom.shareBackdrop.addEventListener('click', () => dom.shareModal.classList.remove('active'));

    function showToast() {
      dom.shareModal.classList.remove('active');
      dom.toast.classList.add('show');
      setTimeout(() => dom.toast.classList.remove('show'), 1500);
    }
  }

  // --- Keyboard Shortcuts ---
  function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (dom.shareModal.classList.contains('active')) {
        if (e.key === 'Escape') dom.shareModal.classList.remove('active');
        return;
      }
      if (e.key === 'ArrowLeft' && state.flip) state.flip.flipPrev();
      if (e.key === 'ArrowRight' && state.flip) state.flip.flipNext();
    });

    dom.btnPrev.addEventListener('click', () => state.flip && state.flip.flipPrev());
    dom.btnNext.addEventListener('click', () => state.flip && state.flip.flipNext());
  }

  function onResize() {
    updateAppHeight();
    if (state.flip) {
      try { state.flip.update(); } catch (_) {}
    }
  }

  function boot() {
    cacheDom();
    updateAppHeight();
    generatePagesDOM();
    setupAudio();
    setupGestures();
    setupShare();
    setupKeyboard();

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    loadAssetsFast(initFlipBook);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
