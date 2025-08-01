import { useClient } from "../Context/clientContext";
import { useNavigate } from "react-router-dom";
import Layout from "../Context/layout";
import axios from "../utils/axiosInstance";
import { formatDistanceToNow } from "date-fns"; 
 

const Clients = () => {
  const { clients, loading, fetchClients, setClients } = useClient();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`/clients/${id}`);
        setClients(clients.filter((client) => client._id !== id));
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      inactive: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
          statusColors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Clients</h2>
          <button
            onClick={() => navigate("/clients/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Client
          </button>
        </div>

        {loading ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-gray-500">No clients found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client._id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                {/* Name & Company */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-blue-900">{client.name}</h3>
                  <p className="text-sm text-blue-600">{client.company || "No Company"}</p>
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
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        client.status === "active"
                          ? "bg-green-100 text-green-800"
                          : client.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 italic mt-2">
                    Created{" "}
                    {formatDistanceToNow(new Date(client.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/clients/edit/${client._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-lg font-medium shadow-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg font-medium shadow-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
