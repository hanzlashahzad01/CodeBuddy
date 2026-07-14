const User = require('../models/User');
const Order = require('../models/Order');
const Course = require('../models/Course');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalOrders, revenueResult, latestUsers, latestOrders] =
      await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email avatar role createdAt'),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'name email')
          .populate('course', 'title')
      ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Aggregate monthly revenue and registrations for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [monthlyRevenueRaw, monthlyUsersRaw] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$amount' }
          }
        }
      ]),
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const graphData = [];
    const hasRealOrders = await Order.exists({ paymentStatus: 'paid' });
    const hasRealUsers = (await User.countDocuments()) > 1; // More than admin

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthLabel = months[monthIndex];

      const revMatch = monthlyRevenueRaw.find(r => r._id.year === year && r._id.month === (monthIndex + 1));
      const userMatch = monthlyUsersRaw.find(u => u._id.year === year && u._id.month === (monthIndex + 1));

      let revenueVal = revMatch ? revMatch.revenue : 0;
      let registrationsVal = userMatch ? userMatch.count : 0;

      // Inject visual mock progression if the database is brand new and empty, 
      // but live-update current month if orders/users are added.
      if (!hasRealOrders) {
        const mockRevenues = [150, 280, 220, 480, 390, 600];
        revenueVal = mockRevenues[5 - i] + (i === 0 ? revenueVal : 0);
      }
      if (!hasRealUsers) {
        const mockRegs = [5, 12, 8, 18, 14, 25];
        registrationsVal = mockRegs[5 - i] + (i === 0 ? registrationsVal : 0);
      }

      graphData.push({
        month: monthLabel,
        year: year,
        revenue: revenueVal,
        registrations: registrationsVal
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalOrders,
        revenue,
        latestUsers,
        latestOrders,
        graphData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit: limitParam, role } = req.query;

    const query = {};
    if (role) query.role = role;

    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be student or admin' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Suspend / unsuspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
exports.suspendUser = async (req, res) => {
  try {
    // Prevent admin from suspending themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot suspend your own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user,
      message: `User has been ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
