// ✅ CartPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMoneyBillWave, FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const customerId = localStorage.getItem("customer_id");
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, [customerId]);

  const fetchCartItems = () => {
    if (customerId) {
      axios
        .get(`https://eatster-pro.onrender.com/api/cart/${customerId}`)
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error("Error fetching cart items:", err));
    }
  };

  const updateQuantity = (cartId, newQty) => {
    if (newQty <= 0) return;

    axios
      .put(`https://eatster-pro.onrender.com/api/cart/update/${cartId}`, { quantity: newQty })
      .then(() => {
        fetchCartItems();
        fetchCartCount();
      })
      .catch((err) => console.error("Failed to update quantity:", err));
  };

  const removeItem = (cartId) => {
    Swal.fire({
      title: "Remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://eatster-pro.onrender.com/api/cart/item/${cartId}`)
          .then(() => {
            Swal.fire("Removed!", "Item removed from cart.", "success");
            fetchCartItems();
            fetchCartCount();
          })
          .catch((err) => console.error("Failed to delete item:", err));
      }
    });
  };

  const getTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.quantity * parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire('Cart is empty', 'Please add items to your cart before proceeding.', 'warning');
      return;
    }

    // Assuming all items in the cart are from the same restaurant
    const restaurantId = cartItems[0].restaurant_id;

    navigate("/buy", {
      state: {
        cartItems,
        totalAmount: parseFloat(getTotal()),
        customer_id: customerId,
        restaurant_id: restaurantId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-6 gap-3">
          <FaShoppingCart className="text-3xl text-orange-600 drop-shadow-sm" />
          <h1 className="text-3xl font-bold text-orange-600">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white shadow-sm rounded-2xl p-4 hover:shadow-md transition-all">
                  <img
                    src={
                      item.image_url
                        ? item.image_url.startsWith('/uploads/')
                          ? `https://eatster-pro.onrender.com${item.image_url}`
                          : `https://eatster-pro.onrender.com/uploads/menu_items/${item.image_url}`
                        : "/food-default.jpg"
                    }
                    alt={item.item_name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1 px-4 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{item.item_name}</h3>
                    <div className="flex items-center mt-2 gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-orange-100 text-orange-600 px-2 rounded hover:bg-orange-200 font-bold text-lg">-</button>
                      <span className="mx-2 font-medium text-gray-700">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-orange-100 text-orange-600 px-2 rounded hover:bg-orange-200 font-bold text-lg">+</button>
                    </div>
                  </div>
                  <div className="text-right min-w-[90px]">
                    <p className="font-bold text-green-600 text-lg">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button onClick={() => removeItem(item.id)} className="mt-2 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow font-semibold transition-all">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-right border-t pt-9 pb-5 pr-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-inner">
              <p className="text-xl font-bold text-gray-800 flex items-center justify-end gap-2 mb-2">
                <FaMoneyBillWave className="text-green-500 text-2xl" />
                Total: <span className="text-orange-600">₹ {getTotal()}</span>
              </p>
              <button
                onClick={handleProceedToCheckout}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
              >
                Proceed to Checkout <FaArrowRight className="text-lg" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

