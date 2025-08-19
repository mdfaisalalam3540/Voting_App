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

// Registration for Voter
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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

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

// Login for Voter
const loginUser = asyncHandler(async (req, res) => {
  // req body => data
  const { epicNumber, email, password } = req.body;

  // validation (epicNumber or email)
  if (!epicNumber && !email) {
    throw new ApiError(400, "epicNumber or password is required");
  }

  // check if user exist
  const user = await User.findOne({
    $or: [{ epicNumber }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credential");
  }

  // accessToken and refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // for cross origin cookies
    maxAge: 10 * 24 * 30 * 30 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logout for Voter
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  // Common cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // for cross-origin cookies
  };

  // Clear both accessToken and refreshToken cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully!"));
});

export { registerUser, loginUser, logoutUser };
