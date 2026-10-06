/**
 * ==========================================================================
 * PREMIUM 3D FLIPBOOK ENGINE (WhatsApp-First, Full-Screen, Ambient Flute Audio)
 * E-Paper Edition: जय जगन्नाथ (वर्ष 01, अंक 01)
 * Ultra-Sharp, Senior-Friendly Readability with Zero-Lag Dual-Page Preload
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
      aspectRatio: 1286 / 1800,
      hardCovers: true,
      flippingTime: 520
    },
    share: {
      title: 'जय जगन्नाथ ई-समाचार पत्र — विशेष 3D डिजिटल संस्करण',
      text: 'जय जगन्नाथ (वर्ष 01, अंक 01) — भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य।',
      whatsappCaption: 'जय जगन्नाथ! "जय जगन्नाथ" ई-समाचार पत्र (विशेष 3D डिजिटल संस्करण) अवश्य पढ़ें:'
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
      btnZoom: document.getElementById('btn-zoom'),
      iconZoomIn: document.getElementById('icon-zoom-in'),
      iconZoomOut: document.getElementById('icon-zoom-out'),
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
      img.width = isMobile ? 1350 : 1800;
      img.height = isMobile ? 1890 : 2520;
      img.decoding = 'async';
      img.loading = 'eager'; // Crucial: eager load so page turns never render blank

      if (index < 2) {
        img.setAttribute('fetchpriority', 'high');
      }

      // Auto-retry recovery on cellular network glitch
      img.onerror = () => {
        setTimeout(() => {
          img.src = getPageSrc(page) + `?t=${Date.now()}`;
        }, 800);
      };

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

  // --- Web Audio Soft Paper Rustle ---
  let audioCtx = null;
  function playPaperRustle() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.12);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.6, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start();
    } catch (_) {}
  }

  // --- Background Peaceful Flute Music (Low Volume, Smooth Loop) ---
  function setupAudio() {
    const audio = dom.bgAudio;
    const btn = dom.btnSound;
    if (!audio || !btn) return;

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

    const onFirstUserAction = () => {
      tryPlayAudio();
      window.removeEventListener('pointerdown', onFirstUserAction);
      window.removeEventListener('touchstart', onFirstUserAction);
    };

    window.addEventListener('pointerdown', onFirstUserAction, { once: true });
    window.addEventListener('touchstart', onFirstUserAction, { once: true });
  }

  // --- Zero-Lag Preloader (Preloads Page 1 AND Page 2 before reveal) ---
  function loadAssetsFast(onReady) {
    const pages = config.pages || [];
    if (pages.length === 0) {
      onReady();
      return;
    }

    // Immediately kick off preload of ALL pages in parallel
    pages.forEach((p) => {
      const preloadImg = new Image();
      preloadImg.src = getPageSrc(p);
    });

    // Ensure Page 1 AND Page 2 are fully in memory before showing the book
    const pagesToWait = Math.min(2, pages.length);
    let loadedCount = 0;

    const onSingleLoaded = () => {
      loadedCount++;
      if (loadedCount >= pagesToWait) {
        onReady();
        dismissPreloader();
      }
    };

    for (let i = 0; i < pagesToWait; i++) {
      const img = new Image();
      img.src = getPageSrc(pages[i]);
      if (img.decode) {
        img.decode().then(onSingleLoaded).catch(onSingleLoaded);
      } else {
        img.onload = img.onerror = onSingleLoaded;
      }
    }

    // Safety fallback: dismiss preloader after max 2.5s even if slow network
    setTimeout(() => {
      if (dom.preloader && !dom.preloader.classList.contains('hidden')) {
        onReady();
        dismissPreloader();
      }
    }, 2500);
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
    const ratio = config.book.aspectRatio || (1286 / 1800);
    const targetWidth = isMobile ? Math.min(window.innerWidth * 0.96, 520) : 530;
    const targetHeight = Math.round(targetWidth / ratio);

    try {
      state.flip = new St.PageFlip(dom.book, {
        width: targetWidth,
        height: targetHeight,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 1200,
        minHeight: 360,
        maxHeight: 1600,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: config.book.flippingTime || 520,
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
        playPaperRustle();
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
      if (state.zoomLevel > 1) return;

      if (e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const duration = Date.now() - touchStartTime;

        if (Math.abs(diffX) > 28 && Math.abs(diffX) > Math.abs(diffY) && duration < 800) {
          if (diffX < 0) {
            if (state.flip) state.flip.flipNext();
          } else {
            if (state.flip) state.flip.flipPrev();
          }
        }
      }
    }, { passive: true });

    dom.tapPrev.addEventListener('click', () => {
      if (state.zoomLevel === 1 && state.flip) state.flip.flipPrev();
    });
    dom.tapNext.addEventListener('click', () => {
      if (state.zoomLevel === 1 && state.flip) state.flip.flipNext();
    });
  }

  // --- Double-Tap & Button Zoom & Pan Engine ---
  function setupZoom() {
    const btn = dom.btnZoom;
    const wrapper = dom.zoomWrapper;
    const stage = dom.viewportStage;
    if (!wrapper || !stage) return;

    let panX = 0;
    let panY = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    function applyTransform(animated = true) {
      wrapper.style.transition = animated ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      if (state.zoomLevel > 1) {
        wrapper.style.transform = `scale(${state.zoomLevel}) translate(${panX}px, ${panY}px)`;
        wrapper.classList.add('panning');
        if (dom.tapPrev) dom.tapPrev.style.pointerEvents = 'none';
        if (dom.tapNext) dom.tapNext.style.pointerEvents = 'none';
        if (dom.iconZoomIn) dom.iconZoomIn.style.display = 'none';
        if (dom.iconZoomOut) dom.iconZoomOut.style.display = 'block';
      } else {
        wrapper.style.transform = '';
        wrapper.classList.remove('panning');
        if (dom.tapPrev) dom.tapPrev.style.pointerEvents = '';
        if (dom.tapNext) dom.tapNext.style.pointerEvents = '';
        if (dom.iconZoomIn) dom.iconZoomIn.style.display = 'block';
        if (dom.iconZoomOut) dom.iconZoomOut.style.display = 'none';
        panX = 0;
        panY = 0;
      }
    }

    function toggleZoom(originX = null, originY = null) {
      if (state.zoomLevel > 1) {
        state.zoomLevel = 1.0;
        panX = 0;
        panY = 0;
      } else {
        state.zoomLevel = 1.95; // 1.95x magnification for crystal-clear readability
        if (originX !== null && originY !== null) {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          panX = Math.max(-140, Math.min(140, (cx - originX) * 0.45));
          panY = Math.max(-200, Math.min(200, (cy - originY) * 0.45));
        } else {
          panX = 0;
          panY = 0;
        }
      }
      applyTransform(true);
    }

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleZoom();
      });
    }

    stage.addEventListener('dblclick', (e) => {
      e.preventDefault();
      toggleZoom(e.clientX, e.clientY);
    });

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const now = Date.now();
        const dist = Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY);

        if (now - lastTapTime < 320 && dist < 35) {
          e.preventDefault();
          toggleZoom(touch.clientX, touch.clientY);
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;
        lastTapX = touch.clientX;
        lastTapY = touch.clientY;

        if (state.zoomLevel > 1) {
          isDragging = true;
          startX = touch.clientX - panX * state.zoomLevel;
          startY = touch.clientY - panY * state.zoomLevel;
        }
      }
    }, { passive: false });

    stage.addEventListener('touchmove', (e) => {
      if (state.zoomLevel > 1 && isDragging && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        panX = (touch.clientX - startX) / state.zoomLevel;
        panY = (touch.clientY - startY) / state.zoomLevel;

        const limitX = (window.innerWidth * 0.5);
        const limitY = (window.innerHeight * 0.5);
        panX = Math.max(-limitX, Math.min(limitX, panX));
        panY = Math.max(-limitY, Math.min(limitY, panY));

        applyTransform(false);
      }
    }, { passive: false });

    stage.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        applyTransform(true);
      }
    });

    stage.addEventListener('mousedown', (e) => {
      if (state.zoomLevel > 1 && e.button === 0) {
        isDragging = true;
        startX = e.clientX - panX * state.zoomLevel;
        startY = e.clientY - panY * state.zoomLevel;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (state.zoomLevel > 1 && isDragging) {
        panX = (e.clientX - startX) / state.zoomLevel;
        panY = (e.clientY - startY) / state.zoomLevel;
        const limitX = (window.innerWidth * 0.5);
        const limitY = (window.innerHeight * 0.5);
        panX = Math.max(-limitX, Math.min(limitX, panX));
        panY = Math.max(-limitY, Math.min(limitY, panY));
        applyTransform(false);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        applyTransform(true);
      }
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
    setupZoom();
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
