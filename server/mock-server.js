const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
const properties = [
  {
    id: 1,
    name: "Skyline Apartments",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip_code: "94105",
    type: "Apartment Building",
    price: 1200000,
    monthly_rent: 28000,
    monthly_charges: 3000,
    security_deposit: 2000,
    square_feet: 12000,
    num_bedrooms: 20,
    num_bathrooms: 25,
    floor_level: 12,
    orientation: "South-East",
    year_built: 2015,
    recent_renovation_year: 2022,
    energy_rating: "A",
    energy_consumption: "80 kWh/m²/year",
    greenhouse_emissions: "20 kg CO2e/m²/year",
    heating_type: "Central",
    has_kitchen_equipment: true,
    has_furniture: false,
    has_elevator: true,
    has_parking: true,
    has_accessibility: true,
    description: "A modern apartment building with excellent amenities in the heart of the city.",
    images: JSON.stringify(["building1.jpg", "lobby1.jpg", "apartment1.jpg"]),
    units: 20,
    occupied: 18,
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Harbor View Condos",
    address: "456 Ocean Drive",
    city: "Miami",
    state: "FL",
    zip_code: "33139",
    type: "Condominium",
    price: 3500000,
    monthly_rent: 45000,
    monthly_charges: 5000,
    security_deposit: 5000,
    square_feet: 15000,
    num_bedrooms: 30,
    num_bathrooms: 35,
    floor_level: 20,
    orientation: "South",
    year_built: 2018,
    recent_renovation_year: null,
    energy_rating: "B",
    energy_consumption: "100 kWh/m²/year",
    greenhouse_emissions: "25 kg CO2e/m²/year",
    heating_type: "Heat pump",
    has_kitchen_equipment: true,
    has_furniture: true,
    has_elevator: true,
    has_parking: true,
    has_accessibility: true,
    description: "Luxury condominiums with breathtaking ocean views and world-class amenities.",
    images: JSON.stringify(["condo1.jpg", "view1.jpg", "pool1.jpg"]),
    units: 30,
    occupied: 25,
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Greenfield Houses",
    address: "789 Park Avenue",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    type: "Single-Family Home",
    price: 850000,
    monthly_rent: 4000,
    monthly_charges: 500,
    security_deposit: 8000,
    square_feet: 2200,
    num_bedrooms: 4,
    num_bathrooms: 3,
    floor_level: 2,
    orientation: "East",
    year_built: 2010,
    recent_renovation_year: 2021,
    energy_rating: "A+",
    energy_consumption: "60 kWh/m²/year",
    greenhouse_emissions: "15 kg CO2e/m²/year",
    heating_type: "Solar",
    has_kitchen_equipment: true,
    has_furniture: false,
    has_elevator: false,
    has_parking: true,
    has_accessibility: false,
    description: "Modern eco-friendly homes in a quiet neighborhood with excellent schools nearby.",
    images: JSON.stringify(["house1.jpg", "garden1.jpg", "kitchen1.jpg"]),
    units: 1,
    occupied: 1,
    status: "rented",
    created_at: new Date().toISOString()
  }
];

const tenants = [
  {
    id: 1,
    property_id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "415-555-1234",
    lease_start: "2023-01-01",
    lease_end: "2024-01-01",
    rent: 1500,
    status: "active",
    property_name: "Skyline Apartments",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    property_id: 1,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "415-555-5678",
    lease_start: "2023-02-15",
    lease_end: "2024-02-15",
    rent: 1650,
    status: "active",
    property_name: "Skyline Apartments",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    property_id: 2,
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    phone: "786-555-9012",
    lease_start: "2023-03-01",
    lease_end: "2024-03-01",
    rent: 2200,
    status: "active",
    property_name: "Harbor View Condos",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    property_id: 3,
    first_name: "Sarah",
    last_name: "Williams",
    email: "sarah.williams@example.com",
    phone: "512-555-3456",
    lease_start: "2023-01-15",
    lease_end: "2024-01-15",
    rent: 4000,
    status: "active",
    property_name: "Greenfield Houses",
    created_at: new Date().toISOString()
  }
];

const applicants = [
  {
    id: 1,
    property_id: 1,
    first_name: "Robert",
    last_name: "Wilson",
    email: "robert.wilson@example.com",
    phone: "415-555-7890",
    credit_score: 720,
    income: 75000,
    occupation: "Software Engineer",
    references: "2 personal references",
    status: "pending",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    property_id: 1,
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@example.com",
    phone: "415-555-2345",
    credit_score: 750,
    income: 85000,
    occupation: "Marketing Manager",
    references: "3 personal references",
    status: "approved",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    property_id: 2,
    first_name: "David",
    last_name: "Miller",
    email: "david.miller@example.com",
    phone: "786-555-6789",
    credit_score: 680,
    income: 65000,
    occupation: "Teacher",
    references: "2 personal references",
    status: "pending",
    created_at: new Date().toISOString()
  }
];

const loanComparisons = [
  {
    id: 1,
    name: "Downtown Office Purchase",
    loan_amount: 500000,
    interest_rate_1: 4.25,
    term_years_1: 30,
    interest_rate_2: 3.75,
    term_years_2: 15,
    monthly_payment_1: 2459.70,
    monthly_payment_2: 3636.42,
    total_interest_1: 385492.00,
    total_interest_2: 154555.60,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Rental Property Investment",
    loan_amount: 350000,
    interest_rate_1: 4.5,
    term_years_1: 30,
    interest_rate_2: 4.0,
    term_years_2: 20,
    monthly_payment_1: 1773.40,
    monthly_payment_2: 2121.90,
    total_interest_1: 288424.00,
    total_interest_2: 159256.00,
    created_at: new Date().toISOString()
  }
];

// API Routes

// Properties
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const propertyId = parseInt(req.params.id);
  const property = properties.find(p => p.id === propertyId);
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json(property);
});

app.post('/api/properties', (req, res) => {
  const newProperty = {
    id: properties.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

app.put('/api/properties/:id', (req, res) => {
  const propertyId = parseInt(req.params.id);
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  
  if (propertyIndex === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  properties[propertyIndex] = {
    ...properties[propertyIndex],
    ...req.body
  };
  
  res.json(properties[propertyIndex]);
});

app.delete('/api/properties/:id', (req, res) => {
  const propertyId = parseInt(req.params.id);
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  
  if (propertyIndex === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  properties.splice(propertyIndex, 1);
  res.json({ message: 'Property deleted successfully' });
});

// Tenants
app.get('/api/tenants', (req, res) => {
  res.json(tenants);
});

app.get('/api/properties/:propertyId/tenants', (req, res) => {
  const propertyId = parseInt(req.params.propertyId);
  const propertyTenants = tenants.filter(t => t.property_id === propertyId);
  res.json(propertyTenants);
});

app.post('/api/tenants', (req, res) => {
  const newTenant = {
    id: tenants.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  // Find property name
  const property = properties.find(p => p.id === newTenant.property_id);
  if (property) {
    newTenant.property_name = property.name;
  }
  
  tenants.push(newTenant);
  res.status(201).json(newTenant);
});

// Tenant Comparison (Applicants)
app.get('/api/tenant-comparison/applicants', (req, res) => {
  let filteredApplicants = [...applicants];
  
  if (req.query.propertyId) {
    const propertyId = parseInt(req.query.propertyId);
    filteredApplicants = applicants.filter(a => a.property_id === propertyId);
  }
  
  res.json(filteredApplicants);
});

app.post('/api/tenant-comparison/applicants', (req, res) => {
  const newApplicant = {
    id: applicants.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  applicants.push(newApplicant);
  res.status(201).json(newApplicant);
});

app.put('/api/tenant-comparison/applicants/:id', (req, res) => {
  const applicantId = parseInt(req.params.id);
  const applicantIndex = applicants.findIndex(a => a.id === applicantId);
  
  if (applicantIndex === -1) {
    return res.status(404).json({ message: 'Applicant not found' });
  }
  
  applicants[applicantIndex] = {
    ...applicants[applicantIndex],
    ...req.body
  };
  
  res.json(applicants[applicantIndex]);
});

app.delete('/api/tenant-comparison/applicants/:id', (req, res) => {
  const applicantId = parseInt(req.params.id);
  const applicantIndex = applicants.findIndex(a => a.id === applicantId);
  
  if (applicantIndex === -1) {
    return res.status(404).json({ message: 'Applicant not found' });
  }
  
  applicants.splice(applicantIndex, 1);
  res.json({ message: 'Applicant deleted successfully' });
});

// Loan Comparison
app.get('/api/loan-comparisons', (req, res) => {
  res.json(loanComparisons);
});

app.post('/api/loan-comparisons', (req, res) => {
  const newLoanComparison = {
    id: loanComparisons.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  loanComparisons.push(newLoanComparison);
  res.status(201).json(newLoanComparison);
});

app.post('/api/loan-comparison/calculate', (req, res) => {
  const { loan_amount, interest_rate_1, term_years_1, interest_rate_2, term_years_2 } = req.body;
  
  // Calculate monthly payment: P * (r * (1+r)^n) / ((1+r)^n - 1)
  // P = principal, r = monthly rate, n = number of payments
  const calculateMonthlyPayment = (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
  };
  
  const monthly_payment_1 = calculateMonthlyPayment(loan_amount, interest_rate_1, term_years_1);
  const monthly_payment_2 = calculateMonthlyPayment(loan_amount, interest_rate_2, term_years_2);
  
  const total_payments_1 = monthly_payment_1 * term_years_1 * 12;
  const total_payments_2 = monthly_payment_2 * term_years_2 * 12;
  
  const total_interest_1 = total_payments_1 - loan_amount;
  const total_interest_2 = total_payments_2 - loan_amount;
  
  res.json({
    monthly_payment_1: parseFloat(monthly_payment_1.toFixed(2)),
    monthly_payment_2: parseFloat(monthly_payment_2.toFixed(2)),
    total_interest_1: parseFloat(total_interest_1.toFixed(2)),
    total_interest_2: parseFloat(total_interest_2.toFixed(2)),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});