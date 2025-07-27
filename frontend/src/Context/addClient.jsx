import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useClient } from "./clientContext";

const AddClient = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const navigate = useNavigate();
    const { fetchClients } = useClient();

    const handleChange = (e) => setFormData({
        ...formData, [e.target.name]: e.target.value
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post("/clients", formData);
            await fetchClients();
            navigate("/clients");
        } catch (error) {
            console.error("Error adding client:", error);
        }
    }

    return (
        <div>
            <h2>Add Client</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 mb-4 w-full" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 mb-4 w-full" />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border p-2 mb-4 w-full" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Client</button>
            </form>
        </div>
    )
};

export default AddClient;