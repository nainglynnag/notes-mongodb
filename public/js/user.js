// Toggle dark mode switch
const darkModeToggle = document.querySelector(
  'button[class*="relative inline-flex"]'
);
let isDarkMode = false;

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", function () {
    const toggle = this.querySelector("span");
    if (!toggle) return;
    if (isDarkMode) {
      this.classList.remove("bg-blue-600");
      this.classList.add("bg-gray-200");
      toggle.classList.remove("translate-x-6");
      toggle.classList.add("translate-x-1");
      isDarkMode = false;
    } else {
      this.classList.remove("bg-gray-200");
      this.classList.add("bg-blue-600");
      toggle.classList.remove("translate-x-1");
      toggle.classList.add("translate-x-6");
      isDarkMode = true;
    }
  });
}

// Show the update password modal (matches onclick used in views)
function updatePasswordModal() {
  const modal = document.getElementById("updatePasswordModal");
  if (modal) modal.classList.remove("hidden");
}

// Attach click handlers to any updatePasswordBtn present on the page
document.querySelectorAll("#updatePasswordBtn").forEach((btn) => {
  if (btn) btn.addEventListener("click", updatePasswordModal);
});

// Close the update password modal (matches onclick used in views)
function closeUpdatePasswordModal() {
  const modal = document.getElementById("updatePasswordModal");
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("click", function (e) {
  if (e.target.id === "updatePasswordModal") {
    closeUpdatePasswordModal();
  }
});

// Remove flash error after 3 seconds
setTimeout(() => {
  const flashError = document.getElementById("flashError");
  if (flashError) flashError.remove();
}, 3000);

// Validate password & confirm password in update password modal before submit
(() => {
  const modal = document.getElementById("updatePasswordModal");
  if (!modal) return;

  const form = modal.querySelector("form");
  if (!form) return;

  function showModalError(message) {
    let flash = form.querySelector("#flashError");
    if (!flash) {
      flash = document.createElement("div");
      flash.id = "flashError";
      flash.className = "mb-4 text-sm text-red-600 text-center";
      form.insertBefore(flash, form.firstChild);
    }
    flash.textContent = message;
  }

  form.addEventListener("submit", function (e) {
    const password = form.querySelector('input[name="password"]');
    const confirm = form.querySelector('input[name="confirm_password"]');
    if (!password || !confirm) return; // let the server handle missing fields

    if (password.value !== confirm.value) {
      e.preventDefault();
      showModalError("Password do not match");
      confirm.focus();
      // remove error after 3 seconds
      setTimeout(() => {
        const f = form.querySelector("#flashError");
        if (f) f.remove();
      }, 3000);
    }
  });
})();
