import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import connectDB from "./config/db.js";

// Routes import
import main from "./routes/main.js";
import auth from "./routes/auth.js";

import expressEjsLayouts from "express-ejs-layouts";

const app = express();

const port = 3000;

connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "./layouts/notesLayout");

// To pass /favicon.ico error on vercel deployment
app.get(["/favicon.ico", "/favicon.png"], (req, res) => res.status(204).end());

app.use("/", auth);
app.use("/", main);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
