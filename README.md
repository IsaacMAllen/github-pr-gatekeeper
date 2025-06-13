# 🛡️ GitHub PR Quality Gatekeeper

**Prevent sloppy pull requests — automatically.**

This Chrome extension disables the ability to create or submit a pull request (PR) on GitHub unless:

✅ All required checks (e.g., CI tests) have passed  
📝 A non-empty PR description has been added

---

## 🚀 Why Use This?

GitHub allows PRs to be submitted or marked “Ready for review” even when:
- CI/CD pipelines are still running or have failed
- Descriptions are empty or incomplete

This can lead to:
- Broken builds
- Code review chaos
- Wasted reviewer time

This extension enforces basic hygiene **without needing repository configuration**.

---

## 🔧 Features

- ⛔ Blocks “Create pull request” if required checks have not passed
- ⛔ Blocks “Ready for review” if description is empty or checks failed
- ✅ Real-time validation as you type or as CI status updates
- 🧠 Smart tooltips explain why buttons are disabled

---

## 🖥️ Installation (Local Development)

1. Clone or download this repo.

2. Open Chrome and navigate to:

chrome://extensions/


3. Enable **Developer mode** (top right).

4. Click **"Load unpacked"** and select the project directory.

5. Navigate to any GitHub PR page (e.g. `https://github.com/user/repo/pull/123`) and test it out!

---

## 💡 How It Works

- The extension injects a script into GitHub PR pages.
- It watches for:
- Description field content
- CI check status (via the status check summary)
- The state of the “Create pull request” and “Ready for review” buttons
- If checks haven’t passed or no description is provided:
- The buttons are disabled
- A tooltip is shown explaining the issue

---

## 🧩 Compatibility

- Works on:
- GitHub.com
- GitHub Enterprise instances (matching PR URL pattern)
- Does **not** require admin access to repositories
- Tested on Chrome 114+ with GitHub UI as of 2025

---

## 📌 Future Improvements

- Configurable check names or bypass rules
- Organization-wide enforcement options
- Firefox support

---

## 🤝 Contributions

PRs and ideas welcome! File an issue or suggest improvements.

---

## 📝 License

MIT License — Use it, improve it, enforce clean code culture.

