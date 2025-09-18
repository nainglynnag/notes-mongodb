import Note from "../models/notesModel.js";

export const errorHandler = (res, error, operation, message) => {
  console.log(`Controller Error ${error} in ${operation}: ${message}`);
  res.status(500).send({ error, message });
};

export const showHomePage = async (req, res) => {
  const notes = await Note.find().sort({isPinned: -1, createdAt: -1});
  console.log(notes);

  res.render("index", {
    layout: "../views/layouts/notesLayout",
    notes
  });
};
