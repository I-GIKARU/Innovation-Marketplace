"use client";

export default function AddButton() {
  const handleAdd = () => {
    alert("Add project clicked! 🚀 (You can connect a modal or form here)");
  };

  return (
    <button onClick={handleAdd} className="text-2xl font-bold cursor-pointer">
      +
    </button>
  );
}
