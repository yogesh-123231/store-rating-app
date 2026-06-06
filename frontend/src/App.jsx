import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, getDashboardPath } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Stores from './pages/Stores';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserNew from './pages/AdminUserNew';
import AdminStores from './pages/AdminStores';
import AdminStoreNew from './pages/AdminStoreNew';
import OwnerDashboard from './pages/OwnerDashboard';
import NotFound from './pages/NotFound';

function HomeRedirect() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (token && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <AppLayout>
              <Stores />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <AdminUsers />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <AdminUserNew />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <AdminStores />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <AdminStoreNew />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['OWNER']}>
            <AppLayout>
              <OwnerDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
