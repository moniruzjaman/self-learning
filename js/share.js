/* ============================================================
   Share module — cross-platform sharing with rich previews
   WhatsApp · Messenger · Facebook · LinkedIn · X/Twitter
   Email · Telegram · Copy link · Native Web Share API
   ============================================================ */

(function () {
    const SHARE = {
        url:   'https://moniruzjaman.github.io/self-learning/',
        title: 'স্বশিক্ষা ও স্বনির্ভরতার কৃষি — বাংলা ই-বুক',
        text:  'একজন কৃষকের জ্ঞান-যাত্রার গল্প। পড়ুন, শুনুন, শেয়ার করুন।',
        hashtags: ['কৃষি', 'স্বশিক্ষা', 'স্বনির্ভরতা', 'বাংলা', 'agriculture', 'selflearning'],

        buildUrl(platform) {
            const u = encodeURIComponent(this.url);
            const t = encodeURIComponent(this.title);
            const tx = encodeURIComponent(this.text);
            const ht = this.hashtags.join(',');
            switch (platform) {
                case 'whatsapp':
                    // WhatsApp uses text param for combined message
                    return `https://wa.me/?text=${encodeURIComponent(this.title + '\n' + this.text + '\n' + this.url)}`;
                case 'messenger':
                    // Messenger uses app_id (required) + link + redirect_uri
                    // Using Facebook's default share endpoint as fallback
                    return `https://www.facebook.com/dialog/send?app_id=145634995501895&display=popup&link=${u}&redirect_uri=${u}`;
                case 'facebook':
                    return `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
                case 'linkedin':
                    return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
                case 'twitter':
                    return `https://twitter.com/intent/tweet?url=${u}&text=${encodeURIComponent(this.title + ' — ' + this.text)}&hashtags=${ht}`;
                case 'telegram':
                    return `https://t.me/share/url?url=${u}&text=${encodeURIComponent(this.title)}`;
                case 'email':
                    return `mailto:?subject=${t}&body=${encodeURIComponent(this.text + '\n\n' + this.url)}`;
                default:
                    return this.url;
            }
        },

        openPopup(url, w = 600, h = 600) {
            const left = (screen.width / 2) - (w / 2);
            const top  = (screen.height / 2) - (h / 2) - 50;
            return window.open(url, '_blank',
                `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,resizable=yes,scrollbars=yes`);
        },

        async copyLink() {
            try {
                await navigator.clipboard.writeText(this.url);
                return true;
            } catch (e) {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = this.url;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                let ok = false;
                try {
                    ok = document.execCommand('copy');
                } catch (_) {}
                document.body.removeChild(ta);
                return ok;
            }
        },

        async nativeShare() {
            if (!navigator.share) return false;
            try {
                await navigator.share({
                    title: this.title,
                    text: this.text,
                    url: this.url,
                    // files: [...]  // could attach og image if needed
                });
                return true;
            } catch (e) {
                if (e.name === 'AbortError') return true;
                console.warn('Native share failed:', e);
                return false;
            }
        },

        async share(platform, opts = {}) {
            // Update URL with chapter hash if specified
            if (opts.chapter) {
                this.url = `https://moniruzjaman.github.io/self-learning/#${opts.chapter}`;
            } else {
                this.url = 'https://moniruzjaman.github.io/self-learning/';
            }

            switch (platform) {
                case 'whatsapp':
                case 'messenger':
                case 'facebook':
                case 'linkedin':
                case 'twitter':
                case 'telegram':
                    this.openPopup(this.buildUrl(platform));
                    return true;
                case 'email':
                    // Email opens user's mail client — use location.href
                    window.location.href = this.buildUrl('email');
                    return true;
                case 'copy':
                    return await this.copyLink();
                case 'native':
                    return await this.nativeShare();
                default:
                    return false;
            }
        },

        isNativeSupported() {
            return !!navigator.share;
        }
    };

    window.EBOOK_SHARE = SHARE;
})();
