import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Determine if the user is authenticated based on userId
  const isAuthenticated = !!userId; // True if userId exists, false otherwise

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/verify`, { withCredentials: true });
      if (res.data.authenticated) {
        setUserId(res.data.userId);
      } else {
        setUserId(null);
      }
    } catch (error) {
      setUserId(null);
      console.error('Auth verification error:', error);
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUserId(null); // Clear user state
      return true; // Indicate success
    } catch (error) {
      toast.error("Logout Failed!");
      return false; // Indicate failure
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated, verifyUser,logout, loading }}>
      {children}
      <ToastContainer 
        position="top-right"
        autoClose={3000} // Close after 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};