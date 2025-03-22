import React, { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/authContext';
import { FaBars, FaTimes, FaSignOutAlt, FaHistory, FaPiggyBank } from 'react-icons/fa';
import Logo from '/kharchezLogo.png';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
      toast.success('Logged out successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/', label: 'Expenses', icon: FaPiggyBank },
    { to: '/history', label: 'History', icon: FaHistory }, // No onClick for date inputs
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 15, duration: 0.5 } },
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 } },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed top-0 w-full bg-gradient-to-br from-blue-500 via-indigo-800 to-teal-900 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <motion.img
                src={Logo}
                alt="KharcheZ"
                className="h-10 w-auto object-contain mr-2 md:h-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, duration: 0.8 }}
              />
              {/* <span className="text-white font-bold text-lg md:text-xl">ExpTrack</span> */}
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <motion.div key={link.to} variants={itemVariants}>
                <NavLink
                  to={link.to}
                  onClick={link.onClick}
                  className={({ isActive }) =>
                    `text-white hover:text-teal-300 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                      isActive ? 'bg-teal-600/20' : ''
                    }`
                  }
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div variants={itemVariants} className="flex items-center space-x-4">
              <motion.button
                onClick={handleLogout}
                className="text-white hover:text-red-300 transition-colors duration-300 flex items-center px-3 py-2 rounded-md text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt className="mr-2 h-4 w-4" /> Logout
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-teal-600/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          variants={menuVariants}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <motion.div key={link.to} variants={itemVariants}>
                <NavLink
                  to={link.to}
                  onClick={() => {
                    setIsOpen(false);
                    if (link.onClick) link.onClick();
                  }}
                  className={({ isActive }) =>
                    `text-white flex px-3 py-2 rounded-md text-base font-medium hover:bg-teal-600/20 items-center gap-2 ${
                      isActive ? 'bg-teal-600/20' : ''
                    }`
                  }
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-white w-full flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-red-600/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt className="mr-2 h-4 w-4" /> Logout
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;