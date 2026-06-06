import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import { getOwnerRatings, getOwnerStore } from '../services/ownerService';

const PAGE_LIMIT = 10;

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return String(dateString);
  }
}

function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });

  // ensure ratings is always an array for rendering
  const ratingsList = Array.isArray(ratings) ? ratings : [];

  // Defensive renderer for the ratings section to avoid white-screen crashes
  const renderRatingsSection = () => {
    try {
      return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Ratings</h3>
              <p className="mt-1 text-sm text-gray-600">See the latest ratings for your store.</p>
            </div>
          </div>

          {loadingRatings ? (
            <LoadingSpinner label="Loading ratings..." />
          ) : ratingsList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
              <p className="text-gray-600">No ratings yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-gray-200">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-sm font-semibold text-gray-900">User Name</th>
                      <th className="px-5 py-4 text-sm font-semibold text-gray-900">Rating</th>
                      <th className="px-5 py-4 text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsList.map((rating) => (
                      <tr key={`${rating?.userId ?? rating?.id}-${rating?.createdAt ?? ''}`} className="border-t border-gray-100">
                        <td className="px-5 py-4 text-sm text-gray-700">{rating?.userName ?? rating?.user?.name ?? '-'}</td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <RatingStars value={Number(rating?.rating) || 0} />
                            <span className="text-sm text-gray-500">{rating?.rating ?? '-'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{formatDate(rating?.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error('Render error in ratings section:', err);
      return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-red-600">Failed to render ratings. Please refresh.</p>
        </div>
      );
    }
  };

  // returns true if store exists, false otherwise
  const fetchStore = async () => {
    setLoadingStore(true);
    try {
      const response = await getOwnerStore();
      setStore(response.data);
      return true;
    } catch (error) {
      if (error?.response?.status === 404) {
        // expected: owner has no store
        setStore(null);
        return false;
      }
      console.error('Store error:', error);
      toast.error('Failed to load store details. Please try again.');
      setStore(null);
      return false;
    } finally {
      setLoadingStore(false);
    }
  };

  const fetchRatings = async (page = 1) => {
    setLoadingRatings(true);
    try {
      const response = await getOwnerRatings({ page, limit: PAGE_LIMIT });
      const data = response.data?.data ?? response.data ?? [];
      const pag = response.data?.pagination ?? { page, limit: PAGE_LIMIT, total: 0, totalPages: 1 };
      setRatings(Array.isArray(data) ? data : []);
      setPagination(pag);
    } catch (error) {
      if (error?.response?.status === 404) {
        // no store -> no ratings
        setRatings([]);
        setPagination({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
        return;
      }
      console.error('Ratings error:', error);
      toast.error('Failed to load ratings. Please try again.');
    } finally {
      setLoadingRatings(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return;
    }
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchRatings(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // On mount, load store and ratings. fetchRatings handles 404 when no store.
    document.title = 'Owner Dashboard - Store Rating App';
    fetchStore();
    fetchRatings(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="mt-2 text-gray-600">View your store details and recent ratings from customers.</p>
      </div>

      {loadingStore ? (
        <LoadingSpinner label="Loading store details..." />
      ) : store ? (
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{store.name}</h2>
              <p className="mt-1 text-gray-600">{store.address}</p>
            </div>
            <div className="rounded-3xl bg-blue-50 px-5 py-4 text-center">
              <p className="text-sm uppercase tracking-[0.18em] text-blue-700">Average Rating</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <RatingStars value={store.averageRating ?? 0} />
                <span className="text-lg font-semibold text-gray-900">
                  {store.averageRating?.toFixed(1) ?? '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No store assigned</h2>
          <p className="mt-2 text-gray-600">Contact admin.</p>
        </div>
      )}

      {renderRatingsSection()}
    </div>
  );
}

export default OwnerDashboard;
