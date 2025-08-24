import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// ensure one subscription per user per poll
subscriptionSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
