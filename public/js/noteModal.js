(function () {
  // Tag state and helpers (shared inside the IIFE so openNoteModal and
  // the later listeners can access the same state without redeclaring)
  const modalRoot = document.getElementById("noteModal");
  const addLabelBtn = modalRoot && modalRoot.querySelector("#addLabelBtn");
  const newTagInput = modalRoot && modalRoot.querySelector("#newTagInput");
  const modalTagsDiv = modalRoot && modalRoot.querySelector("#modalTagsList");
  const noteTagsInput = modalRoot && modalRoot.querySelector("#noteTags");
  let currentTags = [];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderTags() {
    if (!modalTagsDiv) return;
    modalTagsDiv.innerHTML = "";
    currentTags.forEach((t) => {
      const span = document.createElement("span");
      span.className =
        "px-2 py-1 rounded bg-gray-100 text-xs flex items-center gap-2";
      span.innerHTML = `<span class='tag-text'>${escapeHtml(
        t
      )}</span><button class='ml-1 text-red-500 remove-tag' data-tag='${t}'>x</button>`;
      modalTagsDiv.appendChild(span);
    });
    modalTagsDiv.querySelectorAll(".remove-tag").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const tag = this.dataset.tag;
        currentTags = currentTags.filter((c) => c !== tag);
        renderTags();
      });
    });
    if (noteTagsInput) noteTagsInput.value = JSON.stringify(currentTags);
  }

  // Expose modal open/close to window, but keep internal variables scoped
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

    // Safely get the modal note container and adjust classes
    const noteContainerEl = document.getElementById("noteContainer");
    if (noteContainerEl) {
      noteContainerEl.classList.remove(
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
      if (noteColor) noteContainerEl.classList.add(noteColor);
      // keep the modal hidden field in sync so server receives the value
      const modalBgInput =
        modalRoot && modalRoot.querySelector("#noteBackgroundColor");
      if (modalBgInput) modalBgInput.value = noteColor || "note-white";
    }
    const modalNoteIdEl = document.getElementById("modalNoteId");
    if (modalNoteIdEl) modalNoteIdEl.value = noteId;
    const modalNoteTitleEl = document.getElementById("modalNoteTitle");
    if (modalNoteTitleEl) modalNoteTitleEl.value = noteTitle;

    // Ensure the modal form posts to the update route for this note
    const noteModalForm = document.getElementById("noteModalForm");
    if (noteModalForm) {
      noteModalForm.method = "POST";
      noteModalForm.action = "/updatenote/" + noteId;
    }

    // Show/hide content fields
    const textContent = document.getElementById("modalTextContent");
    const checklistContent = document.getElementById("modalChecklistContent");
    const imagesContent = document.getElementById("modalImagesContent");
    textContent && textContent.classList.add("hidden");
    checklistContent && checklistContent.classList.add("hidden");
    imagesContent && imagesContent.classList.add("hidden");

    if (noteType === "text") {
      textContent && textContent.classList.remove("hidden");
      const modalNoteContent = document.getElementById("modalNoteContent");
      if (modalNoteContent) modalNoteContent.value = noteContent;
    } else if (noteType === "checklist") {
      checklistContent && checklistContent.classList.remove("hidden");
      const checklistUl = document.getElementById("modalChecklistItems");
      if (checklistUl) {
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
    }
    if (images && images.length > 0) {
      imagesContent && imagesContent.classList.remove("hidden");
      const imagesDiv = document.getElementById("modalImagesList");
      if (imagesDiv) {
        imagesDiv.innerHTML = "";
        images.forEach((img) => {
          const imgEl = document.createElement("img");
          imgEl.src = img.url;
          imgEl.alt = img.alt || "";
          imgEl.className = "w-20 h-20 object-cover rounded";
          imagesDiv.appendChild(imgEl);
        });
      }
    }

    // Tags: initialize interactive tags state and render them
    currentTags = Array.isArray(tags) ? tags.slice() : [];
    renderTags();

    modal && modal.classList.remove("hidden");
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

  // The save button is a submit button inside the form; the form's action
  // is set when opening the modal. No extra submit handler is required here.

  // Modal Color Picker and More Options logic
  const modalColorPickerBtn = document.getElementById("modalColorPickerBtn");
  const modalColorBar = document.getElementById("modalColorBar");
  const modalSelectedColor = document.getElementById("modalSelectedColor");
  const modalMoreOptionsBtn = document.getElementById("modalMoreOptionsBtn");
  const modalMoreOptionsMenu = document.getElementById("modalMoreOptionsMenu");

  function closeAllModalMenus() {
    if (modalColorBar) modalColorBar.classList.add("hidden");
    if (modalMoreOptionsMenu) modalMoreOptionsMenu.classList.add("hidden");
  }

  if (modalColorPickerBtn && modalColorBar) {
    modalColorPickerBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !modalColorBar.classList.contains("hidden");
      closeAllModalMenus();
      if (!isOpen) modalColorBar.classList.remove("hidden");
    });

    modalColorBar.querySelectorAll("[data-color]").forEach((el) => {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        // Remove previous color class from noteContainer
        const noteContainer = document.getElementById("noteContainer");
        if (noteContainer) {
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
          const color = el.getAttribute("data-color");
          noteContainer.classList.add(color);
          if (modalSelectedColor)
            modalSelectedColor.className = `size-1 ${color} rounded-full`;
          // also update the modal hidden input so the form submits the picked color
          const modalBgInput =
            modalRoot && modalRoot.querySelector("#noteBackgroundColor");
          if (modalBgInput) modalBgInput.value = color;
        }
        modalColorBar.classList.add("hidden");
      });
    });
  }

  if (modalMoreOptionsBtn && modalMoreOptionsMenu) {
    modalMoreOptionsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !modalMoreOptionsMenu.classList.contains("hidden");
      closeAllModalMenus();
      if (!isOpen) modalMoreOptionsMenu.classList.remove("hidden");
    });
  }

  // Wire tag UI events using the shared top-scoped helpers/state
  if (addLabelBtn && modalTagsDiv && newTagInput) {
    addLabelBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      // Close the more options menu if open
      if (modalMoreOptionsMenu) modalMoreOptionsMenu.classList.add("hidden");
      // Show and focus the tag input
      newTagInput.classList.remove("hidden");
      newTagInput.focus();
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

    // Hide tag input when clicking outside
    document.addEventListener("click", function (e) {
      if (
        newTagInput &&
        !newTagInput.classList.contains("hidden") &&
        !newTagInput.contains(e.target) &&
        e.target.id !== "addLabelBtn"
      ) {
        newTagInput.classList.add("hidden");
      }
    });
  }

  // Global click handler: close modal menus if clicking outside
  document.addEventListener("click", function (e) {
    closeAllModalMenus();
  });
})();
