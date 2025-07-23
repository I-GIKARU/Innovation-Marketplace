export default function OrderPagination({ pagination, onPageChange }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-700">
        Showing page {pagination.page} of {pagination.pages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
          disabled={pagination.page === 1}
          className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(pagination.pages, pagination.page + 1))}
          disabled={pagination.page === pagination.pages}
          className={`px-3 py-1 rounded ${pagination.page === pagination.pages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}