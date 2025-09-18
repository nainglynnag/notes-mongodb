import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Checklist Schema
const checklistItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // Note: _id: false is to prevent mongoose from adding an _id field for subdocuments

// Image note Schema
const imageNoteSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Reminder note Schema
const reminderNoteSchema = new Schema(
  {
    dateTime: {
      type: Date,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: function () {
        return this.isRecurring;
      },
    },
  },
  { _id: false }
);

// Position Schema for grid layout
const positionSchema = new Schema(
  {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

// Main Note Schema
const noteSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ["text", "checklist", "image", "drawing", "audio"],
      default: "text",
      required: true,
    },
    backgroundColor: {
      type: String,
      enum: [
        "note-white",
        "note-yellow",
        "note-green",
        "note-blue",
        "note-pink",
        "note-orange",
        "note-purple",
        "note-teal",
        "note-gray",
      ],
      default: "note-white",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Subdocuments
    // For checklist type notes
    checklist: {
      type: [checklistItemSchema],
      validate: {
        validator: function (checklist) {
          if (this.type === "checklist") {
            return checklist && checklist.length > 0;
          }

          return !checklist || checklist.length === 0;
        },
        message: "Checklist items are required for checklist type notes",
      },
    },

    // For image type notes
    images: {
      type: [imageNoteSchema],
    },

    // For reminder type notes
    reminders: {
      type: [reminderNoteSchema],
      default: undefined,
    },

    // For grid layout
    position: {
      type: positionSchema,
      default: () => ({ x: 0, y: 0 }),
    },

    // For user who owns the note
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // For version control
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Note = model("Note", noteSchema);
export default Note;
