import express from "express";
import { createNote, showHomePage } from "../controllers/mainController";

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

export default router;
