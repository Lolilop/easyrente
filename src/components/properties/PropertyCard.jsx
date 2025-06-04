// src/components/properties/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'for sale': 'bg-blue-100 text-blue-800',
      'for rent': 'bg-purple-100 text-purple-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'sold': 'bg-gray-100 text-gray-800',
      'rented': 'bg-indigo-100 text-indigo-800',
      'renovation': 'bg-orange-100 text-orange-800',
      'inactive': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get the first image or use a placeholder
  const getFirstImage = () => {
    if (property.images) {
      // Handle both string and array formats
      if (typeof property.images === 'string') {
        const imageUrls = property.images.split(',');
        if (imageUrls.length > 0) {
          return `/assets/images/${imageUrls[0].trim()}`;
        }
      } else if (Array.isArray(property.images) && property.images.length > 0) {
        // Always use the consistent path structure
        return `/assets/images/${property.images[0]}`;
      }
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };
  
  // Memoize the image path to prevent re-rendering
  const imagePath = React.useMemo(() => getFirstImage(), [property.images]);
  
  // Preload the first image when the component mounts
  React.useEffect(() => {
    const img = new Image();
    img.src = imagePath;
  }, [imagePath]);

  // Format shortened address for display
  const formattedAddress = `${property.address}, ${property.city}, ${property.state}`;
  
  // Get amenities to show (if available)
  const hasAmenities = property.amenities && property.amenities.length > 0;
  // Show at most 3 amenities in the card
  const displayAmenities = hasAmenities ? property.amenities.slice(0, 3) : [];
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
      <Link to={`/properties/${property.id}`} className="flex-grow flex flex-col">
        {/* Property Image with Status Badge */}
        <div className="relative">
          <div className="h-56 overflow-hidden bg-gray-200">
            <img 
              src={imagePath}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              style={{ opacity: 0 }}
              onLoad={(e) => { e.target.style.opacity = 1; e.target.style.transition = "opacity 0.5s ease-in"; }}
              onError={(e) => { 
                // Update only once to prevent flickering
                if (e.target.src !== 'https://via.placeholder.com/300x200?text=Image+Not+Available') {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available'; 
                  e.target.style.opacity = 1;
                }
              }}
            />
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xl font-bold">{formatCurrency(property.price)}</span>
                {property.monthly_rent > 0 && (
                  <span className="ml-1 text-sm opacity-90">
                    | {formatCurrency(property.monthly_rent)}/mo
                  </span>
                )}
              </div>
              <div className="text-sm bg-black/40 px-2 py-1 rounded">
                {property.occupied}/{property.units} units
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Property Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.name}</h3>
          
          {/* Address */}
          <p className="text-sm text-gray-600 mb-3 flex items-start">
            <svg className="h-4 w-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{formattedAddress}</span>
          </p>
          
          {/* Property Specs */}
          <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-x-4 gap-y-1">
            {property.square_feet > 0 && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>{property.square_feet} sq ft</span>
              </div>
            )}
            
            {property.num_bedrooms > 0 && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.num_bedrooms} bd</span>
              </div>
            )}
            
            {property.num_bathrooms > 0 && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{property.num_bathrooms} ba</span>
              </div>
            )}
            
            {property.year_built > 0 && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Built {property.year_built}</span>
              </div>
            )}
          </div>
          
          {/* Amenities if available */}
          {hasAmenities && (
            <div className="mt-auto">
              <div className="text-xs font-medium text-gray-900 mb-1">Top Amenities:</div>
              <div className="flex flex-wrap gap-1">
                {displayAmenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* View Details Button */}
        <div className="px-4 pb-4 pt-2 mt-auto">
          <div className="mt-1 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View Details →
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;