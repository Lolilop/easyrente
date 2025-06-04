// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Tenants from './pages/Tenants';
import TenantComparison from './pages/TenantComparison';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LoanComparison from './pages/LoanComparison';
import TaxSimulator from './pages/TaxSimulator';
import RentTracking from './pages/RentTracking';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/tenant-comparison" element={<TenantComparison />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/loan-comparison" element={<LoanComparison />} />
              <Route path="/tax-simulator" element={<TaxSimulator />} />
              <Route path="/rent-tracking" element={<RentTracking />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-4 px-6 text-center text-gray-500 text-sm">
            <p>© 2023 Real Estate Management System. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;