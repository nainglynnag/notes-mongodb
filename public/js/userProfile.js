// Profile settings menu toggle logic

document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.getElementById("profileBtn");
  const profileSettingsMenu = document.getElementById("profileSettingsMenu");

  // Hide menu by default
  if (profileSettingsMenu) {
    profileSettingsMenu.classList.add("hidden");
  }

  // Toggle menu on button click
  if (profileBtn && profileSettingsMenu) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      profileSettingsMenu.classList.toggle("hidden");
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      profileSettingsMenu &&
      !profileSettingsMenu.classList.contains("hidden") &&
      !profileBtn.contains(e.target) &&
      !profileSettingsMenu.contains(e.target)
    ) {
      profileSettingsMenu.classList.add("hidden");
    }
  });
});
