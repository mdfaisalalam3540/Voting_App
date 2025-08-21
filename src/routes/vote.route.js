import { Router } from "express";
import { voteOnPoll } from "../controllers/vote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/vote").post(verifyJWT, voteOnPoll);

export default router;
