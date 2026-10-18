/* ============================================================
   Analytics — Google Analytics 4 event tracking
   ID: G-GJLZ04PSC1
   Tracks: page_view, chapter_read, reading_progress,
           tts_play, tts_pause, tts_complete,
           share_click, share_complete,
           quiz_attempt, action_plan_check,
           theme_change, font_change, settings_change,
           toc_open, external_link
   ============================================================ */

(function () {
    const GA_ID = 'G-GJLZ04PSC1';

    // ── Load GA4 script ────────────────────────────────────────
    function loadGA() {
        // Standard gtag.js loader
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());

        // Configure with Bengali locale & anonymize IP for privacy
        window.gtag('config', GA_ID, {
            'page_title': document.title,
            'language': 'bn-BD',
            'anonymize_ip': true,
            'allow_google_signals': true,
            'send_page_view': true  // auto page_view event
        });

        console.log('%c📊 GA4 analytics loaded', 'color:#1E8449;font-weight:bold', GA_ID);
    }

    // ── Event tracking helpers ─────────────────────────────────
    const EBOOK_ANALYTICS = {
        GA_ID: GA_ID,
        loaded: false,
        lastProgress: {},  // track last reported progress per chapter

        init() {
            if (this.loaded) return;
            loadGA();
            this.loaded = true;
        },

        /**
         * Send event to GA4.
         * @param {string} name - event name (snake_case, ≤40 chars)
         * @param {object} params - event parameters
         */
        event(name, params = {}) {
            if (typeof window.gtag !== 'function') {
                console.warn('gtag not loaded yet, event queued:', name);
                return;
            }
            // GA4 requires param values to be strings/numbers/booleans
            const clean = {};
            for (const [k, v] of Object.entries(params)) {
                if (v == null) continue;
                if (typeof v === 'object') v = JSON.stringify(v);
                clean[k] = v;
            }
            window.gtag('event', name, clean);
        },

        // ── Specific event helpers ────────────────────────────

        chapterRead(chapterId, chapterTitle) {
            this.event('chapter_read', {
                chapter_id: chapterId,
                chapter_title: chapterTitle,
                engagement_time_msec: 100
            });
        },

        readingProgress(chapterId, percent) {
            // Report 25/50/75/100 milestones only
            const milestones = [25, 50, 75, 100];
            const last = this.lastProgress[chapterId] || 0;
            for (const m of milestones) {
                if (percent >= m && last < m) {
                    this.event('reading_progress', {
                        chapter_id: chapterId,
                        progress_percent: m
                    });
                    this.lastProgress[chapterId] = m;
                    break;
                }
            }
        },

        ttsPlay(chapterId, chapterTitle) {
            this.event('tts_play', {
                chapter_id: chapterId,
                chapter_title: chapterTitle
            });
        },

        ttsPause(chapterId) {
            this.event('tts_pause', {
                chapter_id: chapterId
            });
        },

        ttsComplete(chapterId) {
            this.event('tts_complete', {
                chapter_id: chapterId
            });
        },

        shareClick(platform, chapterId) {
            this.event('share_click', {
                platform: platform,
                chapter_id: chapterId || 'none'
            });
        },

        shareComplete(platform) {
            this.event('share_complete', {
                platform: platform
            });
        },

        quizAttempt(questionNum, answer) {
            this.event('quiz_attempt', {
                question_number: questionNum,
                answer: answer
            });
        },

        actionPlanCheck(day) {
            this.event('action_plan_check', {
                day: day
            });
        },

        themeChange(theme) {
            this.event('theme_change', {
                theme: theme
            });
        },

        fontChange(font) {
            this.event('font_change', {
                font: font
            });
        },

        fontSizeChange(size) {
            this.event('font_size_change', {
                font_size: size
            });
        },

        lineHeightChange(height) {
            this.event('line_height_change', {
                line_height: height
            });
        },

        tocOpen() {
            this.event('toc_open', {});
        },

        tocNavigate(chapterId) {
            this.event('toc_navigate', {
                chapter_id: chapterId
            });
        },

        settingsOpen() {
            this.event('settings_open', {});
        },

        shareModalOpen(chapterId) {
            this.event('share_modal_open', {
                chapter_id: chapterId || 'none'
            });
        },

        externalLink(url) {
            this.event('external_link', {
                link_url: url
            });
        },

        searchEngine() {
            // Useful to detect when site is being indexed
            this.event('site_loaded', {
                referrer: document.referrer || 'direct',
                timestamp: Date.now()
            });
        }
    };

    window.EBOOK_ANALYTICS = EBOOK_ANALYTICS;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EBOOK_ANALYTICS.init());
    } else {
        EBOOK_ANALYTICS.init();
    }
})();
