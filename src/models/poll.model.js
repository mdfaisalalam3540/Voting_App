import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Poll title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [
        {
          text: {
            type: String,
            required: [true, "Option text is required"],
            trim: true,
          },
          votes: {
            type: Number,
            default: 0, // start with 0 votes
          },
        },
      ], // array of strings
      validate: {
        validator: function (arr) {
          return arr.length >= 2; // must have atleast 2 options
        },
        message: "Poll must have at least two options",
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Poll = mongoose.model("Poll", pollSchema);
