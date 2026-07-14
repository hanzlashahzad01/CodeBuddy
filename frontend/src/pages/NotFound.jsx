import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center items-center px-4">
      <h1 className="text-9xl font-black text-[var(--color-primary)] mb-4">404</h1>
      <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-6 text-center">Page Not Found</h2>
      <p className="text-xl text-[var(--color-text-muted)] mb-8 text-center max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
