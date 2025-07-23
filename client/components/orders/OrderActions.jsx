import { useRouter } from 'next/navigation';

export default function OrderActions({ order, onCancel }) {
  const router = useRouter();

  const handleCancel = async () => {
    try {
      await onCancel(order.id);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => router.push(`/orders/${order.id}`)}
        className="text-blue-600 hover:text-blue-900 mr-3"
      >
        View
      </button>
      {(order.status === 'pending' || order.status === 'processing') && (
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-900"
        >
          Cancel
        </button>
      )}
    </>
  );
}