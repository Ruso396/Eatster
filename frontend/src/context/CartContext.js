


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = async () => {
    const customerId = localStorage.getItem("customer_id");
    if (customerId) {
      try {
        const res = await axios.get(`http://https://eatster-nine.vercel.app/api/cart/${customerId}`);
        const total = res.data.reduce((acc, item) => acc + item.quantity, 0);
        setCartItemCount(total);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, setCartItemCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
