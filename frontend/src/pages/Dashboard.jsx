import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../Context/clientContext";

const Dashboard = () => {
  const { clients, loading, error } = useClient(); // Assume error is provided by useClient
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleViewClient = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">ClientFlow Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome back!</h2>
        <p className="text-gray-600 text-lg mb-8">Manage your clients effectively with ClientFlow.</p>
        
        <div className="mt-8">
          {loading ? (
            <p className="text-gray-600">Loading clients...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : clients.length === 0 ? (
            <p className="text-gray-500">No clients found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="bg-white shadow-md p-4 rounded-xl border border-gray-200 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-sm text-gray-600">Email: {client.email}</p>
                  <p className="text-sm text-gray-600">Phone: {client.phone}</p>
                  <p className="text-sm text-gray-600">Company: {client.company}</p>
                  <p className="text-sm text-gray-600">Status: {client.status}</p>
                  <button
                    onClick={() => handleViewClient(client._id)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1 rounded-md transition"
                    aria-label={`View details for ${client.name}`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;