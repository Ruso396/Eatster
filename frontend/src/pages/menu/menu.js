import React, { useEffect, useRef, useState } from "react";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import '../../pages/global.css';

const Menu = ({ userLocation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [resultCity, setResultCity] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/menu", {
      params: { type: foodTypeFilter },
    })
      .then((res) => {
        let sortedData = res.data;
        if (foodTypeFilter === "all") {
          sortedData = res.data.sort((a, b) => {
            if (a.type === "veg" && b.type === "nonveg") return -1;
            if (a.type === "nonveg" && b.type === "veg") return 1;
            return 0;
          });
        }
        const dataWithImgPath = sortedData.map((item) => ({
          name: item.foodname,
          img: `https://eatster-pro.onrender.com/images/${item.img}`,
        }));
        setCategories(dataWithImgPath);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
      });
  }, [foodTypeFilter]);

  const handleFoodClick = async (foodName) => {
    if (!userLocation?.lat || !userLocation?.lng) {
      alert("Location unavailable. Please enable location or enter a pincode.");
      setFilteredRestaurants([]);
      setSelectedFood(foodName);
      setResultCity("your area");
      return;
    }

    try {
      const res = await API.get(`/api/restaurants/nearby-by-menu-item`, {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 15,
          foodName: foodName,
        },
      });

      setSelectedFood(foodName);
      setResultCity(userLocation.city || "your area");
      setFilteredRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching filtered restaurants:", error);
      setFilteredRestaurants([]);
      setResultCity(userLocation.city || "your area");
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      {/* Food Type Filters */}
      <div className="flex justify-center gap-3 mb-6 mt-4">
        {["veg", "nonveg", "all"].map((type) => (
          <button
            key={type}
            onClick={() => setFoodTypeFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              foodTypeFilter === type
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type === "veg" ? "Veg" : type === "nonveg" ? "Non-Veg" : "All"}
          </button>
        ))}
      </div>

      {/* Food Slider */}
      <div className="relative bg-white rounded-lg shadow-md py-6 px-2 mt-4 flex items-center gap-4 overflow-hidden">
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white w-9 h-9 rounded-full shadow hover:bg-gray-100 z-10 flex items-center justify-center text-xl"
        >
          ‹
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 no-scrollbar w-full"
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex-none basis-1/6 sm:basis-1/4 md:basis-1/6 shrink-0 flex flex-col items-center cursor-pointer gap-2"
              onClick={() => handleFoodClick(cat.name)}
            >
              <div className="w-[75px] sm:w-[85px] md:w-[100px] h-[75px] sm:h-[85px] md:h-[100px] rounded-full overflow-hidden bg-white shadow flex items-center justify-center">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <p className="text-sm font-medium text-gray-700 text-center">{cat.name}</p>
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white w-9 h-9 rounded-full shadow hover:bg-gray-100 z-10 flex items-center justify-center text-xl"
        >
          ›
        </button>
      </div>

      {/* Restaurant Results */}
      {selectedFood && filteredRestaurants.length > 0 && (
        <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
            Restaurants with online delivery in{" "}
            <span className="text-orange-600">{resultCity}</span> for{" "}
            <span className="text-red-500">{selectedFood}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((rest, index) => (
              <div
                key={index}
                onClick={() => navigate(`/restaurant/${rest.id}?food=${selectedFood}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer overflow-hidden"
              >
                <img
                  src={`https://eatster-pro.onrender.com/${rest.image_url || "uploads/images/default_food.jpg"}`}
                  alt={rest.name}
                  className="w-full h-40 object-cover border-b"
                />
                <div className="p-4 space-y-1 text-sm">
                  <h3 className="text-lg font-bold text-gray-800">{rest.name}</h3>
                  <p className="text-gray-600">
                    <strong>City:</strong> {rest.city || "Unknown"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Distance:</strong> {rest.distance?.toFixed(2)} km
                  </p>
                  <p className="text-gray-600">
                    <strong>Delivery:</strong> {rest.estimated_delivery_time} mins
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Restaurants Found */}
      {selectedFood && filteredRestaurants.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <img
            src="/No_results_1.png"
            alt="No restaurants found"
            className="mx-auto w-28 opacity-70 mb-4"
          />
          <h3 className="text-lg font-semibold">
            Sorry, no restaurants found for <span className="text-red-500">{selectedFood}</span> in {resultCity}.
          </h3>
          <p className="text-sm mt-1 text-gray-400">
            Try a different food or check your location settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
