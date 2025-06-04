const mariadb = require('mariadb');
require('dotenv').config();

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (conn) conn.release(); // Release connection back to the pool
  }
}

async function initDatabase() {
  console.log('Initializing database schema...');
  try {
    // Create properties table
    await query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(200) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        monthly_rent DECIMAL(10, 2),
        monthly_charges DECIMAL(8, 2),
        security_deposit DECIMAL(10, 2),
        square_feet DECIMAL(8, 2) NOT NULL,
        num_bedrooms INT,
        num_bathrooms DECIMAL(4, 1),
        floor_level INT,
        orientation VARCHAR(20),
        year_built INT,
        recent_renovation_year INT,
        energy_rating VARCHAR(2),
        energy_consumption DECIMAL(8, 2),
        greenhouse_emissions DECIMAL(8, 2),
        heating_type VARCHAR(50),
        has_kitchen_equipment BOOLEAN DEFAULT FALSE,
        has_furniture BOOLEAN DEFAULT FALSE,
        has_elevator BOOLEAN DEFAULT FALSE,
        has_parking BOOLEAN DEFAULT FALSE,
        has_accessibility BOOLEAN DEFAULT FALSE,
        description TEXT,
        images TEXT,
        units INT DEFAULT 1,
        occupied INT DEFAULT 0,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create tenants table
    await query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        lease_start DATE NOT NULL,
        lease_end DATE NOT NULL,
        rent DECIMAL(8, 2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Create loan_comparisons table
    await query(`
      CREATE TABLE IF NOT EXISTS loan_comparisons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        loan_amount DECIMAL(12, 2) NOT NULL,
        interest_rate_1 DECIMAL(5, 3) NOT NULL,
        term_years_1 INT NOT NULL,
        interest_rate_2 DECIMAL(5, 3) NOT NULL,
        term_years_2 INT NOT NULL,
        monthly_payment_1 DECIMAL(10, 2) NOT NULL,
        monthly_payment_2 DECIMAL(10, 2) NOT NULL,
        total_interest_1 DECIMAL(12, 2) NOT NULL,
        total_interest_2 DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
    throw err;
  }
}

module.exports = {
  query,
  initDatabase,
};
