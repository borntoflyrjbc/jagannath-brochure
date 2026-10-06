/**
 * SINGLE SOURCE OF TRUTH — FLIPBOOK CONFIGURATION
 * E-Paper Edition: जय जगन्नाथ — जन-जन की आस्था, समाज की आवाज
 * Dr. Purshottam Tiwari | Jai Jagannath Mission International
 */
window.FLIPBOOK_CONFIG = {
  brand: {
    name: 'JAI JAGANNATH MISSION',
    tagline: 'ई-समाचार पत्र • भगवान जगन्नाथ चेतना और मानसिक स्वास्थ्य',
    logo: 'assets/brand/logo.svg',
    showBrandLogo: true,
    logoPosition: 'top-left',
    accentColor: '#D97706',
    backgroundColor: '#070709'
  },
  book: {
    aspectRatio: 1286 / 1800, // ~0.7144 ratio (Matches exact paper pages)
    hardCovers: true,         // First and last pages get data-density="hard"
    flippingTime: 520,        // Natural smooth page turn speed
    openIntro: true
  },
  share: {
    title: 'भगवान जगन्नाथ समाचार पत्र -1',
    text: 'भगवान जगन्नाथ समाचार पत्र -1',
    whatsappCaption: 'भगवान जगन्नाथ समाचार पत्र -1'
  },
  zoom: {
    min: 1,
    max: 2.5,
    step: 0.5
  },
  pages: [
    { desktop: 'assets/pages/page-1.webp', mobile: 'assets/pages/mobile/page-1.webp', alt: 'मुखपृष्ठ - जय जगन्नाथ ई-समाचार पत्र (वर्ष 01, अंक 01)' },
    { desktop: 'assets/pages/page-2.webp', mobile: 'assets/pages/mobile/page-2.webp', alt: 'पृष्ठ 2 - दवा मन को दबाती है, चेतना मन को बदलती है (अध्याय 6 से 15)' },
    { desktop: 'assets/pages/page-3.webp', mobile: 'assets/pages/mobile/page-3.webp', alt: 'पृष्ठ 3 - महाप्रभु का महाअभियान — जगन्नाथ पुरी में है समस्या का समाधान' },
    { desktop: 'assets/pages/page-4.webp', mobile: 'assets/pages/mobile/page-4.webp', alt: 'पृष्ठ 4 - डॉ. पुरुषोत्तम तिवारी की सर्वश्रेष्ठ पुस्तकें (भाग 1)' },
    { desktop: 'assets/pages/page-5.webp', mobile: 'assets/pages/mobile/page-5.webp', alt: 'पृष्ठ 5 - सर्वश्रेष्ठ पुस्तकें एवं साहित्यिक संकल्प' },
    { desktop: 'assets/pages/page-6.webp', mobile: 'assets/pages/mobile/page-6.webp', alt: 'पृष्ठ 6 - मन संवाद साधना शिविर — तीन दिवसीय कार्यक्रम' },
    { desktop: 'assets/pages/page-7.webp', mobile: 'assets/pages/mobile/page-7.webp', alt: 'पृष्ठ 7 - जय जगन्नाथ मिशन अन्तर्राष्ट्रीय — परिचय एवं दर्शन' },
    { desktop: 'assets/pages/page-8.webp', mobile: 'assets/pages/mobile/page-8.webp', alt: 'अंतिम पृष्ठ - भगवान जगन्नाथ चेतना का भव्य आगाज (विमोचन समाचार)' }
  ]
};
