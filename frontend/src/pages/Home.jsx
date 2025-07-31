import React from 'react';
import { Link } from 'react-router-dom'; // Optional: for navigation to /login

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to the Home Page</h1>
      <p>This is a basic React component for your home route.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default Home;