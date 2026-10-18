/* ============================================================
   TTS — Browser-native SpeechSynthesis API for Bengali narration
   - Auto-detects Bengali voice (bn-IN / bn-BD)
   - Highlights text being read (boundary events)
   - Speed control, pause/resume/stop
   - Falls back gracefully if no Bengali voice installed
   ============================================================ */

(function () {
    const EBOOK_TTS = {
        synth: window.speechSynthesis,
        voices: [],
        bnVoice: null,
        currentChapter: null,
        currentChunks: [],
        currentChunkIndex: 0,
        currentSpeed: 1.0,
        isPlaying: false,
        isPaused: false,
        utterance: null,
        onProgress: null,
        onEnd: null,
        onStart: null,

        init() {
            if (!this.synth) {
                console.warn('SpeechSynthesis not supported');
                return false;
            }
            this.loadVoices();
            // Some browsers load voices async
            if (typeof this.synth.onvoiceschanged !== 'undefined') {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }
            return true;
        },

        loadVoices() {
            this.voices = this.synth.getVoices();
            // Prefer Bengali voice
            this.bnVoice =
                this.voices.find(v => /^bn(-|_)/i.test(v.lang)) ||
                this.voices.find(v => /bengali/i.test(v.name)) ||
                this.voices.find(v => /bn/i.test(v.lang)) ||
                null;
            console.log('TTS voices loaded:', this.voices.length, '| Bengali voice:', this.bnVoice ? this.bnVoice.name : 'NONE');
        },

        hasBengaliVoice() {
            return this.bnVoice !== null;
        },

        splitText(text) {
            // Bengali sentence enders: । ? ! ; and double newline
            const chunks = [];
            const parts = text.split(/(?<=[।?!;])\s+|\n\n+/);
            let cur = '';
            for (const p of parts) {
                if (!p.trim()) continue;
                if ((cur + ' ' + p).length > 200) {
                    if (cur) chunks.push(cur.trim());
                    cur = p;
                } else {
                    cur = cur ? cur + ' ' + p : p;
                }
            }
            if (cur) chunks.push(cur.trim());
            return chunks;
        },

        play(chapterId, text, opts = {}) {
            if (!this.synth) {
                alert('আপনার ব্রাউজারে Text-to-Speech সাপোর্ট নেই। অডিও ফিচার কাজ করবে না।');
                return;
            }
            this.stop();
            this.currentChapter = chapterId;
            this.currentSpeed = opts.speed || 1.0;
            this.currentChunks = this.splitText(text);
            this.currentChunkIndex = 0;
            this.isPlaying = true;
            this.isPaused = false;
            if (this.onStart) this.onStart(chapterId);
            this._speakNext();
        },

        _speakNext() {
            if (this.currentChunkIndex >= this.currentChunks.length) {
                this.isPlaying = false;
                if (this.onEnd) this.onEnd(this.currentChapter);
                return;
            }
            const chunk = this.currentChunks[this.currentChunkIndex];
            const u = new SpeechSynthesisUtterance(chunk);
            u.lang = 'bn-BD';
            if (this.bnVoice) u.voice = this.bnVoice;
            u.rate = this.currentSpeed;
            u.pitch = 1.0;
            u.volume = 1.0;

            u.onstart = () => {
                if (this.onProgress) {
                    this.onProgress({
                        chapterId: this.currentChapter,
                        chunkIndex: this.currentChunkIndex,
                        totalChunks: this.currentChunks.length,
                        text: chunk,
                        progress: (this.currentChunkIndex / this.currentChunks.length) * 100
                    });
                }
            };
            u.onend = () => {
                if (!this.isPlaying) return;
                this.currentChunkIndex++;
                this._speakNext();
            };
            u.onerror = (e) => {
                console.warn('TTS error:', e);
                // Skip to next chunk
                this.currentChunkIndex++;
                this._speakNext();
            };

            this.utterance = u;
            this.synth.speak(u);
        },

        pause() {
            if (this.synth && this.isPlaying && !this.isPaused) {
                this.synth.pause();
                this.isPaused = true;
            }
        },

        resume() {
            if (this.synth && this.isPaused) {
                this.synth.resume();
                this.isPaused = false;
            }
        },

        stop() {
            if (this.synth) this.synth.cancel();
            this.isPlaying = false;
            this.isPaused = false;
            this.currentChunkIndex = 0;
            this.utterance = null;
        },

        setSpeed(speed) {
            this.currentSpeed = speed;
            // If playing, restart current chunk with new speed
            if (this.isPlaying && !this.isPaused) {
                this.synth.cancel();
                this._speakNext();
            }
        },

        getState() {
            return {
                isPlaying: this.isPlaying,
                isPaused: this.isPaused,
                chapterId: this.currentChapter,
                chunkIndex: this.currentChunkIndex,
                totalChunks: this.currentChunks.length,
                progress: this.currentChunks.length > 0
                    ? (this.currentChunkIndex / this.currentChunks.length) * 100
                    : 0
            };
        }
    };

    window.EBOOK_TTS = EBOOK_TTS;
})();
