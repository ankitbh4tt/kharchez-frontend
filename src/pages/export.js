// src/pages/export.js
import Register from './Register';
import Login from './Login';
import AddExpense from './AddExpense';
import Dashboard from './Dashboard';
import EditExpense from './EditExpense';
import ExpenseDetails from './ExpenseDetails';
import NotFound from './NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar/Navbar'; // Import Navbar from components
import History from './History'; // Import History from pages

export {
  Register,
  Login,
  AddExpense,
  Dashboard,
  EditExpense,
  NotFound,
  ExpenseDetails,
  ProtectedRoute,
  Navbar, // Export Navbar
  History, // Export History
};