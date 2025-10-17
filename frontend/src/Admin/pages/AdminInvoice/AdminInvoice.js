import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Button,
  TextField,
  Stack,
} from '@mui/material';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const restaurantId = localStorage.getItem('restaurant_id');

  useEffect(() => {
    if (!restaurantId) {
      alert('Restaurant ID not found. Please login again.');
      return;
    }

    fetch(`http://https://eatster-nine.vercel.app/api/invoice/restaurant/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((inv) => ({
          ...inv,
          total_price: parseFloat(inv.total_price),
          gst: parseFloat(inv.gst),
          total_with_gst: parseFloat(inv.total_with_gst),
        }));
        setInvoices(formatted);
        setFilteredInvoices(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load invoices:', err);
        setLoading(false);
      });
  }, [restaurantId]);

  useEffect(() => {
    const filtered = invoices.filter((inv) =>
      inv.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ color: '#FF5722' }}>
        📄 Restaurant Invoices
      </Typography>

      {/* 🔍 Search Filter */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          variant="outlined"
          label="Search Order / Invoice ID"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Stack>

      {filteredInvoices.length === 0 ? (
        <Typography>No matching invoices found.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={4}>
          <Table>
            <TableHead sx={{ backgroundColor: '#673AB7' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>Invoice ID</TableCell>
                <TableCell sx={{ color: '#fff' }}>Order ID</TableCell>
                <TableCell sx={{ color: '#fff' }}>Total</TableCell>
                <TableCell sx={{ color: '#fff' }}>GST</TableCell>
                <TableCell sx={{ color: '#fff' }}>Total w/ GST</TableCell>
                <TableCell sx={{ color: '#fff' }}>Created At</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff' }}>PDF</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.invoice_id}>
                  <TableCell>{inv.invoice_id}</TableCell>
                  <TableCell>{inv.order_id}</TableCell>
                  <TableCell>₹ {inv.total_price.toFixed(2)}</TableCell>
                  <TableCell>₹ {inv.gst.toFixed(2)}</TableCell>
                  <TableCell>₹ {inv.total_with_gst.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(inv.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{inv.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      href={`http://https://eatster-nine.vercel.app/api/invoice/${inv.order_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}