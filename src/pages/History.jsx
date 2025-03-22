import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import ExpenseDetails from './ExpenseDetails';

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for date range, expenses, custom picker, summary toggle, and modal
  const [range, setRange] = useState({ from: null, to: null });
  const [expenses, setExpenses] = useState([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Initialize dates from query params
  const queryParams = new URLSearchParams(location.search);
  const initialStart = queryParams.get('start') ? new Date(queryParams.get('start')) : null;
  const initialEnd = queryParams.get('end') ? new Date(queryParams.get('end')) : null;

  // Preset range options (trading app style)
  const rangeOptions = [
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
  ];

  // Handle range selection
  const handleRangeSelect = (option) => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (option.days - 1));
    const newRange = { from: start, to: end };
    setRange(newRange);
    const startISO = newRange.from.toISOString();
    const endISO = newRange.to.toISOString();
    navigate(`/history?start=${startISO}&end=${endISO}`);
    fetchExpenses(startISO, endISO);
    toast.success(`${option.label} range applied!`, { position: 'top-right', autoClose: 2000 });
  };

  // Custom picker submit
  const handleCustomSubmit = () => {
    if (range.from && range.to) {
      const startISO = range.from.toISOString();
      const endISO = range.to.toISOString();
      navigate(`/history?start=${startISO}&end=${endISO}`);
      fetchExpenses(startISO, endISO);
      toast.success('Custom range applied!', { position: 'top-right', autoClose: 2000 });
      setShowCustomPicker(false);
    } else {
      toast.error('Please select a full range!', { position: 'top-right', autoClose: 2000 });
    }
  };

  // Fetch expenses from backend
  const fetchExpenses = async (start, end) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expenses/history`, {
        params: { start, end },
        withCredentials: true,
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses!', { position: 'top-right', autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL changes and fetch data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newStart = params.get('start') ? new Date(params.get('start')) : null;
    const newEnd = params.get('end') ? new Date(params.get('end')) : null;
    setRange({ from: newStart, to: newEnd });
    if (newStart && newEnd) {
      const startISO = newStart.toISOString();
      const endISO = newEnd.toISOString();
      fetchExpenses(startISO, endISO);
    }
  }, [location.search]);

  // Calculate summary data
  const calculateSummary = () => {
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Category-wise breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || expense.category || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = { count: 0, amount: 0 };
      }
      acc[categoryName].count += 1;
      acc[categoryName].amount += expense.amount;
      return acc;
    }, {});

    return { totalExpenses, totalAmount, categoryBreakdown };
  };

  const summary = calculateSummary();

  // Handle card click to open modal
  const handleCardClick = (expense) => {
    setSelectedExpense(expense);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedExpense(null);
  };

  // Custom calendar logic
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= totalDays; day++) days.push(new Date(year, month, day));
    return days;
  };

  const handleDayClick = (day) => {
    if (!day) return;
    if (!range.from || (range.from && range.to)) {
      setRange({ from: day, to: null });
    } else if (day < range.from) {
      setRange({ from: day, to: range.from });
    } else {
      setRange({ ...range, to: day });
    }
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-6 md:p-8">
        {/* Header and Range Navbar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            History Dashboard
          </h1>
          <div className="flex flex-wrap gap-2 bg-indigo-50 rounded-xl p-4 items-center justify-center md:justify-end shadow-md">
            {rangeOptions.map((option) => (
              <motion.button
                key={option.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRangeSelect(option)}
                className={`py-2 px-4 rounded-full font-medium text-sm transition-all duration-300 ${
                  range.from &&
                  range.to &&
                  range.to.getTime() - range.from.getTime() === (option.days - 1) * 24 * 60 * 60 * 1000
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-indigo-700 hover:bg-indigo-100 hover:shadow-md'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCustomPicker(true)}
              className={`py-2 px-4 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                range.from &&
                range.to &&
                !rangeOptions.some(
                  (opt) => range.to.getTime() - range.from.getTime() === (opt.days - 1) * 24 * 60 * 60 * 1000
                )
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-indigo-700 hover:bg-indigo-100 hover:shadow-md'
              }`}
            >
              <FaCalendarAlt className="h-4 w-4" />
              <span>Custom</span>
            </motion.button>
          </div>
        </div>

        {/* History Content */}
        <div className="bg-gray-50 rounded-xl p-6">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center h-32">
              <p className="text-gray-600 text-lg">Loading expenses...</p>
            </motion.div>
          ) : range.from && range.to ? (
            <>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Showing records from{' '}
                <span className="font-bold text-indigo-700">{range.from.toLocaleDateString()}</span> to{' '}
                <span className="font-bold text-indigo-700">{range.to.toLocaleDateString()}</span>
              </p>

              {/* Summary Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-5 mb-6 shadow-lg border-l-4 border-indigo-500"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-indigo-800 mb-2">Summary</h2>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Total Expenses: <span className="font-semibold text-indigo-700">{summary.totalExpenses}</span>
                      </p>
                      <p className="text-gray-600">
                        Total Amount: <span className="font-semibold text-indigo-700">₹{summary.totalAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <button
                      onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Category Breakdown
                      {showCategoryBreakdown ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <AnimatePresence>
                      {showCategoryBreakdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-1"
                        >
                          {Object.entries(summary.categoryBreakdown).length > 0 ? (
                            Object.entries(summary.categoryBreakdown).map(([category, data]) => (
                              <p key={category} className="text-gray-600 text-sm">
                                <span className="font-medium">{category}</span>: {data.count} expense{data.count !== 1 ? 's' : ''} (₹{data.amount.toFixed(2)})
                              </p>
                            ))
                          ) : (
                            <p className="text-gray-500 italic text-sm">No categories to display.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Expenses Grid */}
              {expenses.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {expenses.map((expense) => (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: expenses.indexOf(expense) * 0.1 }}
                      onClick={() => handleCardClick(expense)}
                      className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">{expense.title}</h3>
                      <p className="text-gray-600 text-sm mb-1">
                        Date: {new Date(expense.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Amount: <span className="font-medium text-indigo-700">₹{expense.amount.toFixed(2)}</span>
                      </p>
                      <p className="text-indigo-600 text-sm">
                        Category: {expense.category?.name || expense.category || 'N/A'}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-lg italic text-center py-10"
                >
                  No expenses found for this range.
                </motion.p>
              )}
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-lg italic text-center py-10"
            >
              No date range selected. Pick a range above to view history.
            </motion.p>
          )}
        </div>

        {/* Expense Details Modal */}
        {selectedExpense && (
          <ExpenseDetails
            expense={selectedExpense}
            onClose={handleCloseModal}
            onUpdate={() => {}} // Placeholder, not used in read-only mode
            onDelete={() => {}} // Placeholder, not used in read-only mode
            readOnly={true} // Disable edit/delete functionality
          />
        )}

        {/* Custom Date Picker Popup */}
        {showCustomPicker && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-2xl font-bold text-indigo-800 mb-5 text-center">Custom Date Range</h2>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={prevMonth}
                    className="text-indigo-600 hover:text-indigo-800 text-xl font-bold"
                  >
                    ←
                  </button>
                  <span className="text-lg font-semibold text-indigo-700">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="text-indigo-600 hover:text-indigo-800 text-xl font-bold"
                  >
                    →
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="font-medium text-gray-700">{day}</div>
                  ))}
                  {generateDays().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      disabled={!day}
                      className={`w-10 h-10 rounded-full text-center flex items-center justify-center ${
                        !day
                          ? 'invisible'
                          : range.from && range.to && day >= range.from && day <= range.to
                          ? 'bg-indigo-600 text-white font-medium'
                          : (range.from?.toDateString() === day?.toDateString() ||
                              range.to?.toDateString() === day?.toDateString())
                          ? 'bg-indigo-700 text-white font-medium'
                          : 'bg-white text-gray-800 hover:bg-indigo-100 hover:text-indigo-700'
                      }`}
                    >
                      {day ? day.getDate() : ''}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={handleCustomSubmit}
                  className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-200"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;