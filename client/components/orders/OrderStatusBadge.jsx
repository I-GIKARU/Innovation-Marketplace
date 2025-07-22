export default function OrderStatusBadge({ status }) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}