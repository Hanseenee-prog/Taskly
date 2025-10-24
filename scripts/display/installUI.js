let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Utility: Detect if running as PWA
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

// Check if app was already installed
function isAppInstalled() {
  return localStorage.getItem('pwaInstalled') === 'true' || isInStandaloneMode();
}

function showInstallButton() {
  installBtn.classList.remove('hide-install');
  void installBtn.offsetWidth;
  installBtn.classList.add('show-install');
}

function hideInstallButton() {
  installBtn.classList.remove('show-install');
  void installBtn.offsetWidth;
  installBtn.classList.add('hide-install');
}

// Update install button visibility
function updateInstallButtonVisibility() {
  if (isAppInstalled()) {
    hideInstallButton();
  } else if (deferredPrompt) {
    showInstallButton();
  } else {
    // If no prompt yet, hide button (browser will show it when ready)
    hideInstallButton();
  }
}

// Listen for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Only show if not already installed
  if (!isAppInstalled()) {
    showInstallButton();
    console.log('✅ Install prompt available');
  }
});

// Handle install click
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return;
  }
  
  hideInstallButton();
  deferredPrompt.prompt();
  
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);
  
  if (outcome === 'accepted') {
    // Mark as installed
    localStorage.setItem('pwaInstalled', 'true');
    deferredPrompt = null;
    hideInstallButton();
    console.log('✅ User accepted installation');
  } else {
    // User declined, show button again after 10 seconds
    console.log('❌ User declined installation');
    setTimeout(() => {
      if (!isAppInstalled()) {
        showInstallButton();
      }
    }, 10000);
  }
});

// Once app is installed (native event)
window.addEventListener('appinstalled', () => {
  console.log('🎉 App successfully installed!');
  localStorage.setItem('pwaInstalled', 'true');
  deferredPrompt = null;
  hideInstallButton();
});

// On load — check installation state
window.addEventListener('load', () => {
  updateInstallButtonVisibility();
});

// Detect display-mode changes (switching between PWA and browser)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
  if (e.matches) {
    // Now in standalone mode (PWA)
    localStorage.setItem('pwaInstalled', 'true');
    hideInstallButton();
  } else {
    // Back in browser mode
    updateInstallButtonVisibility();
  }
});

// Detect if app was uninstalled (check periodically)
// This helps detect uninstallation
setInterval(() => {
  if (localStorage.getItem('pwaInstalled') === 'true' && !isInStandaloneMode()) {
    // Check if still installable (means it was uninstalled)
    if (deferredPrompt) {
      console.log('📲 App was uninstalled, showing install button');
      localStorage.setItem('pwaInstalled', 'false');
      showInstallButton();
    }
  }
}, 5000); // Check every 5 seconds