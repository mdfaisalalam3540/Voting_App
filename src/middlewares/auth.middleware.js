import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // extract token
    const token =
      req.cookies?.accessToken || // it looks for the token in cookies (good for web apps)
      req.header("Authorization")?.replace("Bearer ", ""); // if not found, it looks in authorization header (common in APIs -> Bearer <token>)

    // console.log(token) || check if token exists
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify token
    // 1. Uses jsonwebtoken to verify the token with your secret key.
    // 2. If token is expired or tampered, it throws an error.
    // 3. If valid, you get back the payload (like { _id, email, epicNumber, name }).

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user in Database
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
