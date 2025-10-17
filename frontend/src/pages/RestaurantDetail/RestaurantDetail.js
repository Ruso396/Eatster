
// src/pages/RestaurantDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../../API";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import Swal from 'sweetalert2'; // ✅ Import this at top
import { FaUtensils, FaStar, FaBoxOpen } from "react-icons/fa";


const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedFood = searchParams.get("food") || "";
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    // Fetch restaurant name
    axios
      .get(`http://https://eatster-nine.vercel.app/api/restaurants`)
      .then((res) => {
        const found = res.data.find((r) => r.id === parseInt(restaurantId));
        setRestaurantName(found ? found.name : "Restaurant");
      })
      .catch(() => setRestaurantName("Restaurant"));

    API.get(`/api/restaurants/${restaurantId}/menu-items`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Failed to fetch:", err));
  }, [restaurantId]);

  const recommendations = menuItems.filter((item) =>
    item.name.toLowerCase().includes(selectedFood.toLowerCase())
  );
  const otherItems = menuItems.filter(
    (item) => !item.name.toLowerCase().includes(selectedFood.toLowerCase())
  );


const handleAddToCart = async (item) => {
  const customerId = localStorage.getItem("customer_id");

  if (!customerId) {
    Swal.fire("Please Login", "You need to be logged in to add items to cart", "warning");
    return;
  }

  // Always extract just the filename for image_url
  const getImageFileName = (url) => {
    if (!url) return 'default_food.jpg'; // fallback to default image
    return url.split('/').pop();
  };
  const imageFileName = getImageFileName(item.image_url);

  try {
    // Step 1: Get existing cart items
    const res = await axios.get(`http://https://eatster-nine.vercel.app/api/cart/${customerId}`);
    const cartItems = res.data;

    // Step 2: Check if cart is empty or same restaurant
    if (
      cartItems.length === 0 ||
      cartItems.every((cartItem) => cartItem.restaurant_id === parseInt(restaurantId))
    ) {
      // Add the item
      await axios.post("http://https://eatster-nine.vercel.app/api/cart/add", {
        customer_id: customerId,
        restaurant_id: parseInt(restaurantId),
        item_id: item.id,
        item_name: item.name,
        foodname: item.foodname,
        price: item.price,
        quantity: 1,
        image_url: imageFileName, // <-- Only filename
      });

      fetchCartCount();

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        showConfirmButton: false,
        timer: 1200,
      });
    } else {
      // Step 3: Ask to clear and add
      Swal.fire({
        title: "Different Restaurant Detected!",
        text: "Your cart contains items from another restaurant. Clear and continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "No, keep existing",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Clear cart and add new item
          await axios.delete(`http://https://eatster-nine.vercel.app/api/cart/clear/${customerId}`);

          await axios.post("http://https://eatster-nine.vercel.app/api/cart/add", {
            customer_id: customerId,
            restaurant_id: parseInt(restaurantId),
            item_id: item.id,
            item_name: item.name,
            foodname: item.foodname,
            price: item.price,
            quantity: 1,
            image_url: imageFileName, // <-- Only filename
          });

          fetchCartCount();

          Swal.fire({
            icon: "success",
            title: "Cart Reset & Added!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      });
    }
  } catch (error) {
    console.error("Add to cart failed:", error);
    Swal.fire("Oops!", "Something went wrong", "error");
  }
};

  return (
    <div className="px-5 py-5 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <FaUtensils className="text-3xl text-orange-500 drop-shadow" />
        <h2 className="text-2xl font-bold text-gray-800">
          {restaurantName}
        </h2>
      </div>

      {recommendations.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-xl text-yellow-500" />
            <h3 className="text-xl font-semibold text-orange-600">Recommended {selectedFood} Varieties</h3>
          </div>
          <div className="flex flex-col gap-5">
            {recommendations.map(
              (item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4 rounded-lg transition-all transform hover:scale-[1.025] hover:shadow-lg hover:bg-orange-50 duration-200 cursor-pointer">
                <div className="max-w-[70%]">
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    {item.name}
                  </h4>
                  <p className="text-gray-700 font-medium">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={item.image_url ? `http://https://eatster-nine.vercel.app/${item.image_url}` : "/food-default.jpg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover mb-2 border"
                  />
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm font-semibold shadow"
                  >
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center gap-2 mb-3 mt-10">
        <FaBoxOpen className="text-xl text-blue-500" />
        <h3 className="text-xl font-semibold text-orange-600">Other Available Foods</h3>
      </div>
      <div className="flex flex-col gap-5">
        {otherItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4 rounded-lg transition-all transform hover:scale-[1.025] hover:shadow-lg hover:bg-blue-50 duration-200 cursor-pointer">
            <div className="max-w-[70%]">
              <h4 className="text-base font-bold text-gray-900 mb-1">
                {item.name}
              </h4>
              <p className="text-gray-700 font-medium">₹{item.price}</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={item.image_url ? `http://https://eatster-nine.vercel.app/${item.image_url}` : "/food-default.jpg"}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover mb-2 border"
              />
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm font-semibold shadow"
              >
                ADD
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
