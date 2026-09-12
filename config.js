/**
 * SINGLE SOURCE OF TRUTH — FLIPBOOK CONFIGURATION
 * All user-editable settings live here.
 * Adding/removing pages in pages[] updates the flipbook and counter automatically.
 */
window.FLIPBOOK_CONFIG = {
  brand: {
    name: 'JAI JAGANNATH MISSION',
    tagline: 'भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य',
    logo: 'assets/brand/logo.svg',
    showBrandLogo: true,
    logoPosition: 'top-left', // 'top-left' | 'top-center'
    accentColor: '#D97706',
    backgroundColor: '#0B0B0D'
  },
  book: {
    aspectRatio: 595 / 842, // A4 ratio (~0.7067) or 3 / 4 (0.75)
    hardCovers: true,       // First and last pages get data-density="hard"
    flippingTime: 620,      // Page turn speed in ms (450-650ms recommended)
    openIntro: true         // Non-blocking cover-lift intro animation
  },
  share: {
    title: 'जय जगन्नाथ मिशन अन्तर्राष्ट्रीय — भव्य आमंत्रण एवं विवरणिका',
    text: 'भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य — विशेष डिजिटल विवरणिका देखें।',
    whatsappCaption: 'जय जगन्नाथ! भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य कृति विमोचन समारोह की डिजिटल विवरणिका अवश्य देखें:'
  },
  zoom: {
    min: 1,
    max: 2.5,
    step: 0.5
  },
  pages: [
    { desktop: 'assets/pages/page-1.webp', mobile: 'assets/pages/mobile/page-1.webp', alt: 'मुखपृष्ठ - कृति विमोचन आमंत्रण' },
    { desktop: 'assets/pages/page-2.webp', mobile: 'assets/pages/mobile/page-2.webp', alt: 'पृष्ठ 2 - आमंत्रण एवं कार्यक्रम विवरण' },
    { desktop: 'assets/pages/page-3.webp', mobile: 'assets/pages/mobile/page-3.webp', alt: 'पृष्ठ 3 - महाप्रभु का महाअभियान' },
    { desktop: 'assets/pages/page-4.webp', mobile: 'assets/pages/mobile/page-4.webp', alt: 'पृष्ठ 4 - जगन्नाथ पुरी एक दिव्य अनुभव' },
    { desktop: 'assets/pages/page-5.webp', mobile: 'assets/pages/mobile/page-5.webp', alt: 'पृष्ठ 5 - आध्यात्मिक समूह से जुड़ें' },
    { desktop: 'assets/pages/page-6.webp', mobile: 'assets/pages/mobile/page-6.webp', alt: 'पृष्ठ 6 - उद्देश्य, सन्देश एवं संकल्प' },
    { desktop: 'assets/pages/page-7.webp', mobile: 'assets/pages/mobile/page-7.webp', alt: 'पृष्ठ 7 - अतिथिगण एवं श्री जगन्नाथ अर्जी पात्र' },
    { desktop: 'assets/pages/page-8.webp', mobile: 'assets/pages/mobile/page-8.webp', alt: 'अंतिम पृष्ठ - आयोजन समिति एवं भक्ति सन्देश' }
  ]
};
