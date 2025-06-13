function validatePR() {
  const descriptionBox = document.querySelector('#pull_request_body');
  const checksSummary = document.querySelector('[data-testid="status-checks-summary"]');
  const createButton = document.querySelector('button[data-edit-text="Create pull request"], button[data-disable-with="Creating pull request…"]');
  const readyButton = document.querySelector('button[data-edit-text="Ready for review"], button[data-disable-with="Marking as ready…"]');

  let descriptionFilled = descriptionBox && descriptionBox.value.trim().length > 0;

  let allChecksPassed = false;
  if (checksSummary) {
    const failedChecks = checksSummary.querySelectorAll('.text-red, .color-fg-danger');
    allChecksPassed = failedChecks.length === 0;
  }

  const allowSubmission = descriptionFilled && allChecksPassed;

  // Disable or re-enable buttons
  [createButton, readyButton].forEach(button => {
    if (button) {
      button.disabled = !allowSubmission;
      button.title = allowSubmission
        ? ''
        : 'You must pass all checks and include a PR description to proceed.';
    }
  });
}

function attachListeners() {
  // Listen to user typing into description field
  const desc = document.querySelector('#pull_request_body');
  if (desc) {
    desc.addEventListener('input', validatePR);
  }

  // Re-validate every 2s to catch check status updates
  setInterval(validatePR, 2000);
}

// Wait for DOM to load
window.addEventListener('load', () => {
  setTimeout(() => {
    attachListeners();
    validatePR();
  }, 1000);
});

