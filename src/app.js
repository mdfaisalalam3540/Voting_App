import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.route.js";
// http://localhost:3005/api/v1/users/register
// http://localhost:3005/api/v1/users/login
// http://localhost:3005/api/v1/users/logout

import pollRouter from "./routes/poll.route.js";
// http://localhost:3005/api/v1/polls/create

import voteRouter from "./routes/vote.route.js";
// http://localhost:3005/api/v1/polls/vote

import subscriptionRouter from "./routes/subscription.route.js";
// http://localhost:3005/api/v1/subscription/subscribe

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/polls", pollRouter);
app.use("/api/v1/votes", voteRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

export { app };
