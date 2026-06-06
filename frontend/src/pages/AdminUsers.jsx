import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import SortableTable from '../components/SortableTable';
import { getUsers } from '../services/adminService.js';

const PAGE_LIMIT = 10;

const roleBadgeStyles = {
  ADMIN: 'bg-purple-100 text-purple-700',
  USER: 'bg-blue-100 text-blue-700',
  OWNER: 'bg-emerald-100 text-emerald-700',
};

const userColumns = [
  { key: 'name', label: 'Name', sortable: true, sortKey: 'name' },
  { key: 'email', label: 'Email', sortable: true, sortKey: 'email' },
  {
    key: 'address',
    label: 'Address',
    render: (row) => row.address || '—',
  },
  {
    key: 'role',
    label: 'Role',
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadgeStyles[row.role] || 'bg-gray-100 text-gray-700'}`}
      >
        {row.role}
      </span>
    ),
  },
];

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsers({
        page,
        limit: PAGE_LIMIT,
        search: activeSearch,
        role: roleFilter,
        sortBy,
        sortOrder,
      });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, activeSearch, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1);
    setActiveSearch(searchInput);
  };

  const handleRoleChange = (event) => {
    setPage(1);
    setRoleFilter(event.target.value);
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-600">Manage all registered users.</p>
        </div>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add User
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            placeholder="Search by name, email, or address..."
          />
        </div>
        <div className="lg:w-48">
          <label htmlFor="roleFilter" className="sr-only">
            Filter by role
          </label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={handleRoleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading users..." />
      ) : (
        <>
          <SortableTable
            columns={userColumns}
            data={users}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            emptyMessage={
              activeSearch || roleFilter
                ? 'No users match your filters.'
                : 'No users found.'
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

export default AdminUsers;
