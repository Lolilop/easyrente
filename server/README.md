# Real Estate Management System - Backend Server

This is the backend server for the Real Estate Management System. It provides API endpoints for managing properties, tenants, and loan comparisons.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MariaDB (v10.5 or higher)

### Database Setup

1. Create a MariaDB database named `real_estate`
2. Configure the database connection in the `.env` file

### Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Environment Configuration

Copy the `.env.example` file to `.env` and update it with your database credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=real_estate
PORT=3001
```

## Running the Server

### Development

```bash
# Run with nodemon for development
npm run dev
```

### Production

```bash
# Run in production mode
npm start
```

### Seeding the Database

To populate the database with initial test data:

```bash
npm run seed
```

## Connecting Frontend and Backend

The frontend application is configured to connect to the backend API at `http://localhost:3001/api`. Make sure both the frontend and backend are running simultaneously:

1. Start the backend server: `cd server && npm run dev`
2. In a separate terminal, start the frontend: `npm run dev`

## API Documentation

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get a property by ID
- `POST /api/properties` - Create a new property
- `PUT /api/properties/:id` - Update a property
- `DELETE /api/properties/:id` - Delete a property

### Tenants

- `GET /api/tenants` - Get all tenants
- `GET /api/properties/:propertyId/tenants` - Get tenants for a specific property
- `POST /api/tenants` - Add a new tenant

### Loan Comparisons

- `GET /api/loan-comparisons` - Get all loan comparisons
- `POST /api/loan-comparisons` - Create a new loan comparison

## Database Schema

The database contains the following tables:

### Properties Table
- `id` - Primary key
- `name` - Property name
- `address` - Property address
- `type` - Property type (Apartment, House, Condo, etc.)
- `price` - Property price/value
- `units` - Number of units
- `occupied` - Number of occupied units
- `status` - Property status (Active, For Sale, Under Renovation, Inactive)

### Tenants Table
- `id` - Primary key
- `property_id` - Foreign key to properties.id
- `first_name` - Tenant first name
- `last_name` - Tenant last name
- `email` - Tenant email address
- `phone` - Tenant phone number
- `lease_start` - Lease start date
- `lease_end` - Lease end date
- `rent` - Monthly rent amount
- `status` - Tenant status (Active, Notice Given, Inactive)

### Loan Comparisons Table
- `id` - Primary key
- `name` - Comparison name/description
- `loan_amount` - Loan principal amount
- `interest_rate_1` - First loan option interest rate
- `term_years_1` - First loan option term in years
- `interest_rate_2` - Second loan option interest rate
- `term_years_2` - Second loan option term in years
- `monthly_payment_1` - First loan option monthly payment
- `monthly_payment_2` - Second loan option monthly payment
- `total_interest_1` - First loan option total interest paid
- `total_interest_2` - Second loan option total interest paid
