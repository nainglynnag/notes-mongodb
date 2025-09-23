import express from "express";
import {
  deleteUser,
  showUserProfile,
  updatePassword,
  updateUserProfile,
  updateUserProfilePost,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", showUserProfile);
router.get("/update", updateUserProfile);
router.post("/update", updateUserProfilePost);
router.post("/update-password", updatePassword);
router.post("/delete-account", deleteUser);

export default router;
