import express from "express";
import {
  registerUser,
  signInUser,
  signOutUser,
} from "../controllers/authController.js";

const router = express.Router();

// Render register form (GET) and handle form submission (POST)
router.get("/register", registerUser);
router.post("/register", registerUser);

router.get("/signin", signInUser);
router.post("/signin", signInUser);

router.get("/signout", signOutUser);

export default router;
