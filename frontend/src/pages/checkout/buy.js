import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaCheckCircle, FaPlus, FaArrowRight, FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheck } from "react-icons/fa";

const ADDRESS_STORAGE_KEY = 'eatster_addresses';

const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

const validatePincode = (pincode) => {
  return /^\d{5,6}$/.test(pincode);
};

const BuyPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (!address.name || !address.phone || !address.address || !address.pincode) {
      Swal.fire('Incomplete Address', 'Please fill out all address fields.', 'warning');
      return;
    }
    if (!validatePhone(address.phone)) {
      Swal.fire('Invalid Phone', 'Phone number must be 10 digits.', 'error');
      return;
    }
    if (!validatePincode(address.pincode)) {
      Swal.fire('Invalid Pincode', 'Pincode must be 5 or 6 digits.', 'error');
      return;
    }
    if (isEditing && selectedIndex !== null) {
      const updated = [...addresses];
      updated[selectedIndex] = address;
      setAddresses(updated);
      setIsEditing(false);
      setSelectedIndex(null);
    } else {
      setAddresses([...addresses, address]);
    }
    setAddress({ name: '', phone: '', address: '', pincode: '' });
  };

  const handleEdit = (idx) => {
    setAddress(addresses[idx]);
    setIsEditing(true);
    setSelectedIndex(idx);
  };

  const handleDelete = (idx) => {
    Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = addresses.filter((_, i) => i !== idx);
        setAddresses(updated);
        if (selectedIndex === idx) {
          setSelectedIndex(null);
        }
      }
    });
  };

  const handleSelect = (idx) => {
    setSelectedIndex(idx);
  };

  const handleProceedToPayment = () => {
    if (selectedIndex === null) {
      Swal.fire('No Address Selected', 'Please select an address to proceed.', 'warning');
      return;
    }
    navigate('/payment', {
      state: {
        ...state,
        address: addresses[selectedIndex],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center py-10 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-8">
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
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl"><FaCreditCard /></div>
            <span className="text-xs mt-1 font-semibold text-gray-400">PAYMENT</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl"><FaCheck /></div>
            <span className="text-xs mt-1 font-semibold text-gray-400">ORDER</span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-10 flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-orange-600 text-center mb-2 tracking-tight flex items-center justify-center gap-3">
          <FaPlus className="text-orange-400" /> Shipping Addresses
        </h1>
        {/* Address List */}
        <div className="mb-2">
          {addresses.length === 0 ? (
            <div className="text-gray-400 text-center italic">No saved addresses. Add one below.</div>
          ) : (
            <ul className="space-y-5">
              {addresses.map((addr, idx) => (
                <li
                  key={idx}
                  className={`relative border-2 rounded-xl p-5 flex flex-col gap-1 shadow-sm transition-all duration-200 cursor-pointer group ${selectedIndex === idx ? 'border-orange-600 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50'}`}
                  onClick={() => handleSelect(idx)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {selectedIndex === idx && <FaCheckCircle className="text-orange-600 text-xl mr-1" />}
                    <span className="font-semibold text-lg text-gray-800">{addr.name}</span>
                    <span className="text-gray-500">({addr.phone})</span>
                  </div>
                  <div className="text-gray-700">{addr.address}</div>
                  <div className="text-gray-500">Pincode: {addr.pincode}</div>
                  <div className="absolute top-3 right-4 flex gap-3">
                    <button
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                      onClick={e => { e.stopPropagation(); handleEdit(idx); }}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                      onClick={e => { e.stopPropagation(); handleDelete(idx); }}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Add/Edit Address Form */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-100 rounded-xl shadow-lg p-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FaPlus className="text-orange-400" />
            <span className="font-bold text-gray-700 text-lg">{isEditing ? 'Edit Address' : 'Add New Address'}</span>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            maxLength={10}
          />
          <textarea
            name="address"
            placeholder="Full Address"
            value={address.address}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            rows="3"
          ></textarea>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            maxLength={6}
          />
          <button
            onClick={handleAddOrUpdate}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 text-lg transition-all"
          >
            {isEditing ? <FaEdit className="text-white" /> : <FaPlus className="text-white" />} {isEditing ? 'Update Address' : 'Add Address'}
          </button>
        </div>
        <button
          onClick={handleProceedToPayment}
          className="w-full mt-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 text-xl transition-all"
        >
          Proceed to Payment <FaArrowRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default BuyPage;