import Project from "../models/Project.js";

export const canEditProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.includes(
      req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this project" });
    }

    req.project = project;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Server error while verifying project access" });
  }
};

