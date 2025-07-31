import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ClientList from './Context/clientList';
import AddClient from './Context/addClient';
import EditClient from './Context/EditClient';
import PrivateRoute from './Context/privateRoute';
import ClientProvider from './Context/clientContext';
 
function App() {
  return (
    <BrowserRouter>
      <ClientProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clients/add" element={<PrivateRoute><AddClient /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
          <Route path="/clients/edit/:id" element={<PrivateRoute><EditClient /></PrivateRoute>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </ClientProvider>d
    </BrowserRouter>
  )
}

export default App;