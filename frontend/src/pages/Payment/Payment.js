import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useCart } from "../../context/CartContext";
import { FaTrash, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaMoneyBillWave, FaCheckCircle, FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";

const getCardType = (number) => {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6/.test(n)) return "discover";
  return "default";
};

const cardColors = {
  visa: "bg-blue-600",
  mastercard: "bg-red-600",
  amex: "bg-green-600",
  discover: "bg-yellow-500",
  default: "bg-red-600",
};

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("cod");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [focus, setFocus] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [errors, setErrors] = useState({});

  const { fetchCartCount } = useCart();

 // ✅ Inside PaymentPage.js
useEffect(() => {
  if (state) {
    const { cartItems, restaurant_id } = state;
    setCartItems(cartItems);

    // Recalculate subtotal and shipping
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const grandTotal = subtotal + shipping;

    setTotalAmount(grandTotal);
    localStorage.setItem("restaurant_id_temp", restaurant_id);
  }

  const id = localStorage.getItem("customer_id");
  setCustomerId(id);
}, [state]);


  const removeItem = (idx) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Validation helpers
  const validateCardNumber = (num) => /^\d{4} \d{4} \d{4} \d{4}$/.test(num);
  const validateExpiry = (exp) => /^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp);
  const validateCvv = (cvv) => /^\d{3,4}$/.test(cvv);
  const validateCardHolder = (name) => /^[A-Za-z ]+$/.test(name.trim()) && name.trim().length > 0;

  const validateAll = () => {
    const errs = {};
    if (selectedMethod === "card") {
      if (!validateCardHolder(cardHolder)) errs.cardHolder = "Only letters and spaces allowed";
      if (!validateCardNumber(cardNumber)) errs.cardNumber = "16 digits required (xxxx xxxx xxxx xxxx)";
      if (!validateExpiry(expiry)) errs.expiry = "MM/YY format";
      if (!validateCvv(cvv)) errs.cvv = "3 or 4 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
const placeOrder = async () => {
  if (!customerId || cartItems.length === 0 || totalAmount <= 0) {
    alert("❌ Missing order details. Please try again.");
    return;
  }
  if (selectedMethod === "card" && !validateAll()) {
    return;
  }

  const formattedAddress = state.address
    ? `${state.address.name}, ${state.address.phone}, ${state.address.address}, ${state.address.pincode}`
    : "No address provided";

  try {
    const res = await axios.post("http://192.168.18.187:5000/api/orders/place", {
      customer_id: customerId,
      restaurant_id: localStorage.getItem("restaurant_id_temp"),
      address: formattedAddress,
      cartItems,
      total_price: totalAmount, // ✅ uses correct total here
      paymentmethod: selectedMethod,
    });

    if (res.status === 200 && res.data.message === "Order placed successfully") {
      await axios.delete(`http://192.168.18.187:5000/api/cart/clear/${customerId}`);
      fetchCartCount();
      navigate("/OrderHistory");
    } else {
      alert("❌ Failed to place order. Please try again.");
    }
  } catch (error) {
    alert("❌ Server error occurred while placing the order.");
  }
};


  // Calculate subtotal and shipping
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // Card formatting and color logic
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    value = value.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };
  const handleCardHolderChange = (e) => {
    let value = e.target.value.replace(/[^A-Za-z ]/g, "");
    setCardHolder(value);
  };
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };
  const cardType = getCardType(cardNumber);
  const cardBgClass = cardColors[cardType] || cardColors.default;

  return (
    <div className="min-h-screen bg-[#fff6f6] flex flex-col items-center py-8 px-2">
      {/* Progress Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div className="flex-1 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl"><FaShoppingCart /></div>
            <span className="text-xs mt-1 font-semibold text-orange-600">CART</span>
          </div>
          <div className="flex-1 h-1 bg-orange-400 mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl"><FaMapMarkerAlt /></div>
            <span className="text-xs mt-1 font-semibold text-green-600">ADDRESS</span>
          </div>
          <div className="flex-1 h-1 bg-blue-400 mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl"><FaCreditCard /></div>
            <span className="text-xs mt-1 font-semibold text-blue-600">PAYMENT</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-xl"><FaCheckCircle /></div>
            <span className="text-xs mt-1 font-semibold text-green-600">ORDER</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Order Summary */}
        <div className="w-full md:w-1/2 p-8 border-r border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ORDER SUMMARY</h2>
          <ul className="space-y-5 mb-6">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 border-b pb-4">
                <img
                  src={
                    item.image_url
                      ? item.image_url.startsWith('/uploads/')
                        ? `http://192.168.18.187:5000${item.image_url}`
                        : `http://192.168.18.187:5000/uploads/menu_items/${item.image_url}`
                      : "/food-default.jpg"
                  }
                  alt={item.item_name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{item.item_name}</div>
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  <div className="text-xs text-gray-500">Price: ₹{item.price}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-red-500 text-base">₹{(item.price * item.quantity).toFixed(2)}</div>
                  <button
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    onClick={() => removeItem(idx)}
                  >
                    <FaTrash /> REMOVE
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Sub Total</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping</span>
              <span className="font-semibold">₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-orange-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/* Right: Payment Card UI */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-6">PAYMENT METHOD</h2>
          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 flex flex-col items-center justify-center border-2 rounded-lg p-3 transition-all ${selectedMethod === "cod" ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-400"}`}
              onClick={() => setSelectedMethod("cod")}
            >
              <FaMoneyBillWave className="text-3xl text-orange-500 mb-1" />
              <span className="font-semibold text-gray-700">Cash on Delivery</span>
              {selectedMethod === "cod" && <FaCheckCircle className="text-green-500 mt-1" />}
            </button>
            <button
              className={`flex-1 flex flex-col items-center justify-center border-2 rounded-lg p-3 transition-all ${selectedMethod === "card" ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-400"}`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="flex gap-2 mb-1">
                <FaCcVisa className="text-2xl text-blue-600" />
                <FaCcMastercard className="text-2xl text-red-600" />
                <FaCcAmex className="text-2xl text-indigo-600" />
                <FaCcDiscover className="text-2xl text-yellow-500" />
              </div>
              <span className="font-semibold text-gray-700">Card Payment</span>
              {selectedMethod === "card" && <FaCheckCircle className="text-green-500 mt-1" />}
            </button>
          </div>
          {selectedMethod === "card" && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner mb-6">
              <div className={`rounded-lg p-2 mb-4 w-64 mx-auto ${cardBgClass} transition-all`}>
                <Cards
                  number={cardNumber}
                  expiry={expiry.replace("/", "")}
                  cvc={cvv}
                  name={cardHolder}
                  focused={focus}
                />
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {/* Cardholder Name */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
                  <input
                    type="text"
                    placeholder="Card Holder"
                    value={cardHolder}
                    onChange={handleCardHolderChange}
                    onFocus={() => setFocus("name")}
                    className={`w-full p-3 pl-10 border rounded-md ${errors.cardHolder ? "border-red-500" : "border-gray-300"}`}
                    maxLength={32}
                  />
                </div>
                {errors.cardHolder && <span className="text-xs text-red-500">{errors.cardHolder}</span>}
                {/* Card Number */}
                <div className="relative">
                  <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => setFocus("number")}
                    className={`w-full p-3 pl-10 border rounded-md ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && <span className="text-xs text-red-500">{errors.cardNumber}</span>}
                <div className="flex gap-4">
                  {/* Expiry */}
                  <div className="relative w-full">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocus("expiry")}
                      className={`w-full p-3 pl-10 border rounded-md ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                      maxLength={5}
                    />
                  </div>
                  {/* CVV */}
                  <div className="relative w-full">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-lg" />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                      onFocus={() => setFocus("cvc")}
                      className={`w-full p-3 pl-10 border rounded-md ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                      maxLength={4}
                    />
                  </div>
                </div>
                {errors.expiry && <span className="text-xs text-red-500">{errors.expiry}</span>}
                {errors.cvv && <span className="text-xs text-red-500">{errors.cvv}</span>}
              </div>
            </div>
          )}
          <button
            onClick={placeOrder}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg text-lg mt-2 transition-all shadow-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
