import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/notFound';
import ClientList from './Context/clientList';
import AddClient from './Context/addClient';
import EditClient from './Context/EditClient';
import PrivateRoute from './Context/privateRoute';
import ClientProvider from './Context/clientContext';
import ClientProjects from './projects/ProjectsList';
import CreateProject from './projects/createProject';
import ProjectList from './projects/ProjectsList';

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
          <Route path="/clients/:clientId/projects" element={<PrivateRoute><ClientProjects /></PrivateRoute>} />
          <Route path="/clients/:clientId/projects/add" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><ProjectList clientId={null} /></PrivateRoute>} />
          <Route path="/projects/add" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClientProvider>
    </BrowserRouter>
  )
}

export default App;