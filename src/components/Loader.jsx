import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Spinning Coin */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700 shadow-lg flex items-center justify-center animate-spin">
        <span className="text-3xl font-bold text-green-800">$</span>
      </div>
      {/* Animated Text */}
      <p className="mt-4 text-lg font-semibold text-gray-600 animate-pulse">
        Calculating your expenses...
      </p>
    </div>
  );
};

export default Loader;