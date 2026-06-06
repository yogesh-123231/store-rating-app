import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import SearchBar from '../components/SearchBar';
import SortableTable from '../components/SortableTable';
import { getAdminStores } from '../services/adminService.js';

const PAGE_LIMIT = 10;

const storeColumns = [
  { key: 'name', label: 'Name', sortable: true, sortKey: 'name' },
  { key: 'email', label: 'Email', sortable: true, sortKey: 'email' },
  {
    key: 'address',
    label: 'Address',
    render: (row) => row.address || '—',
  },
  {
    key: 'averageRating',
    label: 'Average Rating',
    render: (row) =>
      row.averageRating !== null ? (
        <div className="flex items-center gap-2">
          <RatingStars value={Math.round(row.averageRating)} size={16} />
          <span>{row.averageRating}</span>
        </div>
      ) : (
        <span className="text-gray-500">No ratings</span>
      ),
  },
];

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminStores({
        page,
        limit: PAGE_LIMIT,
        search: activeSearch,
        sortBy,
        sortOrder,
      });
      setStores(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, activeSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSearch = () => {
    setPage(1);
    setActiveSearch(searchInput);
  };

  const handleSort = (column, order) => {
    setPage(1);
    setSortBy(column);
    setSortOrder(order);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="mt-2 text-gray-600">Manage all registered stores.</p>
        </div>
        <Link
          to="/admin/stores/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Store
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          placeholder="Search by name, email, or address..."
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading stores..." />
      ) : (
        <>
          <SortableTable
            columns={storeColumns}
            data={stores}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            emptyMessage={
              activeSearch ? 'No stores match your search.' : 'No stores found.'
            }
          />

          <div className="mt-6">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminStores;
