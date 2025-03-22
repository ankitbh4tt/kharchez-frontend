import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const EditExpense = ({ expense: initialExpense, onClose, onUpdate }) => {
  const [expense, setExpense] = useState(initialExpense || {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/expenses/getCategories`, {
          withCredentials: true,
        });
        if (response.data.length) {
          setCategories(response.data);
        } else {
          toast.error('No categories found!', { position: 'top-right', autoClose: 2000 });
        }
      } catch (error) {
        toast.error(error.message, { position: 'top-right', autoClose: 2000 });
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Preserve the original date
    const updatedExpense = {
      ...expense,
      date: initialExpense.date, // Keep the original date
    };
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/expenses/expense/${expense._id}`,
        updatedExpense,
        { withCredentials: true }
      );
      if (response.data) {
        toast.success('Expense updated successfully!', { position: 'top-right', autoClose: 2000 });
        onUpdate(response.data); // Update the parent state
        onClose(); // Close the modal
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update expense!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
          Edit Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={expense.title || ''}
              onChange={handleChange}
              required
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter expense title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={expense.description || ''}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">Category</label>
            <select
              name="category"
              value={expense.category?._id || expense.category || ''}
              onChange={handleChange}
              required
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
            <input
              type="text"
              value={new Date(expense.date).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <FaSave className="h-4 w-4 inline mr-2" /> Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditExpense;