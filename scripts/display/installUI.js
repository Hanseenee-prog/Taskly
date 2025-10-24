let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Utility: Detect if running as PWA
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
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

// Update install button visibility based on install state
function updateInstallButtonVisibility() {
  if (isInStandaloneMode()) {
    hideInstallButton();
  } else {
    showInstallButton();
  }
}

// Listen for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (!isInStandaloneMode()) {
    showInstallButton();
    console.log('✅ Install prompt available');
  }
});

// Handle install click
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  hideInstallButton();
  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);

  if (outcome === 'accepted') {
    deferredPrompt = null;
  } else {
    setTimeout(showInstallButton, 10000);
  }
});

// Once app is installed
window.addEventListener('appinstalled', () => {
  console.log('🎉 App successfully installed!');
  deferredPrompt = null;
  hideInstallButton();
});

// On load — check if already installed
window.addEventListener('load', () => {
  if (isInStandaloneMode()) {
    hideInstallButton();
  }
});

// Detect display-mode changes (install/uninstall)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
  if (e.matches) {
    hideInstallButton();
  } else {
    showInstallButton();
  }
});
