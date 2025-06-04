const { query } = require('./db');
require('dotenv').config();

async function seedDatabase() {
  console.log('Seeding database...');
  try {
    // Seed properties
    console.log('Seeding properties...');
    const properties = [
      {
        name: 'Sunset Apartments',
        address: '123 Sunset Blvd, Los Angeles, CA 90001',
        type: 'Apartment',
        price: 250000.00,
        units: 12,
        occupied: 10,
        status: 'Active'
      },
      {
        name: 'Oakwood Heights',
        address: '456 Oak Street, San Francisco, CA 94101',
        type: 'Apartment',
        price: 350000.00,
        units: 8,
        occupied: 7,
        status: 'Active'
      },
      {
        name: 'Pine Street Houses',
        address: '789 Pine Ave, Seattle, WA 98101',
        type: 'House',
        price: 425000.00,
        units: 3,
        occupied: 2,
        status: 'Active'
      },
      {
        name: 'Riverside Complex',
        address: '101 River Road, Portland, OR 97201',
        type: 'Apartment',
        price: 275000.00,
        units: 6,
        occupied: 4,
        status: 'Active'
      },
      {
        name: 'City Center Lofts',
        address: '202 Downtown Ave, San Diego, CA 92101',
        type: 'Loft',
        price: 500000.00,
        units: 5,
        occupied: 3,
        status: 'Active'
      }
    ];

    // Clear existing data
    await query('TRUNCATE TABLE properties CASCADE');
    
    // Insert properties
    for (const property of properties) {
      await query(
        'INSERT INTO properties (name, address, type, price, units, occupied, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [property.name, property.address, property.type, property.price, property.units, property.occupied, property.status]
      );
    }
    
    // Get the inserted properties to use their IDs
    const insertedProperties = await query('SELECT * FROM properties');
    
    // Seed tenants
    console.log('Seeding tenants...');
    await query('TRUNCATE TABLE tenants CASCADE');
    
    const tenants = [
      {
        property_id: insertedProperties[0].id, // Sunset Apartments
        first_name: 'John',
        last_name: 'Smith',
        email: 'johnsmith@email.com',
        phone: '(555) 123-4567',
        lease_start: '2023-01-15',
        lease_end: '2023-12-15',
        rent: 1500.00,
        status: 'active'
      },
      {
        property_id: insertedProperties[1].id, // Oakwood Heights
        first_name: 'Emily',
        last_name: 'Johnson',
        email: 'emily.j@email.com',
        phone: '(555) 987-6543',
        lease_start: '2023-02-01',
        lease_end: '2023-11-30',
        rent: 1800.00,
        status: 'active'
      },
      {
        property_id: insertedProperties[2].id, // Pine Street Houses
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'mbrown@email.com',
        phone: '(555) 456-7890',
        lease_start: '2023-03-15',
        lease_end: '2024-03-01',
        rent: 2100.00,
        status: 'active'
      },
      {
        property_id: insertedProperties[3].id, // Riverside Complex
        first_name: 'Sarah',
        last_name: 'Garcia',
        email: 'sgarcia@email.com',
        phone: '(555) 234-5678',
        lease_start: '2023-04-01',
        lease_end: '2024-01-15',
        rent: 1650.00,
        status: 'notice'
      },
      {
        property_id: insertedProperties[4].id, // City Center Lofts
        first_name: 'David',
        last_name: 'Wilson',
        email: 'dwilson@email.com',
        phone: '(555) 876-5432',
        lease_start: '2023-05-15',
        lease_end: '2024-02-28',
        rent: 2200.00,
        status: 'active'
      }
    ];
    
    // Insert tenants
    for (const tenant of tenants) {
      await query(
        `INSERT INTO tenants (
          property_id, first_name, last_name, email, phone, lease_start, lease_end, rent, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tenant.property_id, tenant.first_name, tenant.last_name, tenant.email,
          tenant.phone, tenant.lease_start, tenant.lease_end, tenant.rent, tenant.status
        ]
      );
    }
    
    // Seed loan comparisons
    console.log('Seeding loan comparisons...');
    await query('TRUNCATE TABLE loan_comparisons');
    
    const loanComparisons = [
      {
        name: 'Sunset Apartments Loan',
        loan_amount: 200000.00,
        interest_rate_1: 4.5,
        term_years_1: 30,
        interest_rate_2: 3.75,
        term_years_2: 15,
        monthly_payment_1: 1013.37,
        monthly_payment_2: 1454.54,
        total_interest_1: 164813.42,
        total_interest_2: 61818.15
      },
      {
        name: 'Oakwood Heights Financing',
        loan_amount: 300000.00,
        interest_rate_1: 4.25,
        term_years_1: 30,
        interest_rate_2: 3.5,
        term_years_2: 15,
        monthly_payment_1: 1475.82,
        monthly_payment_2: 2145.22,
        total_interest_1: 231294.51,
        total_interest_2: 86138.95
      }
    ];
    
    // Insert loan comparisons
    for (const loan of loanComparisons) {
      await query(
        `INSERT INTO loan_comparisons (
          name, loan_amount, interest_rate_1, term_years_1, interest_rate_2, term_years_2,
          monthly_payment_1, monthly_payment_2, total_interest_1, total_interest_2
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loan.name, loan.loan_amount, loan.interest_rate_1, loan.term_years_1,
          loan.interest_rate_2, loan.term_years_2, loan.monthly_payment_1, loan.monthly_payment_2,
          loan.total_interest_1, loan.total_interest_2
        ]
      );
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();
