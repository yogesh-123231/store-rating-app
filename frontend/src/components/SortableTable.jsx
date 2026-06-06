import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

function SortableTable({ columns, data, sortBy, sortOrder, onSort, emptyMessage = 'No data found.' }) {
  const handleSort = (column) => {
    if (!column.sortable || !column.sortKey) return;

    if (sortBy === column.sortKey) {
      onSort(column.sortKey, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column.sortKey, 'asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (!column.sortable) return null;

    if (sortBy !== column.sortKey) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }

    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                }`}
                onClick={() => handleSort(column)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {column.label}
                  <SortIcon column={column} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;
