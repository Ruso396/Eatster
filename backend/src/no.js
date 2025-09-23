import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 13.0827, // Chennai fallback
  lng: 80.2707
};

const RestaurantFinder = () => {
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [keyword, setKeyword] = useState('biryani');
  const [restaurants, setRestaurants] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setCurrentLocation(location);
        },
        () => alert('Could not get location. Using default.')
      );
    }
  }, []);

  const searchRestaurants = () => {
    if (!mapRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      location: currentLocation,
      radius: 5000,
      keyword: keyword,
      type: 'restaurant'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results);
      } else {
        alert('No results found.');
        setRestaurants([]);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE" libraries={['places']}>
      <div style={{ padding: '10px' }}>
        <h2>🔍 Find Nearby Restaurants</h2>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search food (e.g. biryani, kuruma)"
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={searchRestaurants} style={{ padding: '10px' }}>
          Search
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={currentLocation} />

        {restaurants.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }}
          />
        ))}
      </GoogleMap>

      <div style={{ padding: '10px' }}>
        <h3>🍽 {restaurants.length} results for: <strong>{keyword}</strong></h3>
        {restaurants.map((place, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <h4>{place.name}</h4>
            <p>{place.vicinity}</p>
            <p>⭐ Rating: {place.rating ?? 'N/A'}</p>
          </div>
        ))}
      </div>
    </LoadScript>
  );
};

export default RestaurantFinder;