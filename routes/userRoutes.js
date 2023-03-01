import express from "express";
import { verify } from "jsonwebtoken";
import {
  registerUser,
  authenticate,
  confirm,
  forgotPassword,
  verifyToken,
  newPassword,
} from "../controllers/user.controller.js";
const router = express.Router();

//Authentication, Creation and COnfirm User

router.post("/", registerUser);
router.post("/login", authenticate);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", verifyToken);
router.route("/forgot-password/:token").get(verifyToken).post(newPassword);

export default router;
