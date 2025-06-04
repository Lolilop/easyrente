// src/pages/Analytics.jsx
import React from 'react';

const Analytics = () => {
  // Sample stats data
  const kpis = [
    { title: 'Total Revenue YTD', value: '$324,500', change: '+5.3%', isPositive: true },
    { title: 'Average Occupancy Rate', value: '94%', change: '+2.1%', isPositive: true },
    { title: 'Maintenance Expenses', value: '$45,200', change: '-3.4%', isPositive: true },
    { title: 'Average Tenant Stay', value: '22 months', change: '+1.2%', isPositive: true },
  ];

  // Sample property performance data
  const propertyPerformance = [
    { name: 'Sunset Apartments', revenue: 145000, expenses: 42000, netIncome: 103000 },
    { name: 'Pine Street Houses', revenue: 98000, expenses: 35000, netIncome: 63000 },
    { name: 'Oakwood Heights', revenue: 210000, expenses: 58000, netIncome: 152000 },
    { name: 'Riverside Complex', revenue: 185000, expenses: 63000, netIncome: 122000 },
    { name: 'City Center Lofts', revenue: 138000, expenses: 42000, netIncome: 96000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Last 12 Months</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500">{kpi.title}</h2>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
              <p className={`ml-2 text-sm font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="bg-gray-50 h-64 rounded-md flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
            Revenue chart visualization will be implemented here
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">$776,500</p>
            </div>
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm text-gray-500">Net Income</p>
              <p className="text-xl font-bold text-gray-800">$536,000</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-md">
              <p className="text-sm text-gray-500">Profit Margin</p>
              <p className="text-xl font-bold text-gray-800">69.0%</p>
            </div>
          </div>
        </div>

        {/* Occupancy Rate Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Occupancy Rate</h2>
          <div className="bg-gray-50 h-64 rounded-md flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
            Occupancy rate chart visualization will be implemented here
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-500">Current</p>
              <p className="text-xl font-bold text-gray-800">94%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-xl font-bold text-gray-800">95%</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-md">
              <p className="text-sm text-gray-500">Last Year</p>
              <p className="text-xl font-bold text-gray-800">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Property Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {propertyPerformance.map((property, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.netIncome.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round((property.netIncome / property.revenue) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${propertyPerformance.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${propertyPerformance.reduce((sum, p) => sum + p.expenses, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${propertyPerformance.reduce((sum, p) => sum + p.netIncome, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Math.round((propertyPerformance.reduce((sum, p) => sum + p.netIncome, 0) / 
                    propertyPerformance.reduce((sum, p) => sum + p.revenue, 0)) * 100)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;