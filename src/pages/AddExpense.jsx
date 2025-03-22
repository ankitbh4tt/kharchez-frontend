import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()

  const getAllExpCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expenses/getCategories`, {
        withCredentials: true,
      });
      if (!response.data.length) {
        return toast.error('No Categories Found', { position: 'top-right', autoClose: 2000 });
      }
      toast.success('Categories fetched successfully!', { position: 'top-right', autoClose: 2000 });
      setCategories(response.data);
    } catch (error) {
      toast.error(error.message, { position: 'top-right', autoClose: 2000 });
    }
  };

  const handleExpenseFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const amount = formData.get('amount');
    const category = formData.get('categories');
    let description = formData.get('description');
    if(!description){
      description='N/A'
    }
    console.log({ title, amount, category, description });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/expenses/expense`,
        { title, amount, category, description },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data) {
        toast.success(response.data.status || 'Expense added successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
        e.target.reset(); // Reset form after successful submission
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    getAllExpCategories();
  }, []);

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-100 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
          Add New Expense
        </h2>
        <form onSubmit={handleExpenseFormSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-indigo-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter expense title"
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-indigo-700 mb-1"
            >
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter amount"
            />
          </div>


          {/* Category */}
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-indigo-700 mb-1"
            >
              Category
            </label>
            <select
              name="categories"
              id="categories"
              required
              defaultValue=""
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

                    {/* Description */}
                    <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-indigo-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter description (optional)"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            Add Expense
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddExpense;