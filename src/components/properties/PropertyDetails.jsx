// src/components/properties/PropertyDetails.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PropertyDetails = ({ property, preloadedImages = {}, imagesLoading = false }) => {
  // State for the image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingMap, setLoadingMap] = useState(true);
  const galleryRef = useRef(null);

  // Process images array
  const images = React.useMemo(() => {
    if (Array.isArray(property.images)) {
      return property.images;
    } else if (typeof property.images === 'string') {
      return property.images.split(',').map(img => img.trim());
    }
    return [];
  }, [property.images]);

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

  // Helper function to render a label-value pair
  const LabelValue = ({ label, value, className = '' }) => (
    <div className={`mb-3 ${className}`}>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{value || '—'}</div>
    </div>
  );

  // Helper function for yes/no values
  const renderYesNo = (value) => {
    return value ? (
      <span className="text-green-600">Yes</span>
    ) : (
      <span className="text-gray-500">No</span>
    );
  };

  // Navigate through images
  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Toggle fullscreen image view
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Close fullscreen on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullScreen]);

  // Set map as loaded when MapContainer is mounted
  const handleMapLoad = () => {
    setLoadingMap(false);
  };

  // Compute aspect ratio for images to maintain consistent layout
  const getImageStyle = (index) => {
    const imageData = preloadedImages[index];
    if (!imageData || !imageData.width || !imageData.height) {
      return { aspectRatio: '16/9' };
    }
    return {
      aspectRatio: `${imageData.width}/${imageData.height}`
    };
  };

  // Get image path from preloaded images or original path
  const getImagePath = (index) => {
    if (preloadedImages && preloadedImages[index] && preloadedImages[index].path) {
      return preloadedImages[index].path;
    }
    return `/assets/images/${images[index]}`;
  };

  // Prepare the map position
  const hasMapData = property.latitude && property.longitude;
  const mapPosition = hasMapData ? [property.latitude, property.longitude] : [40.7128, -74.0060]; // Default to NYC if no coords

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Property Header */}
      <div className="px-4 py-5 sm:px-6 bg-blue-50">
        <h3 className="text-2xl leading-6 font-medium text-gray-900">{property.name}</h3>
        <p className="mt-1 max-w-2xl text-md text-gray-500">{property.address}, {property.city}, {property.state} {property.zip_code}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {property.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {property.type}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {property.status}
          </span>
        </div>
      </div>
      
      {/* Image Gallery with Fixed Dimensions and Smooth Transitions */}
      <div className="relative" ref={galleryRef}>
        {/* Image Gallery Container with Fixed Height */}
        <div className="relative h-[400px] overflow-hidden bg-gray-100">
          {/* Loading Overlay */}
          {imagesLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-200 bg-opacity-80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-blue-700 text-sm">Loading images...</p>
              </div>
            </div>
          )}
          
          {/* Show a skeleton loader if images are loading */}
          {imagesLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : (
            images.length > 0 && (
              <img 
                src={getImagePath(currentImageIndex)} 
                alt={`${property.name} - ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-opacity duration-300"
                style={{
                  opacity: 1, // Always fully visible once loaded
                  ...getImageStyle(currentImageIndex)
                }}
                onClick={toggleFullScreen}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                }}
              />
            )
          )}
          
          {/* Navigation Arrows - Only show if not loading and has multiple images */}
          {!imagesLoading && images.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
              >
                &#10094;
              </button>
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
              >
                &#10095;
              </button>
            </>
          )}
          
          {/* Image Counter - Only show if not loading */}
          {!imagesLoading && images.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Fullscreen Button - Only show if not loading */}
          {!imagesLoading && images.length > 0 && (
            <button 
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
              onClick={toggleFullScreen}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h4v2H5v2H3V3zm4 14H3v-4h2v2h2v2zm10-2h-2v2h-2v-4h4v2zm0-10h-2V3h-2V1h4v4z"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Thumbnail Strip - Only show if not loading and has multiple images */}
        {!imagesLoading && images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`h-16 w-24 flex-shrink-0 cursor-pointer border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <div className="h-full w-full bg-gray-200 relative">
                  <img 
                    src={getImagePath(index)} 
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    style={{ opacity: 1 }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=N/A';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isFullScreen && !imagesLoading && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" 
          onClick={toggleFullScreen}
        >
          <div className="relative max-h-screen max-w-screen-xl p-4">
            <img 
              src={getImagePath(currentImageIndex)} 
              alt={`${property.name} - Fullscreen`}
              className="max-h-[90vh] max-w-full object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x800?text=Image+Not+Available';
              }}
            />
            
            <button 
              className="absolute top-4 right-4 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
              onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
            >
              ✕
            </button>
            
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                  onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
                >
                  &#10094;
                </button>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                  onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                >
                  &#10095;
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-50 text-black px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        {/* Property Location Map */}
        {hasMapData && (
          <div className="mb-6">
            <h4 className="text-xl font-medium text-gray-900 mb-3">Location</h4>
            
            {/* Map Container with Fixed Height */}
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md relative">
              {/* Show a loading indicator while map initializes */}
              {loadingMap && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-blue-700">Loading map...</p>
                  </div>
                </div>
              )}
              
              <MapContainer 
                center={mapPosition} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                whenReady={handleMapLoad}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={mapPosition}>
                  <Popup>
                    <strong>{property.name}</strong><br />
                    {property.address}, {property.city}<br />
                    {property.state} {property.zip_code}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
        
        {/* Description and Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {property.description && (
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-gray-600">{property.description}</p>
            </div>
          )}
          
          {/* Amenities Section */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Amenities</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Property Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Financial Details */}
          <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Financial Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatCurrency(property.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium">{formatCurrency(property.monthly_rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Charges:</span>
                <span className="font-medium">{formatCurrency(property.monthly_charges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="font-medium">{formatCurrency(property.security_deposit)}</span>
              </div>
            </div>
          </div>
          
          {/* Property Features */}
          <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Property Features
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Square Feet:</span>
                <span className="font-medium">{property.square_feet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium">{property.num_bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium">{property.num_bathrooms}</span>
              </div>
            </div>
          </div>
          
          {/* Building Details */}
          <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Building Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-medium">{property.year_built}</span>
              </div>
              {property.recent_renovation_year && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Renovation Year:</span>
                  <span className="font-medium">{property.recent_renovation_year}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Units:</span>
                <span className="font-medium">{property.units} (Occupied: {property.occupied})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Information */}
        {property.energy_rating && (
          <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Energy Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-700">{property.energy_rating || '—'}</div>
                <div className="text-gray-600">Energy Rating</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-700">{property.energy_consumption || '—'}</div>
                <div className="text-gray-600">Energy Consumption</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                <div className="text-xl font-bold text-amber-700">{property.greenhouse_emissions || '—'}</div>
                <div className="text-gray-600">Greenhouse Emissions</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Features */}
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Features
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full ${property.has_kitchen_equipment ? 'bg-green-500' : 'bg-gray-300'} mr-2 flex items-center justify-center`}>
                {property.has_kitchen_equipment && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="text-gray-700">Kitchen Equipment</span>
            </div>
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full ${property.has_furniture ? 'bg-green-500' : 'bg-gray-300'} mr-2 flex items-center justify-center`}>
                {property.has_furniture && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="text-gray-700">Furnished</span>
            </div>
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full ${property.has_elevator ? 'bg-green-500' : 'bg-gray-300'} mr-2 flex items-center justify-center`}>
                {property.has_elevator && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="text-gray-700">Elevator</span>
            </div>
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full ${property.has_parking ? 'bg-green-500' : 'bg-gray-300'} mr-2 flex items-center justify-center`}>
                {property.has_parking && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="text-gray-700">Parking</span>
            </div>
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full ${property.has_accessibility ? 'bg-green-500' : 'bg-gray-300'} mr-2 flex items-center justify-center`}>
                {property.has_accessibility && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="text-gray-700">Accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;