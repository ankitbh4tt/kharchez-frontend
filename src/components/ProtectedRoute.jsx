import React from 'react'
import {Navigate,Outlet} from 'react-router-dom'
import {useAuth} from '../Context/authContext'
import Navbar from './Navbar/Navbar';

const ProtectedRoute = ({ children }) => {
  const { userId, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!userId) return <Navigate to="/login" />;

  return (
    <>
      <Navbar /> {/* Render Navbar only for authenticated, protected routes */}
      <Outlet /> {/* Render child routes (e.g., Dashboard, History) */}
    </>
  );
};


export default ProtectedRoute;