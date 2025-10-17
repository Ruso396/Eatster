import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const reasons = [
    "Changed my mind",
    "Found cheaper elsewhere",
    "Ordered by mistake",
    "Delay in delivery",
    "Other",
  ];

  const statusSteps = ["Placed", "Preparing", "Out for delivery", "Delivered"];
  const statusIcons = {
    Placed: "📦",
    Preparing: "🍳",
    "Out for delivery": "🛵",
    Delivered: "✅",
    Cancelled: "❌",
  };

  const getStatusIndex = (status) =>
    statusSteps.findIndex((step) => step.toLowerCase() === status?.toLowerCase());

  useEffect(() => {
    if (order?.order_status === "Delivered") {
      navigate("/FoodDeliveredAlert", { state: { orderId: order.order_id, imageUrl: order?.items?.[0]?.image_url } });
    }
  }, [order?.order_status, navigate, order?.order_id]);

  useEffect(() => {
    const fetchOrder = () => {
      axios
        .get(`https://eatster-nine.vercel.app/api/orders/track/${orderId}`)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error("Error fetching order:", err));
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCancel = () => {
    if (!cancelReason) return alert("Please select a reason");
    axios
      .put(`https://eatster-nine.vercel.app/api/orders/cancel/${orderId}`, {
        reason: cancelReason,
      })
      .then(() => {
        alert("Order cancelled successfully");
        setShowCancelForm(false);
        setCancelReason("");
        axios.get(`https://eatster-nine.vercel.app/api/orders/track/${orderId}`)
             .then((res) => setOrder(res.data));
      })
      .catch((err) => {
        console.error("Cancel failed", err);
        alert("Failed to cancel the order");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
        📍 Track Your Order
      </h2>

      {!order ? (
        <p className="text-center text-gray-600">Loading tracking info...</p>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-700 text-center">
            <p><span className="font-semibold">Order ID:</span> {order.order_id}</p>
            <p>
              <span className="font-semibold">Current Status:</span> <span className="text-blue-600 font-semibold">{order.order_status}</span>
            </p>
          </div>

          <div className="flex justify-center my-6 text-7xl">
            <span>{statusIcons[order.order_status] || "📦"}</span>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Ordered Items:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center border rounded-lg p-3 shadow-sm">
                    <img
                      src={
                        item.image_url
                          ? item.image_url.startsWith('/uploads/')
                            ? `https://eatster-nine.vercel.app${item.image_url}`
                            : `https://eatster-nine.vercel.app/uploads/menu_items/${item.image_url}`
                          : "/food-default.jpg"
                      }
                      alt={item.item_name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                    <div>
                      <p className="font-medium text-gray-700">{item.item_name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-6 mt-6 relative">
            {statusSteps.map((step, index) => {
              const isActive = index <= getStatusIndex(order.order_status);
              return (
                <div key={index} className="flex-1 text-center relative z-10">
                  <div className={`w-6 h-6 mx-auto rounded-full border-2 ${isActive ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}`}></div>
                  <p className={`text-xs mt-2 ${isActive ? "text-green-700 font-medium" : "text-gray-500"}`}>{step}</p>
                </div>
              );
            })}
            <div className="absolute top-3 left-3 right-3 h-1 bg-gray-200 z-0">
              <div className="h-1 bg-green-500 transition-all duration-700" style={{ width: `${((getStatusIndex(order.order_status) + 1) / statusSteps.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Cancel Button */}
          {order.order_status !== "Delivered" && order.order_status !== "Cancelled" && (
            <div className="text-center mt-6">
              {!showCancelForm ? (
                <button onClick={() => setShowCancelForm(true)} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">Cancel Order</button>
              ) : (
                <div className="mt-4">
                  <select className="border border-gray-300 p-2 w-full rounded mb-3" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                    <option value="">-- Select Cancellation Reason --</option>
                    {reasons.map((reason, i) => (
                      <option key={i} value={reason}>{reason}</option>
                    ))}
                  </select>

                  <div className="flex justify-center gap-4">
                    <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirm Cancel</button>
                    <button onClick={() => setShowCancelForm(false)} className="border px-4 py-2 rounded hover:bg-gray-100">Close</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {order.order_status === "Cancelled" && order.cancel_reason && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 text-center rounded">
              ❌ <strong>Order Cancelled</strong> — Reason: <em>{order.cancel_reason}</em>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackingPage;