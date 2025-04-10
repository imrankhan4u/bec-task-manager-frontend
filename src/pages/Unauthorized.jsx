import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-700 mb-6">Sorry, you don't have access to this page.</p>
      <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
