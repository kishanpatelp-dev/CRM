import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { canEditProject } from "../middleware/projectAuth.js";
import {
  createProject,
  getAllProjects,
  getProjectDetail,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  getClientProjects
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", protect, getAllProjects);
router.get("/client/:clientId", protect, getClientProjects);
router.post("/create", protect, createProject);
router.get("/:id", protect, getProjectDetail);
router.put("/:id", protect, canEditProject, updateProject);
router.delete("/:id", protect, canEditProject, deleteProject);
router.put("/:projectId/collaborators",protect,canEditProject,addCollaborator);
router.delete("/:projectId/collaborators",protect,canEditProject,removeCollaborator);

export default router;
