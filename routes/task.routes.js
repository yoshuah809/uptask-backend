import checkAuth from "../middleware/checkAuth.js";
import taskController from "../controllers/task.controller.js";
import express from "express";

const router = express.Router();

router.post("/", checkAuth, taskController.addTask);
router
  .route("/:id")
  .get(checkAuth, taskController.getTask)
  .put(checkAuth, taskController.updateTask)
  .delete(checkAuth, taskController.deleteTask);

router.post("/update-status/:id", checkAuth, taskController.updateStatus);

export default router;
