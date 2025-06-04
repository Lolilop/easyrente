// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, PropertiesIcon, TenantsIcon, 
  AnalyticsIcon, SettingsIcon, LogoIcon, LoanComparisonIcon,
  TenantComparisonIcon, TaxCalculatorIcon 
} from '../assets/icons';
import { RentTrackingIcon } from '../assets/PaymentIcons';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/' },
    { name: 'Properties', icon: PropertiesIcon, path: '/properties' },
    { name: 'Tenants', icon: TenantsIcon, path: '/tenants' },
    { name: 'Tenant Comparison', icon: TenantComparisonIcon, path: '/tenant-comparison' },
    { name: 'Rent Tracking', icon: RentTrackingIcon, path: '/rent-tracking' },
    { name: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
    { name: 'Loan Comparison', icon: LoanComparisonIcon, path: '/loan-comparison' },
    { name: 'Tax Simulator', icon: TaxCalculatorIcon, path: '/tax-simulator' },
    { name: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];
  
  return (
    <aside 
      className={`bg-slate-800 text-white fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out
                  ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <div className={`flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center'}`}>
          <LogoIcon className="w-8 h-8 text-blue-400" />
          {isOpen && (
            <span className="ml-3 text-xl font-bold">RE Management</span>
          )}
        </div>
      </div>
      <div className="py-4">
        <nav>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center py-3 px-6 ${isActive ? 'bg-blue-600' : 'hover:bg-slate-700'} 
                 transition-colors duration-200 ${!isOpen && 'justify-center px-0'}`
              }
            >
              <item.icon className={`w-6 h-6 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {isOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;