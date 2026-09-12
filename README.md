# 📖 Premium 3D Flipbook (WhatsApp-First, Static, PDF→Images Pipeline)

A zero-build, ultra-fast static web app presenting a **digital brochure as a realistic 3D flipbook** with real page-curl physics, ambient lighting, and instant loading on mobile networks.

Built specifically to perform flawlessly inside **WhatsApp's in-app browser (Android WebView & iOS Safari View)** and on modern desktop browsers.

---

## 1. What This Is
- **Realistic 3D Page Flip:** Physics-driven 3D page curl powered by `StPageFlip` (`page-flip` v2.0.7) with hard front & back covers.
- **WhatsApp-First Link Previews:** Pre-configured with raw Open Graph tags so WhatsApp, Telegram, Facebook, and LinkedIn show a rich preview card with image, title, and description before opening.
- **Zero Build Step:** 100% pure vanilla HTML5, CSS3, and modern JavaScript. No Node.js build, no React, no bundler. Double-click `index.html` to run locally via `file://`.
- **Lightweight & Fast:** Entire initial load payload is under ~200 KB; full brochure loads in under 2 seconds on Indian 4G.
- **Single Source of Truth:** All branding, colors, pages, and behavior are configured in a single file: `config.js`.

---

## 2. Replacing the Pages
The brochure pages are stored as optimized `.webp` images in two resolutions for responsive loading:

| Variant | Folder Path | Dimensions / Long Edge | Target Size |
|---|---|---|---|
| **Desktop** | `assets/pages/page-N.webp` | 1600px long edge | 150–350 KB |
| **Mobile** | `assets/pages/mobile/page-N.webp` | 1100px long edge | 80–180 KB |

- **Naming format:** `page-1.webp`, `page-2.webp`, ... `page-N.webp`
- **Aspect ratio:** 3:4 portrait (0.75) or A4 portrait (0.7067). Maintain uniform aspect ratio across all pages.
- **Max payload:** Keep total bundle under 2.5 MB for instant mobile loading.

---

## 3. How to Convert a New PDF to Images

### Path A (Primary) — Browser-Based Exporter (No installation needed)
1. Double-click `tools/pdf-to-images.html` to open it in Google Chrome or any modern browser.
2. Drag and drop your new PDF brochure into the drop zone (conversion is 100% private and client-side; no file is uploaded anywhere).
3. The tool renders every page on a white canvas to avoid black transparency bugs.
4. Click **Download Desktop Set** and **Download Mobile Set** to sequentially save all `.webp` files into your `Downloads` folder.
5. Move the desktop files into `assets/pages/` and the mobile files into `assets/pages/mobile/`.
6. Copy the auto-generated `pages: [...]` code snippet printed at the bottom into `config.js`.

### Path B (Power Users) — CLI Script via Bash
If you have `poppler-utils` (`pdftoppm`) and `cwebp` installed:
```bash
cd tools/
chmod +x convert.sh
./convert.sh path/to/brochure.pdf
```
*(ImageMagick alternative commands are included in comments inside `convert.sh`)*.

### Path C (Architectural Seam — Future In-App PDF Mode)
`config.js` and `script.js` are cleanly decoupled from the asset source. If in the future you wish to render PDFs directly on client devices, you can dynamically populate the `config.pages[]` array from a `loadPagesFromPdf(url)` routine yielding blob URLs, feeding directly into the existing `generatePagesDOM()` and `loadFromHTML()` pipeline without altering the flipbook engine.

---

## 4. Customizing Branding
Open `config.js` to change any setting:

```javascript
window.FLIPBOOK_CONFIG = {
  brand: {
    name: 'YOUR BRAND NAME',
    tagline: 'Your Tagline Here',
    logo: 'assets/brand/logo.svg',       // Brand logo path
    showBrandLogo: true,                 // Set false to hide
    logoPosition: 'top-left',            // 'top-left' | 'top-center'
    accentColor: '#D97706',              // Primary brand accent (Gold/Amber)
    backgroundColor: '#0B0B0D'          // Luxury dark stage background
  },
  book: {
    aspectRatio: 595 / 842,              // A4 (0.7067) or 3 / 4 (0.75)
    hardCovers: true,                    // Page 1 and Last Page as hard covers
    flippingTime: 620,                   // Flip animation duration in ms
    openIntro: true                      // Cover-lift preview animation
  },
  share: {
    title: 'Brochure Title',
    text: 'Check out our digital brochure',
    whatsappCaption: 'Take a look at our new brochure:'
  }
};
```
Branding colors and styles update instantly across the entire interface via CSS variables.

---

## 5. Changing Page Count
To add or remove pages:
1. Place the new `page-N.webp` files in `assets/pages/` and `assets/pages/mobile/`.
2. Update the `pages: [...]` array in `config.js`.
3. **Odd Page Count Handling:** StPageFlip requires an even number of pages for two-page spreads. If your brochure has an odd number of pages (e.g., 5, 7, 9), our runtime automatically appends a styled blank filler page in spread mode so that the back cover closes correctly. The counter will only display the real page count.

---

## 6. Updating the WhatsApp & Social Link Preview
When a link is shared on WhatsApp, WhatsApp's crawler inspects the raw HTML `<meta property="og:*">` tags.

1. **OG Image Format:** WhatsApp **does not support WebP** for link previews. Always use a standard **JPG** or **PNG** at **1200×630 pixels**, under 300 KB.
2. Replace `assets/og-preview.jpg` with your own 1200×630 image (or generate one using `tools/pdf-to-images.html`).
3. In `index.html`, replace all occurrences of `__SITE_URL__` with your live production URL (e.g., `https://yourbrand.vercel.app`).
4. **Cache Busting:** WhatsApp caches OG link previews aggressively. If you update the image after deploying, append `?v=2` to the image URL in `index.html`.

---

## 7. Deployment Guide — Vercel (Recommended, Free, 2 Minutes)
1. Push your flipbook repository to GitHub or upload the folder.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New** → **Project** → **Import** your repository.
4. Under Build & Development Settings:
   - **Framework Preset:** `Other`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** `./`
5. Click **Deploy**.
6. Copy your generated live URL (e.g., `https://brochure-3d.vercel.app`).
7. Open `index.html`, replace `__SITE_URL__` with your live domain, commit, and push.
8. Your brochure is ready to share on WhatsApp!

---

## 8. Deployment Alternatives — GitHub Pages & Netlify Drop

### GitHub Pages (Free)
1. Push the folder to a GitHub repository.
2. Go to **Settings** → **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/(root)`, then click **Save**.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.
5. Update `__SITE_URL__` in `index.html` with this URL.

### Netlify Drop (Instant Drag & Drop)
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `flipbook` folder directly into the browser window.
3. ⚠️ **Important Warning:** An unclaimed Netlify Drop site is temporary and is deleted after ~1 hour unless you log in and claim the site into an account. Always sign in to make the site permanent.

---

## 9. Troubleshooting & Edge Cases

- **WhatsApp preview card is not showing:**
  - Verify that `__SITE_URL__` in `index.html` was replaced with the real `https://` URL.
  - Verify that `assets/og-preview.jpg` is a real JPEG (not renamed WebP) and under 300 KB.
  - Test the URL on [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or LinkedIn Post Inspector.
- **Fullscreen button missing on iPhone / iOS Safari:**
  - iOS Safari on iPhone does not support the Element Fullscreen API. The app automatically detects this and transitions smoothly into **Immersive Mode** (auto-fading the toolbar and logo after 2.8s of inactivity, tapping reveals them).
- **CDN blocked on certain mobile networks:**
  - The site includes a multi-layer fallback. If jsDelivr CDN is blocked by an ISP, the site automatically detects `window.St` and injects `vendor/page-flip.browser.min.js` and `vendor/page-flip.css`.
  - If JavaScript is severely blocked or fails, the app automatically presents a clean, vertical-scrolling reading view (`fallback-viewer`).

---

## 10. License & Attributions
- **StPageFlip (`page-flip`):** MIT License. Copyright (c) 2020 Mikhail Sakhnyuk. Real 3D canvas/HTML page-curl physics.
- **PDF.js (`pdfjs-dist`):** Apache License 2.0. Copyright (c) Mozilla Foundation. Used exclusively inside the local offline dev tool (`tools/pdf-to-images.html`). Never shipped on the live website.
