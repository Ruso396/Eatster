import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaStore,
  FaCheck,
  FaTimes,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUserCheck,
  FaUserTimes,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import './CustomersPage.css';

const CustomersPage = ({ themeColor, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('customers');
  const [users, setUsers] = useState([]);
  const [restaurantOwners, setRestaurantOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // API Call for Users (Customers and potentially others)
      const customerRes = await axios.get('https://eatster-pro.onrender.com/api/users');
      // Filter for users who have a customer_id, mapping username to name for consistency
      const apiCustomers = customerRes.data
        .filter(user => user.customer_id)
        .map(user => ({
          id: user.id,
          name: user.username, // Map 'username' from API to 'name' for display
          email: user.email,
          customer_id: user.customer_id, // Keep customer_id for detail view if needed
          phone: user.phone || 'N/A', // Assuming phone exists, default to 'N/A'
          address: user.address || 'N/A', // Assuming address exists, default to 'N/A'
          status: user.status || 'active', // Assuming status exists, default to 'active'
          joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A', // Use created_at or similar for joinDate
          totalOrders: user.totalOrders || 0, // Assuming totalOrders exists
          totalSpent: user.totalSpent || 0, // Assuming totalSpent exists
        }));

      // Real API Call for Restaurant Owners
      const restaurantRes = await axios.get('https://eatster-pro.onrender.com/api/restaurants');
      const apiRestaurantOwners = restaurantRes.data;

      setUsers(apiCustomers);
      setRestaurantOwners(apiRestaurantOwners);
    } catch (error) {
      console.error('Error loading users:', error);
      Swal.fire('Error', 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus, userType) => {
    try {
      const action = newStatus === 'active' || newStatus === 'approved' ? 'approve' : 'block';
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `Do you want to ${action} this ${userType}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: newStatus === 'active' || newStatus === 'approved' ? '#28a745' : '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: `Yes, ${action}!`
      });

      if (result.isConfirmed) {
        // In a real application, you would make an API call to update the status in the backend
        // Example for customer: await axios.put(`/api/users/${userId}/status`, { status: newStatus });
        // Example for restaurant: await axios.put(`/api/restaurants/${userId}/status`, { status: newStatus });

        if (userType === 'customer') {
          setUsers(prev => prev.map(user => user.id === userId ? { ...user, status: newStatus } : user));
        } else {
          setRestaurantOwners(prev => prev.map(owner => owner.id === userId ? { ...owner, status: newStatus } : owner));
        }

        Swal.fire('Updated!', `User has been ${action}d successfully.`, 'success');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      Swal.fire('Error', 'Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        // In a real application, you would make an API call to delete the user in the backend
        // Example for customer: await axios.delete(`/api/users/${userId}`);
        // Example for restaurant: await axios.delete(`/api/restaurants/${userId}`);

        if (userType === 'customer') {
          setUsers(prev => prev.filter(user => user.id !== userId));
        } else {
          setRestaurantOwners(prev => prev.filter(owner => owner.id !== userId));
        }

        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error', 'Failed to delete user', 'error');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredRestaurantOwners = restaurantOwners.filter(owner => {
    const matchesSearch =
      owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || owner.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: '#28a745', text: 'Active' },
      approved: { color: '#28a745', text: 'Approved' },
      pending: { color: '#ffc107', text: 'Pending' },
      blocked: { color: '#dc3545', text: 'Blocked' },
      rejected: { color: '#dc3545', text: 'Rejected' }
    };

    const config = statusConfig[status] || { color: '#6c757d', text: status };
    return <span className="status-badge" style={{ backgroundColor: config.color }}>{config.text}</span>;
  };

  const UserCard = ({ user, userType }) => (
    <div className={`user-card ${isDarkMode ? 'dark' : ''}`}>
      <div className="user-header">
        <div className="user-info">
          <h4>{user.name}</h4> {/* Uses mapped 'name' (from 'username') */}
          <p className="user-email">{user.email}</p>
          {userType === 'restaurant' && <p className="restaurant-name">{user.restaurantName}</p>}
        </div>
        <div className="user-status">{getStatusBadge(user.status)}</div>
      </div>

      <div className="user-details">
        <div className="detail-item"><FaPhone /><span>{user.phone}</span></div>
        <div className="detail-item"><FaMapMarkerAlt /><span>{user.address}</span></div>
        <div className="detail-item"><span>Joined: {user.joinDate}</span></div>
        <div className="detail-item">
          <span>Orders: {user.totalOrders || 0} | {userType === 'customer' ? `Spent: ₹${user.totalSpent || 0}` : `Revenue: ₹${user.totalRevenue || 0}`}</span>
        </div>
      </div>

      <div className="user-actions">
        <button className="action-btn view-btn" onClick={() => handleViewUser(user)}><FaEye /></button>

        {userType === 'customer' ? (
          user.status === 'active' ? (
            <button className="action-btn block-btn" onClick={() => handleStatusChange(user.id, 'blocked', 'customer')}><FaUserTimes /></button>
          ) : (
            <button className="action-btn approve-btn" onClick={() => handleStatusChange(user.id, 'active', 'customer')}><FaUserCheck /></button>
          )
        ) : (
          user.status === 'pending' && (
            <>
              <button className="action-btn approve-btn" onClick={() => handleStatusChange(user.id, 'approved', 'restaurant')}><FaCheck /></button>
              <button className="action-btn reject-btn" onClick={() => handleStatusChange(user.id, 'rejected', 'restaurant')}><FaTimes /></button>
            </>
          )
        )}

        <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user.id, userType)}><FaTrash /></button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`customers-loading ${isDarkMode ? 'dark' : ''}`}>
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={`customers-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage customers and restaurant owners</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
          <FaUsers /> Customers ({users.length})
        </button>
        <button className={`tab ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
          <FaStore /> Restaurant Owners ({restaurantOwners.length})
        </button>
      </div>

      <div className="controls">
        <div className="search-box"><FaSearch />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="filter-box"><FaFilter />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button className="export-btn"><FaDownload /> Export</button>
      </div>

      <div className="users-grid">
        {activeTab === 'customers' ? (
          filteredUsers.length > 0 ? filteredUsers.map(user => <UserCard key={user.id} user={user} userType="customer" />)
            : <div className="no-users"><FaUsers /><p>No customers found</p></div>
        ) : (
          filteredRestaurantOwners.length > 0 ? filteredRestaurantOwners.map(owner => <UserCard key={owner.id} user={owner} userType="restaurant" />)
            : <div className="no-users"><FaStore /><p>No restaurant owners found</p></div>
        )}
      </div>

      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={() => setShowUserModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-item"><strong>Name:</strong> {selectedUser.name}</div> {/* Displays mapped 'name' */}
              <div className="user-detail-item"><strong>Email:</strong> {selectedUser.email}</div>
              <div className="user-detail-item"><strong>Customer ID:</strong> {selectedUser.customer_id}</div> {/* New: Display customer_id */}
              <div className="user-detail-item"><strong>Phone:</strong> {selectedUser.phone}</div>
              <div className="user-detail-item"><strong>Address:</strong> {selectedUser.address}</div>
              <div className="user-detail-item"><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</div>
              <div className="user-detail-item"><strong>Join Date:</strong> {selectedUser.joinDate}</div>
              {selectedUser.restaurantName && <div className="user-detail-item"><strong>Restaurant:</strong> {selectedUser.restaurantName}</div>}
              {selectedUser.fssaiNumber && <div className="user-detail-item"><strong>FSSAI Number:</strong> {selectedUser.fssaiNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;