// src/pages/Properties.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { properties as propertiesData } from '../data/properties';
import PropertyCard from '../components/properties/PropertyCard';

const Properties = () => {
  // State for filters and view options
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedroomsFilter, setBedroomsFilter] = useState('any');
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Memoize the initial properties data to prevent unnecessary re-renders
  const initialProperties = useMemo(() => propertiesData, []);
  
  // Extract unique property types for filtering
  const propertyTypes = useMemo(() => {
    const types = [...new Set(initialProperties.map(property => property.type))];
    return types.sort();
  }, [initialProperties]);
  
  // Calculate min/max prices for the range filter
  const priceRange_limits = useMemo(() => {
    const prices = initialProperties.map(property => property.price).filter(price => price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [initialProperties]);
  
  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...initialProperties];
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(searchLower) || 
        property.address.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.state.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Property type filter
    if (selectedPropertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        selectedPropertyTypes.includes(property.type)
      );
    }
    
    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(property => property.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(property => property.price <= Number(priceRange.max));
    }
    
    // Bedrooms filter
    if (bedroomsFilter !== 'any') {
      const bedroomsNumber = parseInt(bedroomsFilter);
      if (bedroomsFilter === '4+') {
        filtered = filtered.filter(property => property.num_bedrooms >= 4);
      } else {
        filtered = filtered.filter(property => property.num_bedrooms === bedroomsNumber);
      }
    }
    
    // Sort properties
    switch(sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [initialProperties, searchTerm, selectedPropertyTypes, priceRange, sortBy, bedroomsFilter]);
  
  // Reset filters function
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedPropertyTypes([]);
    setPriceRange({ min: '', max: '' });
    setBedroomsFilter('any');
    setSortBy('name-asc');
  };
  
  // Toggle property type selection
  const togglePropertyType = (type) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(item => item !== type)
        : [...prev, type]
    );
  };
  
  // Handle price range change
  const handlePriceRangeChange = (e, field) => {
    const value = e.target.value;
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Properties</h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link 
                to="/properties/new"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Property
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Box */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search properties by name, address, city..."
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="date-desc">Date: Newest First</option>
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-md overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Filters Toggle Button */}
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedPropertyTypes.length + (priceRange.min || priceRange.max ? 1 : 0) + (bedroomsFilter !== 'any' ? 1 : 0)}
              </span>
            </button>
          </div>
          
          {/* Extended Filters Panel */}
          {filtersVisible && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`property-type-${type}`}
                          name="property-type"
                          type="checkbox"
                          checked={selectedPropertyTypes.includes(type)}
                          onChange={() => togglePropertyType(type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`property-type-${type}`} className="ml-2 block text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                      <input
                        type="number"
                        id="min-price"
                        placeholder="Min Price"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange(e, 'min')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                      <input
                        type="number"
                        id="max-price"
                        placeholder="Max Price"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange(e, 'max')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  {priceRange_limits && (
                    <p className="mt-1 text-xs text-gray-500">
                      Range: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceRange_limits.min)} - 
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceRange_limits.max)}
                    </p>
                  )}
                </div>
                
                {/* Bedrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select
                    id="bedrooms-filter"
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="any">Any</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4+">4+ Bedrooms</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Properties List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <Link 
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Property Image */}
                      <div className="sm:w-48 h-48 overflow-hidden">
                        <img 
                          src={`/assets/images/${Array.isArray(property.images) ? property.images[0] : property.images?.split(',')[0].trim()}`} 
                          alt={property.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { 
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available'; 
                          }}
                        />
                      </div>
                      
                      {/* Property Details */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{property.address}, {property.city}, {property.state}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.status === 'active' ? 'bg-green-100 text-green-800' : 
                            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center text-sm text-gray-500 gap-4">
                          {property.square_feet && <span>{property.square_feet} sq ft</span>}
                          {property.num_bedrooms > 0 && <span>{property.num_bedrooms} bd</span>}
                          {property.num_bathrooms > 0 && <span>{property.num_bathrooms} ba</span>}
                          {property.type && <span>{property.type}</span>}
                        </div>
                        
                        <div className="mt-2">
                          {property.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <span className="text-lg font-semibold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)}</span>
                            {property.monthly_rent > 0 && (
                              <span className="ml-2 text-sm text-gray-700">
                                | {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(property.monthly_rent)}/mo
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-blue-600 font-medium">View Details →</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;