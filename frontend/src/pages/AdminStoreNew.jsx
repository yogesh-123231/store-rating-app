import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminCreateStoreSchema } from '../utils/validators.js';
import { createStore, getUsers } from '../services/adminService.js';

const inputClassName =
  'mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

function AdminStoreNew() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminCreateStoreSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      ownerId: '',
    },
  });

  useEffect(() => {
    const fetchOwners = async () => {
      setIsLoadingOwners(true);
      try {
        const response = await getUsers({ role: 'OWNER', limit: 50, page: 1 });
        setOwners(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load store owners.');
      } finally {
        setIsLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  const onSubmit = async (values) => {
    try {
      await createStore(values);
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.error?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    }
  };

  if (isLoadingOwners) {
    return <LoadingSpinner label="Loading store owners..." />;
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Store</h1>
        <p className="mt-2 text-gray-600">Create a new store and assign an owner.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Store name
          </label>
          <input id="name" type="text" {...register('name')} className={inputClassName} />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Store email
          </label>
          <input id="email" type="email" {...register('email')} className={inputClassName} />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea id="address" rows={4} {...register('address')} className={inputClassName} />
          {errors.address && (
            <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
            Store owner
          </label>
          <select id="ownerId" {...register('ownerId')} className={inputClassName}>
            <option value="">Select an owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="mt-2 text-sm text-red-600">{errors.ownerId.message}</p>
          )}
          {owners.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No users with the OWNER role found. Create an owner user first.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/stores')}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || owners.length === 0}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating store...' : 'Create store'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminStoreNew;
