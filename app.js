import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Routes import
import main from "./routes/main.js";

const app = express();

const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", main);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
