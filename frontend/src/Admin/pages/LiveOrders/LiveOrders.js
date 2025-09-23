import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import Swal from 'sweetalert2';

const LiveOrders = () => {
  const [orders, setOrders] = useState({
    incoming: [],
    preparing: [],
    dispatched: [],
    completed: [],
    cancelled: [],
  });

  const [activeOrderTab, setActiveOrderTab] = useState('incoming');
  const [loading, setLoading] = useState(true);

  // ✅ Normalize status for case-insensitive comparison
  const normalizeStatus = (status) => status?.toLowerCase();

  // ✅ Fetch orders by restaurant (admin login)
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'Authentication token not found. Please login again.', 'error');
        return;
      }

      const res = await axios.get('http://192.168.18.187:5000/api/orders/restaurant', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = res.data;

      const categorizedOrders = {
        incoming: fetchedOrders.filter(o => normalizeStatus(o.order_status) === 'placed'),
        preparing: fetchedOrders.filter(o => normalizeStatus(o.order_status) === 'preparing'),
        dispatched: fetchedOrders.filter(o => normalizeStatus(o.order_status) === 'out for delivery'),
        completed: fetchedOrders.filter(o => normalizeStatus(o.order_status) === 'delivered'),
        cancelled: fetchedOrders.filter(o => normalizeStatus(o.order_status) === 'cancelled'),
      };

      setOrders(categorizedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire('Error', 'Failed to fetch live orders.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Poll every 15 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ✅ Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://192.168.18.187:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Success', `Order updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire('Error', 'Failed to update order status.', 'error');
    }
  };

  // ✅ Render each order card
  const renderOrderCard = (order) => (
    <div
      key={order.order_id}
      className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
    >
      <div>
        <p className="font-semibold text-gray-800">Order #{order.order_id}</p>
        <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
        <p className="text-sm text-gray-600">Address: {order.delivery_address_}</p>
        <p className="text-xs font-medium text-orange-500 mt-1">Status: {order.order_status}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-orange-600">₹{order.total_price}</p>
        <p className="text-xs text-gray-500">{new Date(order.order_date_time).toLocaleString()}</p>
        <div className="mt-2 flex space-x-2">
          {activeOrderTab === 'incoming' && (
            <button
              onClick={() => handleUpdateStatus(order.order_id, 'Preparing')}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600"
            >
              <CheckCircle className="inline-block w-3 h-3 mr-1" /> Accept
            </button>
          )}
          {activeOrderTab === 'preparing' && (
            <button
              onClick={() => handleUpdateStatus(order.order_id, 'Out for delivery')}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600"
            >
              <Truck className="inline-block w-3 h-3 mr-1" /> Dispatch
            </button>
          )}
          {activeOrderTab === 'dispatched' && (
            <button
              onClick={() => handleUpdateStatus(order.order_id, 'Delivered')}
              className="bg-purple-500 text-white px-3 py-1 rounded-md text-xs hover:bg-purple-600"
            >
              <Package className="inline-block w-3 h-3 mr-1" /> Complete
            </button>
          )}
          {activeOrderTab !== 'completed' && activeOrderTab !== 'cancelled' && (
            <button
              onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
            >
              <XCircle className="inline-block w-3 h-3 mr-1" /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Order Management</h3>
      <div className="flex border-b border-gray-200 mb-4">
        {['incoming', 'preparing', 'dispatched', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeOrderTab === tab
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveOrderTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({orders[tab].length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading orders...</p>
        ) : orders[activeOrderTab].length > 0 ? (
          orders[activeOrderTab].map(renderOrderCard)
        ) : (
          <p className="text-gray-500 text-center py-8">No {activeOrderTab} orders at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default LiveOrders;
