import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

// Vote Controller
const voteOnPoll = asyncHandler(async (req, res) => {
  try {
    // 1. Authenticate
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(
        401,
        "Unauthorized user: Please register or login for vote"
      );
    }

    // 2. read input
    const { pollId, optionChosen } = req.body;

    // 3. Find Poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new ApiError(404, "Poll not found");
    }

    // 4. Check Poll Status
    if (poll.status !== "active") {
      throw new ApiError(400, "Poll is closed");
    }

    // 5. Check poll expiry
    if (poll.expiresAt < new Date()) {
      throw new ApiError(400, "Poll is expired");
    }

    // 6. Check already voted
    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      throw new ApiError(400, "You have already voted in the poll");
    }

    // 7. Validate option
    const chosenOption = poll.options.find(
      (opt) => opt.text.toLowerCase() === optionChosen.toLowerCase()
    );
    if (!chosenOption) {
      throw new ApiError(400, "Invalid option chosen");
    }

    // 8. Record vote( create vote for DB)
    const vote = await Vote.create({
      pollId,
      userId,
      optionChosen: chosenOption.text,
    });

    // 9. Increment the chosen option's vote
    chosenOption.votes += 1;
    await poll.save();

    // 10. Respond
    return res
      .status(201)
      .json(
        new ApiResponse(201, { poll, vote }, "Vote recorded successfully!")
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Something went wrong while voting"
    );
  }
});

export { voteOnPoll };
