import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://eatster-pro.onrender.com/api/restaurants'; // Your backend API base URL

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    price: '',
    itemImage: null, // For file object
    available: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  useEffect(() => {
    const fetchRestaurantIdAndMenuItems = async () => {
      const adminEmail = localStorage.getItem('email');
      if (!adminEmail) {
        Swal.fire('Error', 'Admin email not found in local storage. Please log in again.', 'error');
        return;
      }

      try {
        // Fetch restaurant details to get the restaurant_id
        const { data: restaurantData } = await axios.get(`${API_BASE_URL}/details/${adminEmail}`);
        const fetchedRestaurantId = restaurantData.id;
        setRestaurantId(fetchedRestaurantId);

        // Fetch menu items for this restaurant
        const { data: items } = await axios.get(`${API_BASE_URL}/${fetchedRestaurantId}/menu-items`);
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching restaurant data or menu items:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to load menu items.', 'error');
      }
    };

    fetchRestaurantIdAndMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      itemImage: e.target.files[0],
    });
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: '',
      price: '',
      itemImage: null,
      available: true,
    });
    setIsEditing(false);
    setCurrentEditItem(null);
  };

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();

    if (!restaurantId) {
      Swal.fire('Error', 'Restaurant ID not available.', 'error');
      return;
    }

    const itemData = new FormData();
    itemData.append('name', formData.itemName);
    itemData.append('category', formData.category);
    itemData.append('price', formData.price);
    itemData.append('available', formData.available);
    if (formData.itemImage) {
      itemData.append('itemImage', formData.itemImage);
    } else if (isEditing && currentEditItem.image_url) {
        // If not uploading a new image but editing, retain the old image URL
        itemData.append('existingImage', currentEditItem.image_url);
    }

    try {
      if (isEditing) {
        // Update existing item
        const { data } = await axios.put(`${API_BASE_URL}/${restaurantId}/menu-items/${currentEditItem.id}`, itemData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMenuItems(menuItems.map(item => item.id === currentEditItem.id ? { ...data.updatedItem, image_url: data.updatedItem.imageUrl } : item));
        Swal.fire('Success', 'Menu item updated successfully!', 'success');
      } else {
        // Add new item
        const { data } = await axios.post(`${API_BASE_URL}/${restaurantId}/menu-items`, itemData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMenuItems([...menuItems, { ...data, image_url: data.imageUrl }]);
        Swal.fire('Success', 'Menu item added successfully!', 'success');
      }
      resetForm();
    } catch (error) {
      console.error('Error adding/updating menu item:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save menu item.', 'error');
    }
  };

  const handleEditItem = (item) => {
    setIsEditing(true);
    setCurrentEditItem(item);
    setFormData({
      itemName: item.name,
      category: item.category,
      price: item.price.toString(), // Convert number to string for input value
      itemImage: null, // Don't pre-fill file input, user can choose to upload new
      available: item.available === 1, // Convert tinyint to boolean
    });
  };

  const handleDeleteItem = async (itemId) => {
    if (!restaurantId) {
      Swal.fire('Error', 'Restaurant ID not available.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/${restaurantId}/menu-items/${itemId}`);
          setMenuItems(menuItems.filter(item => item.id !== itemId));
          Swal.fire('Deleted!', 'Your menu item has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting menu item:', error);
          Swal.fire('Error', error.response?.data?.message || 'Failed to delete menu item.', 'error');
        }
      }
    });
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu Management</h3>
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h4>
        <form onSubmit={handleAddOrUpdateItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
          <div className="col-span-1">
            <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700 mb-1">
              Item Image
            </label>
            <input
              type="file"
              id="itemImage"
              name="itemImage"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            {/* Image Preview */}
            {(formData.itemImage || (isEditing && currentEditItem?.image_url)) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Image Preview:</p>
                <img
                  src={
                    formData.itemImage
                      ? URL.createObjectURL(formData.itemImage)
                      : `https://eatster-pro.onrender.com/${currentEditItem.image_url}`
                  }
                  alt="Preview"
                  className="w-24 h-24 rounded-md object-cover"
                />
              </div>
            )}
          </div>
          <div className="col-span-full flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="mr-2 rounded text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="available" className="text-sm text-gray-700">Available</label>
          </div>
          <button
            type="submit"
            className="col-span-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center"
          >
            {isEditing ? (
              <>
                <Pencil className="w-4 h-4 mr-2" /> Update Item
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="col-span-full bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <h4 className="text-lg font-medium text-gray-700 mb-3">Current Menu Items</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No menu items added yet.</p>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center space-x-4">
              <img src={item.image_url ? `https://eatster-pro.onrender.com/${item.image_url}` : 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">{item.category} - ₹{item.price}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditItem(item)} className="text-blue-500 hover:text-blue-700"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default MenuManagement;