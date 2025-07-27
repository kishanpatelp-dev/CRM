import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useClient from '../Context/clientContext';
import axios from '../utils/axiosInstance';

const EditClient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchClients } = useClient();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        const getClient = async () => {
            try {
                const response = await axios.get(`/clients/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        getClient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/clients/${id}`, formData);
            await fetchClients();
            navigate('/clients');
        } catch (error) {
            console.error('Error updating client:', error);
        }
    }

    return (
        <div className="edit-client">
            <h2>Edit Client</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Client</button>
            </form>
        </div>
    )
}

export default EditClient;