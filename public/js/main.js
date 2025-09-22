// Note creator functionality
const minimizedCreator = document.getElementById("minimizedCreator");
const expandedCreator = document.getElementById("expandedCreator");
const closeCreator = document.getElementById("closeCreator");
const noteCreationBtn = document.getElementById("noteCreationBtn");

// Guard against missing DOM elements (prevents runtime errors)
if (minimizedCreator && expandedCreator) {
  minimizedCreator.addEventListener("click", function (e) {
    e.stopPropagation();
    minimizedCreator.classList.add("hidden");
    expandedCreator.classList.remove("hidden");
  });

  if (closeCreator) {
    closeCreator.addEventListener("click", function (e) {
      e.stopPropagation();
      expandedCreator.classList.add("hidden");
      minimizedCreator.classList.remove("hidden");
    });
  }
}

if (noteCreationBtn && expandedCreator && minimizedCreator) {
  // Stop propagation so the document click handler doesn't immediately close it
  noteCreationBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    window.scrollTo(0, 0);
    expandedCreator.classList.remove("hidden");
    minimizedCreator.classList.add("hidden");
  });
}

// Close creator when clicking outside
document.addEventListener("click", function (event) {
  const noteCreator = document.getElementById("noteCreator");
  // If the creator doesn't exist or the click was outside the creator, close it
  if (noteCreator && expandedCreator && minimizedCreator) {
    if (!noteCreator.contains(event.target)) {
      expandedCreator.classList.add("hidden");
      minimizedCreator.classList.remove("hidden");
    }
  }
});

// Prevent closing when clicking inside the creator (guarded)
const noteCreatorEl = document.getElementById("noteCreator");
if (noteCreatorEl) {
  noteCreatorEl.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

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

// ... modal-related code moved to public/js/noreModal.js ...

// Color picker and More options logic
const expandedCreatorDiv = document.getElementById("expandedCreator");
const colorPickerBtn = document.getElementById("colorPickerBtn");
const colorBar = document.getElementById("colorBar");
const selectedColor = document.getElementById("selectedColor");
const moreOptionsBtn = document.getElementById("moreOptionsBtn");
const moreOptionsMenu = document.getElementById("moreOptionsMenu");

// checklist & tags elements
const checklistBtn = document.getElementById("checklistBtn");
const addLabelBtn = document.getElementById("addLabelBtn");
const tagsContainer = document.getElementById("tagsContainer");
const tagsList = document.getElementById("tagsList");
const newTagInput = document.getElementById("newTagInput");

const noteTypeInput = document.getElementById("noteType");
const noteBackgroundColorInput = document.getElementById("noteBackgroundColor");
const noteTagsInput = document.getElementById("noteTags");

let currentTags = [];
let checklistMode = false;

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
      if (expandedCreatorDiv)
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
      if (expandedCreatorDiv) expandedCreatorDiv.classList.add(color);
      if (selectedColor)
        selectedColor.className = `size-1 ${color} rounded-full`;
      currentColor = color;
      if (noteBackgroundColorInput) noteBackgroundColorInput.value = color;
      colorBar.classList.add("hidden");
    });
  });
}

// Checklist behavior (operates on main textarea)
const noteContentTextarea = document.getElementById("content");
if (checklistBtn && noteContentTextarea) {
  checklistBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    checklistMode = !checklistMode;
    if (noteTypeInput)
      noteTypeInput.value = checklistMode ? "checklist" : "text";

    // When checklist mode is active, prefix non-empty lines with '- '
    if (checklistMode) {
      const lines = noteContentTextarea.value
        .split("\n")
        .map((l) => (l.trim() ? `- ${l.replace(/^(-\s*)?/, "")}` : ""));
      noteContentTextarea.value = lines.join("\n");
    } else {
      // strip checklist markers when leaving checklist mode
      const lines = noteContentTextarea.value
        .split("\n")
        .map((l) => l.replace(/^(-\s*)?/, ""));
      noteContentTextarea.value = lines.join("\n");
    }
  });
}

// Tags behavior
if (addLabelBtn && tagsContainer && newTagInput) {
  addLabelBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    tagsContainer.classList.toggle("hidden");
    moreOptionsMenu.classList.add("hidden");
  });

  newTagInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = newTagInput.value.trim();
      if (!tag) return;
      if (!currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
      }
      newTagInput.value = "";
    }
  });
}

function renderTags() {
  if (!tagsList) return;
  tagsList.innerHTML = "";
  currentTags.forEach((t) => {
    const span = document.createElement("span");
    span.className =
      "px-2 py-1 rounded bg-gray-100 text-xs flex items-center gap-2";
    span.innerHTML = `<span class='tag-text'>${escapeHtml(
      t
    )}</span><button class='ml-2 text-red-500 remove-tag' data-tag='${t}'>x</button>`;
    tagsList.appendChild(span);
  });
  tagsList.querySelectorAll(".remove-tag").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const tag = this.dataset.tag;
      currentTags = currentTags.filter((c) => c !== tag);
      renderTags();
    });
  });
  if (noteTagsInput) noteTagsInput.value = JSON.stringify(currentTags);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ensure colorPickerBtn exists before trying to reference
const dataColorEls = document.querySelectorAll("[data-color]");
if (dataColorEls && dataColorEls.forEach && colorPickerBtn) {
  dataColorEls.forEach((el) => {
    colorPickerBtn.value = el.dataset.color;
  });
}

if (moreOptionsBtn && moreOptionsMenu) {
  moreOptionsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    try {
      // console.log("moreOptionsBtn clicked");
      const wasHidden = moreOptionsMenu.classList.contains("hidden");
      // close other menus first
      closeAllMenus();
      // if it was hidden, open it; otherwise leave closed
      if (wasHidden) {
        moreOptionsMenu.classList.remove("hidden");
      }
    } catch (err) {
      console.error("moreOptionsBtn handler error", err);
    }
  });
}

document.addEventListener("click", function (e) {
  // Close menus if clicking outside
  closeAllMenus();
  // ensure clicking outside closes tags/checklist containers
  if (
    tagsContainer &&
    !tagsContainer.classList.contains("hidden") &&
    !tagsContainer.contains(e.target) &&
    e.target.id !== "addLabelBtn"
  ) {
    tagsContainer.classList.add("hidden");
  }
  // if checklist mode is active and user clicked outside the creator, exit checklist mode
  if (checklistMode) {
    const noteCreator = document.getElementById("noteCreator");
    if (noteCreator && !noteCreator.contains(e.target)) {
      checklistMode = false;
      if (noteTypeInput) noteTypeInput.value = "text";
      if (noteContentTextarea) {
        const lines = noteContentTextarea.value
          .split("\n")
          .map((l) => l.replace(/^(-\s*)?/, ""));
        noteContentTextarea.value = lines.join("\n");
      }
    }
  }
});

function deleteNote(id) {
  fetch(`/delete/${id}`, { method: "post" }).then(() =>
    window.location.reload()
  );
}
