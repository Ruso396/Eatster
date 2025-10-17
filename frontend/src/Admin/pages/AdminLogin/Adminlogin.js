import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import imges from '../../../assets/loginimgg.jpg';

const AdminLoginRegister = () => {
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
        // 泊 LOGIN
        if (!formData.email || !formData.password) {
          Swal.fire({
            title: 'Error',
            text: 'Please enter both email and password',
            icon: 'error'
          });
          return;
        }

        const { data } = await axios.post('http://https://eatster-nine.vercel.app/api/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('adminname', data.user.username);
        localStorage.setItem('email', data.user.email); 
        localStorage.setItem("restaurant_id", data.user.restaurant_id); // ✅ Store restaurant ID here

        Swal.fire({
          title: `${data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1)} Login Successful!`,
          text: `Welcome, ${data.user.username}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });

        window.dispatchEvent(new Event("userLoggedIn"));

        // 検 Role-based navigation
        if (data.user.role === 'superadmin') {
          navigate('/superadmin-panel');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'user') {
          navigate('/');
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Unknown role, contact support',
            icon: 'error'
          });
        }

      } else {
        // 統 REGISTER
        if (!formData.username || !formData.email || !formData.password) {
          Swal.fire({
            title: 'Error',
            text: 'Please fill all fields',
            icon: 'error'
          });
          return;
        }

        await axios.post('http://https://eatster-nine.vercel.app/api/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        Swal.fire({
          title: 'Registered Successfully!',
          text: 'You can now log in.',
          icon: 'success'
        });

        setIsLogin(true);
        setFormData({
          username: '',
          email: '',
          password: ''
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong 个',
        icon: 'error'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#fafafa] pt-[3%]">
      <div className="w-[800px] h-[500px] flex bg-white shadow-[0_0_25px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
        {/* Left Image */}
        <div className="flex-1 bg-black">
          <img
            src={imges}
            alt="Food"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <p className="text-sm mt-4 text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              className="text-green-600 ml-1 cursor-pointer"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  username: '',
                  email: '',
                  password: ''
                });
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginRegister;