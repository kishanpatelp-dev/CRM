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
    removeCollaborator
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", protect, getAllProjects);
router.post("/", protect, createProject);
router.get("/:id", protect, getProjectDetail);
router.put("/:id", protect, canEditProject, updateProject);
router.delete("/:id", protect, canEditProject, deleteProject);
router.put("/add-collaborator/:projectId", protect, canEditProject, addCollaborator);
router.delete("/remove-collaborator/:projectId", protect, canEditProject, removeCollaborator);

export default router;