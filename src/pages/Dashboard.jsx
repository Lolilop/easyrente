// src/pages/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Properties', value: '24', increase: '+2.5%', color: 'bg-blue-500' },
    { title: 'Occupied Units', value: '18', increase: '+1.2%', color: 'bg-green-500' },
    { title: 'Vacant Units', value: '6', increase: '-0.5%', color: 'bg-amber-500' },
    { title: 'Total Revenue', value: '$45,200', increase: '+4.3%', color: 'bg-purple-500' },
  ];
  
  const recentActivities = [
    { type: 'payment', desc: 'Rent payment received', property: 'Sunset Apartments #304', amount: '+$1,200', date: '2h ago' },
    { type: 'maintenance', desc: 'Maintenance request resolved', property: 'Oakwood Heights #205', amount: '-$350', date: '5h ago' },
    { type: 'lease', desc: 'New lease signed', property: 'Pine Street Houses #8', amount: '+$1,500', date: '1d ago' },
    { type: 'maintenance', desc: 'New maintenance request', property: 'Riverside Complex #112', amount: 'Pending', date: '1d ago' },
  ];

  const upcomingTasks = [
    { title: 'Property Inspection', property: 'Sunset Apartments', due: '2 days' },
    { title: 'Lease Renewal', property: 'Oakwood Heights #205', due: '1 week' },
    { title: 'Rent Collection', property: 'Multiple Properties', due: '10 days' },
    { title: 'Contractor Meeting', property: 'Pine Street Houses', due: '2 weeks' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
            + Add Property
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`h-2 ${stat.color}`}></div>
            <div className="p-5">
              <h2 className="text-sm font-medium text-gray-500">{stat.title}</h2>
              <div className="flex items-baseline mt-1">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 text-xs font-medium ${stat.increase.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.increase}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="bg-gray-50 h-64 rounded-md flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
            Chart visualization will be implemented here
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">$156,230</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl font-bold text-gray-800">$45,128</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Net Income</p>
              <p className="text-xl font-bold text-gray-800">$111,102</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <span className="text-sm font-medium">{task.due.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
                  <p className="text-xs text-gray-500">{task.property}</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded">Due in {task.due}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
              <li key={index} className="py-4 flex">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4
                  ${activity.type === 'payment' ? 'bg-green-100 text-green-600' : 
                    activity.type === 'maintenance' ? 'bg-amber-100 text-amber-600' : 
                    'bg-blue-100 text-blue-600'}`}>
                  {activity.type === 'payment' ? '$' : 
                   activity.type === 'maintenance' ? '🔧' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.desc}</p>
                  <p className="text-sm text-gray-500">{activity.property}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className={`text-sm font-medium ${activity.amount.startsWith('+') ? 'text-green-600' : activity.amount.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;