import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Poll } from "../models/poll.model.js";

const createPoll = asyncHandler(async (req, res) => {
  try {
    // must be authenticated
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized user: Please log in");
    }

    // read inputs
    const { title, description, options, expiresAt, expiresInHours } = req.body;

    // validate required fields
    if (!title || !options || options.length < 2) {
      throw new ApiError(400, "Poll must have a title and at least 2 options");
    }

    // format options: accept both strings and objects
    const formattedOptions = options.map((opt) =>
      typeof opt === "string"
        ? { text: opt, votes: 0 }
        : { text: opt.text, votes: 0 }
    );

    // handle expiry
    let finalExpiresAt;
    if (expiresAt) {
      finalExpiresAt = new Date(expiresAt);
      if (isNaN(finalExpiresAt.getTime())) {
        throw new ApiError(400, "Invalid date format for expiresAt");
      }
    } else if (expiresInHours) {
      finalExpiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    } else {
      throw new ApiError(
        400,
        "Please provide expiresAt (date) or expiresInHours"
      );
    }

    // create poll
    const poll = await Poll.create({
      title,
      description,
      options: formattedOptions,
      expiresAt: finalExpiresAt,
      createdBy: userId,
    });

    // return response
    return res
      .status(201)
      .json(new ApiResponse(201, poll, "Poll created successfully!"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Something went wrong"
    );
  }
});

export { createPoll };
