let debugLoggingEnabled = false;

// Initial pull from chrome.storage
chrome.storage.local.get(['prGatekeeperDebug'], (result) => {
  debugLoggingEnabled = result.prGatekeeperDebug === true;
});

// Listen for live toggle changes from popup
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && 'prGatekeeperDebug' in changes) {
    debugLoggingEnabled = changes.prGatekeeperDebug.newValue === true;
  }
});

function log(...args) {
  if (debugLoggingEnabled) {
    console.log('[PR Gatekeeper]', ...args);
  }
}

function validatePR() {
  log('Running validation...');

  const descriptionBox = document.querySelector('#pull_request_body');
  const description = descriptionBox?.value?.trim() || '';
  const descriptionFilled = description.length > 0;

  const hasFailingChecks = !!document.querySelector(
    '[data-testid="status-checks-summary"] .color-fg-danger, [data-testid="status-checks-summary"] .text-red'
  );
  const hasStatusSummary = !!document.querySelector('[data-testid="status-checks-summary"]');
  const allChecksPassed = !hasFailingChecks || !hasStatusSummary;

  const isValid = descriptionFilled && allChecksPassed;
  const isDraftSelected = document.querySelector('#draft_on')?.checked || false;

  log('Description filled:', descriptionFilled);
  log('All checks passed:', allChecksPassed);
  log('Draft selected:', isDraftSelected);
  log('PR is valid:', isValid);

  const createPrButton = document.querySelector('button.hx_create-pr-button');
  const readyButton = Array.from(document.querySelectorAll('button')).find(
    btn => btn.innerText?.trim().toLowerCase() === 'ready for review'
  );

  [createPrButton, readyButton].forEach(button => {
    if (button) {
      const isDraftButton = button.classList.contains('hx_create-pr-button');

      if (!isValid && !isDraftSelected) {
        button.disabled = true;
        button.style.pointerEvents = 'none';
        button.style.cursor = 'not-allowed';
        button.style.opacity = '0.6';
        button.title = 'You must provide a PR description and pass all required checks.';

        if (!button._listenerAttached) {
          button.addEventListener('click', e => {
            log('Blocked click on:', button.innerText.trim());
            e.preventDefault();
            e.stopImmediatePropagation();
          }, true);
          button._listenerAttached = true;
        }
      } else {
        button.disabled = false;
        button.style.pointerEvents = '';
        button.style.cursor = '';
        button.style.opacity = '';
        button.title = '';
      }
    }
  });
}

function startObserver() {
  const observer = new MutationObserver(() => {
    validatePR();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(() => {
    const box = document.querySelector('#pull_request_body');
    if (box && !box._listenerAttached) {
      box.addEventListener('input', validatePR);
      box._listenerAttached = true;
    }
    validatePR();
  }, 1000);
}

function hookNavigationAndStart() {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  function wrapNavigation(method) {
    return function () {
      method.apply(this, arguments);
      setTimeout(startObserver, 500);
    };
  }

  history.pushState = wrapNavigation(pushState);
  history.replaceState = wrapNavigation(replaceState);

  window.addEventListener('popstate', () => {
    setTimeout(startObserver, 500);
  });

  startObserver();
}

hookNavigationAndStart();

