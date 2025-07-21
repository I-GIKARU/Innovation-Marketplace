'use client';

import React, { useEffect, useState } from 'react';
import { useMerchandise } from '@/hooks/useMerchandise';
import Form from './AddModal';
import ProductsTable from './AdminProductsTable';
import Navbar from './AdminNavbar';

const Products = () => {
  const {
    merchandise,
    fetchMerchandise,
    loading,
    error
  } = useMerchandise([]);

  const [showDetails, setShowDetails] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
 

  useEffect(() => {
    fetchMerchandise();
  }, [fetchMerchandise]);

  const handleAddOrUpdateProduct = async (productData) => {
    const isEdit = !!editingProduct;

    const url = isEdit
      ? `http://127.0.0.1:5000/api/products/${editingProduct.id}`
      : `http://127.0.0.1:5000/api/products`;

    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        stock: productData.availablestock
      })
    });

    if (response.ok) {
      fetchMerchandise();
      setEditingProduct(null);
      setShowForm(false);
    } else {
      alert(`Failed to ${isEdit ? "update" : "add"} product`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <section className="bg-white p-6 rounded shadow-md">
      <Navbar onAddProduct={handleAddClick} />

      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        {editingProduct ? "Edit product information below" : "Add or manage merchandise."}
      </p>

      {showForm && (
        <Form
          onSubmit={handleAddOrUpdateProduct}
          initialData={editingProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showDetails && (
        <>
          <hr className="my-6" />
          <ProductsTable
            merchandise={merchandise}
            loading={loading}
            error={error}
            fetchMerchandise={fetchMerchandise}
            onEdit={handleEdit}
          />
        </>
      )}
    </section>
  );
};

export default Products;
