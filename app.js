import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import connectDB from "./config/db.js";

// Routes import
import main from "./routes/main.js";
import expressEjsLayouts from "express-ejs-layouts";

const app = express();

const port = 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "./layouts/notesLayout");

app.get("/", main);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
