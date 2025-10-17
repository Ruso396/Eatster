// import React, { useState } from "react";
// import axios from "axios";
// import OfferList from "../../../pages/offer/OfferList.js";

// const AdminOffers = () => {
//   const restaurantId = localStorage.getItem("restaurant_id");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     discount_percent: "",
//     valid_from: "",
//     valid_to: "",
//     image: null
//   });

//   const [refresh, setRefresh] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData(prev => ({ ...prev, image: files[0] }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       data.append("restaurant_id", restaurantId);
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("discount_percent", formData.discount_percent);
//       data.append("valid_from", formData.valid_from);
//       data.append("valid_to", formData.valid_to);
//       data.append("active", true);
//       if (formData.image) data.append("image", formData.image);

//       await axios.post("https://backend-weld-three-46.vercel.app/api/offers", data);
//       alert("✅ Offer added successfully!");

//       setFormData({
//         title: "",
//         description: "",
//         discount_percent: "",
//         valid_from: "",
//         valid_to: "",
//         image: null
//       });

//       setRefresh(prev => !prev);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to add offer");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Manage Offers</h2>
//       <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
//         <input name="title" placeholder="Offer Title" value={formData.title} onChange={handleChange} className="border p-2 w-full rounded" required />
//         <textarea name="description" placeholder="Offer Description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" required />
//         <input name="discount_percent" type="number" placeholder="Discount %" value={formData.discount_percent} onChange={handleChange} className="border p-2 w-full rounded" required />
//         <input name="valid_from" type="date" value={formData.valid_from} onChange={handleChange} className="border p-2 w-full rounded" required />
//         <input name="valid_to" type="date" value={formData.valid_to} onChange={handleChange} className="border p-2 w-full rounded" required />
//         <input name="image" type="file" accept="image/*" onChange={handleChange} className="border p-2 w-full rounded" />
//         <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">➕ Add Offer</button>
//       </form>
//       <hr className="my-6" />
//       <OfferList key={refresh} restaurantId={restaurantId} isAdmin={true} />
//     </div>
//   );
// };

// export default AdminOffers;


import React, { useState, useEffect } from "react";
import axios from "axios";
import OfferList from "../../../pages/offer/OfferList.js";
import Swal from 'sweetalert2';
import { FaEdit, FaTimes, FaTrash, FaRupeeSign, FaShoppingCart, FaUtensils, FaTag, FaAlignLeft, FaPercent, FaCalendarAlt, FaImage } from 'react-icons/fa';

const AdminOffers = () => {
  const restaurantId = localStorage.getItem("restaurant_id");

  const [formData, setFormData] = useState({
    title: "",
        foodname: "",
        price: "",
    description: "",
    discount_percent: "",
    valid_from: "",
    valid_to: "",
    image: null
  });

    // State for live preview
    const [previewData, setPreviewData] = useState({
        title: "",
        foodname: "",
        price: "",
        description: "",
        discount_percent: "",
        imageUrl: null
    });

  const [refresh, setRefresh] = useState(false);
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerRefresh, setBannerRefresh] = useState(false);
    const [banners, setBanners] = useState([]);
    const [editBannerId, setEditBannerId] = useState(null);
    const [editBannerImage, setEditBannerImage] = useState(null);

    const bannerInputRef = React.useRef();

    // Fetch banners for this restaurant
    useEffect(() => {
        if (!restaurantId) return;
        axios.get(`https://backend-weld-three-46.vercel.app/api/restaurants/${restaurantId}/banners`).then(res => setBanners(res.data));
    }, [restaurantId, bannerRefresh]);

    // Delete banner
    const handleDeleteBanner = async (bannerId) => {
        const result = await Swal.fire({
            title: 'Are you sure you want to delete this banner?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, delete it!',
        });
        if (!result.isConfirmed) return;
        await axios.delete(`https://backend-weld-three-46.vercel.app/api/restaurants/banners/${bannerId}`);
        setBannerRefresh(prev => !prev);
        Swal.fire({ icon: 'success', title: 'Banner deleted successfully!', showConfirmButton: false, timer: 1200 });
    };

    // Edit banner (replace image)
    const handleEditBanner = (bannerId) => {
        setEditBannerId(bannerId);
        setEditBannerImage(null);
    };
    const handleEditBannerImageChange = (e) => {
        setEditBannerImage(e.target.files[0]);
    };
    const handleEditBannerSubmit = async (e) => {
        e.preventDefault();
        if (!editBannerImage || !editBannerId) {
            Swal.fire({ icon: 'error', title: 'No new image selected!', showConfirmButton: false, timer: 1500 });
            return;
        }
        const data = new FormData();
        data.append("banner", editBannerImage);
        await axios.put(`https://backend-weld-three-46.vercel.app/api/restaurants/banners/${editBannerId}`, data);
        setEditBannerId(null);
        setEditBannerImage(null);
        setBannerRefresh(prev => !prev);
        Swal.fire({ icon: 'success', title: 'Banner updated successfully!', showConfirmButton: false, timer: 1200 });
    };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
            setPreviewData(prev => ({ ...prev, imageUrl: files[0] ? URL.createObjectURL(files[0]) : null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
            setPreviewData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("restaurant_id", restaurantId);
      data.append("title", formData.title);
            data.append("foodname", formData.foodname);
            data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("discount_percent", formData.discount_percent);
      data.append("valid_from", formData.valid_from);
      data.append("valid_to", formData.valid_to);
      data.append("active", true);
      if (formData.image) data.append("image", formData.image);

      await axios.post("https://backend-weld-three-46.vercel.app/api/offers", data);
      setFormData({
        title: "",
                foodname: "",
                price: "",
        description: "",
        discount_percent: "",
        valid_from: "",
        valid_to: "",
        image: null
      });
            setPreviewData({ // Reset preview data as well
                title: "",
                foodname: "",
                price: "",
                description: "",
                discount_percent: "",
                imageUrl: null
            });
            Swal.fire({ icon: 'success', title: 'Offer added successfully!', showConfirmButton: false, timer: 1200 });
      setRefresh(prev => !prev);
    } catch (err) {
      console.error(err);
            Swal.fire({ icon: 'error', title: 'Failed to add offer', text: err.message });
        }
    };

    const handleBannerChange = (e) => {
        setBannerImage(e.target.files[0]);
    };

    const handleBannerUpload = async (e) => {
        e.preventDefault();
        if (!bannerImage) {
            Swal.fire({ icon: 'warning', title: 'Please select a banner image', showConfirmButton: false, timer: 1500 });
            return;
        }
        try {
            const data = new FormData();
            data.append("restaurant_id", restaurantId);
            data.append("banner", bannerImage);
            await axios.post("https://backend-weld-three-46.vercel.app/api/restaurants/banners", data);
            setBannerImage(null);
            if (bannerInputRef.current) bannerInputRef.current.value = "";
            setBannerRefresh(prev => !prev);
            Swal.fire({ icon: 'success', title: 'Banner uploaded successfully!', showConfirmButton: false, timer: 1200 });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Failed to upload banner', text: err.message });
    }
  };

  return (
    <div className="p-6">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Manage Offers & Banners</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Offer Creation Form */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-xl">
                    <h3 className="text-2xl font-bold mb-5 text-gray-800">Add New Offer</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-orange-300">
                            <FaUtensils className="text-orange-500 text-lg mx-3" />
                            <input
                                name="foodname"
                                placeholder="Food Name"
                                value={formData.foodname}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-green-300">
                            <FaRupeeSign className="text-green-600 text-lg mx-3" />
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                            <FaTag className="text-blue-500 text-lg mx-3" />
                            <input
                                name="title"
                                placeholder="Offer Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-start border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-purple-300">
                            <FaAlignLeft className="text-purple-500 text-lg mx-3 mt-4" />
                            <textarea
                                name="description"
                                placeholder="Offer Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent min-h-[80px]"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-300">
                            <FaPercent className="text-red-500 text-lg mx-3" />
                            <input
                                name="discount_percent"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Discount %"
                                value={formData.discount_percent}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-300">
                            <FaCalendarAlt className="text-teal-500 text-lg mx-3" />
                            <input
                                name="valid_from"
                                type="date"
                                value={formData.valid_from}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-cyan-300">
                            <FaCalendarAlt className="text-cyan-500 text-lg mx-3" />
                            <input
                                name="valid_to"
                                type="date"
                                value={formData.valid_to}
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
                            <FaImage className="text-indigo-500 text-lg mx-3" />
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="p-3 w-full outline-none bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-md hover:bg-orange-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                        >
                            <FaEdit className="text-xl" /> Add Offer
                        </button>
                    </form>
                </div>

                {/* Live Offer Preview */}
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-xl border border-gray-200">
                    <h3 className="text-2xl font-bold mb-5 text-gray-800 text-center">Live Offer Preview</h3>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden relative">
                        {previewData.imageUrl ? (
                            <div className="w-full h-40 sm:h-52 overflow-hidden flex items-center justify-center bg-gray-50">
                                <img
                                    src={previewData.imageUrl}
                                    alt="Offer Preview"
                                    className="w-full h-full object-cover rounded-t-xl"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-40 sm:h-52 bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-t-xl">
                                No Image Selected
                            </div>
                        )}
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-orange-700 truncate">
                                    {previewData.foodname || previewData.title || "Food/Offer Name"}
                                </h3>
                                {previewData.discount_percent && (
                                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                        {previewData.discount_percent}% OFF
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl text-green-700 font-bold">
                                    ₹{previewData.price || "0.00"}
                                </span>
                                {/* You can add time left preview if desired, but it requires valid_to */}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {previewData.description || "This is a placeholder for your offer description. It will appear here as you type."}
                            </p>
                            <button className="mt-3 w-full bg-green-500 text-white text-base font-semibold py-2 rounded-md flex items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                                <FaShoppingCart /> Add to Cart (Preview)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-10 border-t-2 border-gray-300" />

            {/* Banner Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
                <h3 className="text-2xl font-bold mb-5 text-gray-800">Upload Restaurant Banner</h3>
                <form onSubmit={handleBannerUpload} className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="flex-1 border border-gray-300 p-3 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
                        ref={bannerInputRef}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                        disabled={!bannerImage}
                    >
                        <FaImage className="text-xl" /> Upload Banner
                    </button>
                </form>
            </div>

            {/* Banner List for Admin */}
            {banners.length > 0 && (
                <div className="my-8 bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-bold mb-5 text-gray-800 text-center">Uploaded Banners</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {banners.map(banner => (
                            <div key={banner.id} className="border border-gray-200 rounded-xl shadow-md p-3 relative bg-white flex flex-col items-center">
                                <img
                                    src={`https://eatster-nine.vercel.app${banner.image_url}`}
                                    alt="Banner"
                                    className="w-full h-36 object-cover rounded-md mb-3"
                                />
                                <div className="flex gap-3 justify-center w-full">
                                    <button
                                        onClick={() => handleDeleteBanner(banner.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                    <button
                                        onClick={() => handleEditBanner(banner.id)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-yellow-600 transition-colors"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                </div>
                                {editBannerId === banner.id && (
                                    <form onSubmit={handleEditBannerSubmit} className="mt-4 flex flex-col gap-3 w-full">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditBannerImageChange}
                                            className="border border-gray-300 p-2 w-full rounded-md file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FaEdit /> Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditBannerId(null)}
                                                className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        </div>
      </form>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <hr className="my-10 border-t-2 border-gray-300" />
            <OfferList key={refresh + '-' + bannerRefresh} restaurantId={restaurantId} isAdmin={true} />
    </div>
  );
};

export default AdminOffers;