import Task from "../models/Task.js";
import Project from "../models/Project.js";

/**
 * Compute progress as percentage: completed tasks / total tasks.
 */
const computeProjectProgress = async (projectId) => {
  const total = await Task.countDocuments({ projectId });
  if (total === 0) return 0;
  const done = await Task.countDocuments({ projectId, status: "completed" });
  return Math.round((done / total) * 100);
};

/**
 * Derive project status from progress and endDate.
 */
const deriveProjectStatus = (progress, endDate) => {
  if (progress === 100) return "Completed";
  if (endDate && new Date() > new Date(endDate)) return "At Risk";
  if (progress > 0) return "On Track";
  return "Not Started";
};

/**
 * Recompute & persist progress + status back to the project.
 */
const updateProjectProgressAndStatus = async (projectId) => {
  const progress = await computeProjectProgress(projectId);
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const status = deriveProjectStatus(progress, project.endDate);

  project.progress = progress;
  project.status = status;
  await project.save();

  return { progress, status };
};

export {
  computeProjectProgress,
  deriveProjectStatus,
  updateProjectProgressAndStatus,
};
