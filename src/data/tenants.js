// src/data/tenants.js
const tenants = [
  {
    id: 1,
    name: "John Smith",
    email: "johnsmith@email.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments",
    unit: "304",
    leaseEnd: "2023-12-15",
    status: "active",
    paymentStatus: "current",
    first_name: "John",
    last_name: "Smith"
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "(555) 987-6543",
    property: "Oakwood Heights",
    unit: "205",
    leaseEnd: "2023-11-30",
    status: "active",
    paymentStatus: "current",
    first_name: "Emily",
    last_name: "Johnson"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 456-7890",
    property: "Pine Street Houses",
    unit: "8",
    leaseEnd: "2024-03-01",
    status: "active",
    paymentStatus: "overdue",
    first_name: "Michael",
    last_name: "Brown"
  },
  {
    id: 4,
    name: "Sarah Garcia",
    email: "sgarcia@email.com",
    phone: "(555) 234-5678",
    property: "Riverside Complex",
    unit: "112",
    leaseEnd: "2024-01-15",
    status: "notice",
    paymentStatus: "current",
    first_name: "Sarah",
    last_name: "Garcia"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "dwilson@email.com",
    phone: "(555) 876-5432",
    property: "City Center Lofts",
    unit: "501",
    leaseEnd: "2024-02-28",
    status: "active",
    paymentStatus: "current",
    first_name: "David",
    last_name: "Wilson"
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jlee@email.com",
    phone: "(555) 345-6789",
    property: "Mountain View Residences",
    unit: "405",
    leaseEnd: "2024-04-15",
    status: "active",
    paymentStatus: "current",
    first_name: "Jennifer",
    last_name: "Lee"
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "rtaylor@email.com",
    phone: "(555) 567-8901",
    property: "Sunset Apartments",
    unit: "210",
    leaseEnd: "2023-12-31",
    status: "notice",
    paymentStatus: "overdue",
    first_name: "Robert",
    last_name: "Taylor"
  },
  {
    id: 8,
    name: "Amanda Martinez",
    email: "amanda.m@email.com",
    phone: "(555) 678-9012",
    property: "Riverside Complex",
    unit: "308",
    leaseEnd: "2024-02-15",
    status: "active",
    paymentStatus: "current",
    first_name: "Amanda",
    last_name: "Martinez"
  }
];

const tenantsApi = {
  getAll: () => Promise.resolve(tenants),
  getById: (id) => Promise.resolve(tenants.find(tenant => tenant.id === id)),
  create: (tenant) => {
    const newTenant = {
      ...tenant,
      id: Math.max(...tenants.map(t => t.id)) + 1
    };
    tenants.push(newTenant);
    return Promise.resolve(newTenant);
  },
  update: (id, updates) => {
    const index = tenants.findIndex(tenant => tenant.id === id);
    if (index >= 0) {
      tenants[index] = { ...tenants[index], ...updates };
      return Promise.resolve(tenants[index]);
    }
    return Promise.reject(new Error(`Tenant with id ${id} not found`));
  },
  delete: (id) => {
    const index = tenants.findIndex(tenant => tenant.id === id);
    if (index >= 0) {
      const deleted = tenants.splice(index, 1)[0];
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error(`Tenant with id ${id} not found`));
  }
};

export { tenants, tenantsApi };