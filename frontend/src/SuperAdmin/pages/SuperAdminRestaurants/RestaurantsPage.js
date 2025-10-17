// File: PaymentsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserShield } from 'react-icons/fa';

export default function RestaurantsPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('https://eatster-nine.vercel.app/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const handleMakeAdmin = (id) => {
    axios.put(`https://eatster-nine.vercel.app/api/restaurants/make-admin/${id}`)
      .then(() => {
        alert("✅ User promoted to admin!");
        fetchUsers();
      })
      .catch(err => {
        alert("❌ Failed to promote user");
        console.error(err);
      });
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'admin') return u.role === 'admin';
    if (filter === 'customer') return u.role !== 'admin';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">✨ Manage Users</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          {['all', 'admin', 'customer'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 shadow ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-indigo-100 animate-fade-in">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-indigo-600 text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u, index) => (
                <tr
                  key={u.id}
                  className="hover:bg-indigo-50 transition-all duration-300"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{u.username}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.status === 'active'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.customer_id || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => handleMakeAdmin(u.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow hover:scale-105 transform transition"
                      >
                        <FaUserShield className="text-sm" /> Make Admin
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-bold">Already Admin</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}