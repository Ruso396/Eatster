import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Payment,
  AccessTime,
  Cancel,
  CheckCircle,
  EventAvailable,
} from "@mui/icons-material";
import { format } from "date-fns";

const AdminPayment = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      const restaurantId = localStorage.getItem("restaurant_id");

      if (!restaurantId) {
        console.error("restaurant_id not found in localStorage");
        return;
      }

      try {
        const res = await axios.get(
          `https://backend-weld-three-46.vercel.app/api/orders/restaurant/${restaurantId}`
        );
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = [];

    switch (filter) {
      case "day":
        filtered = orders.filter((o) => {
          const date = new Date(o.order_date_time);
          return (
            date.toDateString() === now.toDateString()
          );
        });
        break;
      case "week":
        filtered = orders.filter((o) => {
          const date = new Date(o.order_date_time);
          const diff = (now - date) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        });
        break;
      case "month":
        filtered = orders.filter((o) => {
          const date = new Date(o.order_date_time);
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "year":
        filtered = orders.filter((o) => {
          const date = new Date(o.order_date_time);
          return date.getFullYear() === now.getFullYear();
        });
        break;
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);
  }, [filter, orders]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        <Payment sx={{ mr: 1, verticalAlign: "middle" }} />
        Restaurant Orders
      </Typography>

      {/* Filter Dropdown */}
      <Box sx={{ mb: 3, maxWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel>Date Filter</InputLabel>
          <Select
            value={filter}
            label="Date Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f0f0" }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cancel Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{ transition: "all 0.3s ease", ":hover": { bgcolor: "#f9f9f9" } }}
                >
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>₹{order.total_price?.toFixed(2)}</TableCell>
                  <TableCell>{order.delivery_address_}</TableCell>
                  <TableCell>{order.paymentmethod}</TableCell>
                  <TableCell>
                    <AccessTime sx={{ fontSize: 18, mr: 1 }} />
                    {format(new Date(order.order_date_time), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell>
                    <EventAvailable sx={{ fontSize: 18, mr: 1 }} />
                    {format(new Date(order.delivery_date_time), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell>
                    {order.order_status === "Cancelled" ? (
                      <Cancel color="error" />
                    ) : (
                      <CheckCircle color="success" />
                    )}{" "}
                    {order.order_status}
                  </TableCell>
                  <TableCell>{order.cancel_reason || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPayment;
