import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const adminLinks = (
    <>
      <Link to="/admin/dashboard" className="hover:text-blue-600">
        Dashboard
      </Link>
      <Link to="/admin/users" className="hover:text-blue-600">
        Users
      </Link>
      <Link to="/admin/stores" className="hover:text-blue-600">
        Stores
      </Link>
    </>
  );

  const userLinks = (
    <Link to="/stores" className="hover:text-blue-600">
      Stores
    </Link>
  );

  const ownerLinks = (
    <Link to="/owner/dashboard" className="hover:text-blue-600">
      Dashboard
    </Link>
  );

  const roleLinks =
    user.role === 'ADMIN'
      ? adminLinks
      : user.role === 'OWNER'
        ? ownerLinks
        : userLinks;

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-gray-900">
            Store Rating
          </Link>
          <div className="flex gap-4 text-sm text-gray-700">{roleLinks}</div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-sm text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
