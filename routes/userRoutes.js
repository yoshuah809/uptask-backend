import express from "express";
import { verify } from "jsonwebtoken";
import userController from "../controllers/user.controller.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

//Authentication, Creation and COnfirm User
//46l05gvs33o1gtgorgii

router.post("/", userController.registerUser);
router.post("/login", userController.authenticate);
router.get("/confirm/:token", userController.confirm);
router.post("/forgot-password", userController.forgotPassword);
router.get("/forgot-password/:token", userController.verifyToken);
router
  .route("/forgot-password/:token")
  .get(userController.verifyToken)
  .post(userController.newPassword);

router.get("/profile", checkAuth, userController.profile);

export default router;
