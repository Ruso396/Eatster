const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Restaurant = require('../model/restaurantModel');
const Order = require('../model/orderModel');

// SuperAdmin Login
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if super admin credentials are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // For demo purposes, accept specific super admin credentials
    if (email === 'superadmin@eatster.com' && password === 'superadmin123') {
      const superAdminData = {
        id: 1,
        name: 'Super Admin',
        email: email,
        role: 'super_admin',
        permissions: ['all']
      };

      const token = jwt.sign(
        { 
          id: superAdminData.id, 
          email: superAdminData.email, 
          role: 'super_admin' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Super Admin login successful',
        data: {
          token,
          user: superAdminData
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('SuperAdmin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users (customers)
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // Get total restaurants
    const totalRestaurants = await Restaurant.countDocuments();
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get pending restaurants
    const pendingRestaurants = await Restaurant.countDocuments({ status: 'pending' });
    
    // Get pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Get active users (users who have placed orders in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await User.countDocuments({
      role: 'customer',
      lastOrderDate: { $gte: thirtyDaysAgo }
    });
    
    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Calculate monthly revenue
    const monthlyRevenueData = await Order.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlyRevenue = monthlyRevenueData.length > 0 ? monthlyRevenueData[0].total : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue,
        pendingRestaurants,
        pendingOrders,
        activeUsers,
        monthlyRevenue
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Users (Customers)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = { role: 'customer' };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status !== 'all') {
      query.status = status;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Restaurant Owners
const getAllRestaurantOwners = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = { role: 'restaurant_owner' };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status !== 'all') {
      query.status = status;
    }
    
    const restaurantOwners = await User.find(query)
      .select('-password')
      .populate('restaurantId', 'name address fssaiNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      data: {
        restaurantOwners,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });

  } catch (error) {
    console.error('Get restaurant owners error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update User Status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!['active', 'blocked', 'approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Recent Orders
const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get recent orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Top Restaurants
const getTopRestaurants = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const restaurants = await Restaurant.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' },
          totalRevenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    cond: { $eq: ['$$this.status', 'completed'] }
                  }
                },
                as: 'order',
                in: '$$order.totalAmount'
              }
            }
          }
        }
      },
      {
        $sort: { totalOrders: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          name: 1,
          totalOrders: 1,
          totalRevenue: 1,
          rating: 1
        }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      data: restaurants
    });

  } catch (error) {
    console.error('Get top restaurants error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
// ✅ Get All Orders (For Super Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name phone email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('SuperAdmin getAllOrders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  superAdminLogin,
  getDashboardStats,
  getAllUsers,
  getAllRestaurantOwners,
  updateUserStatus,
  deleteUser,
  getRecentOrders,
  getTopRestaurants,
  getAllOrders // 👈 add here
};
