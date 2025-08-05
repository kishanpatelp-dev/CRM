import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axiosInstance";

const defaultAvatar = "/assets/default-avatar.svg";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("/profile");
        const data = res.data;
        if (data.success && data.user) {
          if (data.user.avatarUrl) {
            setAvatarUrl(data.user.avatarUrl);
          }
        } else {
          console.warn("Could not load user:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleImgError = () => {
    if (avatarUrl !== defaultAvatar) setAvatarUrl(defaultAvatar);
  };

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "👤", label: "Clients", path: "/clients" },
    { icon: "🏢", label: "Companies", path: "/companies" },
    { icon: "📅", label: "Calendar", path: "/calendar" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white border-r border-transparent shadow-sm [border-image:linear-gradient(to_bottom,theme(colors.blue.400),theme(colors.blue.100))_1] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 ">
          <h1 className="text-xl font-semibold">ClientFlow</h1>
          <p className="text-sm text-gray-500">Customer Management</p>
        </div>
        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold uppercase text-gray-600 mb-2">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-r border-gray-200 px-6 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                ClientFlow Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Welcome back, manage your clients efficiently.
              </p>
            </div>
          </div>

          {/* Avatar + hover dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button
                aria-label="User menu"
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white font-medium uppercase focus:outline-none"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="profile"
                    onError={handleImgError}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>U</span>
                )}
              </button>

              {/* dropdown on hover */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-auto transition-all duration-150 absolute right-0 top-full mt-2 w-48 bg-black text-white rounded-lg shadow-lg overflow-hidden text-sm z-10">
                <div className="py-3 flex flex-col">
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-5 py-3 text-left hover:bg-gray-800"
                  >
                    My Profile
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  <button
                    onClick={handleLogout}
                    className="px-5 py-3 text-left hover:bg-gray-800"
                  >
                    Log Out
                  </button>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
