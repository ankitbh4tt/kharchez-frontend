import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const ExpenseDetails = ({ expense, onClose, onUpdate, onDelete, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState({ ...expense });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle edit toggle
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited expense
  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/expenses/expense/${editedExpense._id}`,
        editedExpense,
        { withCredentials: true }
      );
      console.log(response.data.updatedExpense);
      onUpdate(response.data.updatedExpense);
      setEditedExpense(response.data.updatedExpense);
      setIsEditing(false);
      toast.success('Expense updated!', { position: 'top-right', autoClose: 2000 });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense!', { position: 'top-right', autoClose: 2000 });
    }
  };

  // Open delete confirmation modal
  const confirmDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // Delete expense
  const deleteExpense = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/expense/${expense._id}`, {
        withCredentials: true,
      });
      onDelete(expense._id);
      onClose();
      toast.success('Expense deleted!', { position: 'top-right', autoClose: 2000 });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense!', { position: 'top-right', autoClose: 2000 });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">Expense Details</h2>

          {/* Expense Details */}
          {isEditing && !readOnly ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedExpense.title}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editedExpense.amount}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={new Date(editedExpense.date).toISOString().split('T')[0]}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editedExpense.category?.name || editedExpense.category || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editedExpense.description || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={saveEdit}
                  className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save
                </button>
                <button
                  onClick={toggleEdit}
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-800">{expense?.title}</p>
              <p className="text-gray-600">Amount: ${expense?.amount.toFixed(2)}</p>
              <p className="text-gray-600">
                Date: {new Date(expense?.date).toLocaleDateString()}
              </p>
              <p className="text-indigo-600 font-medium">
                Category: {expense?.category?.name || expense?.category || 'N/A'}
              </p>
              <p className="text-gray-600 break-words">
                Description: {expense?.description || 'N/A'}
              </p>
              <p className="text-gray-600">Created By: {expense?.user?.userName || 'N/A'}</p>

              {!readOnly && (
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleEdit}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                  >
                    <FaEdit className="h-4 w-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-red-700"
                  >
                    <FaTrash className="h-4 w-4" />
                    Delete
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Delete Confirmation Modal (only shown if not read-only) */}
          {!readOnly && isDeleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
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
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      deleteExpense();
                      setIsDeleteModalOpen(false);
                    }}
                    className="bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExpenseDetails;