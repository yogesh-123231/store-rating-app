import { useEffect, useState } from 'react';
import { BarChart3, Star, Store, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDashboard } from '../services/adminService.js';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { key: 'totalStores', label: 'Total Stores', icon: Store, color: 'bg-emerald-50 text-emerald-600' },
  { key: 'totalRatings', label: 'Total Ratings', icon: Star, color: 'bg-amber-50 text-amber-600' },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboard();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of users, stores, and ratings.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats?.[key] ?? 0}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-blue-600" size={24} />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platform summary</h2>
            <p className="text-sm text-gray-600">
              {stats?.totalUsers ?? 0} users across {stats?.totalStores ?? 0} stores with{' '}
              {stats?.totalRatings ?? 0} ratings submitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
