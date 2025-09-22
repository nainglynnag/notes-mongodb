import Note from "../models/notesModel.js";

export const errorHandler = (res, error, operation, message) => {
  console.log(`Controller Error ${error} in ${operation}: ${message}`);
  res.status(500).send({ error, message });
};

export const showHomePage = async (req, res) => {
  const reqTag = req.query.tag || "all";
  let notes;
  if (reqTag === "all") {
    notes = await Note.find({ userId: req.session.user.id }).sort({
      isPinned: -1,
      createdAt: -1,
    });
  } else {
    notes = await Note.find({ userId: req.session.user.id, tags: reqTag }).sort(
      {
        isPinned: -1,
        createdAt: -1,
      }
    );
  }

  // Collect unique tags from all notes
  const tagSet = new Set();
  const allNotes = await Note.find({ userId: req.session.user.id });
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

export const createNote = async (req, res) => {
  try {
    // console.log(req.session.user.id);
    // console.log(req.body);
    const { title, content, type, backgroundColor, tags, checklist } = req.body;

    // Basic validation
    const noteData = {
      title: title || "",
      content: content || "",
      type: type || "text",
      backgroundColor: backgroundColor || "note-white",
      userId: req.session.user.id,
    };

    // Parse tags/checklist if provided as JSON strings
    try {
      if (tags) noteData.tags = JSON.parse(tags);
    } catch (e) {
      noteData.tags = Array.isArray(tags) ? tags : [];
    }
    // try {
    //   if (checklist) {
    //     noteData.checklist = JSON.parse(checklist);
    //   } else if (noteData.type === 'checklist' && noteData.content) {

    //     const lines = noteData.content.split('\n').map(l => l.trim()).filter(l => l.length);
    //     const parsed = lines.map((line, idx) => {
    //       const text = line.replace(/^(-\s*)?/, '');
    //       return { id: Date.now().toString(36) + '_' + idx, text, checked: false, order: idx };
    //     });
    //     noteData.checklist = parsed;

    //     noteData.content = '';
    //   }
    // } catch (e) {
    //   noteData.checklist = Array.isArray(checklist) ? checklist : [];
    // }

    const newNote = new Note(noteData);
    await newNote.save();
    return res.redirect("/");
  } catch (error) {
    errorHandler(res, error, "createNote", "Error creating note");
  }
};

export const updateNote = async (req, res) => {
  try {
    // console.log(req.body);
    const { id, title, content, type, backgroundColor, tags, checklist } =
      req.body;

    const noteData = {
      title: title,
      content: content,
      type: type || "text",
      backgroundColor: backgroundColor || "note-white",
      tags: tags ? JSON.parse(tags) : [],
      checklist: checklist ? JSON.parse(checklist) : [],
    };

    await Note.findByIdAndUpdate({ _id: id }, noteData).where({
      userId: req.session.user.id,
    });

    return res.redirect("/");
  } catch (error) {
    errorHandler(res, error, "updateNote", "Error updating note");
  }
};

export const deleteNote = async (req, res) => {
  try {
    // console.log("param", req.params.id);
    await Note.findByIdAndDelete(req.params.id);
    return res.redirect("/");
  } catch (error) {
    errorHandler(res, error, "deleteNote", "Error deleting note");
  }
};
