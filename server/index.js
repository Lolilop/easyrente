const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { query, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database schema
initDatabase().catch(console.error);

// API Routes

// Properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const [property] = await query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { 
      name, address, city, state, zip_code, type, price, monthly_rent, monthly_charges, security_deposit,
      square_feet, num_bedrooms, num_bathrooms, floor_level, orientation, year_built,
      recent_renovation_year, energy_rating, energy_consumption, greenhouse_emissions,
      heating_type, has_kitchen_equipment, has_furniture, has_elevator, has_parking,
      has_accessibility, description, images, units, occupied, status 
    } = req.body;
    
    // Validate required fields
    if (!name || !address || !city || !state || !zip_code || !type || !price || !square_feet || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const result = await query(
      `INSERT INTO properties (
        name, address, city, state, zip_code, type, price, monthly_rent, monthly_charges, security_deposit,
        square_feet, num_bedrooms, num_bathrooms, floor_level, orientation, year_built,
        recent_renovation_year, energy_rating, energy_consumption, greenhouse_emissions,
        heating_type, has_kitchen_equipment, has_furniture, has_elevator, has_parking,
        has_accessibility, description, images, units, occupied, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, address, city, state, zip_code, type, price, monthly_rent, monthly_charges, security_deposit,
        square_feet, num_bedrooms, num_bathrooms, floor_level, orientation, year_built,
        recent_renovation_year, energy_rating, energy_consumption, greenhouse_emissions,
        heating_type, has_kitchen_equipment, has_furniture, has_elevator, has_parking,
        has_accessibility, description, images, units, occupied || 0, status
      ]
    );
    
    const newProperty = {
      id: result.insertId,
      name,
      address,
      city,
      state,
      zip_code,
      type,
      price,
      monthly_rent,
      monthly_charges,
      security_deposit,
      square_feet,
      num_bedrooms,
      num_bathrooms,
      floor_level,
      orientation,
      year_built,
      recent_renovation_year,
      energy_rating,
      energy_consumption,
      greenhouse_emissions,
      heating_type,
      has_kitchen_equipment,
      has_furniture,
      has_elevator,
      has_parking,
      has_accessibility,
      description,
      images,
      units,
      occupied,
      status
    };
    
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { 
      name, address, city, state, zip_code, type, price, monthly_rent, monthly_charges, security_deposit,
      square_feet, num_bedrooms, num_bathrooms, floor_level, orientation, year_built,
      recent_renovation_year, energy_rating, energy_consumption, greenhouse_emissions,
      heating_type, has_kitchen_equipment, has_furniture, has_elevator, has_parking,
      has_accessibility, description, images, units, occupied, status 
    } = req.body;
    const propertyId = req.params.id;
    
    // Check if property exists
    const [property] = await query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    await query(
      `UPDATE properties SET 
        name = ?, address = ?, city = ?, state = ?, zip_code = ?, type = ?, price = ?, 
        monthly_rent = ?, monthly_charges = ?, security_deposit = ?, square_feet = ?, 
        num_bedrooms = ?, num_bathrooms = ?, floor_level = ?, orientation = ?, 
        year_built = ?, recent_renovation_year = ?, energy_rating = ?, 
        energy_consumption = ?, greenhouse_emissions = ?, heating_type = ?, 
        has_kitchen_equipment = ?, has_furniture = ?, has_elevator = ?, 
        has_parking = ?, has_accessibility = ?, description = ?, 
        images = ?, units = ?, occupied = ?, status = ? 
      WHERE id = ?`,
      [
        name, address, city, state, zip_code, type, price, monthly_rent, monthly_charges, 
        security_deposit, square_feet, num_bedrooms, num_bathrooms, floor_level, orientation, 
        year_built, recent_renovation_year, energy_rating, energy_consumption, greenhouse_emissions, 
        heating_type, has_kitchen_equipment, has_furniture, has_elevator, has_parking,
        has_accessibility, description, images, units, occupied, status, propertyId
      ]
    );
    
    res.json({ 
      id: propertyId, 
      name, 
      address, 
      city, 
      state, 
      zip_code, 
      type, 
      price, 
      monthly_rent, 
      monthly_charges, 
      security_deposit,
      square_feet, 
      num_bedrooms, 
      num_bathrooms, 
      floor_level, 
      orientation, 
      year_built,
      recent_renovation_year, 
      energy_rating, 
      energy_consumption, 
      greenhouse_emissions,
      heating_type, 
      has_kitchen_equipment, 
      has_furniture, 
      has_elevator, 
      has_parking,
      has_accessibility, 
      description, 
      images, 
      units, 
      occupied, 
      status 
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    // Check if property exists
    const [property] = await query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    await query('DELETE FROM properties WHERE id = ?', [propertyId]);
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
});

// Tenants
app.get('/api/tenants', async (req, res) => {
  try {
    const tenants = await query(`
      SELECT t.*, p.name as property_name 
      FROM tenants t
      JOIN properties p ON t.property_id = p.id
      ORDER BY t.created_at DESC
    `);
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Error fetching tenants' });
  }
});

app.get('/api/properties/:propertyId/tenants', async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const tenants = await query('SELECT * FROM tenants WHERE property_id = ?', [propertyId]);
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants for property:', error);
    res.status(500).json({ message: 'Error fetching tenants for property' });
  }
});

app.post('/api/tenants', async (req, res) => {
  try {
    const { property_id, first_name, last_name, email, phone, lease_start, lease_end, rent, status } = req.body;
    
    // Validate required fields
    if (!property_id || !first_name || !last_name || !email || !lease_start || !lease_end || !rent || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if property exists
    const [property] = await query('SELECT * FROM properties WHERE id = ?', [property_id]);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const result = await query(
      'INSERT INTO tenants (property_id, first_name, last_name, email, phone, lease_start, lease_end, rent, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [property_id, first_name, last_name, email, phone, lease_start, lease_end, rent, status]
    );
    
    // Update the occupied count in the properties table
    await query(
      'UPDATE properties SET occupied = occupied + 1 WHERE id = ?',
      [property_id]
    );
    
    const newTenant = {
      id: result.insertId,
      property_id,
      first_name,
      last_name,
      email,
      phone,
      lease_start,
      lease_end,
      rent,
      status
    };
    
    res.status(201).json(newTenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ message: 'Error creating tenant' });
  }
});

// Loan Comparisons
app.get('/api/loan-comparisons', async (req, res) => {
  try {
    const loanComparisons = await query('SELECT * FROM loan_comparisons ORDER BY created_at DESC');
    res.json(loanComparisons);
  } catch (error) {
    console.error('Error fetching loan comparisons:', error);
    res.status(500).json({ message: 'Error fetching loan comparisons' });
  }
});

app.post('/api/loan-comparisons', async (req, res) => {
  try {
    const {
      name,
      loan_amount,
      interest_rate_1,
      term_years_1,
      interest_rate_2,
      term_years_2,
      monthly_payment_1,
      monthly_payment_2,
      total_interest_1,
      total_interest_2
    } = req.body;
    
    // Validate required fields
    if (!name || !loan_amount || !interest_rate_1 || !term_years_1 || !interest_rate_2 || !term_years_2) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const result = await query(
      `INSERT INTO loan_comparisons (
        name, loan_amount, interest_rate_1, term_years_1, interest_rate_2, term_years_2,
        monthly_payment_1, monthly_payment_2, total_interest_1, total_interest_2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, loan_amount, interest_rate_1, term_years_1, interest_rate_2, term_years_2,
        monthly_payment_1, monthly_payment_2, total_interest_1, total_interest_2
      ]
    );
    
    const newLoanComparison = {
      id: result.insertId,
      name,
      loan_amount,
      interest_rate_1,
      term_years_1,
      interest_rate_2,
      term_years_2,
      monthly_payment_1,
      monthly_payment_2,
      total_interest_1,
      total_interest_2,
      created_at: new Date()
    };
    
    res.status(201).json(newLoanComparison);
  } catch (error) {
    console.error('Error creating loan comparison:', error);
    res.status(500).json({ message: 'Error creating loan comparison' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
