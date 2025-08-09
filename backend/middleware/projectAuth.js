import Project from "../models/Project.js";

export const canEditProject = async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      (c) => c.uesrId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.project = project;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Auth check failed" });
  }
};
