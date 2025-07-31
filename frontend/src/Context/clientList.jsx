import { useClient } from '../Context/clientContext';
import axios from '../utils/axiosInstance';

const ClientList = () => {
  const { clients, loading, fetchClients, setClients } = useClient();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`/clients/${id}`);
        setClients(clients.filter(client => client._id !== id));
        fetchClients(); 
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Clients</h1>
      <ul>
        {clients.map(client => (
          <li key={client._id} className="border p-2 mb-2">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Company:</strong> {client.company}</p>
            <p><strong>Status:</strong> {client.status}</p>
            <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(client._id)}>Delete</button>
            <a href={`/clients/edit/${client._id}`} className="ml-2 bg-blue-500 text-white px-2 py-1">Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
