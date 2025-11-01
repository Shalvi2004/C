import Router from "express";
import { otpVerification } from "../controllers/optVerification.controller.js";

const router = Router();

router.get("/getOtp", otpVerification);

export default router;
