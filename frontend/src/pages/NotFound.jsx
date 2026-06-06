import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function NotFound() {
  useEffect(() => {
    document.title = '404 - Page not found';
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link to="/login" className="mt-4 text-blue-600 hover:underline">
        Go to Login
      </Link>
    </div>
  );
}

export default NotFound;
