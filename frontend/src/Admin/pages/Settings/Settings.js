import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Settings = () => {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    account_name: '',
    account_number: '',
    ifsc: '',
    fssai: '', // Added FSSAI for display
    gstin: '', // Added GSTIN for display
    pan: '',   // Added PAN for display
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      try {
        const userEmail = localStorage.getItem('email'); // Get the logged-in user's email
        if (!userEmail) {
          setError("User email not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://eatster-nine.vercel.app/api/restaurants/details/${userEmail}`);
        setRestaurantData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError("Failed to load restaurant details. Please try again.");
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRestaurantDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email'); // Get the logged-in user's email
      if (!userEmail) {
        Swal.fire('Error', 'User email not found. Please log in.', 'error');
        return;
      }

      await axios.put(`https://eatster-nine.vercel.app/api/restaurants/details/${userEmail}`, {
        name: restaurantData.name,
        mobile: restaurantData.contact, // Ensure this maps to 'mobile' in backend
        address: restaurantData.address,
        // Include other fields that can be updated through this form if necessary
      });
      Swal.fire('Success', 'Restaurant details updated successfully!', 'success');
    } catch (err) {
      console.error("Error updating restaurant details:", err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update restaurant details.', 'error');
    }
  };

  const handleBankDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email'); // Get the logged-in user's email
      if (!userEmail) {
        Swal.fire('Error', 'User email not found. Please log in.', 'error');
        return;
      }

      await axios.put(`https://eatster-nine.vercel.app/api/restaurants/bank-details/${userEmail}`, {
        account_name: restaurantData.account_name,
        account_number: restaurantData.account_number,
        ifsc: restaurantData.ifsc,
      });
      Swal.fire('Success', 'Bank details updated successfully!', 'success');
    } catch (err) {
      console.error("Error updating bank details:", err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update bank details.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Settings</h3>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Restaurant Details</h4>
        <form onSubmit={handleRestaurantDetailsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              name="name"
              value={restaurantData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contact" // Maps to 'mobile' in backend
              value={restaurantData.mobile || ''} // Use restaurantData.mobile
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="emailAddress"
              name="email"
              value={restaurantData.email || ''}
              onChange={handleChange}
              disabled // Email is usually not editable via settings
              className="mt-1 block w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              name="address"
              value={restaurantData.address || ''}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500 resize-none"
            ></textarea>
          </div>
          {/* Display FSSAI, GSTIN, PAN as read-only, assuming they are not frequently updated */}
          <div>
            <label htmlFor="fssai" className="block text-sm font-medium text-gray-700">FSSAI</label>
            <input
              type="text"
              id="fssai"
              name="fssai"
              value={restaurantData.fssai || ''}
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">GSTIN</label>
            <input
              type="text"
              id="gstin"
              name="gstin"
              value={restaurantData.gstin || ''}
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN</label>
            <input
              type="text"
              id="pan"
              name="pan"
              value={restaurantData.pan || ''}
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <button type="submit" className="col-span-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200">Save Restaurant Details</button>
        </form>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Bank Details</h4>
        <form onSubmit={handleBankDetailsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Holder Name</label>
            <input
              type="text"
              id="accountName"
              name="account_name"
              value={restaurantData.account_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="account_number"
              value={restaurantData.account_number || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifsc"
              value={restaurantData.ifsc || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button type="submit" className="col-span-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200">Save Bank Details</button>
        </form>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-3">FSSAI Certificate</h4>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-gray-600 mr-3" />
            {/* You would typically display the actual filename if stored, or allow upload */}
            <p className="text-gray-700">FSSAI_Certificate_2024.pdf (Placeholder)</p>
          </div>
          <input type="file" className="text-sm text-gray-500" />
        </div>
      </div>
    </section>
  );
};

export default Settings;