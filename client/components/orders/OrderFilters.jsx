export default function OrderFilters({ activeTab, setActiveTab }) {
  const filters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => setActiveTab(filter.value)}
          className={`px-4 py-2 rounded ${activeTab === filter.value ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}