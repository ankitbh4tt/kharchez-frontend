import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import ExpenseDetails from './ExpenseDetails';
import EditExpense from './EditExpense';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        console.log('Fetching expenses from:', `${API_BASE_URL}/api/expenses/allExpenses`);
        const response = await axios.get(`${API_BASE_URL}/api/expenses/allExpenses`, {
          withCredentials: true,
        });
        setExpenses(response.data);
        if (response.data.length > 0) {
          toast.success('Expenses loaded successfully!', { position: 'top-right', autoClose: 2000 });
        } else {
          toast.info('No expenses found for this month!', { position: 'top-right', autoClose: 2000 });
        }
      } catch (error) {
        console.error('Fetch error:', error.response || error);
        toast.error(error.response?.data?.message || 'Failed to load expenses!', { position: 'top-right', autoClose: 2000 });
      }
    };
    fetchExpenses();
  }, []);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const openModal = async (expenseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expenses/expense/${expenseId}`, {
        withCredentials: true,
      });
      setSelectedExpense(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching expense details:', error);
      toast.error('Failed to load expense details!', { position: 'top-right', autoClose: 2000 });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  const confirmDelete = (expenseId) => {
    setExpenseToDelete(expenseId);
    setIsDeleteModalOpen(true);
  };

  const deleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/expense/${expenseToDelete}`, {
        withCredentials: true,
      });
      setExpenses(expenses.filter((exp) => exp._id !== expenseToDelete));
      toast.success('Expense deleted!', { position: 'top-right', autoClose: 2000 });
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense!', { position: 'top-right', autoClose: 2000 });
    }
  };

  return (
    <div className="pt-16 px-4 sm:pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            Expenses for {currentMonth}
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddExpense}
            className="bg-indigo-600 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full flex items-center justify-center gap-2 shadow-md hover:bg-indigo-700 transition-all duration-300"
          >
            <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
            Add Expense
          </motion.button>
        </div>

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 max-w-md mx-auto"
          >
            <p className="text-gray-600 text-lg font-medium italic">
              No expenses this month yet. Add some to get started!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {expenses.map((expense) => {
              const dateObj = new Date(expense.date);
              const dateStr = dateObj.toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              const timeStr = dateObj.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              return (
                <motion.div
                  key={expense._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: expenses.indexOf(expense) * 0.1 }}
                  onClick={() => openModal(expense._id)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer relative group"
                >
                  {/* Expense Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate mb-2">
                      {expense.title}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-indigo-600 mb-4">
                      ₹{expense.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600 font-medium">Date:</div>
                      <span className="text-sm text-gray-500 ml-2">{dateStr}</span>
                      <span className="text-indigo-600 bg-indigo-50 py-1 px-3 rounded-full text-xs sm:text-sm font-medium ml-auto">
                        {expense.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Action Row with Time and Icons */}
                  <div className="flex items-center justify-between border-t border-gray-100 p-3 bg-gray-50">
                    <span className="text-sm text-gray-500">{timeStr}</span>
                    <div className="flex gap-3 sm:gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExpense(expense);
                          setIsEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                        aria-label="Edit expense"
                      >
                        <FaEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(expense._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete expense"
                      >
                        <FaTrash className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(expense._id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="View expense details"
                      >
                        <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Edit Expense Modal */}
        {isEditModalOpen && (
          <EditExpense
            expense={selectedExpense}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={(updatedExpense) =>
              setExpenses(expenses.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp)))
            }
          />
        )}

        {/* Expense Detail Modal */}
        {isModalOpen && (
          <ExpenseDetails
            expense={selectedExpense}
            onClose={closeModal}
            onUpdate={(updatedExpense) =>
              setExpenses(expenses.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp)))
            }
            onDelete={(expenseId) => setExpenses(expenses.filter((exp) => exp._id !== expenseId))}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.5 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setExpenseToDelete(null);
                  }}
                  className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteExpense}
                  className="bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;