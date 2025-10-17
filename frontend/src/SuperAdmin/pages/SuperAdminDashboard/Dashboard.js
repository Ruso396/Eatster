import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [selectedBox, setSelectedBox] = useState('users');
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRestaurants();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://https://eatster-nine.vercel.app/api/users");
    setUsers(res.data);
  };

  const fetchRestaurants = async () => {
    const res = await axios.get("http://https://eatster-nine.vercel.app/api/restaurants");
    setRestaurants(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get("http://https://eatster-nine.vercel.app/api/orders/all");
    setOrders(res.data);
  };

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const renderChart = () => {
    switch (selectedBox) {
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={users.map((u, i) => ({ name: `User ${i + 1}`, id: u.id }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="id" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'restaurants':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restaurants.map((r, i) => ({ name: `Rest ${i + 1}`, id: r.id }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="id" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'orders':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orders.slice(0, 5).map((o, i) => ({ name: `Order ${i + 1}`, value: o.total_price }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {orders.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => setSelectedBox('users')}
          className="cursor-pointer bg-white shadow-xl rounded-xl p-6 hover:bg-blue-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700">Users</h2>
          <p className="text-4xl font-bold text-blue-500">{users.length}</p>
        </div>
        <div
          onClick={() => setSelectedBox('restaurants')}
          className="cursor-pointer bg-white shadow-xl rounded-xl p-6 hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700">Restaurants</h2>
          <p className="text-4xl font-bold text-green-500">{restaurants.length}</p>
        </div>
        <div
          onClick={() => setSelectedBox('orders')}
          className="cursor-pointer bg-white shadow-xl rounded-xl p-6 hover:bg-yellow-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
          <p className="text-4xl font-bold text-yellow-500">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          {selectedBox.charAt(0).toUpperCase() + selectedBox.slice(1)} Chart
        </h2>
        {renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;