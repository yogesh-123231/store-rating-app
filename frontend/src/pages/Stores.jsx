import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import { getStores, submitRating } from '../services/storeService.js';

const PAGE_LIMIT = 10;

function Stores() {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingStore, setRatingStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStores({
        page,
        limit: PAGE_LIMIT,
        search: activeSearch,
      });
      setStores(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSearch = () => {
    setPage(1);
    setActiveSearch(searchInput);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRatingModal = (store, isModify = false) => {
    setRatingStore(store);
    setSelectedRating(isModify && store.userRating ? store.userRating : 0);
  };

  const closeRatingModal = () => {
    setRatingStore(null);
    setSelectedRating(0);
  };

  const handleSubmitRating = async () => {
    if (!ratingStore || selectedRating < 1) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }

    setIsSubmittingRating(true);
    try {
      await submitRating(ratingStore.id, selectedRating);
      toast.success(
        ratingStore.canModify ? 'Rating updated successfully' : 'Rating submitted successfully'
      );
      closeRatingModal();
      await fetchStores();
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.error?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <p className="mt-2 text-gray-600">Browse stores and submit your ratings.</p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          placeholder="Search by name or address..."
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading stores..." />
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
          <p className="text-gray-600">
            {activeSearch ? 'No stores match your search.' : 'No stores available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={(s) => openRatingModal(s, false)}
                onModify={(s) => openRatingModal(s, true)}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {ratingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {ratingStore.canModify ? 'Modify rating' : 'Rate store'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{ratingStore.name}</p>
              </div>
              <button
                type="button"
                onClick={closeRatingModal}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-sm text-gray-600">Select your rating</p>
              <RatingStars
                value={selectedRating}
                interactive
                size={32}
                onChange={setSelectedRating}
              />
              {selectedRating > 0 && (
                <p className="text-sm font-medium text-gray-700">
                  {selectedRating} star{selectedRating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeRatingModal}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                disabled={isSubmittingRating || selectedRating < 1}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingRating ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stores;
