document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-logging');

  // Load setting from shared extension storage
  chrome.storage.local.get(['prGatekeeperDebug'], (result) => {
    toggle.checked = result.prGatekeeperDebug === true;
  });

  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ prGatekeeperDebug: toggle.checked });
  });
});

