import { Router } from "express";   
import { createToken } from "../controllers/chatController.js";
const router  =  Router();


router.get("/createToken", createToken); // Sending Token:

export default router;