# স্বশিক্ষা ও স্বনির্ভরতার কৃষি — বাংলা ই-বুক

> একজন কৃষকের জ্ঞান-যাত্রার গল্প।
> ইন্টারঅ্যাক্টিভ ও অ্যাকশন-ওরিয়েন্টেড ওপেন অ্যাক্সেস ই-বুক।

[![License: Open](https://img.shields.io/badge/license-open%20access-success)](LICENSE)
[![Language: Bengali](https://img.shields.io/badge/language-Bengali-blue)]()
[![Format: Web](https://img.shields.io/badge/format-web%20ebook-orange)]()

একটি সম্পূর্ণ ফিচার-সমৃদ্ধ বাংলা ই-বুক — পড়ুন, শুনুন, শেয়ার করুন। এই রিপোজিটরি GitHub Pages-এ হোস্ট করা একটি স্ট্যাটিক ওয়েব ই-বুক রিডার ধারণ করে।

---

## ✨ ফিচার

### 📖 পড়ার ফিচার
- **রেসপন্সিভ রিডার** — মোবাইল, ট্যাবলেট, ডেস্কটপে সমানভাবে কাজ করে
- **৩টি থিম** — দিন (light) · সেপিয়া · রাত (night)
- **২টি ফন্ট পরিবার** — Noto Serif Bengali (সেরিফ) · Noto Sans Bengali (স্যান্স)
- **সমন্বয়যোগ্য ফন্ট আকার** — ১৪px থেকে ২৪px
- **লাইন উচ্চতা নিয়ন্ত্রণ** — ১.৪ থেকে ২.২
- **সেটিংস স্থায়ী** — localStorage এ সংরক্ষিত, পরবর্তী ভিজিটে বজায় থাকে
- **পঠন প্রগ্রেস বার** — কতটা পড়েছেন তার ভিজ্যুয়াল ইন্ডিকেটর
- **অধ্যায় স্ক্রল-স্পাই** — স্ক্রল করলে স্বয়ংক্রিয়ভাবে TOC আপডেট হয়
- **ড্রপ-ক্যাপ** — প্রতিটি অধ্যায়ের প্রথম অক্ষর বড় সাজানো

### 🎧 শোনার ফিচার (Text-to-Speech)
- **ব্রাউজার-নেটিভ Web Speech API** — কোনো সার্ভার বা API কল নেই
- **বাংলা ভয়েস অটো-ডিটেকশন** — bn-BD / bn-IN ভয়েস খুঁজে নেয়
- **প্লে / পজ / স্টপ কন্ট্রোল**
- **গতি নিয়ন্ত্রণ** — ০.৭৫× থেকে ২×
- **প্রগ্রেস ইন্ডিকেটর** — অধ্যায়ের কত শতাংশ শোনা হয়েছে
- **প্রতিটি অধ্যায়ের জন্য আলাদা অডিও** — অধ্যায় অনুযায়ী শুনুন

### 🔗 শেয়ারিং ফিচার (মেটা-অপটিমাইজড)
- **WhatsApp** — বইয়ের শিরোনাম + বর্ণনা + লিঙ্ক একসাথে
- **Facebook Messenger** — rich preview সহ
- **Facebook** — og:image দিয়ে large preview
- **LinkedIn** — professional preview card
- **X / Twitter** — twitter:card summary_large_image
- **Email** — pre-filled subject + body
- **Telegram** — share/url endpoint
- **Copy link** — clipboard এ কপি
- **Native Web Share API** — মোবাইলে OS-লেভেল শেয়ার শিট
- **প্রতিটি প্ল্যাটফর্মে একই OG ইমেজ** (1200×630) — ব্র্যান্ড কনসিস্টেন্সি

### 📱 প্রোগ্রেসিভ ওয়েব অ্যাপ
- **Installable** — হোম স্ক্রিনে ইনস্টল করা যায়
- **Offline-friendly** — একবার লোড হলে অফলাইনে পড়া যায় (with service worker, future)
- **Apple Touch Icon + Android theme color**
- **Web App Manifest**

### 📚 বইয়ের কাঠামো
- **প্রচ্ছদ** — full-bleed gradient hero
- **৬টি অধ্যায়** — গল্প + ব্যাখ্যা + তুলনামূলক ছক
- **ইন্টারঅ্যাক্টিভ সেকশন** — ৩টি কুইজ + ৭ দিনের কর্মপরিকল্পনা + ফাঁকা জমির ডায়েরি
- **কৃষি-শব্দকোষ** — ১০টি মূল পরিভাষার সংজ্ঞা
- **আরও পড়ার সূত্র** — বই, ওয়েবসাইট, সংস্থা
- **বই সম্পর্কে** — উদ্দেশ্য ও ব্যবহারপদ্ধতি

### ♿ অ্যাক্সেসিবিলিটি
- **সিম্যান্টিক HTML** — proper headings, sections, ARIA labels
- **কীবোর্ড নেভিগেশন** — `M` = TOC, `S` = Settings, `T` = TTS, `Esc` = Close
- **Skip-to-content** — logical tab order
- **High contrast** — সব থিমে WCAG AA কমপ্লায়েন্ট
- **Screen reader friendly**

### 🔍 SEO / Rich Snippets
- **JSON-LD Book schema** — Google-এ রিচ রেজাল্ট
- **Open Graph tags** — সব সোশ্যাল প্ল্যাটফর্মে প্রিভিউ
- **Twitter Card** — X / Twitter-এ large image card
- **Canonical URL**
- **Multilingual og:locale** — bn-BD, bn-IN, en-US

---

## 🚀 GitHub Pages এ ডেপ্লয় করুন

এই রিপোজিটরি GitHub-এ পুশ করার পর:

1. **GitHub-এ যান** → `moniruzjaman/self-learning` রিপোজিটরি
2. **Settings** → **Pages** (বাম সাইডবারে)
3. **Source:** `Deploy from a branch`
4. **Branch:** `main` / **Folder:** `/ (root)`
5. **Save** ক্লিক করুন

১-২ মিনিটের মধ্যে আপনার ই-বুক লাইভ হবে:

```
https://moniruzjaman.github.io/self-learning/
```

---

## 🛠️ লোকালি চালান

এই রিপোজিটরি ক্লোন করুন এবং যেকোনো স্ট্যাটিক সার্ভার দিয়ে চালান:

```bash
git clone https://github.com/moniruzjaman/self-learning.git
cd self-learning

# Python দিয়ে
python3 -m http.server 8000

# অথবা Node দিয়ে
npx serve .

# অথবা শুধু index.html খুলুন (কিছু ফিচার সীমিত থাকতে পারে)
```

তারপর ব্রাউজারে যান: `http://localhost:8000`

---

## 📁 ফাইল কাঠামো

```
self-learning/
├── index.html              # মেইন রিডার পেজ
├── og-image.png            # 1200×630 social preview (PNG, মূল)
├── og-image.jpg            # 1200×630 social preview (JPG, অপটিমাইজড)
├── og-image.html           # OG ইমেজের সোর্স
├── favicon.png             # 32×32 favicon
├── apple-touch-icon.png    # 180×180 iOS icon
├── manifest.webmanifest    # PWA manifest
├── README.md               # এই ফাইল
│
├── css/
│   └── reader.css          # সব স্টাইল (theme, layout, components)
│
├── js/
│   ├── content.js          # বইয়ের সম্পূর্ণ টেক্সট + মেটাডেটা
│   ├── tts.js              # Text-to-Speech ইঞ্জিন (Web Speech API)
│   ├── share.js            # ক্রস-প্ল্যাটফর্ম শেয়ারিং মডিউল
│   └── reader.js           # মেইন কন্ট্রোলার (events, rendering, state)
│
└── assets/
    ├── NotoSerifBengali-Regular.ttf   # বডি ফন্ট
    └── NotoSansBengali-Regular.ttf    # হেডিং ফন্ট
```

---

## 🎨 ডিজাইন সিস্টেম

### রং
| ভূমিকা | রং | Hex |
|--------|-----|-----|
| Primary | গাঢ় সবুজ | `#145A32` |
| Primary-2 | মাঝারি সবুজ | `#1E8449` |
| Accent | হারভেস্ট গোল্ড | `#B7950B` |
| Paper (Day) | ক্রিম | `#FBFAF6` |
| Paper (Sepia) | সেপিয়া | `#F4ECD8` |
| Paper (Night) | গাঢ় নীল-কালো | `#1A1F2E` |

### টাইপোগ্রাফি
- **Body:** Noto Serif Bengali (scholarly, readable)
- **Headings:** Noto Sans Bengali (modern, bold)
- **Base size:** 17px (user-adjustable 14-24px)
- **Line height:** 1.8 (user-adjustable 1.4-2.2)

---

## 📲 শেয়ারিং গাইড

### WhatsApp-এ শেয়ার করলে যা দেখাবে
- বইয়ের শিরোনাম
- সংক্ষিপ্ত বর্ণনা
- OG ইমেজ (1200×630 প্রিভিউ)
- ক্লিকযোগ্য লিঙ্ক

### Facebook-এ শেয়ার করলে
- Large image preview
- Title + description
- Site name attribution

### LinkedIn-এ শেয়ার করলে
- Professional card layout
- 1200×630 image
- Article metadata

### X / Twitter-এ শেয়ার করলে
- Summary with large image card
- Hashtags (কৃষি, স্বশিক্ষা, স্বনির্ভরতা, agriculture, selflearning)

---

## 🔧 কাস্টমাইজেশন

### রং বদলান
`css/reader.css` এ `:root` ব্লকে CSS variables এডিট করুন।

### নতুন অধ্যায় যোগ করুন
`js/content.js` এ `EBOOK_CONTENT.chapters` array তে নতুন অবজেক্ট যোগ করুন।

### শেয়ার মেসেজ বদলান
`js/share.js` এ `SHARE` অবজেক্টের `title`, `text`, `hashtags` পরিবর্তন করুন।

### OG ইমেজ রি-জেনারেট করুন
`og-image.html` এডিট করে `scripts/render_og_image.js` দিয়ে রি-রেন্ডার করুন।

---

## 📄 লাইসেন্স

এই ই-বুকটি শিক্ষার্থী, কৃষক ও সম্প্রসারণ কর্মীদের জন্য বিনামূল্যে বিতরণযোগ্য। বাণিজ্যিক উদ্দেশ্যে ছাপা বা বিক্রি ছাড়া অন্য যেকোনো কাজে ব্যবহার করা যাবে।

সোর্স কোড (HTML/CSS/JS) MIT লাইসেন্সের অধীনে।

---

## 🙏 কৃতজ্ঞতা

- **Noto Serif Bengali** ও **Noto Sans Bengali** ফন্ট — Google Fonts Project
- **Web Speech API** — W3C standard for browser-native TTS
- **Paged.js** — CSS Paged Media polyfill (used in PDF version)
- সব কৃষক, যাঁরা ভোরের আলোয় মাঠে নামেন

---

## 📞 যোগাযোগ

- **রিপোজিটরি:** [github.com/moniruzjaman/self-learning](https://github.com/moniruzjaman/self-learning)
- **লাইভ সাইট:** [moniruzjaman.github.io/self-learning](https://moniruzjaman.github.io/self-learning/)

---

<div align="center">

**একটি খাতা, একটি কলম, একটি প্রশ্ন দিয়ে শুরু হয় স্বনির্ভরতা।**

</div>
