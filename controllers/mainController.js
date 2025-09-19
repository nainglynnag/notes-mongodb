import Note from "../models/notesModel.js";

export const errorHandler = (res, error, operation, message) => {
  console.log(`Controller Error ${error} in ${operation}: ${message}`);
  res.status(500).send({ error, message });
};

export const showHomePage = async (req, res) => {
  const reqTag = req.query.tag || "all";
  let notes;
  if (reqTag === "all") {
    notes = await Note.find().sort({ isPinned: -1, createdAt: -1 });
  } else {
    notes = await Note.find({ tags: reqTag }).sort({
      isPinned: -1,
      createdAt: -1,
    });
  }

  // Collect unique tags from all notes
  const tagSet = new Set();
  const allNotes = await Note.find();
  allNotes.forEach((note) => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  const tags = Array.from(tagSet);

  res.render("index", {
    layout: "../views/layouts/notesLayout",
    active: reqTag,
    notes,
    tags,
  });
};
