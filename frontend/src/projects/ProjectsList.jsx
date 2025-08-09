import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import Layout from "../components/layout";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

export default function ClientProjectsTable({ clientId: propClientId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const clientId = propClientId || params.clientId; // allow prop override

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = clientId
        ? `/projects/client/${clientId}`
        : `/projects`; 
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  const toggleExpand = (id) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const daysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = Math.ceil(
      (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "overdue":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };
  
  
  const overdueProjects = projects.filter(
    (p) => p.status !== "completed" && p.endDate && new Date(p.endDate) < new Date()
  );
  const dueSoonProjects = projects.filter((p) => {
    const days = daysLeft(p.endDate);
    return p.status !== "completed" && days !== null && days > 0 && days <= 7;
  });
  const activeProjects = projects.filter(
    (p) => !overdueProjects.includes(p) && !dueSoonProjects.includes(p)
  );

  const renderProjectRow = (project, idx) => {
    const isExpanded = expandedProject === project._id;
    const days = daysLeft(project.endDate);
    return (
      <div
        key={project._id}
        className={`transition hover:shadow-md hover:scale-[1.01] rounded-xl my-2 ${
          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        {/* Row */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer px-3 sm:px-4 py-3 sm:py-4 gap-2"
          onClick={() => toggleExpand(project._id)}
        >
          <div className="flex flex-col w-full">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="font-semibold text-gray-800 truncate">{project.name}</span>
                <span className="text-xs text-gray-500 italic truncate">
                  ({project.clientId?.name || "My Project"})
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                    project.status
                  )}`}
                >
                  {project.status?.toUpperCase()}
                </span>
                {days !== null && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      days < 0
                        ? "bg-red-100 text-red-600"
                        : days <= 7
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {days < 0
                      ? `${Math.abs(days)}d overdue`
                      : `${days}d left`}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{project.progress ?? 0}%</span>
                <div
                  className="p-1 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-110"
                  title="Go to Workspace"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      clientId
                        ? `/clients/${clientId}/projects/${project._id}/workspace`
                        : `/projects/${project._id}/workspace`
                    );
                  }}
                >
                  <LayoutDashboard
                    size={18}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${project.progress ?? 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-[500px] mt-2" : "max-h-0"
          }`}
        >
          {isExpanded && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-b-xl p-4 sm:p-5 space-y-4">
              {/* Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-500" /> Timeline
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Start:</strong> {formatDate(project.startDate)}{" "}
                    <span className="mx-1">|</span>
                    <strong>End:</strong> {formatDate(project.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1 flex items-center">
                    <BarChart2 size={16} className="mr-2 text-blue-500" /> Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {project.status}{" "}
                    <span className="mx-1">|</span>
                    <strong>Completion:</strong> {project.progress ?? 0}%
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-sm text-gray-600">
                  {project.description || "No description provided"}
                </p>
              </div>

              {/* Team */}
              {project.collaborators?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Users size={16} className="mr-2 text-blue-500" /> Team
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.collaborators.map((c) => {
                      const initials = c.userId?.name
                        ? c.userId.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?";
                      return (
                        <div
                          key={c.userId?._id}
                          className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                            {initials}
                          </div>
                          <span className="text-sm text-gray-700 truncate">
                            {c.userId?.name || "Unknown"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            Projects
          </h2>
          <button
            onClick={() =>
              navigate(
                clientId
                  ? `/clients/${clientId}/projects/add`
                  : `add`
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium shadow transition duration-300 ease-in-out w-full sm:w-auto"
          >
            + Add Project
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic">No projects available</p>
        ) : (
          <div className="space-y-8">
            {/* Overdue */}
            {overdueProjects.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-3">
                  <AlertTriangle size={18} /> Overdue
                </h3>
                {overdueProjects.map((p, idx) => renderProjectRow(p, idx))}
              </div>
            )}

            {/* Due Soon */}
            {dueSoonProjects.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-600 mb-3">
                  <Clock size={18} /> Due Soon
                </h3>
                {dueSoonProjects.map((p, idx) => renderProjectRow(p, idx))}
              </div>
            )}

            {/* Active */}
            {activeProjects.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-600 mb-3">
                  <CheckCircle size={18} /> Active
                </h3>
                {activeProjects.map((p, idx) => renderProjectRow(p, idx))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
