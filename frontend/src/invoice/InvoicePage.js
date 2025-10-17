import React, { useEffect, useState } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import { FaFileInvoice, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaMapMarkerAlt } from "react-icons/fa";

const statusIcon = (status) => {
  if (status === "Delivered") return <FaCheckCircle className="text-green-500 inline-block mr-1" />;
  if (status === "Cancelled") return <FaTimesCircle className="text-red-500 inline-block mr-1" />;
  return <FaClock className="text-yellow-500 inline-block mr-1" />;
};

const InvoicePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId = localStorage.getItem("customer_id");

  useEffect(() => {
    axios
      .get(`https://eatster-nine.vercel.app/api/orders/history/${customerId}`)
      .then((res) => {
        const grouped = {};
        res.data.forEach((item) => {
          if (!grouped[item.order_id]) grouped[item.order_id] = [];
          grouped[item.order_id].push(item);
        });
        setOrders(Object.values(grouped));
      })
      .catch((err) => console.error("Order fetch failed", err))
      .finally(() => setLoading(false));
  }, [customerId]);

  const download = async (orderId) => {
    try {
      const res = await axios.get(`https://eatster-nine.vercel.app/api/invoice/${orderId}`, {
        responseType: "blob",
      });
      FileSaver.saveAs(res.data, `invoice_${orderId}.pdf`);
    } catch {
      alert("Invoice not available yet.");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading invoices…</p>;

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaFileInvoice className="text-3xl text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">My Invoices</h1>
      </div>
      {orders.map((items) => {
        const order = items[0];
        const orderId = order.order_id;
        const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const gst = (total * 0.18).toFixed(2);
        const totalWithGst = (total + Number(gst)).toFixed(2);

        return (
          <div
            key={orderId}
            className="mb-6 bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 transition hover:shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-600 mb-3 gap-1 sm:gap-0">
              <p><span className="font-semibold text-gray-700">Order:</span> {orderId}</p>
              <p><span className="font-semibold text-gray-700">Placed:</span> {new Date(order.order_date_time).toLocaleDateString()}</p>
              <p>
                <span className="font-semibold text-gray-700">Status:</span> {statusIcon(order.order_status)}
                <span className={`font-semibold ${order.order_status === "Delivered" ? "text-green-600" : order.order_status === "Cancelled" ? "text-red-600" : "text-yellow-600"}`}>{order.order_status}</span>
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="py-2 px-2 sm:px-3">Image</th>
                    <th className="py-2 px-2 sm:px-3">Item</th>
                    <th className="py-2 px-2 sm:px-3">Qty</th>
                    <th className="py-2 px-2 sm:px-3">Price</th>
                    <th className="py-2 px-2 sm:px-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 px-2 sm:px-3">
                        <img
                          src={
                            item.image_url
                              ? item.image_url.startsWith('/uploads/')
                                ? `https://eatster-nine.vercel.app${item.image_url}`
                                : `https://eatster-nine.vercel.app/uploads/menu_items/${item.image_url}`
                              : "/food-default.jpg"
                          }
                          alt={item.item_name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border"
                        />
                      </td>
                      <td className="py-2 px-2 sm:px-3">{item.item_name}</td>
                      <td className="py-2 px-2 sm:px-3">{item.quantity}</td>
                      <td className="py-2 px-2 sm:px-3">₹{item.price}</td>
                      <td className="py-2 px-2 sm:px-3">₹{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-3 text-xs sm:text-sm">
              <p>Grand Total: <span className="font-semibold">₹{total.toFixed(2)}</span></p>
              <p>GST (18%): <span className="font-semibold">₹{gst}</span></p>
              <p className="font-bold text-base sm:text-lg text-blue-900 mt-1">Total w/ GST: ₹{totalWithGst}</p>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
              <button
                onClick={() => download(orderId)}
                disabled={order.order_status !== "Delivered"}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-all shadow-sm
                  ${order.order_status === "Delivered"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                `}
              >
                <FaDownload className="text-lg" /> Download Invoice
              </button>
              <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm max-w-xs w-full text-left break-words whitespace-pre-line">
                <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                <span className="block w-full leading-snug" style={{ wordBreak: 'break-word', fontSize: '12px' }}>{order.delivery_address_}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoicePage;
