// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AddExpense, Dashboard, EditExpense, ExpenseDetails, Login, NotFound, ProtectedRoute, Register, Navbar, History } from './pages/export.js';
import { useAuth } from './Context/authContext';
import { useLocation } from 'react-router-dom';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-0"> {/* Offset for fixed navbar height */}
        <Routes>
          {/* Protected Routes (require authentication) */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-expense/:id" element={<EditExpense />} />
            <Route path="/expense/:id" element={<ExpenseDetails />} />
            <Route path="/history" element={<History />} />
          </Route>

          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;