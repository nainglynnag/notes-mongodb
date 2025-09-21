import User from "../models/authModel.js";
import bcrypt from "bcrypt";

export const errorHandler = (res, error, operation, message) => {
  console.log(`Controller Error ${error} in ${operation}: ${message}`);
  res.status(500).send({ error, message });
};

export const registerUser = async (req, res) => {
  try {
    // If this is a GET request (or no body was submitted) just render the register form.
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.render("auth/register", {
        layout: "../views/layouts/authLayout",
      });
    }

    // Otherwise handle POST data to register a new user.
    const { name, email, password } = req.body;
    console.log("register user:", name, email, password);

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).render("auth/register", {
        layout: "../views/layouts/authLayout",
        error: "Please provide all information",
        formData: { name, email },
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).render("auth/register", {
        layout: "../views/layouts/authLayout",
        error: "Email has already registered",
        formData: { name, email },
      });
    }

    // Hash password and save user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.insertMany({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Redirect to sign-in after successful registration
    return res.redirect("/signin");
  } catch (error) {
    errorHandler(res, error, "register", "Error registering user");
  }
};

export const signInUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.render("auth/signIn", {
        layout: "../views/layouts/authLayout",
      });
    }

    const { email, password } = req.body;
    // console.log("signIn POST:", email);

    let error = "";
    const userCheck = await User.findOne({ email: email });
    if (!userCheck) error = "User not found";

    const passwordCheck = await bcrypt.compare(password, userCheck.password);
    if (!passwordCheck) error = "Incorrect password";

    if (error) {
      return res.render("auth/signIn", {
        layout: "../views/layouts/authLayout",
        error,
      });
    } else {
      req.session.user = {
        id: userCheck._id,
        name: userCheck.name,
        email: userCheck.email,
        avatar: userCheck.avatar,
      };
      // console.log("Signed in user:", req.session.user);
      return res.redirect("/");
    }
  } catch (error) {
    errorHandler(res, error, "signIn", "Error signing in user");
  }
};

export const signOutUser = (req, res) => {
  try {
    req.session.destroy();
    // console.log("Signed out user:", req.session.user);
    return res.redirect("/signin");
  } catch (error) {
    errorHandler(res, error, "signOut", "Error signing out user");
  }
};
