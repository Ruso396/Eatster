import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUtensils,
  FaMotorcycle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar,
} from "react-icons/fa";

// ✅ NEW: sonner toast
import { Toaster, toast } from "sonner";

const statusIconMap = {
  Placed: { icon: <FaBoxOpen />, color: "text-gray-700" },
  Preparing: { icon: <FaUtensils />, color: "text-yellow-500" },
  "Out for delivery": { icon: <FaMotorcycle />, color: "text-blue-500" },
  Delivered: { icon: <FaCheckCircle />, color: "text-green-600" },
  Cancelled: { icon: <FaTimesCircle />, color: "text-red-600" },
  default: { icon: <FaClock />, color: "text-gray-500" },
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [existingReviews, setExistingReviews] = useState({});
  const customerId = localStorage.getItem("customer_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      axios
        .get(`https://backend-weld-three-46.vercel.app/api/orders/history/${customerId}`)
        .then((res) => {
          setOrders(res.data);
          const deliveredOrders = res.data.filter(
            (o) => o.order_status === "Delivered"
          );
          deliveredOrders.forEach((o) => {
            axios
              .get(`https://backend-weld-three-46.vercel.app/api/orders/review/${o.order_id}`)
              .then((r) => {
                if (r.data) {
                  setExistingReviews((prev) => ({
                    ...prev,
                    [o.order_id]: r.data,
                  }));
                }
              });
          });
        })
        .catch((err) => console.error(err));
    }
  }, [customerId]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment("");
    setShowModal(true);
  };

  const handleSubmitReview = () => {
    axios
      .post("https://backend-weld-three-46.vercel.app/api/orders/review", {
        order_id: selectedOrder.order_id,
        restaurant_id: selectedOrder.restaurant_id,
        customer_id: selectedOrder.customer_id,
        rating,
        comment,
      })
      .then(() => {
        toast.success("🎉 Review submitted! Thanks ❤️");
        setShowModal(false);
        setExistingReviews((prev) => ({
          ...prev,
          [selectedOrder.order_id]: { rating, comment },
        }));
      })
      .catch((err) => {
        toast.error("❌ Failed to submit review");
        console.error(err);
      });
  };

  const grouped = orders.reduce((acc, item) => {
    const { order_id } = item;
    if (!acc[order_id]) acc[order_id] = [];
    acc[order_id].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ✅ sonner Toaster */}
      <Toaster position="top-center" richColors />

      <h2 className="text-3xl font-extrabold mb-8 text-orange-600 flex items-center gap-3">
        <FaBoxOpen className="text-orange-500 text-4xl" />
        Your Order History
      </h2>

      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <FaBoxOpen className="text-7xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No orders found.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([orderId, items]) => {
          const status = items[0].order_status;
          const existing = existingReviews[orderId];
          return (
            <div
              key={orderId}
              className="bg-white shadow-xl rounded-2xl p-7 mb-8 border border-orange-100 hover:shadow-2xl transition-all duration-200"
            >
              <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-base text-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-500">Order ID:</span>
                  <span className="font-mono text-gray-800">{orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-500">Date:</span>
                  <span className="text-gray-800">
                    {new Date(items[0].order_date_time).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-500">Status:</span>
                  <span
                    className={`flex items-center gap-1 font-semibold ${statusIconMap[status]?.color}`}
                  >
                    {statusIconMap[status]?.icon} {status}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-orange-50 text-orange-700">
                    <tr>
                      <th className="py-2 px-3">Image</th>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-orange-50"
                      >
                        <td className="py-2 px-3">
                          <img
                            src={
                              item.image_url
                                ? item.image_url.startsWith('/uploads/')
                                  ? `https://eatster-nine.vercel.app${item.image_url}`
                                  : `https://eatster-nine.vercel.app/uploads/menu_items/${item.image_url}`
                                : "/food-default.jpg"
                            }
                            alt={item.item_name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-2 px-3">{item.item_name}</td>
                        <td className="py-2 px-3">{item.quantity}</td>
                        <td className="py-2 px-3">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <span className="text-xl font-bold text-green-600">
                  Total: ₹{items[0].total_price.toFixed(2)}
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/tracking/${orderId}`)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <FaMotorcycle /> Track
                  </button>

                  {status === "Delivered" &&
                    (existing ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <FaStar /> Rated: {existing.rating} ⭐
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(items[0])}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <FaStar /> Leave Review
                      </button>
                    ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <label className="block mb-2 font-semibold">Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <label className="block mb-2 font-semibold">Comment:</label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;