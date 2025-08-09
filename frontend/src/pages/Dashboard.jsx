import { useClient } from "../Context/clientContext";
import Layout from "../components/layout";
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

  const total = clients.length;
  const active = clients.filter((c) => c.status === "active").length;
  const pending = clients.filter((c) => c.status === "pending").length;
  const inactive = clients.filter((c) => c.status === "inactive").length;

  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const StatusBadge = ({ status }) => {
    const colors = {
      active: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      inactive: "bg-red-500 text-white",
    };
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
          colors[status] || "bg-gray-300 text-gray-800"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium shadow transition duration-300 ease-in-out w-full sm:w-auto"
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
                  className="relative bg-gradient-to-br from-blue-100/70 to-white/30 backdrop-blur-md border border-blue-100 shadow-md rounded-3xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-blue-100"
                >
                  {/* Name & Company */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-blue-900">
                      {client.name}
                    </h3>
                    <p className="text-sm italic text-blue-500">
                      {client.company || "No Company"}
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="text-base text-gray-700 space-y-1 mb-5">
                    {client.email && (
                      <p>
                        <span className="font-medium text-gray-600">Email:</span>{" "}
                        {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p>
                        <span className="font-medium text-gray-600">Phone:</span>{" "}
                        {client.phone}
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-gray-600">Status:</span>{" "}
                      <StatusBadge status={client.status} />
                    </p>
                    <p className="text-xs text-gray-400 italic mt-2">
                      Created{" "}
                      {formatDistanceToNow(new Date(client.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
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
