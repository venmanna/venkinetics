/**
 * Apex Pulse - PWA Lifecycle & Installation Manager
 */

export class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
  }

  init() {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.isInstalled = true;
      document.body.classList.add('is-installed-app');
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((reg) => {
            console.log('[Apex Pulse PWA] Service Worker active, scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[Apex Pulse PWA] Service Worker registration:', err);
          });
      });
    }

    // Capture install prompt for Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('btn-pwa-install-header');
      const installCard = document.getElementById('pwa-install-banner');
      if (installBtn) installBtn.classList.remove('hidden');
      if (installCard) installCard.classList.remove('hidden');
    });

    // Handle install prompt click
    const installBtns = document.querySelectorAll('.btn-trigger-pwa-install');
    installBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.promptInstall());
    });

    // Detect iOS to show iOS Add to Home Screen instructions
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos && !this.isInstalled) {
      const iosGuide = document.getElementById('ios-install-guide');
      if (iosGuide) iosGuide.classList.remove('hidden');
    }
  }

  async promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('[Apex Pulse PWA] User accepted installation');
        const installCard = document.getElementById('pwa-install-banner');
        if (installCard) installCard.classList.add('hidden');
      }
      this.deferredPrompt = null;
    } else {
      // If prompt not available (e.g. iOS or manual)
      const modal = document.getElementById('modal-install-help');
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      }
    }
  }
}
