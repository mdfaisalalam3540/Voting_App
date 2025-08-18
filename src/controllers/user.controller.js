import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { epicNumber, name, email, password } = req.body;

  // validation - registration form should not be empty
  if (!epicNumber || !name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: email, epicNumber
  const existedUser = await User.findOne({
    $or: [{ email }, { epicNumber }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "user with this Epic_Number or Email already exists"
    );
  }

  // create user object - create entry in database
  const user = await User.create({
    epicNumber,
    name,
    email,
    password,
  });

  // remove field from response
  const createdUser = await User.findById(user._id).select("-password");

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //   user.password = undefined;

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdUser, "User Registered Successfully to vote")
    );
});

export { registerUser };
