// src/pages/RentTracking.jsx
import React, { useState, useEffect } from 'react';
import { PaymentStatusCard } from '../components/payments/PaymentStatusCard';
import { PaymentList } from '../components/payments/PaymentList';
import { PaymentForm } from '../components/payments/PaymentForm';
import { paymentsApi } from '../data/payments';
import { properties } from '../data/properties';
import { tenants } from '../data/tenants';

const RentTracking = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filters, setFilters] = useState({
    property: 'all',
    status: 'all',
    tenant: 'all',
    period: 'current'
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch payments data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await paymentsApi.getAll();
        setPayments(data);
        setFilteredPayments(data);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter payments based on selected filters
  useEffect(() => {
    let result = [...payments];

    // Property filter
    if (filters.property !== 'all') {
      result = result.filter(payment => payment.property_id === parseInt(filters.property));
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(payment => payment.status === filters.status);
    }

    // Tenant filter
    if (filters.tenant !== 'all') {
      result = result.filter(payment => payment.tenant_id === parseInt(filters.tenant));
    }

    // Period filter
    if (filters.period === 'current') {
      result = result.filter(payment => {
        const paymentDate = new Date(payment.due_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });
    } else if (filters.period === 'overdue') {
      result = result.filter(payment => {
        const paymentDate = new Date(payment.due_date);
        return paymentDate < currentDate && payment.status !== 'paid';
      });
    } else if (filters.period === 'upcoming') {
      result = result.filter(payment => {
        const paymentDate = new Date(payment.due_date);
        return paymentDate > currentDate && payment.status !== 'paid';
      });
    } else if (filters.period === 'lastMonth') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      result = result.filter(payment => {
        const paymentDate = new Date(payment.due_date);
        return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
      });
    }

    setFilteredPayments(result);
  }, [filters, payments, currentMonth, currentYear, currentDate]);

  // Calculate statistics for the status cards
  const statistics = {
    total: payments.length,
    paid: payments.filter(payment => payment.status === 'paid').length,
    pending: payments.filter(payment => payment.status === 'pending').length,
    overdue: payments.filter(payment => payment.status === 'overdue').length,
    totalPaid: payments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount_paid, 0),
    totalDue: payments
      .filter(payment => payment.status !== 'paid')
      .reduce((sum, payment) => sum + (payment.amount - payment.amount_paid), 0)
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentForm(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsLoading(true);
    try {
      let updatedPayment;
      if (editingPayment) {
        updatedPayment = await paymentsApi.update(editingPayment.id, paymentData);
        setPayments(payments.map(p => p.id === updatedPayment.id ? updatedPayment : p));
      } else {
        updatedPayment = await paymentsApi.create(paymentData);
        setPayments([...payments, updatedPayment]);
      }
      setShowPaymentForm(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Error saving payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      setIsLoading(true);
      try {
        await paymentsApi.delete(id);
        setPayments(payments.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting payment:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerateReceipt = (payment) => {
    // Find property and tenant details
    const property = properties.find(p => p.id === payment.property_id);
    const tenant = tenants.find(t => t.id === payment.tenant_id);

    // Create receipt content
    const receiptContent = `
      RENT PAYMENT RECEIPT
      
      Date: ${new Date().toLocaleDateString()}
      
      PROPERTY: ${property ? property.name : 'Unknown'} (${payment.unit || 'N/A'})
      ADDRESS: ${property ? `${property.address}, ${property.city}, ${property.state} ${property.zip_code}` : 'N/A'}
      
      TENANT: ${tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown'}
      
      PAYMENT DETAILS:
      Due Date: ${new Date(payment.due_date).toLocaleDateString()}
      Amount Due: $${payment.amount.toFixed(2)}
      Amount Paid: $${payment.amount_paid.toFixed(2)}
      Payment Method: ${payment.payment_method}
      Payment Date: ${payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
      Payment Status: ${payment.status.toUpperCase()}
      
      Remaining Balance: $${(payment.amount - payment.amount_paid).toFixed(2)}
      
      Notes: ${payment.notes || 'None'}
      
      This is an official receipt for the rent payment detailed above.
    `;

    // Create and download the receipt as a text file
    const element = document.createElement("a");
    const file = new Blob([receiptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `rent_receipt_${payment.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Rent Payment Tracking</h1>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PaymentStatusCard
          title="Total Payments"
          count={statistics.total}
          amount={statistics.totalPaid + statistics.totalDue}
          color="bg-blue-500"
        />
        <PaymentStatusCard
          title="Paid"
          count={statistics.paid}
          amount={statistics.totalPaid}
          color="bg-green-500"
        />
        <PaymentStatusCard
          title="Pending"
          count={statistics.pending}
          amount={payments
            .filter(payment => payment.status === 'pending')
            .reduce((sum, payment) => sum + (payment.amount - payment.amount_paid), 0)}
          color="bg-yellow-500"
        />
        <PaymentStatusCard
          title="Overdue"
          count={statistics.overdue}
          amount={payments
            .filter(payment => payment.status === 'overdue')
            .reduce((sum, payment) => sum + (payment.amount - payment.amount_paid), 0)}
          color="bg-red-500"
        />
      </div>
      
      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Payment Records</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={handleAddPayment}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            Record Payment
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Property</label>
            <select
              name="property"
              value={filters.property}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant</label>
            <select
              name="tenant"
              value={filters.tenant}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tenants</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current">Current Month</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
              <option value="lastMonth">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        {/* Payment List */}
        <PaymentList 
          payments={filteredPayments}
          isLoading={isLoading}
          onEditPayment={handleEditPayment}
          onDeletePayment={handleDeletePayment}
          onGenerateReceipt={handleGenerateReceipt}
        />
      </div>
      
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <PaymentForm
              payment={editingPayment}
              onSubmit={handlePaymentSubmit}
              onCancel={() => {
                setShowPaymentForm(false);
                setEditingPayment(null);
              }}
              properties={properties}
              tenants={tenants}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentTracking;