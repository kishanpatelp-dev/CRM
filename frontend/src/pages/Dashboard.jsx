import { useClient } from "../Context/clientContext";
import Layout from "../Context/layout";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, count, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className={`p-5 rounded-xl shadow-sm ${colorClasses[color]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

const Dashboard = () => {
  const { clients, loading } = useClient();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <p className="p-6">Loading...</p>
      </Layout>
    );
  }

  // Count stats
  const total = clients.length;
  const active = clients.filter((c) => c.status === "active").length;
  const pending = clients.filter((c) => c.status === "pending").length;
  const inactive = clients.filter((c) => c.status === "inactive").length;

  // Sort by createdAt for recent list
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const StatusBadge = ({ status }) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => navigate("/clients/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Quick Add
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Clients" count={total} color="blue" />
          <StatCard title="Active" count={active} color="green" />
          <StatCard title="Pending" count={pending} color="yellow" />
          <StatCard title="Inactive" count={inactive} color="red" />
        </div>

        {/* Recently Added Clients */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recently Added Clients
          </h2>
          {recentClients.length === 0 ? (
            <p className="text-gray-500">No recent clients</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentClients.map((client) => (
                <div
                  key={client._id}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="mb-3 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{client.name}</h3>
                      <p className="text-sm text-blue-600">{client.company || "No Company"}</p>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                  <div className="text-sm text-gray-700 space-y-1 mb-3">
                    {client.email && <p><strong>Email:</strong> {client.email}</p>}
                    {client.phone && <p><strong>Phone:</strong> {client.phone}</p>}
                  </div>
                  <p className="text-xs text-gray-500 italic mb-4">
                    Added {formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
