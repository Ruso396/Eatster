import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bgImage from '../../assets/loggin.jpeg'; // ✅ Your background image

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          Swal.fire({ title: 'Error', text: 'Please enter both email and password', icon: 'error' });
          return;
        }

        const { data } = await axios.post('http://localhost:5000/api/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('customer_id', data.user.customer_id);

        Swal.fire({
          title: `${data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1)} Login Successful!`,
          text: `Welcome, ${data.user.username}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });

        window.dispatchEvent(new Event("userLoggedIn"));

        if (data.user.role === 'superadmin') navigate('/superadmin-panel');
        else if (data.user.role === 'admin') navigate('/admin-dashboard');
        else if (data.user.role === 'user') navigate('/eatster');
        else {
          Swal.fire({ title: 'Error', text: 'Unknown role, contact support', icon: 'error' });
        }
      } else {
        if (!formData.username || !formData.email || !formData.password) {
          Swal.fire({ title: 'Error', text: 'Please fill all fields', icon: 'error' });
          return;
        }

        await axios.post('http://localhost:5000/api/register', formData);

        Swal.fire({ title: 'Registered Successfully!', text: 'You can now log in.', icon: 'success' });

        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong 😢',
        icon: 'error'
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-sm p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Sign In' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
          >
            {isLogin ? 'Continue' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: '', email: '', password: '' });
            }}
            className="ml-2 text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;