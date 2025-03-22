import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

import { API_BASE_URL } from '../config/api';
import logo from '../img/kharchezLogo.png';

const Register = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [error, setError] = useState(null); // Track errors for debugging
  const navigate = useNavigate();

  useEffect(() => {
    let filled = 0;
    if (userName.trim()) filled++;
    if (email.trim()) filled++;
    if (password.trim()) filled++;
    setFormProgress((filled / 3) * 100);
  }, [userName, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting registration with:', { userName, email, password });
    if (!userName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { userName, password, email },
        { withCredentials: true }
      );
      console.log('Registration response:', response.data);
      if (response.data.status) {
        toast.success(response.data.status, {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError('Registration failed: ' + (error.response?.data?.error || error.message));
      toast.error('Registration failed. Check your details or server connection.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 15, duration: 0.5 },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3, ease: 'easeInOut' } },
    tap: { scale: 0.98 },
  };

  return (
    <div className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-teal-900 md:p-2">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/10 w-full max-w-sm mx-auto z-10 relative overflow-hidden sm:max-w-md md:max-w-md lg:max-w-lg md:p-5"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-3 md:mb-4">
          <motion.img
            src={logo}
            alt="Piggy Bank Logo"
            className="h-16 w-auto object-contain md:h-18"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, duration: 0.8 }}
          />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-center text-2xl font-bold text-white mb-2 tracking-wide md:text-3xl md:mb-3"
        >
          Create Account
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-200 mb-3 font-medium md:text-base md:mb-4"
        >
          Every Paisa Counts. Every Journey Matters. Join KharcheZ.
        </motion.p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-300 text-xs mb-3"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="w-full bg-white/10 h-1 mb-3 rounded-full overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="h-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="space-y-3 md:space-y-4"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-teal-300">
                <FaUser className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
              <input
                type="text"
                name="userName"
                id="userName"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                autoComplete="username"
                required
                placeholder="Username"
                className="w-full py-2.5 px-8 bg-white/5 border border-teal-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 shadow-sm md:py-3 md:px-9"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-teal-300">
                <FaEnvelope className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                autoComplete="email"
                required
                placeholder="Email"
                className="w-full py-2.5 px-8 bg-white/5 border border-teal-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 shadow-sm md:py-3 md:px-9"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-teal-300">
                <FaLock className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                required
                placeholder="Password"
                className="w-full py-2.5 px-8 bg-white/5 border border-teal-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 shadow-sm md:py-3 md:px-9"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2.5 px-5 rounded-lg bg-teal-600 text-white font-medium text-base shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 md:py-3 md:px-6 md:text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-5 text-center md:mt-6"
        >
          <motion.p className="text-xs text-gray-200 md:text-sm">
            Already have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                to="/login"
                className="font-medium text-teal-300 hover:text-white transition-colors duration-300 underline underline-offset-2"
              >
                Sign in
              </Link>
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;