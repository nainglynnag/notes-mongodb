// Note creator functionality
const minimizedCreator = document.getElementById("minimizedCreator");
const expandedCreator = document.getElementById("expandedCreator");
const closeCreator = document.getElementById("closeCreator");

minimizedCreator.addEventListener("click", function () {
  minimizedCreator.classList.add("hidden");
  expandedCreator.classList.remove("hidden");
});

closeCreator.addEventListener("click", function () {
  expandedCreator.classList.add("hidden");
  minimizedCreator.classList.remove("hidden");
});

// Close creator when clicking outside
document.addEventListener("click", function (event) {
  const noteCreator = document.getElementById("noteCreator");
  if (!noteCreator.contains(event.target)) {
    expandedCreator.classList.add("hidden");
    minimizedCreator.classList.remove("hidden");
  }
});

// Prevent closing when clicking inside the creator
document
  .getElementById("noteCreator")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

// Sidebar toggle functionality
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
}
function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
}
function handleSidebar() {
  if (window.innerWidth >= 1024) {
    openSidebar();
  } else {
    closeSidebar();
  }
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", function () {
    if (sidebar.classList.contains("-translate-x-full")) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });
}

window.addEventListener("resize", handleSidebar);
document.addEventListener("DOMContentLoaded", handleSidebar);
