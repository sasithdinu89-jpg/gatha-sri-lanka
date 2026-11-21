/**
 * Sinhala Buddhist Gatha Collection
 * Modern, Serene, Client-Side JavaScript Application
 */

(function () {
  'use strict';

  // Application State
  const state = {
    gathas: [],
    filtered: [],
    activeCategory: 'all',
    searchQuery: '',
    currentModalIndex: -1,
    isFullscreen: false,
    soundEnabled: true,
    audioCtx: null
  };

  // DOM Elements
  const elements = {
    grid: document.getElementById('gathasGrid'),
    emptyState: document.getElementById('emptyState'),
    resultCount: document.getElementById('resultCount'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    
    // Lightbox Modal
    modal: document.getElementById('gathaModal'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalImgContainer: document.getElementById('modalImgContainer'),
    modalImg: document.getElementById('modalImg'),
    modalFullscreenBtn: document.getElementById('modalFullscreenBtn'),
    modalPrevBtn: document.getElementById('modalPrevBtn'),
    modalNextBtn: document.getElementById('modalNextBtn'),
    modalCategoryBadge: document.getElementById('modalCategoryBadge'),
    modalTitleSinhala: document.getElementById('modalTitleSinhala'),
    modalTitleEnglish: document.getElementById('modalTitleEnglish'),
    modalVerseText: document.getElementById('modalVerseText'),
    modalMeaningSinhala: document.getElementById('modalMeaningSinhala'),
    modalMeaningEnglish: document.getElementById('modalMeaningEnglish'),
    modalDownloadBtn: document.getElementById('modalDownloadBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),

    // Dedicated Fullscreen Chanting Viewer (Mobile & Tablet)
    fsViewer: document.getElementById('fullscreenViewer'),
    fsCloseBtn: document.getElementById('fsCloseBtn'),
    fsPrevBtn: document.getElementById('fsPrevBtn'),
    fsNextBtn: document.getElementById('fsNextBtn'),
    fsChimeBtn: document.getElementById('fsChimeBtn'),
    fsImg: document.getElementById('fsImg'),
    fsScrollContainer: document.getElementById('fsScrollContainer'),
    fsTitleSinhala: document.getElementById('fsTitleSinhala'),
    fsTitleEnglish: document.getElementById('fsTitleEnglish'),
    fsCategoryBadge: document.getElementById('fsCategoryBadge'),
    fsCounter: document.getElementById('fsCounter'),
    
    // Toast
    toast: document.getElementById('toastNotification'),
    toastText: document.getElementById('toastText')
  };

  // ==========================================
  // Web Audio API: Temple Singing Bowl Chime
  // ==========================================
  function playTempleChime() {
    if (!state.soundEnabled) return;

    try {
      if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioContext();
      }

      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const now = state.audioCtx.currentTime;
      const fundamental = 432; // Sacred 432 Hz frequency
      const harmonics = [1, 2.01, 3.02, 4.2];
      const gains = [0.4, 0.2, 0.08, 0.03];

      harmonics.forEach((harmonic, index) => {
        const osc = state.audioCtx.createOscillator();
        const gainNode = state.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * harmonic, now);

        // Exponential decay envelope simulating a bronze singing bowl
        gainNode.gain.setValueAtTime(gains[index], now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gainNode);
        gainNode.connect(state.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn('Audio chime unsupported or blocked:', e);
    }
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  let toastTimeout = null;
  function showToast(message) {
    if (!elements.toast || !elements.toastText) return;
    elements.toastText.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // Theme Management (Light / Twilight)
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem('gatha-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        playTempleChime();
        showToast(next === 'dark' ? 'රාත්‍රී භාවනා තේමාව සක්‍රියයි (Twilight Mode)' : 'දිවා තේමාව සක්‍රියයි (Parchment Mode)');
      });
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gatha-theme', theme);
    if (elements.themeToggleBtn) {
      const iconLight = elements.themeToggleBtn.querySelector('.theme-icon-light');
      const iconDark = elements.themeToggleBtn.querySelector('.theme-icon-dark');
      if (iconLight && iconDark) {
        if (theme === 'dark') {
          iconLight.classList.remove('hidden');
          iconDark.classList.add('hidden');
        } else {
          iconLight.classList.add('hidden');
          iconDark.classList.remove('hidden');
        }
      }
    }
  }

  // ==========================================
  // Sound Chime Toggle
  // ==========================================
  function initSoundToggle() {
    if (elements.soundToggleBtn) {
      elements.soundToggleBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) {
          playTempleChime();
          showToast('ශබ්දය සක්‍රියයි • Temple bell enabled');
          elements.soundToggleBtn.setAttribute('title', 'Mute Singing Bowl Chime');
          elements.soundToggleBtn.classList.remove('opacity-50');
        } else {
          showToast('ශබ්දය අක්‍රියයි • Temple bell muted');
          elements.soundToggleBtn.setAttribute('title', 'Enable Singing Bowl Chime');
          elements.soundToggleBtn.classList.add('opacity-50');
        }
      });
    }
  }

  // ==========================================
  // Data Fetching & Rendering
  // ==========================================
  async function loadGathas() {
    const embeddedScript = document.getElementById('gathasData');
    let loadedData = null;

    // In HTTP/HTTPS (GitHub Pages, local server), fetch gathas.json
    if (window.location.protocol !== 'file:') {
      try {
        const response = await fetch('assets/data/gathas.json');
        if (response.ok) {
          loadedData = await response.json();
        }
      } catch (err) {
        console.warn('Network fetch for gathas.json failed, falling back to embedded script:', err);
      }
    }

    // Fallback to embedded script if file:// or fetch failed
    if (!loadedData && embeddedScript && embeddedScript.textContent.trim()) {
      try {
        loadedData = JSON.parse(embeddedScript.textContent);
      } catch (e) {
        console.error('Failed to parse embedded gathasData:', e);
      }
    }

    if (loadedData && Array.isArray(loadedData) && loadedData.length > 0) {
      state.gathas = loadedData;
      applyFilters();
      handleDeepLink();
    } else {
      console.error('Could not load Gathas from network or embedded data');
      if (elements.grid) {
        elements.grid.innerHTML = `
          <div class="col-span-full py-16 text-center">
            <p class="text-xl font-semibold text-amber-800">දත්ත ලබා ගැනීමේ දෝෂයක් හටගති.</p>
            <p class="text-stone-500 mt-2">Could not load Gathas metadata. Please verify assets/data/gathas.json exists.</p>
          </div>
        `;
      }
    }
  }

  function applyFilters() {
    const query = state.searchQuery.toLowerCase().trim();
    const category = state.activeCategory;

    state.filtered = state.gathas.filter(item => {
      // Category match
      const categoryMatch = (category === 'all') || (item.category === category);
      if (!categoryMatch) return false;

      // Search match
      if (!query) return true;

      const searchableText = [
        item.titleSinhala || '',
        item.titleEnglish || '',
        item.summary || '',
        item.versePali || '',
        item.meaningSinhala || '',
        item.meaningEnglish || '',
        (item.tags || []).join(' ')
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });

    renderGallery();
    updateCounter();
  }

  function renderGallery() {
    if (!elements.grid) return;

    if (state.filtered.length === 0) {
      elements.grid.innerHTML = '';
      if (elements.emptyState) elements.emptyState.classList.remove('hidden');
      return;
    }

    if (elements.emptyState) elements.emptyState.classList.add('hidden');

    elements.grid.innerHTML = state.filtered.map((item, index) => {
      const categoryName = item.categoryNameSinhala || item.category;
      return `
        <article class="gatha-card group" data-id="${item.id}" data-index="${index}">
          <!-- Card Image Wrap -->
          <div class="card-image-wrap" role="button" tabindex="0" aria-label="විවෘත කරන්න: ${item.titleSinhala}" onclick="window.GathaApp.openModal(${index})">
            <img 
              src="${item.image}" 
              alt="${item.titleSinhala} - ${item.titleEnglish}"
              loading="lazy"
            />
            <div class="image-inner-frame"></div>
            
            <!-- Hover Action Overlay -->
            <div class="card-overlay">
              <button class="card-overlay-btn px-4 py-2 bg-amber-700/90 hover:bg-amber-600 text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg flex items-center gap-2 backdrop-blur-sm transition-all duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                විශාල කර බලන්න
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex flex-col flex-grow justify-between border-t border-amber-900/10">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="category-badge-chip">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  ${categoryName}
                </span>
                <span class="text-xs text-stone-400 font-serif italic">${item.categoryNameEnglish || ''}</span>
              </div>

              <h2 class="text-xl font-bold font-sinhala-serif text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200">
                ${item.titleSinhala}
              </h2>

              <p class="text-xs font-serif italic text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                ${item.titleEnglish}
              </p>

              <p class="text-sm text-stone-600 dark:text-stone-300 mt-3 font-sinhala-sans line-clamp-2 leading-relaxed">
                ${item.summary}
              </p>
            </div>

            <!-- Card Action Footer -->
            <div class="pt-4 mt-4 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
              <button 
                onclick="window.GathaApp.openModal(${index})"
                class="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <span>කියවන්න</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <div class="flex items-center gap-1">
                <button 
                  onclick="event.stopPropagation(); window.GathaApp.downloadGatha('${item.image}', '${item.titleEnglish}')" 
                  title="බාගත කරන්න (Download Image)" 
                  class="p-2 rounded-full text-stone-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                </button>

                <button 
                  onclick="event.stopPropagation(); window.GathaApp.shareGatha('${item.id}', '${item.titleSinhala}')" 
                  title="බෙදාගන්න (Share / Copy Link)" 
                  class="p-2 rounded-full text-stone-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function updateCounter() {
    if (!elements.resultCount) return;
    const total = state.gathas.length;
    const count = state.filtered.length;
    if (count === total) {
      elements.resultCount.textContent = `ගාථා ${total} ම ප්‍රදර්ශනය කෙරේ • Showing all ${total} gathas`;
    } else {
      elements.resultCount.textContent = `ප්‍රතිඵල ${count} ක් හමුවිය • Showing ${count} of ${total}`;
    }
  }

  // ==========================================
  // Lightbox Modal & Fullscreen Controls
  // ==========================================
  function updateModalContent(index) {
    state.currentModalIndex = index;
    const item = state.filtered[index];
    if (!item) return;

    if (elements.modalImg) {
      elements.modalImg.src = item.image;
      elements.modalImg.alt = item.titleSinhala;
    }
    if (elements.modalCategoryBadge) {
      elements.modalCategoryBadge.textContent = `${item.categoryNameSinhala || ''} • ${item.categoryNameEnglish || ''}`;
    }
    if (elements.modalTitleSinhala) {
      elements.modalTitleSinhala.textContent = item.titleSinhala;
    }
    if (elements.modalTitleEnglish) {
      elements.modalTitleEnglish.textContent = item.titleEnglish;
    }
    if (elements.modalVerseText) {
      elements.modalVerseText.textContent = item.versePali;
    }
    if (elements.modalMeaningSinhala) {
      elements.modalMeaningSinhala.textContent = item.meaningSinhala;
    }
    if (elements.modalMeaningEnglish) {
      elements.modalMeaningEnglish.textContent = item.meaningEnglish;
    }

    // Action handlers (no copy function)
    if (elements.modalDownloadBtn) {
      elements.modalDownloadBtn.onclick = () => downloadGatha(item.image, item.titleEnglish);
    }
    if (elements.modalShareBtn) {
      elements.modalShareBtn.onclick = () => shareGatha(item.id, item.titleSinhala);
    }

    // Update deep link URL hash
    window.location.hash = item.id;
  }

  function openModal(index) {
    if (index < 0 || index >= state.filtered.length) return;
    state.currentModalIndex = index;

    // Reset container scroll
    if (elements.modalImgContainer) {
      elements.modalImgContainer.scrollTop = 0;
      elements.modalImgContainer.scrollLeft = 0;
    }

    updateModalContent(index);

    // Show modal
    if (elements.modal) {
      elements.modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    playTempleChime();
  }

  function closeModal() {
    if (!elements.modal) return;
    elements.modal.classList.add('hidden');
    if (!state.isFullscreen) {
      document.body.style.overflow = '';
    }
    state.currentModalIndex = -1;

    // Remove hash without scrolling
    history.replaceState(null, null, ' ');
  }

  function nextModal() {
    if (state.filtered.length <= 1) return;
    const nextIdx = (state.currentModalIndex + 1) % state.filtered.length;
    openModal(nextIdx);
  }

  function prevModal() {
    if (state.filtered.length <= 1) return;
    const prevIdx = (state.currentModalIndex - 1 + state.filtered.length) % state.filtered.length;
    openModal(prevIdx);
  }

  // ==========================================
  // Dedicated Fullscreen Chanting Viewer
  // (Optimized for Mobile & Tablet reading)
  // ==========================================
  function openFullscreen(index) {
    if (typeof index === 'number' && index >= 0 && index < state.filtered.length) {
      state.currentModalIndex = index;
    } else if (state.currentModalIndex === -1 && state.filtered.length > 0) {
      state.currentModalIndex = 0;
    }

    const item = state.filtered[state.currentModalIndex];
    if (!item || !elements.fsViewer) return;

    state.isFullscreen = true;

    // Populate fullscreen view
    if (elements.fsImg) {
      elements.fsImg.src = item.image;
      elements.fsImg.alt = `${item.titleSinhala} - ${item.titleEnglish}`;
    }
    if (elements.fsTitleSinhala) {
      elements.fsTitleSinhala.textContent = item.titleSinhala;
    }
    if (elements.fsTitleEnglish) {
      elements.fsTitleEnglish.textContent = item.titleEnglish;
    }
    if (elements.fsCategoryBadge) {
      elements.fsCategoryBadge.textContent = item.categoryNameSinhala || item.category;
    }
    if (elements.fsCounter) {
      elements.fsCounter.textContent = `ගාථා ${state.currentModalIndex + 1} / ${state.filtered.length}`;
    }
    if (elements.fsScrollContainer) {
      elements.fsScrollContainer.scrollTop = 0;
      elements.fsScrollContainer.scrollLeft = 0;
    }

    elements.fsViewer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Request native browser fullscreen if supported
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}

    playTempleChime();
  }

  function closeFullscreen() {
    if (!elements.fsViewer) return;
    state.isFullscreen = false;
    elements.fsViewer.classList.add('hidden');

    // Only restore body scrolling if main modal is also closed
    if (!elements.modal || elements.modal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }

    // Exit native browser fullscreen if active
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  }

  function nextFullscreen() {
    if (state.filtered.length <= 1) return;
    const nextIdx = (state.currentModalIndex + 1) % state.filtered.length;
    openFullscreen(nextIdx);
    if (elements.modal && !elements.modal.classList.contains('hidden')) {
      updateModalContent(nextIdx);
    }
  }

  function prevFullscreen() {
    if (state.filtered.length <= 1) return;
    const prevIdx = (state.currentModalIndex - 1 + state.filtered.length) % state.filtered.length;
    openFullscreen(prevIdx);
    if (elements.modal && !elements.modal.classList.contains('hidden')) {
      updateModalContent(prevIdx);
    }
  }

  // ==========================================
  // Helper Actions (Download, Share, Deep-link)
  // ==========================================
  function downloadGatha(imagePath, title) {
    const ext = (imagePath || '').split('.').pop().split(/[#?]/)[0] || 'jpg';
    const filename = `${(title || 'gatha').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.${ext}`;
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`බාගත වීම ආරම්භ විය • Downloading ${filename}`);
  }

  async function shareGatha(id, title) {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${id}`;
    const shareData = {
      title: `${title} - සිංහල බෞද්ධ ගාථා සංග්‍රහය`,
      text: `${title} බෞද්ධ ගාථාව නැරඹීමට හා ශ්‍රවණයට පිවිසෙන්න:`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, falling back to clipboard:', err);
        } else {
          return;
        }
      }
    }

    copyText(shareUrl, 'ගාථාව බෙදාගැනීමේ සබැඳිය පිටපත් කරගන්නා ලදී (Link copied!)');
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('පිටපත් කිරීමට නොහැකි විය');
    }
    document.body.removeChild(textArea);
  }

  function handleDeepLink() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;
    const targetIndex = state.filtered.findIndex(g => g.id === hash);
    if (targetIndex !== -1) {
      setTimeout(() => openModal(targetIndex), 200);
    }
  }

  // ==========================================
  // Event Listeners Initialization
  // ==========================================
  function initEvents() {
    // Category Filter Buttons
    elements.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeCategory = btn.getAttribute('data-category');
        applyFilters();
        playTempleChime();
      });
    });

    // Search Input
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (elements.clearSearchBtn) {
          if (state.searchQuery.length > 0) {
            elements.clearSearchBtn.classList.remove('hidden');
          } else {
            elements.clearSearchBtn.classList.add('hidden');
          }
        }
        applyFilters();
      });
    }

    // Clear Search Button
    if (elements.clearSearchBtn) {
      elements.clearSearchBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        state.searchQuery = '';
        elements.clearSearchBtn.classList.add('hidden');
        applyFilters();
        elements.searchInput.focus();
      });
    }

    // Modal Close
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeModal);
    }
    if (elements.modalBackdrop) {
      elements.modalBackdrop.addEventListener('click', closeModal);
    }

    // Modal Nav & Fullscreen Trigger (Clicking image or button goes Full Screen)
    if (elements.modalPrevBtn) {
      elements.modalPrevBtn.addEventListener('click', prevModal);
    }
    if (elements.modalNextBtn) {
      elements.modalNextBtn.addEventListener('click', nextModal);
    }
    if (elements.modalFullscreenBtn) {
      elements.modalFullscreenBtn.addEventListener('click', () => openFullscreen(state.currentModalIndex));
    }
    if (elements.modalImgContainer) {
      // Tapping anywhere on the image container triggers Full Screen for Mobile & Tablet
      elements.modalImgContainer.addEventListener('click', () => {
        openFullscreen(state.currentModalIndex);
      });
    }

    // Fullscreen Viewer Controls
    if (elements.fsCloseBtn) {
      elements.fsCloseBtn.addEventListener('click', closeFullscreen);
    }
    if (elements.fsPrevBtn) {
      elements.fsPrevBtn.addEventListener('click', prevFullscreen);
    }
    if (elements.fsNextBtn) {
      elements.fsNextBtn.addEventListener('click', nextFullscreen);
    }
    if (elements.fsChimeBtn) {
      elements.fsChimeBtn.addEventListener('click', playTempleChime);
    }

    // Mobile & Tablet Touch Swipe Navigation in Full Screen Mode
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    if (elements.fsScrollContainer) {
      elements.fsScrollContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }
      }, { passive: true });

      elements.fsScrollContainer.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
          const diffX = e.changedTouches[0].clientX - touchStartX;
          const diffY = e.changedTouches[0].clientY - touchStartY;
          const duration = Date.now() - touchStartTime;

          // Quick horizontal swipe (swipe left = next, swipe right = prev)
          if (duration < 600 && Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
            if (diffX < 0) {
              nextFullscreen();
            } else {
              prevFullscreen();
            }
          }
        }
      }, { passive: true });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (state.isFullscreen) {
        if (e.key === 'Escape') closeFullscreen();
        if (e.key === 'ArrowRight') nextFullscreen();
        if (e.key === 'ArrowLeft') prevFullscreen();
        return;
      }

      if (elements.modal && !elements.modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextModal();
        if (e.key === 'ArrowLeft') prevModal();
        if (e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'Z') {
          openFullscreen(state.currentModalIndex);
        }
      }
    });

    // Reset Filters from Empty State
    window.resetGathaFilters = () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      if (elements.searchInput) elements.searchInput.value = '';
      if (elements.clearSearchBtn) elements.clearSearchBtn.classList.add('hidden');
      elements.filterBtns.forEach(b => {
        if (b.getAttribute('data-category') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      applyFilters();
    };
  }

  // ==========================================
  // Public App Namespace
  // ==========================================
  window.GathaApp = {
    openModal,
    closeModal,
    openFullscreen,
    closeFullscreen,
    downloadGatha,
    shareGatha,
    playTempleChime
  };

  // Kickstart Application
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSoundToggle();
    initEvents();
    loadGathas();
  });
})();
