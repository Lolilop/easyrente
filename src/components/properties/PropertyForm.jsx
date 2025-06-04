// src/components/properties/PropertyForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyForm = ({ property = null, onSave = null, onCancel = null }) => {
  const navigate = useNavigate();
  const isEditing = Boolean(property);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    type: 'Apartment',
    price: '',
    monthly_rent: '',
    monthly_charges: '',
    security_deposit: '',
    square_feet: '',
    num_bedrooms: '',
    num_bathrooms: '',
    floor_level: '',
    orientation: '',
    year_built: '',
    recent_renovation_year: '',
    energy_rating: '',
    energy_consumption: '',
    greenhouse_emissions: '',
    heating_type: '',
    has_kitchen_equipment: false,
    has_furniture: false,
    has_elevator: false,
    has_parking: false,
    has_accessibility: false,
    description: '',
    images: '',
    units: 1,
    occupied: 0,
    status: 'active'
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Active section state
  const [activeSection, setActiveSection] = useState('basic');


  // Initialize form data if editing
  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        type: property.type || 'Apartment',
        price: property.price || '',
        monthly_rent: property.monthly_rent || '',
        monthly_charges: property.monthly_charges || '',
        security_deposit: property.security_deposit || '',
        square_feet: property.square_feet || '',
        num_bedrooms: property.num_bedrooms || '',
        num_bathrooms: property.num_bathrooms || '',
        floor_level: property.floor_level || '',
        orientation: property.orientation || '',
        year_built: property.year_built || '',
        recent_renovation_year: property.recent_renovation_year || '',
        energy_rating: property.energy_rating || '',
        energy_consumption: property.energy_consumption || '',
        greenhouse_emissions: property.greenhouse_emissions || '',
        heating_type: property.heating_type || '',
        has_kitchen_equipment: property.has_kitchen_equipment || false,
        has_furniture: property.has_furniture || false,
        has_elevator: property.has_elevator || false,
        has_parking: property.has_parking || false,
        has_accessibility: property.has_accessibility || false,
        description: property.description || '',
        images: property.images || '',
        units: property.units || 1,
        occupied: property.occupied || 0,
        status: property.status || 'active'
      });
    }
  }, [property]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error for the changed field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Basic required fields
    if (!formData.name.trim()) newErrors.name = 'Property name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'Zip code is required';
    if (!formData.type.trim()) newErrors.type = 'Property type is required';
    
    // Financial information
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.monthly_rent && (isNaN(formData.monthly_rent) || formData.monthly_rent < 0)) {
      newErrors.monthly_rent = 'Monthly rent must be a valid number';
    }
    if (formData.monthly_charges && (isNaN(formData.monthly_charges) || formData.monthly_charges < 0)) {
      newErrors.monthly_charges = 'Monthly charges must be a valid number';
    }
    if (formData.security_deposit && (isNaN(formData.security_deposit) || formData.security_deposit < 0)) {
      newErrors.security_deposit = 'Security deposit must be a valid number';
    }
    
    // Property details
    if (!formData.square_feet || isNaN(formData.square_feet) || formData.square_feet <= 0) {
      newErrors.square_feet = 'Valid square footage is required';
    }
    if (formData.num_bedrooms && (isNaN(formData.num_bedrooms) || formData.num_bedrooms < 0)) {
      newErrors.num_bedrooms = 'Number of bedrooms must be a valid number';
    }
    if (formData.num_bathrooms && (isNaN(formData.num_bathrooms) || formData.num_bathrooms < 0)) {
      newErrors.num_bathrooms = 'Number of bathrooms must be a valid number';
    }

    // Units info
    if (!formData.units || isNaN(formData.units) || formData.units < 1) {
      newErrors.units = 'At least 1 unit is required';
    }
    if (isNaN(formData.occupied) || formData.occupied < 0 || formData.occupied > formData.units) {
      newErrors.occupied = 'Occupied must be between 0 and total units';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate form
    if (!validateForm()) {
      // Find which section contains the first error
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const basicFields = ['name', 'address', 'city', 'state', 'zip_code', 'type', 'status'];
        const financialFields = ['price', 'monthly_rent', 'monthly_charges', 'security_deposit'];
        const detailsFields = ['square_feet', 'num_bedrooms', 'num_bathrooms', 'floor_level', 'orientation', 'year_built', 'recent_renovation_year'];
        const energyFields = ['energy_rating', 'energy_consumption', 'greenhouse_emissions', 'heating_type'];
        const amenitiesFields = ['has_kitchen_equipment', 'has_furniture', 'has_elevator', 'has_parking', 'has_accessibility', 'description'];
        
        if (basicFields.some(field => errorFields.includes(field))) {
          setActiveSection('basic');
        } else if (financialFields.some(field => errorFields.includes(field))) {
          setActiveSection('financial');
        } else if (detailsFields.some(field => errorFields.includes(field))) {
          setActiveSection('details');
        } else if (energyFields.some(field => errorFields.includes(field))) {
          setActiveSection('energy');
        } else if (amenitiesFields.some(field => errorFields.includes(field))) {
          setActiveSection('amenities');
        }
      }
      return;
    }

    try {
      setSaving(true);
      
      // Convert numeric fields from strings to numbers
      const numericFields = ['price', 'monthly_rent', 'monthly_charges', 'security_deposit', 'square_feet', 
                           'num_bedrooms', 'num_bathrooms', 'floor_level', 'year_built', 'recent_renovation_year',
                           'energy_consumption', 'greenhouse_emissions', 'units', 'occupied'];
                           
      const processedData = { ...formData };
      
      numericFields.forEach(field => {
        if (processedData[field] !== '' && !isNaN(processedData[field])) {
          processedData[field] = Number(processedData[field]);
        }
      });

      // Format images from string to array if needed
      if (typeof processedData.images === 'string' && processedData.images.trim() !== '') {
        processedData.images = processedData.images.split(',').map(img => img.trim());
      } else if (!processedData.images) {
        processedData.images = [];
      }

      let result;
      if (isEditing) {
        // For editing, keep the existing ID and just update the data
        result = {
          ...processedData,
          id: property.id,
          created_at: property.created_at
        };
      } else {
        // For new properties, generate a unique ID and timestamp
        result = {
          ...processedData,
          id: Date.now(), // Simple unique ID
          created_at: new Date().toISOString()
        };
      }

      // Call onSave callback if provided, or navigate back
      if (onSave) {
        onSave(result);
      } else {
        navigate('/properties');
      }
    } catch (error) {
      console.error('Failed to save property:', error);
      setSubmitError('Failed to save property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Section navigation component
  const SectionNav = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'basic', label: 'Basic Info' },
          { id: 'financial', label: 'Financial' },
          { id: 'details', label: 'Details' },
          { id: 'energy', label: 'Energy & Utilities' },
          { id: 'amenities', label: 'Amenities' },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeSection === section.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );

  // Input field component
  const InputField = ({ label, type = 'text', name, value, onChange, error, ...props }) => (
    <div className="sm:col-span-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  // Checkbox field component
  const CheckboxField = ({ label, name, checked, onChange }) => (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={name} className="font-medium text-gray-700">{label}</label>
      </div>
    </div>
  );


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <SectionNav />
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      {/* Basic Information Section */}
      {activeSection === 'basic' && (
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Property Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Property Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div className="sm:col-span-6">
              <InputField
                label="Street Address *"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="State/Province *"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Zip/Postal Code *"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                error={errors.zip_code}
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="active">Active</option>
                <option value="for sale">For Sale</option>
                <option value="for rent">For Rent</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="renovation">Under Renovation</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div className="sm:col-span-3 flex gap-4">
              <div className="w-1/2">
                <InputField
                  label="Units *"
                  name="units"
                  type="number"
                  min="1"
                  value={formData.units}
                  onChange={handleChange}
                  error={errors.units}
                  required
                />
              </div>
              <div className="w-1/2">
                <InputField
                  label="Occupied"
                  name="occupied"
                  type="number"
                  min="0"
                  max={formData.units}
                  value={formData.occupied}
                  onChange={handleChange}
                  error={errors.occupied}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Financial Section */}
      {activeSection === 'financial' && (
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Property Price/Value *"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                label="Monthly Rent"
                name="monthly_rent"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthly_rent}
                onChange={handleChange}
                error={errors.monthly_rent}
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                label="Monthly Charges"
                name="monthly_charges"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthly_charges}
                onChange={handleChange}
                error={errors.monthly_charges}
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                label="Security Deposit"
                name="security_deposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.security_deposit}
                onChange={handleChange}
                error={errors.security_deposit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Property Details Section */}
      {activeSection === 'details' && (
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Property Details</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <InputField
                label="Square Feet *"
                name="square_feet"
                type="number"
                min="0"
                step="0.01"
                value={formData.square_feet}
                onChange={handleChange}
                error={errors.square_feet}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Bedrooms"
                name="num_bedrooms"
                type="number"
                min="0"
                value={formData.num_bedrooms}
                onChange={handleChange}
                error={errors.num_bedrooms}
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Bathrooms"
                name="num_bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.num_bathrooms}
                onChange={handleChange}
                error={errors.num_bathrooms}
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Floor Level"
                name="floor_level"
                type="number"
                min="0"
                value={formData.floor_level}
                onChange={handleChange}
                error={errors.floor_level}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Orientation</label>
              <select
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Not specified</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Northeast">Northeast</option>
                <option value="Northwest">Northwest</option>
                <option value="Southeast">Southeast</option>
                <option value="Southwest">Southwest</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Year Built"
                name="year_built"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.year_built}
                onChange={handleChange}
                error={errors.year_built}
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                label="Last Renovation Year"
                name="recent_renovation_year"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.recent_renovation_year}
                onChange={handleChange}
                error={errors.recent_renovation_year}
              />
            </div>
          </div>
        </div>
      )}


      {/* Energy & Utilities Section */}
      {activeSection === 'energy' && (
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Energy & Utilities</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Energy Rating</label>
              <select
                name="energy_rating"
                value={formData.energy_rating}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Not specified</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Energy Consumption (kWh/m²/yr)"
                name="energy_consumption"
                type="number"
                min="0"
                step="0.01"
                value={formData.energy_consumption}
                onChange={handleChange}
                error={errors.energy_consumption}
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="Greenhouse Emissions (kg CO₂/m²/yr)"
                name="greenhouse_emissions"
                type="number"
                min="0"
                step="0.01"
                value={formData.greenhouse_emissions}
                onChange={handleChange}
                error={errors.greenhouse_emissions}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Heating Type</label>
              <select
                name="heating_type"
                value={formData.heating_type}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Not specified</option>
                <option value="Electric">Electric</option>
                <option value="Gas">Gas</option>
                <option value="Oil">Oil</option>
                <option value="Solar">Solar</option>
                <option value="Heat Pump">Heat Pump</option>
                <option value="District">District Heating</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Section */}
      {activeSection === 'amenities' && (
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Amenities & Description</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3 space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Features</h4>
              <CheckboxField
                label="Kitchen Equipment"
                name="has_kitchen_equipment"
                checked={formData.has_kitchen_equipment}
                onChange={handleChange}
              />
              <CheckboxField
                label="Furnished"
                name="has_furniture"
                checked={formData.has_furniture}
                onChange={handleChange}
              />
              <CheckboxField
                label="Elevator"
                name="has_elevator"
                checked={formData.has_elevator}
                onChange={handleChange}
              />
              <CheckboxField
                label="Parking"
                name="has_parking"
                checked={formData.has_parking}
                onChange={handleChange}
              />
              <CheckboxField
                label="Accessibility Features"
                name="has_accessibility"
                checked={formData.has_accessibility}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                label="Images URLs (comma separated)"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={saving}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {saving ? 'Saving...' : isEditing ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
