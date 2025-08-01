import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../Context/clientContext";
import Layout from "../Context/layout";

const Dashboard = () => {
  const { clients, loading, error } = useClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleViewClient = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <Layout>
      <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Your Clients</h3>
            <button
              onClick={() => navigate("/clients/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              + Quick Add
            </button>
          </div>
      </div>
    </Layout>
  );
};

export default Dashboard;