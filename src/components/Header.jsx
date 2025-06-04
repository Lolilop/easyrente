// src/components/Header.jsx
import React from 'react';
import { MenuIcon, NotificationIcon, UserIcon, SearchIcon } from '../assets/icons';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 px-4 md:px-8">
        <div className="relative max-w-md mx-auto md:max-w-lg lg:max-w-xl">
          <div className="flex items-center border rounded-lg bg-gray-50 px-3">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, tenants, documents..."
              className="w-full py-2 px-3 bg-transparent border-none focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <NotificationIcon className="h-6 w-6 text-gray-500" />
        </button>
        
        <div className="relative">
          <button className="flex items-center text-gray-700 focus:outline-none">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <UserIcon className="h-5 w-5" />
            </div>
            <span className="ml-2 font-medium hidden md:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;