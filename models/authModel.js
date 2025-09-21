import mongoose from "mongoose";

const { Schema, model } = mongoose;

const preferencesSchema = new mongoose.Schema(
  {
    defaultBackgroundColor: {
      type: String,
      default: "note-yellow",
    },
    gridView: {
      type: String,
      default: "masonry",
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      default: "medium",
    },
  },
  { _id: false }
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Optional fields for future use
    avatar: {
      type: String,
      default: null,
    },

    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
