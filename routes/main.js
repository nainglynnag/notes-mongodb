import express from "express";
import { showHomePage } from "../controllers/mainController";

const router = express.Router();

router.get("/", showHomePage);

export default router;
