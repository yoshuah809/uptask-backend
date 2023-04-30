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
router.get("/tasks/:id", checkAuth, projectController.getTasks); // TODO --- need to move this to Task Controller

router.post("/contributors/", checkAuth, projectController.searchMember);
router.post("/contributors/:id", checkAuth, projectController.addMember);
router.post(
  "/delete-contributor/:id",
  checkAuth,
  projectController.deleteMember
);

export default router;
