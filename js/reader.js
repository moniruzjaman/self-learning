/* ============================================================
   Reader — main controller
   - Renders chapters from EBOOK_CONTENT
   - Manages TOC sidebar, settings panel, share modal
   - Audio (TTS) playback UI
   - Reading progress, scroll spy, persistent settings
   ============================================================ */

(function () {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ── State ──────────────────────────────────────────────────
    const state = {
        currentChapter: null,
        settings: {
            theme: localStorage.getItem('ebook-theme') || 'day',
            font: localStorage.getItem('ebook-font') || 'serif',
            fontSize: parseInt(localStorage.getItem('ebook-fontsize') || '17', 10),
            lineHeight: parseInt(localStorage.getItem('ebook-lineheight') || '180', 10) / 100,
        },
        audio: {
            visible: false,
            isPlaying: false,
            speed: 1.0,
        },
    };

    // ── Render book content ────────────────────────────────────
    function renderBook() {
        const root = $('#bookContent');
        const html = [];

        const renderChapter = (ch) => {
            const epigraph = ch.epigraph
                ? `<div class="epigraph">${ch.epigraph}</div>`
                : '';
            return `
<section class="chapter" id="${ch.id}" data-chapter="${ch.id}" data-num="${ch.numLabel}">
  <div class="chapter-header">
    <span class="chapter-num">${ch.numLabel}</span>
    <h2 class="chapter-title">${ch.title}</h2>
    <p class="chapter-subtitle">${ch.subtitle}</p>
  </div>
  ${epigraph}
  <div class="chapter-body">${ch.html}</div>
</section>`;
        };

        // Chapters
        for (const ch of EBOOK_CONTENT.chapters) {
            html.push(renderChapter(ch));
        }
        // Interactive, glossary, resources, about
        html.push(renderChapter(EBOOK_CONTENT.interactive));
        html.push(renderChapter(EBOOK_CONTENT.glossary));
        html.push(renderChapter(EBOOK_CONTENT.resources));
        html.push(renderChapter(EBOOK_CONTENT.about));

        root.innerHTML = html.join('\n');
    }

    // ── Render TOC sidebar ─────────────────────────────────────
    function renderToc() {
        const nav = $('#tocNav');
        const html = [];
        for (const item of EBOOK_TOC) {
            if (item.section) {
                html.push(`<div class="toc-section-header">${item.section}</div>`);
            } else {
                html.push(`
<a href="#${item.id}" class="toc-item" data-target="${item.id}">
  <span class="toc-num">${item.num}</span>
  <span class="toc-text-block">
    <span class="toc-item-title">${item.title}</span>
    <span class="toc-item-sub">${item.sub}</span>
  </span>
</a>`);
            }
        }
        nav.innerHTML = html.join('');
    }

    // ── Apply settings ─────────────────────────────────────────
    function applySettings() {
        document.documentElement.setAttribute('data-theme', state.settings.theme);
        document.documentElement.style.setProperty('--font-size', state.settings.fontSize + 'px');
        document.documentElement.style.setProperty('--line-height', state.settings.lineheight || state.settings.lineHeight);
        // Font family
        if (state.settings.font === 'sans') {
            document.documentElement.style.setProperty('--font-body', "'NotoSansBengali', sans-serif");
            document.documentElement.style.setProperty('--font-head', "'NotoSansBengali', sans-serif");
        } else {
            document.documentElement.style.setProperty('--font-body', "'NotoSerifBengali', serif");
            document.documentElement.style.setProperty('--font-head', "'NotoSansBengali', sans-serif");
        }
        // Update UI controls
        $('#fontSizeRange').value = state.settings.fontSize;
        $('#fontSizeValue').textContent = state.settings.fontSize + 'px';
        $('#lineHeightRange').value = Math.round(state.settings.lineHeight * 100);
        $('#lineHeightValue').textContent = state.settings.lineHeight.toFixed(2);
        $$('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === state.settings.theme));
        $$('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.font === state.settings.font));
    }

    // ── Sidebar / panel toggle helpers ────────────────────────
    function openToc() {
        $('#tocSidebar').classList.add('open');
        $('#tocOverlay').classList.add('visible');
    }
    function closeToc() {
        $('#tocSidebar').classList.remove('open');
        $('#tocOverlay').classList.remove('visible');
    }
    function openSettings() {
        $('#settingsPanel').classList.add('open');
        $('#settingsOverlay').classList.add('visible');
    }
    function closeSettings() {
        $('#settingsPanel').classList.remove('open');
        $('#settingsOverlay').classList.remove('visible');
    }

    // ── Share modal ────────────────────────────────────────────
    function openShare(chapterId) {
        $('#shareModal').classList.add('visible');
        $('#shareLinkInput').value = chapterId
            ? `https://moniruzjaman.github.io/self-learning/#${chapterId}`
            : 'https://moniruzjaman.github.io/self-learning/';
        // Hide native share button if unsupported
        $('#btnNativeShare').style.display = EBOOK_SHARE.isNativeSupported() ? '' : 'none';
    }
    function closeShare() {
        $('#shareModal').classList.remove('visible');
    }

    // ── Audio (TTS) UI ─────────────────────────────────────────
    function showAudioBar() {
        $('#audioBar').classList.add('visible');
        document.body.classList.add('audio-visible');
        state.audio.visible = true;
    }
    function hideAudioBar() {
        $('#audioBar').classList.remove('visible');
        document.body.classList.remove('audio-visible');
        state.audio.visible = false;
    }
    function setAudioPlayIcon(playing) {
        const icon = $('#audioPlayIcon');
        if (playing) {
            // Pause icon
            icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        } else {
            // Play icon
            icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        }
    }
    function updateAudioProgress(pct) {
        $('#audioProgressFill').style.width = pct + '%';
    }

    function startChapterAudio(chapterId) {
        // Find chapter
        const all = [
            ...EBOOK_CONTENT.chapters,
            EBOOK_CONTENT.interactive,
            EBOOK_CONTENT.glossary,
            EBOOK_CONTENT.resources,
            EBOOK_CONTENT.about,
        ];
        const ch = all.find(c => c.id === chapterId);
        if (!ch || !ch.ttsText) {
            alert('এই অধ্যায়ের জন্য অডিও উপলব্ধ নেই।');
            return;
        }

        if (!EBOOK_TTS.init()) {
            alert('আপনার ব্রাউজারে Speech Synthesis সাপোর্ট নেই। অডিও ফিচার ব্যবহার করা যাবে না।');
            return;
        }

        // If same chapter and playing, toggle pause/resume
        if (state.audio.isPlaying && EBOOK_TTS.currentChapter === chapterId) {
            if (EBOOK_TTS.isPaused) {
                EBOOK_TTS.resume();
                setAudioPlayIcon(true);
            } else {
                EBOOK_TTS.pause();
                setAudioPlayIcon(false);
            }
            return;
        }

        // Stop any previous
        EBOOK_TTS.stop();

        // Show audio bar with chapter title
        $('#audioTitle').textContent = ch.title;
        showAudioBar();
        setAudioPlayIcon(true);
        state.audio.isPlaying = true;

        // Wire callbacks
        EBOOK_TTS.onProgress = (info) => {
            updateAudioProgress(info.progress);
        };
        EBOOK_TTS.onEnd = (cid) => {
            setAudioPlayIcon(false);
            state.audio.isPlaying = false;
            updateAudioProgress(100);
            setTimeout(() => {
                if (EBOOK_TTS.currentChapter === cid) {
                    updateAudioProgress(0);
                }
            }, 1500);
        };

        // If no Bengali voice, warn once
        if (!EBOOK_TTS.hasBengaliVoice() && !sessionStorage.getItem('bn-voice-warned')) {
            sessionStorage.setItem('bn-voice-warned', '1');
            console.warn('No Bengali TTS voice found on this device. The audio may use a default voice. To enable proper Bengali narration, install a Bengali voice in your OS settings (Android: Settings → Languages → Bengali; iOS: Settings → Accessibility → Spoken Content → Voices → Bengali; Windows: Settings → Time & Language → Speech → Add Bengali).');
        }

        EBOOK_TTS.play(chapterId, ch.ttsText, { speed: state.audio.speed });
    }

    function stopAudio() {
        EBOOK_TTS.stop();
        setAudioPlayIcon(false);
        state.audio.isPlaying = false;
        updateAudioProgress(0);
        hideAudioBar();
    }

    // ── Progress bar + scroll spy ──────────────────────────────
    function onScroll() {
        // Progress
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        $('#progressBar').style.width = Math.min(100, pct) + '%';

        // Scroll spy — find current chapter
        const chapters = $$('section.chapter, section.hero');
        let current = null;
        for (const ch of chapters) {
            const rect = ch.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.35) {
                current = ch;
            } else {
                break;
            }
        }
        if (current && current.id !== state.currentChapter) {
            state.currentChapter = current.id;
            updateActiveToc(current.id);
            // Update topbar title
            const data = current.dataset;
            if (data && data.num) {
                $('#topbarChapter').textContent = data.num + ' · ' + (current.querySelector('.chapter-title')?.textContent || '');
            } else if (current.id === 'hero') {
                $('#topbarChapter').textContent = EBOOK_CONTENT.subtitle;
            }
        }
    }

    function updateActiveToc(chapterId) {
        $$('.toc-item').forEach(item => {
            item.classList.toggle('active', item.dataset.target === chapterId);
        });
        // Auto-scroll TOC to active item
        const active = $('.toc-item.active');
        if (active) {
            const nav = $('#tocNav');
            const navRect = nav.getBoundingClientRect();
            const itemRect = active.getBoundingClientRect();
            if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
                active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    // ── Event wiring ───────────────────────────────────────────
    function wireEvents() {
        // Topbar
        $('#btnToc').addEventListener('click', openToc);
        $('#btnCloseToc').addEventListener('click', closeToc);
        $('#tocOverlay').addEventListener('click', closeToc);

        $('#btnSettings').addEventListener('click', openSettings);
        $('#btnCloseSettings').addEventListener('click', closeSettings);
        $('#settingsOverlay').addEventListener('click', closeSettings);

        $('#btnShare').addEventListener('click', () => openShare(state.currentChapter));
        $('#fabShare').addEventListener('click', () => openShare(state.currentChapter));
        $('#btnCloseShare').addEventListener('click', closeShare);
        $('#shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') closeShare();
        });

        $('#btnAudio').addEventListener('click', () => {
            if (state.currentChapter && state.currentChapter !== 'hero') {
                startChapterAudio(state.currentChapter);
            } else {
                // Start chapter 1 if at hero
                startChapterAudio('ch1');
                // Scroll to ch1
                document.getElementById('ch1')?.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Audio bar controls
        $('#audioPlay').addEventListener('click', () => {
            if (state.audio.isPlaying) {
                if (EBOOK_TTS.isPaused) {
                    EBOOK_TTS.resume();
                    setAudioPlayIcon(true);
                } else {
                    EBOOK_TTS.pause();
                    setAudioPlayIcon(false);
                }
            } else if (EBOOK_TTS.currentChapter) {
                EBOOK_TTS.resume();
                setAudioPlayIcon(true);
            }
        });
        $('#audioStop').addEventListener('click', stopAudio);
        $('#audioSpeed').addEventListener('change', (e) => {
            state.audio.speed = parseFloat(e.target.value);
            EBOOK_TTS.setSpeed(state.audio.speed);
        });
        $('#audioProgress').addEventListener('click', (e) => {
            // Visual feedback only — Web Speech API doesn't support seek
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            updateAudioProgress(pct);
        });

        // Share buttons
        $$('.share-btn[data-share]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.share;
                if (platform === 'copy') {
                    const ok = await EBOOK_SHARE.copyLink();
                    btn.querySelector('span').textContent = ok ? 'কপি হয়েছে!' : 'ব্যর্থ';
                    setTimeout(() => btn.querySelector('span').textContent = 'লিঙ্ক কপি', 1500);
                } else {
                    await EBOOK_SHARE.share(platform, { chapter: state.currentChapter });
                }
            });
        });
        $('#btnCopyLink').addEventListener('click', async () => {
            const ok = await EBOOK_SHARE.copyLink();
            $('#btnCopyLink').textContent = ok ? '✓ কপি হয়েছে' : '✗ ব্যর্থ';
            setTimeout(() => $('#btnCopyLink').textContent = 'কপি', 1500);
        });

        // Hero buttons
        $('#btnHeroStart').addEventListener('click', () => {
            document.getElementById('ch1')?.scrollIntoView({ behavior: 'smooth' });
            closeToc();
        });
        $('#btnHeroListen').addEventListener('click', () => {
            startChapterAudio('ch1');
            document.getElementById('ch1')?.scrollIntoView({ behavior: 'smooth' });
        });
        $('#btnHeroShare').addEventListener('click', () => openShare(null));
        $('#btnStartReading').addEventListener('click', () => {
            closeToc();
            document.getElementById('ch1')?.scrollIntoView({ behavior: 'smooth' });
        });

        // End buttons
        $('#btnEndShare').addEventListener('click', () => openShare(null));
        $('#btnEndRestart').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Settings: theme
        $$('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.settings.theme = btn.dataset.theme;
                localStorage.setItem('ebook-theme', state.settings.theme);
                applySettings();
            });
        });
        // Settings: font
        $$('.font-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.settings.font = btn.dataset.font;
                localStorage.setItem('ebook-font', state.settings.font);
                applySettings();
            });
        });
        // Settings: font size
        $('#fontSizeRange').addEventListener('input', (e) => {
            state.settings.fontSize = parseInt(e.target.value, 10);
            localStorage.setItem('ebook-fontsize', state.settings.fontSize);
            applySettings();
        });
        $('#btnFontInc').addEventListener('click', () => {
            state.settings.fontSize = Math.min(24, state.settings.fontSize + 1);
            localStorage.setItem('ebook-fontsize', state.settings.fontSize);
            applySettings();
        });
        $('#btnFontDec').addEventListener('click', () => {
            state.settings.fontSize = Math.max(14, state.settings.fontSize - 1);
            localStorage.setItem('ebook-fontsize', state.settings.fontSize);
            applySettings();
        });
        // Settings: line height
        $('#lineHeightRange').addEventListener('input', (e) => {
            state.settings.lineHeight = parseInt(e.target.value, 10) / 100;
            localStorage.setItem('ebook-lineheight', e.target.value);
            applySettings();
        });

        // TOC item clicks (smooth scroll + close sidebar)
        document.addEventListener('click', (e) => {
            const tocItem = e.target.closest('.toc-item');
            if (tocItem) {
                e.preventDefault();
                const target = tocItem.dataset.target;
                closeToc();
                setTimeout(() => {
                    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
                    history.replaceState(null, '', '#' + target);
                }, 200);
            }
        });

        // Scroll
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignore when typing in inputs
            if (e.target.matches('input, textarea, select')) return;
            switch (e.key) {
                case 'Escape':
                    if ($('#shareModal').classList.contains('visible')) closeShare();
                    else if ($('#tocSidebar').classList.contains('open')) closeToc();
                    else if ($('#settingsPanel').classList.contains('open')) closeSettings();
                    break;
                case 'm':
                case 'M':
                    if (!$('#tocSidebar').classList.contains('open')) openToc();
                    else closeToc();
                    break;
                case 's':
                case 'S':
                    if (!$('#settingsPanel').classList.contains('open')) openSettings();
                    else closeSettings();
                    break;
                case 't':
                case 'T':
                    if (state.currentChapter && state.currentChapter !== 'hero') {
                        startChapterAudio(state.currentChapter);
                    }
                    break;
            }
        });
    }

    // ── Init ───────────────────────────────────────────────────
    function init() {
        renderBook();
        renderToc();
        applySettings();
        wireEvents();
        onScroll();

        // Open chapter from URL hash
        const hash = window.location.hash.slice(1);
        if (hash) {
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 400);
        }

        // Pre-warm TTS voices
        if (window.EBOOK_TTS) EBOOK_TTS.init();

        console.log('%c📖 স্বশিক্ষা ও স্বনির্ভরতার কৃষি — ই-বুক পাঠক', 'color:#145A32;font-weight:bold;font-size:14px');
        console.log('Shortcuts: M=সূচিপত্র · S=সেটিংস · T=শুনুন · Esc=বন্ধ');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
