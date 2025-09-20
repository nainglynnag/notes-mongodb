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

// Note Modal Logic
window.openNoteModal = function (el) {
  const modal = document.getElementById("noteModal");
  const noteId = el.getAttribute("data-note-id");
  const noteColor = el.getAttribute("data-note-backgroundColor");
  const noteTitle = el.getAttribute("data-note-title") || "";
  const noteContent = el.getAttribute("data-note-content") || "";
  const noteType = el.getAttribute("data-note-type") || "text";
  const checklist = JSON.parse(
    decodeURIComponent(el.getAttribute("data-note-checklist") || "%5B%5D")
  );
  const images = JSON.parse(
    decodeURIComponent(el.getAttribute("data-note-images") || "%5B%5D")
  );
  const tags = JSON.parse(
    decodeURIComponent(el.getAttribute("data-note-tags") || "%5B%5D")
  );

  noteContainer.classList.remove(
    "note-white",
    "note-yellow",
    "note-green",
    "note-blue",
    "note-pink",
    "note-orange",
    "note-purple",
    "note-teal",
    "note-gray"
  );

  document.getElementById("noteContainer").classList.add(noteColor);
  document.getElementById("modalNoteId").value = noteId;
  document.getElementById("modalNoteTitle").value = noteTitle;

  // Show/hide content fields
  document.getElementById("modalTextContent").classList.add("hidden");
  document.getElementById("modalChecklistContent").classList.add("hidden");
  document.getElementById("modalImagesContent").classList.add("hidden");

  if (noteType === "text") {
    document.getElementById("modalTextContent").classList.remove("hidden");
    document.getElementById("modalNoteContent").value = noteContent;
  } else if (noteType === "checklist") {
    document.getElementById("modalChecklistContent").classList.remove("hidden");
    const checklistUl = document.getElementById("modalChecklistItems");
    checklistUl.innerHTML = "";
    checklist.forEach((item) => {
      const li = document.createElement("li");
      li.className = "flex items-center";
      li.innerHTML =
        `<input type='checkbox' class='mr-2 rounded outline-0 focus:outline-none' ${
          item.checked ? "checked disabled" : ""
        } />` +
        `<span class="${
          item.checked ? "line-through" : ""
        }">${item.text.replace(/"/g, "&quot;")}</span>`;
      checklistUl.appendChild(li);
    });
  }
  if (images && images.length > 0) {
    document.getElementById("modalImagesContent").classList.remove("hidden");
    const imagesDiv = document.getElementById("modalImagesList");
    imagesDiv.innerHTML = "";
    images.forEach((img) => {
      const imgEl = document.createElement("img");
      imgEl.src = img.url;
      imgEl.alt = img.alt || "";
      imgEl.className = "w-20 h-20 object-cover rounded";
      imagesDiv.appendChild(imgEl);
    });
  }
  // Tags
  const tagsDiv = document.getElementById("modalTagsList");
  tagsDiv.innerHTML = "";
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "px-2 py-1 rounded bg-gray-50/50 text-xs";
    span.textContent = tag;
    tagsDiv.appendChild(span);
  });

  modal.classList.remove("hidden");
};

window.closeNoteModal = function () {
  document.getElementById("noteModal").classList.add("hidden");
};

// Optional: Close modal on overlay click
const noteModal = document.getElementById("noteModal");
noteModal &&
  noteModal.addEventListener("click", function (e) {
    if (e.target === noteModal) {
      closeNoteModal();
    }
  });

// Handle Save (UI only)
document
  .getElementById("noteModalForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // You can add AJAX here to save to backend
    closeNoteModal();
    // Optionally update the note in the UI
  });

// Color picker and More options logic
const expandedCreatorDiv = document.getElementById("expandedCreator");
const colorPickerBtn = document.getElementById("colorPickerBtn");
const colorBar = document.getElementById("colorBar");
const selectedColor = document.getElementById("selectedColor");
const moreOptionsBtn = document.getElementById("moreOptionsBtn");
const moreOptionsMenu = document.getElementById("moreOptionsMenu");

let currentColor = "note-white";

function closeAllMenus() {
  colorBar.classList.add("hidden");
  moreOptionsMenu.classList.add("hidden");
}

if (colorPickerBtn && colorBar) {
  colorPickerBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = !colorBar.classList.contains("hidden");
    closeAllMenus();
    if (!isOpen) colorBar.classList.remove("hidden");
  });
  colorBar.querySelectorAll("[data-color]").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      // Remove previous color class
      expandedCreatorDiv.classList.remove(
        "note-white",
        "note-yellow",
        "note-green",
        "note-blue",
        "note-pink",
        "note-orange",
        "note-purple",
        "note-teal",
        "note-gray"
      );
      // Add new color class
      const color = el.getAttribute("data-color");
      expandedCreatorDiv.classList.add(color);
      selectedColor.className = `size-1 ${color} rounded-full`;
      currentColor = color;
      colorBar.classList.add("hidden");
    });
  });
}

if (moreOptionsBtn && moreOptionsMenu) {
  moreOptionsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = !moreOptionsMenu.classList.contains("hidden");
    closeAllMenus();
    if (!isOpen) moreOptionsMenu.classList.remove("hidden");
  });
}

document.addEventListener("click", function (e) {
  // Close menus if clicking outside
  closeAllMenus();
});
