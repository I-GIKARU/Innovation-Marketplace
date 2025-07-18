import React, { useState } from 'react';
import Sidebar from './AdminSidebar';
import Projects from './AdminProjects'; 
import Products from './AdminProducts'; 
import ProjectsTable from './AdminProjectsTable'; 
import Merchandise from '@/components/Merchandise';
import ProductsTable from './AdminProductsTable'; 

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [showProjectsTable, setShowProjectsTable] = useState(false);
  const [showProductsTable, setShowProductsTable] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="p-6 m-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-100 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800">Projects</h3>
                <p className="text-sm mt-1 text-gray-700">30 + 1 today</p>
                <button onClick={() => setShowProjectsTable(!showProjectsTable)} className="mt-3 text-green-700 font-semibold underline cursor-pointer">
                  View details
                </button>
              </div>

             
              <div className="bg-orange-100 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800">
                  Products available for purchase
                </h3>
                <button onClick={() => setShowProductsTable(!showProductsTable)} className="mt-3 text-orange-700 font-semibold underline cursor-pointer">
                  View details
                </button>
              </div>
            </div>

          
            <div className="mt-8 space-y-8">
              {showProjectsTable && <ProjectsTable />}
              {showProductsTable && <ProductsTable />}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="p-6 m-6"><Projects /> 
          </div>
          
        );

      case 'products':
        return (
          <div className="p-6 m-6">  <Products />
          </div>
           
        );
      default:
        return <div className="p-6">❓ Page not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EAF1FF]">
      <Sidebar onSelect={setActivePage} />
      <main className="flex-1 ml-64 overflow-auto">{renderPage()}</main>
    </div>
  );
};

export default Dashboard;

