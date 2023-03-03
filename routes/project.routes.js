import projectController from "../controllers/project.controller.js";
import checkAuth from "../middleware/checkAuth.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, projectController.getProjects)
  .post(checkAuth, projectController.newProject);
router
  .route("/:id")
  .get(checkAuth, projectController.getProject)
  .put(checkAuth, projectController.editProject)
  .delete(checkAuth, projectController.deleteProject);
router.get("/tasks/:id", checkAuth, projectController.getTasks);
router.post("/add-memeber/:id", checkAuth, projectController.addMember);
router.post("/delete-memeber/:id", checkAuth, projectController.deleteMember);

export default router;
