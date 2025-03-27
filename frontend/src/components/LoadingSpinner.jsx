
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        {/* Outer circle with transparent border */}
        <div className="w-20 h-20 border-4 border-gray-300 border-opacity-30 rounded-full" />
        
        {/* Spinning top border */}
        <div className="w-20 h-20 border-4 border-t-emerald-500 border-transparent animate-spin rounded-full absolute left-0 top-0" />
        
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

