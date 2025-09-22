import express from "express";
import {
  createNote,
  deleteNote,
  showHomePage,
  updateNote,
} from "../controllers/mainController";

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
router.post("/delete/:id", isLoggedIn, deleteNote);

export default router;
