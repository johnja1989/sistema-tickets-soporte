import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;