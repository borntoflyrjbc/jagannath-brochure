# 📖 भगवान जगन्नाथ समाचार पत्र — 3D डिजिटल ई-समाचार पत्र एवं विवरणिका

> **लाइव प्रोडक्शन वेबसाइट**: [https://jaijagannathmisiion.dpdns.org/](https://jaijagannathmisiion.dpdns.org/)  
> **Vercel प्रोडक्शन**: [https://jagannath-brochure.vercel.app/](https://jagannath-brochure.vercel.app/)  
> **GitHub रिपॉजिटरी**: [https://github.com/borntoflyrjbc/jagannath-brochure](https://github.com/borntoflyrjbc/jagannath-brochure)

---

## ⚡ मुख्य विशेषताएं (Key Architecture)
1. **सीनियर-फ्रेंडली अल्ट्रा-शार्प फॉन्ट (Senior-Friendly Readability)**:
   - अखबार के छोटे देवनागरी अक्षरों को बुजुर्ग पाठकों के लिए स्पष्ट रखने हेतु मोबाइल रेजोल्यूशन **1350×1890 px** रखा गया है।
   - फॉन्ट पर **Unsharp-Masking Filter (radius 1.0, 125% contrast)** लगाया गया है जिससे बिना ज़ूम किए भी हर मात्रा और पूर्ण विराम स्पष्ट दिखता है।
2. **1.95× मैग्निफिकेशन ज़ूम & पैन (Double-Tap & Toolbar 🔍)**:
   - फोन पर स्क्रीन पर कहीं भी डबल-टैप करने या टूलबार में 🔍 आइकन दबाने पर 1.95× मैग्निफिकेशन सक्रिय होता है।
   - ज़ूम स्थिति में ड्रैग/पैन करके किसी भी कॉलम को आसानी से पढ़ा जा सकता है और पेज गलती से नहीं पलटता।
3. **ज़ीरो-लैग डुअल प्रीलोड (Zero-Blank Dual-Page Preloading)**:
   - पेज 1 और पेज 2 दोनों बैकग्राउंड मेमोरी में 100% लोड होने के बाद ही प्रीलोडर हटता है।
   - इससे पहले पन्ने को पलटते ही पेज 2 **0ms (बिना किसी सफेद स्क्रीन के)** तुरंत दिखाई देता है।
4. **WhatsApp 16:9 कस्टम थंबनेल**:
   - `assets/og-preview.jpg` (1200×675 px, 282 KB, < 300 KB WhatsApp limit)।
   - WhatsApp पर शेयर करते समय टाइटल स्ट्रिक्टली: **भगवान जगन्नाथ समाचार पत्र -1** आता है।
5. **ऑडियो वातावरण**:
   - शांत बांसुरी बीजीएम लूप (35s, 0.25 वॉल्यूम) + टॉप-राइट "संगीत" टॉगल।
   - पन्ना पलटने पर Web Audio API से सिंथेसाइज़्ड ऑर्गेनिक पेपर रस्टल साउंड।

---

## 🛠️ नया अंक (Next Edition) कैसे अपलोड करें:

भविष्य में अंक 2 या नया पेपर आने पर:

1. **नए पेपर्स रखें**:
   - नए पेपर्स को किसी फ़ोल्डर (जैसे `Downloads/PAPER-2/`) में 01 से 08 के क्रम में रखें।
2. **कन्वर्जन स्क्रिप्ट चलाएं**:
   ```bash
   python "C:\Users\MY PC\.gemini\antigravity-ide\scratch\make_ultra_sharp_pages.py"
   ```
   (यह अपने आप 1350×1890 मोबाइल और 1800×2520 डेस्कटॉप वेबपी फाइलें बना देगा)।
3. **थंबनेल और टाइटल अपडेट करें**:
   - नया थंबनेल `assets/og-preview.jpg` में सेव करें (1200×675 px, < 300 KB)।
   - `index.html` और `config.js` में टाइटल (जैसे `भगवान जगन्नाथ समाचार पत्र -2`) और `?v=...` कैश बस्टर बदलें।
4. **GitHub पर पुश करें**:
   ```bash
   cd "C:\Users\MY PC\.gemini\antigravity-ide\scratch\flipbook"
   git add .
   git commit -m "Publish Edition 2"
   git push origin main
   ```
   *Vercel और डिजिटलप्लेट डोमेन 60 सेकंड में अपने आप लाइव हो जाएंगे!*

---

## 📂 बैकअप और सुरक्षित स्टोरेज
* **पुराना ब्रोशर बैकअप**: `D:\Backup\flipbook-old-jaijagannathmission-backup`
* **अंक 1 सम्पूर्ण बैकअप**: `D:\Backup\flipbook-epaper-edition-1-backup`
* **क्रेडेंशियल वॉल्ट**: `CREDENTIALS.md`
