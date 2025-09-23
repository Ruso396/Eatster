import React, { useEffect, useState, useRef, useCallback } from "react";
import FoodVillaLogo from "./Eatster.png";
import AviiGif from "../../assets/changesfood.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from 'react-router-dom';

import {
  faSearch,
  faBars,
  faQuestionCircle,
  faUserCircle,
  faTimes,
  faMapMarkerAlt,
  faClipboardList,
  faSignOutAlt,
  faFileInvoice,
  faUtensils, // Icon for Menu
  faShoppingCart, // Icon for Cart
  faSignInAlt, // Icon for Sign In
  faHome, // Icon for Home
  faGift, // Icon for Offer
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeout;
  return function executed(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

const Header = ({ setUserLocation }) => {
  const [locationDisplay, setLocationDisplay] = useState({
    area: "Detecting...",
    city: "",
    state: "",
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for location search query
  const [searchResults, setSearchResults] = useState([]); // State for search suggestions
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart(); // live count from context

  // Ref to track if location has been set to prevent multiple GPS detections
  const isLocationSetRef = useRef(false);

  useEffect(() => {
    const handleLogin = () => {
      const name = localStorage.getItem("username");
      setUsername(name);
    };
    window.addEventListener("userLoggedIn", handleLogin);
    return () => window.removeEventListener("userLoggedIn", handleLogin);
  }, []);

  // Detect current GPS location only once on component mount
  useEffect(() => {
    if (!isLocationSetRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const addr = res.data.address;
            const newLocation = {
              lat: latitude,
              lng: longitude,
              area: addr.suburb || addr.village || addr.hamlet || addr.road || "Your Area",
              city: addr.city || addr.town || addr.state_district || "Your City",
              state: addr.state || "Your State",
            };
            setLocationDisplay(newLocation);
            setUserLocation(newLocation); // ✅ Send to App.js
            isLocationSetRef.current = true; // Mark as set
          } catch (e) {
            console.error("Location error:", e);
            setLocationDisplay({ area: "Unavailable", city: "", state: "" });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationDisplay({ area: "Geolocation Disabled", city: "", state: "" });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options for getCurrentPosition
      );
    } else if (!navigator.geolocation) {
      setLocationDisplay({ area: "Geolocation Not Supported", city: "", state: "" });
    }
  }, []); // Empty dependency array means this runs once on mount

  // Debounced search handler for location suggestions
  const handleLocationSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) { // Only search if query is at least 3 characters
        setSearchResults([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Location search error:", err);
        setSearchResults([]);
      }
      setLoadingSearch(false);
    }, 500), // Debounce by 500ms
    []
  );

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleLocationSearch(query);
  };

  const handleSelectLocation = async (selectedResult) => {
    const { lat, lon, address } = selectedResult;
    const newLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      area: address.suburb || address.village || address.hamlet || address.road || "Area",
      city: address.city || address.town || address.state_district || "City",
      state: address.state || "State",
    };
    setLocationDisplay(newLocation);
    setUserLocation(newLocation); // ✅ Send to App.js
    isLocationSetRef.current = true; // Mark as set by search
    setShowSidebar(false);
    setSearchQuery(""); // Clear search query
    setSearchResults([]); // Clear search results
    Swal.fire({
      icon: 'success',
      title: 'Location Updated!',
      text: `Delivering to ${newLocation.area}, ${newLocation.city}.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "No, stay logged in",
      confirmButtonColor: "red",
      cancelButtonColor: "gray",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged out!",
          text: "You’ve been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          localStorage.clear();
          window.location.href = "/login";
        });
      }
    });
  };

  return (
    <>
      {/* === FIXED HEADER === */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-md px-4 py-2 h-[64px] md:h-[72px]">
        {/* Left: Logo and Location */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center no-underline">
            <img src={AviiGif} alt="Logo GIF" className="h-12 md:h-14 w-auto rounded" />
            <img src={FoodVillaLogo} alt="Logo" className="h-auto w-[65px] md:w-[70px]" />
          </a>
          <div
            className="flex items-center cursor-pointer whitespace-nowrap"
            onClick={() => setShowSidebar(true)}
          >
            <h2
              className="text-[11px] md:text-sm text-[#38383a] truncate max-w-[120px] md:max-w-[180px]"
              title={`${locationDisplay.area}, ${locationDisplay.city}, ${locationDisplay.state}`}
            >
              <span className="text-[10px] md:text-xs font-bold text-[#111216] border-b border-[#3d4152] mr-1 no-underline">
                Deliver to
              </span>
              {`${locationDisplay.area}, ${locationDisplay.city}`}
            </h2>
            <span className="text-orange-500 text-xs ml-1">&#9660;</span>
          </div>
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex md:hidden">
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xl text-gray-800 cursor-pointer"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center list-none m-0 p-0">
          <li className="ml-6">
            <a href="/menu" className="flex items-center gap-2 text-[#303031] text-sm font-bold no-underline">
              <FontAwesomeIcon icon={faUtensils} /> <span>Menu</span>
            </a>
          </li>
          <li className="ml-6">
            <a href="/OfferList" className="flex items-center gap-2 text-[#303031] text-sm font-bold no-underline">
              <FontAwesomeIcon icon={faGift}  /> <span>Offers</span>
            </a>
          </li>
          <li className="ml-6">
            <a href="/search" className="flex items-center gap-2 text-[#303031] text-sm font-bold no-underline">
              <FontAwesomeIcon icon={faSearch} /> <span>Search</span>
            </a>
          </li>
          <li className="ml-6">
            <a href="/help" className="flex items-center gap-2 text-[#303031] text-sm font-bold no-underline">
              <FontAwesomeIcon icon={faQuestionCircle} /> <span>Help</span>
            </a>
          </li>
          <li className="ml-6 relative">
            {username ? (
              <div className="relative">
                <span
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 font-bold text-black hover:text-red-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUserCircle} />
                  {username}
                </span>
                {dropdownOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50 min-w-[180px]">
                    <Link
                      to="/OrderHistory"
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                      onClick={() => { setShowSidebar(false); setDropdownOpen(false); }}
                    >
                      <FontAwesomeIcon icon={faClipboardList} className="text-blue-500" /> Orders
                    </Link>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" /> Logout
                    </button>
                    <Link
                      to="/InvoicePage"
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-left text-blue-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faFileInvoice} className="text-green-500" /> My Invoices
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <a href="/Login" className="flex items-center gap-2 text-[#303031] text-sm font-bold no-underline">
                <FontAwesomeIcon icon={faSignInAlt} /> <span>Sign In</span>
              </a>
            )}
          </li>
          <li className="ml-6">
            <a href="/cart" className="flex items-center gap-1 no-underline">
              <div className="relative">
                <svg viewBox="-1 0 37 32" height="20" width="20" className="text-black">
                  <path
                    fill={cartItemCount === 0 ? "transparent" : "#60b246"}
                    stroke="currentColor"
                    d="M4.438 0l-2.598 5.11-1.84 26.124h34.909l-1.906-26.124-2.597-5.11z"
                  ></path>
                </svg>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold ${cartItemCount === 0 ? "text-black" : "text-white"
                    }`}
                >
                  {cartItemCount}
                </span>
              </div>
              <span className="text-sm font-bold text-[#303031]">Cart</span>
            </a>
          </li>
        </ul>
      </div>

      {/* 👇 This spacer fixes the content-overlap */}
      <div className="h-[64px] md:h-[72px]"></div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[64px] left-0 right-0 bg-white shadow-md z-50 md:hidden">
          <ul className="flex flex-col p-4 space-y-4 text-sm font-semibold">
            <li>
              <a href="/" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} className="text-blue-500" /> Home
              </a>
            </li>
            <li>
              <a href="/menu" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faUtensils} className="text-orange-500" /> Menu
              </a>
            </li>
            <li>
              <a href="/OfferList" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faGift} className="text-pink-500" /> Offers
              </a>
            </li>
            <li>
              <a href="/search" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} className="text-purple-500" /> Search
              </a>
            </li>
            <li>
              <a href="/help" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-green-500" /> Help
              </a>
            </li>
            <li>
              <Link to="/cart" className="text-[#303031] no-underline flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} className="text-red-500" /> Cart ({cartItemCount})
              </Link>
            </li>
            {username ? (
              <>
                <li>
                  <Link to="/OrderHistory" className="text-[#303031] no-underline flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <FontAwesomeIcon icon={faClipboardList} className="text-blue-500" /> Orders
                  </Link>
                </li>
                <li>
                  <Link to="/InvoicePage" className="text-[#303031] no-underline flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <FontAwesomeIcon icon={faFileInvoice} className="text-green-500" /> My Invoices
                  </Link>
                </li>
                <li>
                  <span className="text-[#303031] cursor-pointer flex items-center gap-2" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" /> Logout ({username})
                  </span>
                </li>
              </>
            ) : (
              <li>
                <a href="/Login" className="text-[#303031] no-underline flex items-center gap-2">
                  <FontAwesomeIcon icon={faSignInAlt} className="text-gray-600" /> Sign In
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex justify-start items-stretch"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="bg-white w-[300px] h-full p-5 animate-slideIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-black"
              onClick={() => setShowSidebar(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="text-lg font-bold mb-4">Search for Location</h3>
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full p-2 text-sm border border-gray-300 rounded"
                placeholder="Enter address, village, city..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {loadingSearch && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>

            {searchResults.length > 0 && (
              <ul className="max-h-60 overflow-y-auto border border-gray-200 rounded shadow-md mt-2">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    className="p-3 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 flex items-center"
                    onClick={() => handleSelectLocation(result)}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                    <span>{result.display_name}</span>
                  </li>
                ))}
              </ul>
            )}

            {searchQuery.length >= 3 && !loadingSearch && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No results found for "{searchQuery}".</p>
            )}

            <button
              className="w-full p-2 mt-4 text-sm bg-orange-500 text-white font-semibold rounded flex items-center justify-center gap-2"
              onClick={() => {
                // Trigger GPS detection again if user clicks "Detect My Location"
                isLocationSetRef.current = false;
                // You might want to re-run the initial useEffect for GPS here
                // For simplicity, let's just close sidebar and let useEffect handle it next render
                setShowSidebar(false);
                // Optionally, add a Swal loading indicator for GPS
                Swal.fire({
                  title: 'Detecting Location...',
                  text: 'Please allow location access.',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading()
                  }
                });
                // A small delay to allow Swal to show before GPS attempt
                setTimeout(() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                          const res = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                          );
                          const addr = res.data.address;
                          const newLocation = {
                            lat: latitude,
                            lng: longitude,
                            area: addr.suburb || addr.village || addr.hamlet || addr.road || "Your Area",
                            city: addr.city || addr.town || addr.state_district || "Your City",
                            state: addr.state || "Your State",
                          };
                          setLocationDisplay(newLocation);
                          setUserLocation(newLocation);
                          isLocationSetRef.current = true;
                          Swal.fire({
                            icon: 'success',
                            title: 'Location Detected!',
                            text: `Delivering to ${newLocation.area}, ${newLocation.city}.`,
                            timer: 1500,
                            showConfirmButton: false,
                          });
                        } catch (e) {
                          console.error("Location error:", e);
                          setLocationDisplay({ area: "Unavailable", city: "", state: "" });
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Could not detect your location. Please try searching or enable GPS.',
                          });
                        }
                      },
                      (error) => {
                        console.error("Geolocation error:", error);
                        setLocationDisplay({ area: "Geolocation Disabled", city: "", state: "" });
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'Geolocation access denied or unavailable. Please try searching for your location.',
                        });
                      },
                      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                  } else {
                    Swal.fire({
                      icon: 'info',
                      title: 'Geolocation Not Supported',
                      text: 'Your browser does not support geolocation.',
                    });
                  }
                }, 100); // Small delay
              }}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Detect My Current Location</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;