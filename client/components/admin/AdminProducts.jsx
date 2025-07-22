'use client';

import React, { useEffect, useState } from 'react';
import { useMerchandise } from '@/hooks/useMerchandise';
import Form from './AddModal';
import ProductsTable from './AdminProductsTable';
import MerchandiseUpload from './MerchandiseUpload';
import { Plus, Package } from 'lucide-react';


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
  const [showUploadModal, setShowUploadModal] = useState(false);
 

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

  const handleUploadComplete = (newMerchandise) => {
    // Refresh merchandise list after successful upload
    fetchMerchandise();
    setShowUploadModal(false);
  };

  return (
    <section className="bg-white p-6 rounded shadow-md">
      

      <div className=" mb-4 mt-4">
        <h2 className="text-xl font-bold">Products</h2>

        <p className="text-gray-600 mb-6">
        {editingProduct ? "Edit product information below" : "Add or manage merchandise."}
      </p>
        <div className="flex gap-3 mt-3">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Product with Images
          </button>
          
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>

      

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
      
      {/* Merchandise Upload Modal */}
      {showUploadModal && (
        <MerchandiseUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </section>
  );
};

export default Products;
