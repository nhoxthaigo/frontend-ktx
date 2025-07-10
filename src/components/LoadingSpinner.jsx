import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-2"></div>
      <span className="text-sm text-gray-600">Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
