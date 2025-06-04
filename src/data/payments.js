// src/data/payments.js
// Sample payment data for the rent payment tracking module
// This simulates a database/API service

// Define initial payment records
let payments = [
  {
    id: 1,
    property_id: 1,
    tenant_id: 1,
    unit: '304',
    amount: 1500,
    amount_paid: 1500,
    due_date: '2023-05-01T00:00:00Z',
    payment_date: '2023-05-01T00:00:00Z',
    payment_method: 'bank_transfer',
    status: 'paid',
    notes: 'Payment received on time'
  },
  {
    id: 2,
    property_id: 1,
    tenant_id: 2,
    unit: '205',
    amount: 1650,
    amount_paid: 1650,
    due_date: '2023-05-01T00:00:00Z',
    payment_date: '2023-05-02T00:00:00Z',
    payment_method: 'credit_card',
    status: 'paid',
    notes: 'Payment received'
  },
  {
    id: 3,
    property_id: 2,
    tenant_id: 3,
    unit: '12B',
    amount: 2200,
    amount_paid: 0,
    due_date: '2023-05-01T00:00:00Z',
    payment_date: null,
    payment_method: null,
    status: 'overdue',
    notes: 'Tenant contacted via email on May 3rd'
  },
  {
    id: 4,
    property_id: 3,
    tenant_id: 4,
    unit: null,
    amount: 4000,
    amount_paid: 2000,
    due_date: '2023-05-01T00:00:00Z',
    payment_date: '2023-05-01T00:00:00Z',
    payment_method: 'check',
    status: 'partial',
    notes: 'Partial payment received, remainder due by May 15th'
  },
  {
    id: 5,
    property_id: 1,
    tenant_id: 1,
    unit: '304',
    amount: 1500,
    amount_paid: 0,
    due_date: '2023-06-01T00:00:00Z',
    payment_date: null,
    payment_method: null,
    status: 'pending',
    notes: 'Upcoming payment'
  },
  {
    id: 6,
    property_id: 2,
    tenant_id: 3,
    unit: '12B',
    amount: 2200,
    amount_paid: 0,
    due_date: '2023-06-01T00:00:00Z',
    payment_date: null,
    payment_method: null,
    status: 'pending',
    notes: ''
  },
  {
    id: 7,
    property_id: 4,
    tenant_id: 5,
    unit: '501',
    amount: 3500,
    amount_paid: 3500,
    due_date: '2023-05-01T00:00:00Z',
    payment_date: '2023-04-28T00:00:00Z',
    payment_method: 'bank_transfer',
    status: 'paid',
    notes: 'Early payment received'
  },
  {
    id: 8,
    property_id: 5,
    tenant_id: 6,
    unit: '405',
    amount: 2800,
    amount_paid: 0,
    due_date: '2023-06-01T00:00:00Z',
    payment_date: null,
    payment_method: null,
    status: 'pending',
    notes: ''
  }
];

// Simulated API service
const paymentsApi = {
  getAll: () => Promise.resolve([...payments]),

  getById: (id) => {
    const payment = payments.find(payment => payment.id === id);
    return Promise.resolve(payment ? { ...payment } : null);
  },

  getByPropertyId: (propertyId) => {
    const filtered = payments.filter(payment => payment.property_id === propertyId);
    return Promise.resolve([...filtered]);
  },

  getByTenantId: (tenantId) => {
    const filtered = payments.filter(payment => payment.tenant_id === tenantId);
    return Promise.resolve([...filtered]);
  },

  getByStatus: (status) => {
    const filtered = payments.filter(payment => payment.status === status);
    return Promise.resolve([...filtered]);
  },

  create: (paymentData) => {
    // Generate a new ID (in a real app this would be handled by the database)
    const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    
    const newPayment = {
      id: newId,
      ...paymentData,
      // Set defaults for any missing fields
      payment_date: paymentData.payment_date || null,
      payment_method: paymentData.payment_method || null,
      notes: paymentData.notes || ''
    };
    
    payments.push(newPayment);
    return Promise.resolve({ ...newPayment });
  },

  update: (id, paymentData) => {
    const index = payments.findIndex(payment => payment.id === id);
    if (index !== -1) {
      payments[index] = { ...payments[index], ...paymentData };
      return Promise.resolve({ ...payments[index] });
    }
    return Promise.reject(new Error(`Payment with id ${id} not found`));
  },

  delete: (id) => {
    const index = payments.findIndex(payment => payment.id === id);
    if (index !== -1) {
      const deletedPayment = payments[index];
      payments = payments.filter(payment => payment.id !== id);
      return Promise.resolve({ ...deletedPayment });
    }
    return Promise.reject(new Error(`Payment with id ${id} not found`));
  },

  // Helper methods for reporting
  getSummaryByProperty: () => {
    const summary = {};
    payments.forEach(payment => {
      if (!summary[payment.property_id]) {
        summary[payment.property_id] = {
          totalDue: 0,
          totalPaid: 0,
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0
        };
      }
      
      summary[payment.property_id].totalDue += payment.amount;
      summary[payment.property_id].totalPaid += payment.amount_paid;
      
      switch (payment.status) {
        case 'paid':
          summary[payment.property_id].paidCount += 1;
          break;
        case 'pending':
          summary[payment.property_id].pendingCount += 1;
          break;
        case 'overdue':
          summary[payment.property_id].overdueCount += 1;
          break;
        default:
          break;
      }
    });
    
    return Promise.resolve(summary);
  },

  getSummaryByMonth: (year) => {
    const summary = {};
    const currentYear = year || new Date().getFullYear();
    
    // Initialize months
    for (let i = 0; i < 12; i++) {
      summary[i] = {
        totalDue: 0,
        totalPaid: 0,
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0
      };
    }
    
    payments.forEach(payment => {
      const paymentDate = new Date(payment.due_date);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      
      if (paymentYear === currentYear) {
        summary[paymentMonth].totalDue += payment.amount;
        summary[paymentMonth].totalPaid += payment.amount_paid;
        
        switch (payment.status) {
          case 'paid':
            summary[paymentMonth].paidCount += 1;
            break;
          case 'pending':
            summary[paymentMonth].pendingCount += 1;
            break;
          case 'overdue':
            summary[paymentMonth].overdueCount += 1;
            break;
          default:
            break;
        }
      }
    });
    
    return Promise.resolve(summary);
  }
};

export { payments, paymentsApi };