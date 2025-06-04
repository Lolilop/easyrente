// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Unknown error occurred',
    }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Properties API
export const propertiesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    return handleResponse(response);
  },
  
  create: async (propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },
  
  update: async (id, propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Tenants API
export const tenantsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tenants`);
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`);
    return handleResponse(response);
  },
  
  create: async (tenantData) => {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    return handleResponse(response);
  },
  
  update: async (id, tenantData) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Loan Comparison API
export const loanComparisonApi = {
  compare: async (loanData) => {
    const response = await fetch(`${API_BASE_URL}/loan-comparison/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
    });
    return handleResponse(response);
  },
};

// Tenant Comparison API
export const tenantComparisonApi = {
  getApplicants: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/tenant-comparison/applicants${propertyId ? `?propertyId=${propertyId}` : ''}`);
    return handleResponse(response);
  },
  
  addApplicant: async (applicantData) => {
    const response = await fetch(`${API_BASE_URL}/tenant-comparison/applicants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicantData),
    });
    return handleResponse(response);
  },
  
  updateApplicant: async (id, applicantData) => {
    const response = await fetch(`${API_BASE_URL}/tenant-comparison/applicants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicantData),
    });
    return handleResponse(response);
  },
  
  deleteApplicant: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenant-comparison/applicants/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
