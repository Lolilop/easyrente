// src/pages/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  // Sample user profile data
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@realestate.com',
    phone: '(555) 123-4567',
    role: 'Administrator',
    notificationEmail: true,
    notificationSMS: false,
    notificationApp: true,
    theme: 'light',
    language: 'english'
  });

  // Form handling
  const [formData, setFormData] = useState({...profile});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile({...formData});
    // Here you would normally save to backend
    alert('Settings updated successfully!');
  };

  // Settings sections
  const sections = [
    { id: 'profile', title: 'Profile Settings', icon: '👤' },
    { id: 'notifications', title: 'Notification Preferences', icon: '🔔' },
    { id: 'appearance', title: 'Appearance', icon: '🎨' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'billing', title: 'Billing & Subscription', icon: '💳' },
    { id: 'integrations', title: 'System Integrations', icon: '🔄' },
  ];
  
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Navigation */}
          <div className="md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            {activeSection === 'profile' && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Property Manager">Property Manager</option>
                        <option value="Maintenance Staff">Maintenance Staff</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                      <p className="text-xs text-gray-500">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="notificationEmail" 
                        checked={formData.notificationEmail} 
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">SMS Notifications</h3>
                      <p className="text-xs text-gray-500">Receive updates via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="notificationSMS" 
                        checked={formData.notificationSMS} 
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">App Notifications</h3>
                      <p className="text-xs text-gray-500">Receive in-app notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="notificationApp" 
                        checked={formData.notificationApp} 
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Appearance Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                    <select
                      id="theme"
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="english">English</option>
                      <option value="french">French</option>
                      <option value="spanish">Spanish</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="current-password" className="block text-sm text-gray-700">Current Password</label>
                        <input 
                          type="password" 
                          id="current-password" 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm text-gray-700">New Password</label>
                        <input 
                          type="password" 
                          id="new-password" 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm text-gray-700">Confirm New Password</label>
                        <input 
                          type="password" 
                          id="confirm-password" 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                        />
                      </div>
                      <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 mb-2">Add an extra layer of security to your account</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Enable Two-Factor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing & Subscription</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You are currently on the <span className="font-medium">Professional Plan</span> billed annually.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Payment Method</h3>
                    <div className="mt-2 flex items-center p-3 border rounded-md">
                      <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/2024</p>
                      </div>
                      <button className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                        Update
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Billing History</h3>
                    <div className="mt-2 bg-white border rounded-md divide-y">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Professional Plan (Annual)</p>
                          <p className="text-xs text-gray-500">Oct 21, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">$599.00</p>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Download</button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Professional Plan (Annual)</p>
                          <p className="text-xs text-gray-500">Oct 21, 2022</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">$499.00</p>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'integrations' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">System Integrations</h2>
                <div className="space-y-6">
                  {/* Google Calendar Integration */}
                  <div className="flex items-start border-b pb-6">
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">Google Calendar</h3>
                      <p className="text-xs text-gray-500 mt-1">Sync property appointments and maintenance schedules with your Google Calendar</p>
                      <button className="mt-2 px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  {/* QuickBooks Integration */}
                  <div className="flex items-start border-b pb-6">
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">QuickBooks</h3>
                      <p className="text-xs text-gray-500 mt-1">Connect your accounting system for automatic payment processing</p>
                      <button className="mt-2 px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  {/* DocuSign Integration */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">DocuSign</h3>
                      <p className="text-xs text-gray-500 mt-1">Enable electronic signatures for lease agreements and other documents</p>
                      <div className="mt-2 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Connected
                        </span>
                        <button className="ml-2 text-xs text-red-600 hover:text-red-900">
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;