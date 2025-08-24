import { Router } from "express";
import { subscribeToPoll } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, subscribeToPoll);

export default router;
