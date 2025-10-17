import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaShoppingCart, FaTimes, FaSave } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { faGift } from "@fortawesome/free-solid-svg-icons";

const OfferList = ({ restaurantId: propRestaurantId, isAdmin = false }) => {
  const [offers, setOffers] = useState([]);
  const [restaurantId, setRestaurantId] = useState(propRestaurantId || null);
  const [banners, setBanners] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();
  const [editOfferId, setEditOfferId] = useState(null);
  const [editOfferData, setEditOfferData] = useState({ title: '', description: '', discount_percent: '', valid_from: '', valid_to: '', image: null });
  const [refresh, setRefresh] = useState(false);
  const { fetchCartCount } = useCart();
  const [allMode, setAllMode] = useState(!propRestaurantId);
  const [allBanners, setAllBanners] = useState([]);

  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  useEffect(() => {
    if (!propRestaurantId) {
      // Fetch all offers from all restaurants
      axios.get('http://https://eatster-nine.vercel.app/api/offers').then(res => setOffers(res.data)).catch(() => setOffers([]));
      setAllMode(true);
      setRestaurantId(null);
      setBanners([]);
      setRestaurantName('');
      const fetchBanners = () => {
        axios.get('http://https://eatster-nine.vercel.app/api/restaurants/banners-all')
          .then(res => {
            setAllBanners(res.data);
            console.log('Fetched banners:', res.data); // Debug log
          })
          .catch(() => setAllBanners([]));
      };
      fetchBanners();
      window.addEventListener('focus', fetchBanners);
      return () => window.removeEventListener('focus', fetchBanners);
    } else {
    const storedId = propRestaurantId || localStorage.getItem("restaurant_id");
    if (!storedId) {
      console.warn("❗ No restaurant_id found");
      return;
    }
    setRestaurantId(storedId);
      axios.get(`http://https://eatster-nine.vercel.app/api/restaurants/${storedId}/banners`).then(res => {
        setBanners(res.data);
        if (res.data.length > 0) setRestaurantName(res.data[0].restaurant_name);
      });
      axios.get(`http://https://eatster-nine.vercel.app/api/offers/${storedId}`).then(res => setOffers(res.data)).catch(() => setOffers([]));
      setAllMode(false);
    }
  }, [propRestaurantId, refresh]);

  // Fix banner duplication (unique by id)
  const uniqueBanners = Array.from(new Map(banners.map(b => [b.id, b])).values());

  const handleAddToCart = async (offer) => {
    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      Swal.fire("Please Login", "You need to be logged in to add items to cart", "warning");
      return;
    }
    try {
      // Get existing cart items
      const res = await axios.get(`http://https://eatster-nine.vercel.app/api/cart/${customerId}`);
      const cartItems = res.data;
      // Check if cart is empty or same restaurant
      if (
        cartItems.length === 0 ||
        cartItems.every((cartItem) => cartItem.restaurant_id === (allMode ? offer.restaurant_id : parseInt(restaurantId)))
      ) {
        // Add the offer as a cart item
        await axios.post("http://https://eatster-nine.vercel.app/api/cart/add", {
          customer_id: customerId,
          restaurant_id: allMode ? offer.restaurant_id : parseInt(restaurantId),
          item_id: offer.id,
          item_name: offer.foodname || offer.title,
          foodname: offer.foodname || offer.title,
          price: offer.price || 0,
          quantity: 1,
          image_url: offer.image_url,
        });
        fetchCartCount();
        Swal.fire({ icon: "success", title: "Added to Cart", showConfirmButton: false, timer: 1200 });
      } else {
        Swal.fire({
          title: "Different Restaurant Detected!",
          text: "Your cart contains items from another restaurant. Clear and continue?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, clear it!",
          cancelButtonText: "No, keep existing",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete(`http://https://eatster-nine.vercel.app/api/cart/clear/${customerId}`);
            await axios.post("http://https://eatster-nine.vercel.app/api/cart/add", {
              customer_id: customerId,
              restaurant_id: parseInt(restaurantId),
              item_id: offer.id,
              item_name: offer.foodname || offer.title,
              foodname: offer.foodname || offer.title,
              price: offer.price || 0,
              quantity: 1,
              image_url: offer.image_url,
            });
            fetchCartCount();
            Swal.fire({ icon: "success", title: "Cart Reset & Added!", showConfirmButton: false, timer: 1200 });
          }
        });
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      Swal.fire("Oops!", "Something went wrong", "error");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this offer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });
    if (!result.isConfirmed) return;
    await axios.delete(`http://https://eatster-nine.vercel.app/api/offers/${offerId}`, { data: { restaurant_id: restaurantId } });
    setRefresh(prev => !prev);
  };
  const handleEditOffer = (offer) => {
    setEditOfferId(offer.id);
    setEditOfferData({
      foodname: offer.foodname || '',
      price: offer.price || '',
      title: offer.title,
      description: offer.description,
      discount_percent: offer.discount_percent,
      valid_from: offer.valid_from?.slice(0, 10) || '',
      valid_to: offer.valid_to?.slice(0, 10) || '',
      image: null
    });
  };
  const handleEditOfferChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditOfferData(prev => ({ ...prev, image: files[0] }));
    } else {
      setEditOfferData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleEditOfferSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('restaurant_id', restaurantId);
    data.append('foodname', editOfferData.foodname);
    data.append('price', editOfferData.price);
    data.append('title', editOfferData.title);
    data.append('description', editOfferData.description);
    data.append('discount_percent', editOfferData.discount_percent);
    data.append('valid_from', editOfferData.valid_from);
    data.append('valid_to', editOfferData.valid_to);
    data.append('active', true);
    if (editOfferData.image) data.append('image', editOfferData.image);
    await axios.put(`http://https://eatster-nine.vercel.app/api/offers/${editOfferId}`, data);
    setEditOfferId(null);
    setEditOfferData({ foodname: '', price: '', title: '', description: '', discount_percent: '', valid_from: '', valid_to: '', image: null });
    setRefresh(prev => !prev);
  };

  // Helper to get time left string
  function getTimeLeft(valid_to) {
    if (!valid_to) return null;
    const now = new Date();
    const end = new Date(valid_to);
    const diff = end - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Ends soon';
  }

  return (
    <div className="p-4 sm:p-6">
      {/* 🔷 Banner Slider */}
      {!isAdmin && !restaurantId && (
        <div className="mb-10 max-w-5xl mx-auto">
          {allBanners.length > 0 ? (
            <>
              {/* Debug: Show number of banners */}
              {/* <div className="text-xs text-gray-400 mb-2">Banners fetched: {allBanners.length}</div> */}
              <Slider {...bannerSettings}>
                {Array.from(new Map(allBanners.map(b => [b.id, b])).values()).map((banner, index) => (
                  <div key={banner.id} className="relative px-2 cursor-pointer" onClick={() => navigate(`/pages/RestaurantDetail/${banner.restaurant_id}`)}>
                    <img
                      src={`http://https://eatster-nine.vercel.app${banner.image_url}`}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-52 sm:h-64 object-cover rounded-xl shadow-lg"
                      onError={e => { e.target.onerror = null; e.target.src = "/default-banner.jpg"; }}
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-lg font-bold">{banner.restaurant_name}</div>
                  </div>
                ))}
              </Slider>
            </>
          ) : (
            <div className="text-center text-gray-400">No banners available.</div>
          )}
        </div>
      )}

      {/* 🔶 Heading */}
      <h2
        className={`text-3xl font-extrabold text-center mb-8 ${
          isAdmin ? "text-blue-600" : "text-orange-600"
        }`}
      >
        {isAdmin ? "📋 Current Offers (Admin View)" : "🎁 Exciting Offers Just for You"}
      </h2>

      {/* 🛍️ Offer Grid */}
      {offers.length === 0 ? (
        <p className="text-gray-500 text-center">No offers available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition relative">
              {offer.image_url && (
                <div className="w-full h-36 sm:h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                  <img src={`http://https://eatster-nine.vercel.app${offer.image_url}`} alt={offer.title} className="w-full h-full object-cover rounded-t-xl hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-orange-700 truncate">{offer.foodname || offer.title}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{offer.discount_percent}% OFF</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg text-green-700 font-bold">₹{offer.price}</span>
                  {!isAdmin && getTimeLeft(offer.valid_to) && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{getTimeLeft(offer.valid_to)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{offer.description}</p>
                {allMode && (
                  <div className="text-xs text-blue-700 font-semibold mb-1">{offer.restaurant_name}</div>
                )}
                {!isAdmin && (
                  <button onClick={() => handleAddToCart(offer)} className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition"><FaShoppingCart /> Add to Cart</button>
                )}
                {isAdmin && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditOffer(offer)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-2 rounded-full text-lg flex items-center justify-center"><FaEdit /></button>
                    <button onClick={() => handleDeleteOffer(offer.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-full text-lg flex items-center justify-center"><FaTrash /></button>
                  </div>
                )}
              </div>
              {isAdmin && editOfferId === offer.id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <form onSubmit={handleEditOfferSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3 relative">
                    <button type="button" onClick={() => setEditOfferId(null)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"><FaTimes /></button>
                    <div className="flex flex-col gap-2">
                      <input name="foodname" value={editOfferData.foodname || ''} onChange={handleEditOfferChange} placeholder="Food Name" className="border p-2 w-full rounded mb-2" required />
                      <input name="price" type="number" min="0" step="0.01" value={editOfferData.price || ''} onChange={handleEditOfferChange} placeholder="Price" className="border p-2 w-full rounded mb-2" required />
                      <input name="title" value={editOfferData.title} onChange={handleEditOfferChange} placeholder="Title" className="border p-2 w-full rounded mb-2" required />
                      <textarea name="description" value={editOfferData.description} onChange={handleEditOfferChange} placeholder="Description" className="border p-2 w-full rounded mb-2" required />
                      <input name="discount_percent" type="number" value={editOfferData.discount_percent} onChange={handleEditOfferChange} placeholder="Discount %" className="border p-2 w-full rounded mb-2" required />
                      <input name="valid_from" type="date" value={editOfferData.valid_from} onChange={handleEditOfferChange} className="border p-2 w-full rounded mb-2" required />
                      <input name="valid_to" type="date" value={editOfferData.valid_to} onChange={handleEditOfferChange} className="border p-2 w-full rounded mb-2" required />
                      <input name="image" type="file" accept="image/*" onChange={handleEditOfferChange} className="border p-2 w-full rounded mb-2" />
                    </div>
                    <div className="flex gap-4 justify-center mt-2">
                      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-xl flex items-center justify-center"><FaSave /></button>
                      <button type="button" onClick={() => setEditOfferId(null)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-full text-xl flex items-center justify-center"><FaTimes /></button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferList;
