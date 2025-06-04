// src/components/payments/PaymentForm.jsx
import React, { useState, useEffect } from 'react';

export const PaymentForm = ({ payment, onSubmit, onCancel, properties, tenants }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    tenant_id: '',
    unit: '',
    amount: 0,
    amount_paid: 0,
    due_date: '',
    payment_date: '',
    payment_method: 'cash',
    status: 'pending',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing an existing payment
  useEffect(() => {
    if (payment) {
      setFormData({
        property_id: payment.property_id,
        tenant_id: payment.tenant_id,
        unit: payment.unit || '',
        amount: payment.amount,
        amount_paid: payment.amount_paid,
        due_date: payment.due_date.split('T')[0],
        payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : '',
        payment_method: payment.payment_method || 'cash',
        status: payment.status,
        notes: payment.notes || ''
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    // Handle numeric inputs
    if (name === 'amount' || name === 'amount_paid') {
      updatedValue = parseFloat(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: updatedValue
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }

    // Auto-update status based on payment amounts
    if (name === 'amount_paid') {
      const newAmountPaid = parseFloat(value) || 0;
      if (newAmountPaid >= formData.amount) {
        setFormData(prev => ({
          ...prev,
          status: 'paid',
          [name]: updatedValue
        }));
      } else if (newAmountPaid > 0) {
        setFormData(prev => ({
          ...prev,
          status: 'partial',
          [name]: updatedValue
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.property_id) newErrors.property_id = 'Property is required';
    if (!formData.tenant_id) newErrors.tenant_id = 'Tenant is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (formData.amount_paid > formData.amount) newErrors.amount_paid = 'Paid amount cannot exceed total amount';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    
    // If payment date is provided but status is not paid, validate
    if (formData.payment_date && formData.amount_paid <= 0) {
      newErrors.payment_date = 'Payment date requires a payment amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format dates for API
      const formattedData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        payment_date: formData.payment_date ? new Date(formData.payment_date).toISOString() : null
      };
      
      // Check overdue status based on current date and due date
      const currentDate = new Date();
      const dueDate = new Date(formData.due_date);
      
      // If not fully paid and past due date, mark as overdue
      if (formData.status !== 'paid' && dueDate < currentDate && formData.amount_paid < formData.amount) {
        formattedData.status = 'overdue';
      }
      
      onSubmit(formattedData);
    }
  };

  // Filter tenants by selected property
  const filteredTenants = formData.property_id 
    ? tenants.filter(tenant => tenant.property_id === parseInt(formData.property_id))
    : tenants;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {payment ? 'Edit Payment Record' : 'New Payment Record'}
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              className={`block w-full p-2 border rounded-md ${errors.property_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
            {errors.property_id && <p className="text-red-500 text-xs mt-1">{errors.property_id}</p>}
          </div>

          {/* Tenant Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
            <select
              name="tenant_id"
              value={formData.tenant_id}
              onChange={handleChange}
              className={`block w-full p-2 border rounded-md ${errors.tenant_id ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!formData.property_id}
            >
              <option value="">Select a tenant</option>
              {filteredTenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.first_name} {tenant.last_name}</option>
              ))}
            </select>
            {errors.tenant_id && <p className="text-red-500 text-xs mt-1">{errors.tenant_id}</p>}
            {!formData.property_id && <p className="text-gray-500 text-xs mt-1">Select a property first</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Apt 3B"
            />
          </div>

          {/* Amount Due */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Due ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`block w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid ($)</label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`block w-full p-2 border rounded-md ${errors.amount_paid ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.amount_paid && <p className="text-red-500 text-xs mt-1">{errors.amount_paid}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className={`block w-full p-2 border rounded-md ${errors.due_date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date (if paid)</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className={`block w-full p-2 border rounded-md ${errors.payment_date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online_payment">Online Payment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partial">Partially Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add any additional payment information..."
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {payment ? 'Update Payment' : 'Save Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};