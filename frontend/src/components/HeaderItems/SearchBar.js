// ✅ Frontend: components/SearchBar.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ userLocation }) => {
  const [searchText, setSearchText] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    axios
      .get("http://localhost:5000/api/search/suggestions", { params: { query } })
      .then((res) => {
        setSuggestions(res.data);
      })
      .catch((err) => {
        console.error("Suggestion fetch failed", err);
        setSuggestions([]);
      });
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (name) => {
    setSearchText(name);
    setSuggestions([]);
    handleSearch();
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setError("Please enter a food item.");
      setHasSearched(true);
      return;
    }
    if (!userLocation?.lat || !userLocation?.lng) {
      setError("Location not available.");
      setHasSearched(true);
      return;
    }
    const query = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      radius: 15,
      foodName: searchText,
    };
    axios
      .get("http://localhost:5000/api/restaurants/nearby-by-menu-item", { params: query })
      .then((res) => {
        setRestaurants(res.data);
        setError("");
        setHasSearched(true);
      })
      .catch((err) => {
        console.error("Search failed", err);
        setError("Failed to search.");
        setRestaurants([]);
        setHasSearched(true);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-bar-wrapper" style={{ padding: "16px", background: "#fff", minHeight: "80vh" }}>
      <div className="flex justify-center gap-2 mb-2 px-4 relative">
        <input
          type="text"
          placeholder="Search for food"
          value={searchText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="border px-4 py-2 rounded w-full max-w-xl"
        />
        <button onClick={handleSearch} className="bg-orange-500 text-white px-4 py-2 rounded">Search</button>

        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 bg-white w-full max-w-xl border rounded shadow z-50">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item.name)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <img
                  src={`http://localhost:5000/${item.image || "uploads/images/default_food.jpg"}`}
                  alt={item.name}
                  className="w-6 h-6 object-cover rounded"
                />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasSearched && error && <p style={{ color: "red" }}>{error}</p>}

      {hasSearched && restaurants.length > 0 && (
        <div className="search-results">
          <h3>Results for <strong>{searchText}</strong>:</h3>
          <div className="restaurant-cards" style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
            {restaurants.map((rest, i) => (
              <div key={i} onClick={() => navigate(`/restaurant/${rest.id}?food=${searchText}`)} className="p-3 border rounded cursor-pointer hover:shadow" style={{ width: "250px" }}>
                <img src={`http://localhost:5000/${rest.image_url || "uploads/images/default_food.jpg"}`} alt={rest.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }} />
                <h4>{rest.name}</h4>
                <p><strong>City:</strong> {rest.city}</p>
                <p><strong>Distance:</strong> {rest.distance?.toFixed(2)} km</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSearched && restaurants.length === 0 && !error && <p>No restaurants found for "{searchText}".</p>}
    </div>
  );
};

export default SearchBar;