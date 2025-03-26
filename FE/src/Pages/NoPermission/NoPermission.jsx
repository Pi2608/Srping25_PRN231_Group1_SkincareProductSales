import React from 'react';
import { Link } from 'react-router-dom';

const NoPermission = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 mx-auto text-red-500 mb-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. 
          Please contact the administrator if you believe this is an error.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Go to Home
          </Link>
          
          <Link 
            to="/login" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoPermission;