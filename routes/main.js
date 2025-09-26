import express from "express";
import {
  archiveNote,
  createNote,
  deleteNote,
  showHomePage,
  updateNote,
} from "../controllers/mainController.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/signin");
  }
};

router.get("/", isLoggedIn, showHomePage);
router.post("/addnote", isLoggedIn, createNote);
router.post("/updatenote/:id", isLoggedIn, updateNote);
router.put("/archive/:id", isLoggedIn, archiveNote);
router.post("/delete/:id", isLoggedIn, deleteNote);

export default router;
