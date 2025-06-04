// src/pages/PropertyDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { properties as propertiesData } from '../data/properties';
import PropertyDetails from '../components/properties/PropertyDetails';
import PropertyForm from '../components/properties/PropertyForm';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});
  const isMounted = useRef(true);

  // Cache images in session storage to prevent flickering on navigation
  const cacheKey = `property-images-${id}`;
  
  // Get property details from local data on component mount and preload images
  useEffect(() => {
    // Setup cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setImagesLoading(true);
        
        const numericId = parseInt(id, 10);
        const foundProperty = propertiesData.find(p => p.id === numericId);
        
        if (!foundProperty) {
          setError('Property not found');
          setLoading(false);
          return;
        }
        
        // Set the property data immediately to improve perceived performance
        setProperty(foundProperty);
        setLoading(false);
        
        // Check if we have cached image data
        const cachedImageData = sessionStorage.getItem(cacheKey);
        if (cachedImageData) {
          setPreloadedImages(JSON.parse(cachedImageData));
          setImagesLoading(false);
          return;
        }
        
        // Preload all images in the background
        preloadPropertyImages(foundProperty);
        
      } catch (err) {
        console.error('Failed to load property:', err);
        if (isMounted.current) {
          setError('Failed to load property details');
          setLoading(false);
        }
      }
    };
    
    loadProperty();
  }, [id, cacheKey]);
  
  // Preload all property images
  const preloadPropertyImages = async (property) => {
    if (!property.images) {
      setImagesLoading(false);
      return;
    }
    
    try {
      const images = Array.isArray(property.images) 
        ? property.images 
        : property.images.split(',').map(img => img.trim());
      
      const imageCache = {};
      
      // Create an array of promises for each image load
      const imagePromises = images.map((image, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          const imagePath = `/assets/images/${image}`;
          
          // Set handlers
          img.onload = () => {
            imageCache[index] = {
              path: imagePath,
              width: img.width,
              height: img.height,
              loaded: true
            };
            resolve(imagePath);
          };
          
          img.onerror = () => {
            imageCache[index] = {
              path: 'https://via.placeholder.com/800x600?text=Image+Not+Available',
              width: 800,
              height: 600,
              loaded: true,
              isPlaceholder: true
            };
            resolve(null);
          };
          
          // Start loading
          img.src = imagePath;
        });
      });
      
      // Wait for all images to be either loaded or failed
      await Promise.all(imagePromises);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setPreloadedImages(imageCache);
        // Cache the processed images in sessionStorage
        sessionStorage.setItem(cacheKey, JSON.stringify(imageCache));
        setImagesLoading(false);
      }
    } catch (err) {
      console.error('Error preloading images:', err);
      if (isMounted.current) {
        setImagesLoading(false);
      }
    }
  };

  // Handle property update
  const handleUpdateProperty = (updatedData) => {
    try {
      // In a real app, this would persist changes to a database
      // Here we just update the local state
      setProperty(updatedData);
      setIsEditing(false);
      
      // Clear image cache when property is updated
      sessionStorage.removeItem(cacheKey);
    } catch (err) {
      console.error('Failed to update property:', err);
      // Let the form component handle the error display
      throw err;
    }
  };

  // Handle property deletion
  const handleDeleteProperty = () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In a real app, this would make an API call to delete
      // Clear the cache for this property
      sessionStorage.removeItem(cacheKey);
      // Navigate back to the properties list
      navigate('/properties', { replace: true });
    } catch (err) {
      console.error('Failed to delete property:', err);
      alert('Failed to delete property');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              &larr; Back to Properties
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => navigate('/properties')}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  // Render not found state
  if (!property) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-gray-500 mb-4">Property not found</h3>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            &larr; Back to Properties
          </button>
        </div>
        <div className="mt-4 sm:mt-0 space-x-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Property
              </button>
              <button
                onClick={handleDeleteProperty}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Property
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Edit Property</h2>
          <PropertyForm 
            property={property} 
            onSave={handleUpdateProperty} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <>
          {/* Images loading overlay - only show when property data is loaded but images are still loading */}
          {!loading && imagesLoading && (
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2 mx-auto"></div>
                  <p className="text-blue-700">Loading images...</p>
                </div>
              </div>
              {/* Skeleton loader for images */}
              <div className="h-96 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          )}
          
          {/* Pass the preloaded image data to PropertyDetails */}
          <PropertyDetails 
            property={property} 
            preloadedImages={preloadedImages} 
            imagesLoading={imagesLoading} 
          />
        </>
      )}
    </div>
  );
};

export default PropertyDetail;