import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    optionChosen: {
      type: String, // store option text
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure one vote per user per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
