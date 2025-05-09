import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold mb-4 text-red-500">Error 404: Page Not Found</h1>
      <p className="text-2xl mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="text-xl text-blue-500 underline">
        Back to Home
      </Link>
    </div>
  );
}