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
