import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import Layout from "../components/layout";

const CreateProject = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/projects/create",
        { ...form, ...(clientId ? { clientId } : {}) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (clientId) {
        navigate(`/clients/${clientId}/projects`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {clientId ? "Add Project for Client" : "Add Project"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
      </div>
    </Layout>
  );
};

export default CreateProject;
