import express from "express";
import { registerUser } from "../controllers/userController.js";
const router = express.Router();

//Authentication, Creation and COnfirm User

router.post("/", registerUser);

export default router;
