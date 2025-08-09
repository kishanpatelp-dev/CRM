import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import {
  Home,
  Users,
  FolderKanban,
  CalendarDays,
  Settings,
  Menu,
  LogOut,
  User,
} from "lucide-react";

const defaultAvatar = "/assets/default-avatar.svg";

const pageMessages = {
  "/dashboard": "Welcome to your dashboard overview.",
  "/clients": "Manage and view all clients here.",
  "/projects": "Browse and track your projects.",
  "/calendar": "View your schedule and deadlines.",
  "/settings": "Configure your preferences.",
};

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const res = await axios.get("/profile");
        if (res.data.success && res.data.user?.avatarUrl) {
          setAvatarUrl(res.data.user.avatarUrl);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    })();
  }, []);

  const handleImgError = () => {
    setAvatarUrl(defaultAvatar);
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    let pathAcc = "";
    const fetchNames = async () => {
      const crumbs = await Promise.all(
        segments.map(async (seg, i) => {
          pathAcc += `/${seg}`;
          const isId = /^[0-9a-fA-F]{24}$/.test(seg);
          if (isId) {
            const parent = segments[i - 1];
            try {
              if (parent === "clients") {
                const res = await axios.get(`/clients/${seg}`);
                return {
                  name: res.data?.client?.name || "Client",
                  path: null, // IDs not clickable
                };
              }
              if (parent === "projects") {
                const res = await axios.get(`/projects/${seg}`);
                return {
                  name: res.data?.project?.name || "Project",
                  path: null,
                };
              }
              if (parent === "tasks") {
                const res = await axios.get(`/tasks/${seg}`);
                return {
                  name: res.data?.task?.title || "Task",
                  path: null,
                };
              }
            } catch {
              return { name: "Unknown", path: null };
            }
          }
          return {
            name: seg.charAt(0).toUpperCase() + seg.slice(1),
            path: i < segments.length - 1 ? pathAcc : null,
          };
        })
      );
      setBreadcrumbs(crumbs);
    };
    fetchNames();
  }, [location.pathname]);

  useEffect(() => {
    const topPath = "/" + (location.pathname.split("/").filter(Boolean)[0] || "");
    setPageMessage(pageMessages[topPath] || "");
  }, [location.pathname]);

  const isInsideClients = location.pathname.startsWith("/clients/");
  const isInsideProjectsUnderClient =
    /\/clients\/[^/]+\/projects/.test(location.pathname);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            ClientFlow
          </h1>
          <p className="text-sm text-gray-500">Customer Management</p>
        </div>
        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold uppercase text-gray-500 mb-3">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path) ||
              (item.path === "/clients" && isInsideClients);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          {isInsideProjectsUnderClient && (
            <div className="ml-8 mt-2">
              <button
                onClick={() => {
                  const clientId = location.pathname.split("/")[2];
                  navigate(`/clients/${clientId}/projects`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 text-blue-700 text-sm cursor-pointer"
              >
                <FolderKanban className="w-4 h-4" /> Projects
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-3 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  <span>/</span>
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-gray-800">{bc.name}</span>
                  ) : bc.path ? (
                    <Link to={bc.path} className="hover:text-blue-600">
                      {bc.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">{bc.name}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Avatar dropdown */}
          <div className="relative group">
            <button className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white font-medium uppercase focus:outline-none border border-blue-500 shadow-sm cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="profile"
                  onError={handleImgError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden text-sm border border-gray-100 transition-all duration-150">
              <button
                onClick={() => navigate("/profile")}
                className="px-5 py-3 flex items-center gap-2 hover:bg-gray-50 w-full text-left cursor-pointer"
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="px-5 py-3 flex items-center gap-2 hover:bg-gray-50 w-full text-left text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-auto px-8 py-8">
          {pageMessage && (
            <div className="mb-6 text-gray-500 italic">{pageMessage}</div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
