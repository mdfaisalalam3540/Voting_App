import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Poll } from "../models/poll.model.js";
import { Subscription } from "../models/sunscription.model.js";

const subscribeToPoll = asyncHandler(async (req, res) => {
  try {
    // 1. Authenticate
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized user: Please login to subscribe");
    }

    // 2. Read input
    const { pollId } = req.body;

    if (!pollId) {
      throw new ApiError(400, "Poll ID is required to subscribe");
    }

    // 3. Find poll
    const poll = await Poll.findById(pollId);

    if (!poll) {
      throw new ApiError(404, "Poll not found");
    }

    // 4. Check poll status
    if (poll.status !== "active" || poll.expiresAt < new Date()) {
      throw new ApiError(400, "Poll is expired or closed. Cannot subscribe");
    }

    // 5. Check already subscribed
    const existingSubscription = await Subscription.findOne({ pollId, userId });

    if (existingSubscription) {
      throw new ApiError(400, "Yuo have already subscribed to this poll");
    }

    // 6. Create subscription
    const subsciption = await Subscription.create({ pollId, userId });

    // 7. Return response
    return res
      .status(201)
      .json(
        new ApiResponse(201, subsciption, "Subscribed to poll successfully!")
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Something went wrong while subscribing"
    );
  }
});

export { subscribeToPoll };
