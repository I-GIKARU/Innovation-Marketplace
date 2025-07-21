// // // import React, { useState } from 'react';
// // // import ProductsTable from './AdminProductsTable';

// // // const Products = () => {
// // //   const [showDetails, setShowDetails] = useState(false);

// // //   return (
// // //     <section className="bg-white p-6 rounded shadow-md">
// // //       <h2 className="text-xl font-bold mb-2">Products</h2>
// // //       <p className="text-gray-600">Merchandise available at our store</p>
// // //       <button onClick={() => setShowDetails(!showDetails)}  
// // //       className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"  >
// // //         View Details
// // //       </button>

// // //       {showDetails && <ProductsTable />}
// // //     </section>
// // //   );
// // // };

// // // export default Products;
// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { useMerchandise } from '@/hooks/useMerchandise';
// // import Form from './AddModal';
// // import ProductsTable from './AdminProductsTable';

// // const Products = () => {
// //   const {
// //     merchandise,
// //     fetchMerchandise,
// //     loading,
// //     error
// //   } = useMerchandise();

// //   const [showDetails, setShowDetails] = useState(false);
// //   const [editingProduct, setEditingProduct] = useState(null); // Edit mode
// //   const [showForm, setShowForm] = useState(false); // Show/hide form

// //   useEffect(() => {
// //     fetchMerchandise();
// //   }, [fetchMerchandise]);

// //   const handleAddOrUpdateProduct = async (productData) => {
// //     const isEdit = !!editingProduct;

// //     const url = isEdit
// //       ? `http://127.0.0.1:5000/api/merchandise/${editingProduct.id}`
// //       : `http://127.0.0.1:5000/api/merchandise`;

// //     const method = isEdit ? "PUT" : "POST";

// //     const response = await fetch(url, {
// //       method,
// //       headers: {
// //         "Content-Type": "application/json"
// //       },
// //       body: JSON.stringify({
// //         name: productData.name,
// //         price: productData.price,
// //         stock: productData.availablestock
// //       })
// //     });

// //     if (response.ok) {
// //       fetchMerchandise();
// //       setEditingProduct(null);
// //       setShowForm(false); // hide form after submit
// //     } else {
// //       alert(`Failed to ${isEdit ? "update" : "add"} product`);
// //     }
// //   };

// //   const handleEdit = (product) => {
// //     setEditingProduct(product);
// //     setShowForm(true);
// //   };

// //   const handleAddClick = () => {
// //     setEditingProduct(null); // clear editing
// //     setShowForm(true);       // show empty form
// //   };

// //   return (
// //     <section className="bg-white p-6 rounded shadow-md">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-xl font-bold">Products</h2>
// //         <button
// //           className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
// //           onClick={handleAddClick}
// //         >
// //           + Add Product
// //         </button>
// //       </div>

// //       <p className="text-gray-600 mb-6">
// //         {editingProduct ? "Edit product information below" : "Add or manage merchandise."}
// //       </p>

// //       {showForm && (
// //         <Form
// //           onSubmit={handleAddOrUpdateProduct}
// //           initialData={editingProduct}
// //           onCancel={() => {
// //             setShowForm(false);
// //             setEditingProduct(null);
// //           }}
// //         />
// //       )}

// //       <div className="my-6">
// //         <button
// //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
// //           onClick={() => setShowDetails(!showDetails)}
// //         >
// //           {showDetails ? "Hide Details" : "View Details"}
// //         </button>
// //       </div>

// //       {showDetails && (
// //         <>
// //           <hr className="my-6" />
// //           <ProductsTable
// //             merchandise={merchandise}
// //             loading={loading}
// //             error={error}
// //             fetchMerchandise={fetchMerchandise}
// //             onEdit={handleEdit}
// //           />
// //         </>
// //       )}
// //     </section>
// //   );
// // };

// // export default Products;

// "use client";
// import { useState } from "react";
// import { Search, Plus } from "lucide-react";
// import Image from "next/image";

// export default function Navbar({ onAddProduct }) {
//   return (
//     <div className="bg-white p-4 shadow rounded-xl">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         {/* Search Bar */}
//         <div className="flex-1 flex justify-center">
//           <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-md">
//             <Search className="text-gray-400 mr-2" size={16} />
//             <input
//               type="text"
//               placeholder="Search"
//               className="bg-transparent outline-none w-full"
//             />
//           </div>
//         </div>

//         {/* Profile + Add Button */}
//         <div className="flex items-center gap-4 ml-6">
//           <button
//             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
//             onClick={onAddProduct}
//           >
//             <Plus className="cursor-pointer text-gray-600 hover:text-gray-800" />
//           </button>

//           <Image
//             src="/images/admin_profile.jpg"
//             alt="paul"
//             width={32}
//             height={32}
//             className="rounded-full"
//           />
//           <span className="text-gray-700 font-medium">Paul</span>
//         </div>
//       </div>
//     </div>
//   );
// }

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
