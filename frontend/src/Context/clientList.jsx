import { useClient } from "../Context/clientContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import axios from "../utils/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import deleteIcon from "../../assets/delete.png";
import pencilIcon from "../../assets/pencil.png";

const Clients = () => {
  const { clients, loading, fetchClients, setClients } = useClient();
  const navigate = useNavigate();

  const handleDelete = async (id, e) => {
    e.stopPropagation();
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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Clients</h2>
          <button
            onClick={() => navigate("/clients/add")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
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
                className="group relative bg-gradient-to-br from-blue-100/70 to-white/30 backdrop-blur-md border border-blue-100 shadow-md rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-blue-100"
                onClick={() => navigate(`/clients/${client._id}/projects`)}
              >
                {/* Icons - always visible on mobile, hover on desktop */}
                <div className="
                  absolute top-5 right-5 flex gap-2
                  opacity-100
                  md:opacity-0 md:group-hover:opacity-100
                  transition-opacity duration-200
                ">
                  <img
                    src={pencilIcon}
                    alt="Edit"
                    className="w-6 h-6 cursor-pointer rounded-full p-1 hover:bg-gray-200 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clients/edit/${client._id}`);
                    }}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="w-6 h-6 cursor-pointer rounded-full p-1 hover:bg-gray-200 transition"
                    onClick={(e) => handleDelete(client._id, e)}
                  />
                </div>

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
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        client.status === "active"
                          ? "bg-green-500 text-white"
                          : client.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {client.status}
                    </span>
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
    </Layout>
  );
};

export default Clients;
