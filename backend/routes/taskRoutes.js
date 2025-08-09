import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { canEditProject } from "../middleware/projectAuth.js";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForProject,
} from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, canEditProject, getTasksForProject);
router.post("/", protect, canEditProject, createTask);
router.put("/:taskId", protect, canEditProject, updateTask);
router.delete("/:taskId", protect, canEditProject, deleteTask);

export default router;
