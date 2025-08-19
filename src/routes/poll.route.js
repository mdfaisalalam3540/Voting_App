import { Router } from "express";
import { createPoll } from "../controllers/poll.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createPoll);

export default router;
