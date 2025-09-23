import User from "../models/authModel.js";
import bcrypt from "bcrypt";

export const errorHandler = (res, error, operation, message) => {
  console.log(`Controller Error ${error} in ${operation}: ${message}`);
  res.status(500).send({ error, message });
};

export const showUserProfile = async (req, res) => {
  try {
    // console.log(req.session.user);
    const userData = await User.findById(req.session.user.id);
    // console.log(userData);

    return res.render("user/index", {
      layout: "../views/layouts/userLayout",
      userData,
    });
  } catch (error) {
    errorHandler(res, error, "showUserProfile", "Error showing user profile");
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userData = await User.findById(req.session.user.id);

    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   await User.findByIdAndUpdate(userId, { name, email, password: hashedPassword });
    // } else {
    //   await User.findByIdAndUpdate(userId, { name, email });
    // }

    return res.render("user/update", {
      layout: "../views/layouts/userLayout",
      userData,
    });

    // return res.redirect("/user/profile");
  } catch (error) {
    errorHandler(
      res,
      error,
      "updateUserProfile",
      "Error updating user profile"
    );
  }
};

export const updateUserProfilePost = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name, email } = req.body;

    const userData = await User.findById(userId);

    const update = {};
    if (userData.name != name) update.name = name;
    if (userData.email != email) update.email = email;

    // console.log("update ", update);
    if (Object.keys(update).length > 0) {
      //   console.log("update data", update);
      await User.findByIdAndUpdate(userId, update);
    } else {
      res.render("user/update", {
        layout: "../views/layouts/userLayout",
        userData,
        error: "No changes has made yet!",
      });
    }

    // if (password && password.trim()) {
    //   const hashed = await bcrypt.hash(password, 10);
    //   update.password = hashed;
    // }

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    });

    if (updated) {
      if (req.session && req.session.user) {
        req.session.user.name = updated.name;
        req.session.user.email = updated.email;
      }
    }

    return res.redirect("/");
  } catch (error) {
    errorHandler(res, error, "updateUserProfilePost", "Error saving profile");
  }
};

export const updatePassword = async (req, res) => {
  try {
    // console.log(req.body);
    const userId = req.session.user.id;
    const { password } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
    }

    req.session.destroy();
    return res.redirect("/signin");
  } catch (error) {
    errorHandler(res, error, "updatePassword", "Error updating password");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    await User.findByIdAndDelete(userId);
    req.session.destroy();
    return res.redirect("/signin");
  } catch (error) {
    errorHandler(res, error, "deleteUser", "Error deleting user");
  }
};
