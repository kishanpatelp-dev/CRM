import { createContext, useState,useContext, useEffect } from "react";
import axios from "../utils/axiosInstance";

const ClientContext = createContext();

export const useClient = () => useContext(clientContext);

export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        try{
            const res = await axios.get("/clients");
            setClients(res.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <ClientContext.Provider value={{ clients, setClients, loading, fetchClients }}>    
            {children}
        </ClientContext.Provider>
    );
    
};
