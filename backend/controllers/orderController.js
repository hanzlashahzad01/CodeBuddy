const Order = require('../models/Order');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create new order (student only)
// @route   POST /api/orders
// @access  Private/Student
exports.createOrder = async (req, res) => {
  try {
    const { courseId, paymentMethod, transactionId, couponApplied } = req.body;

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if already purchased
    const alreadyPurchased = req.user.purchasedCourses.some(
      (id) => id.toString() === courseId
    );
    if (alreadyPurchased) {
      return res.status(400).json({ success: false, error: 'You have already purchased this course' });
    }

    // Calculate amount (apply discount if present)
    const discountedPrice = course.price - (course.price * (course.discount / 100));
    const amount = Math.max(0, discountedPrice);

    const order = await Order.create({
      user: req.user.id,
      course: courseId,
      amount,
      paymentMethod: paymentMethod || 'free',
      transactionId,
      couponApplied,
      paymentStatus: amount === 0 ? 'paid' : 'pending'
    });

    // If free or instantly paid, add to purchasedCourses
    if (order.paymentStatus === 'paid') {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { purchasedCourses: courseId }
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get logged-in student's orders
// @route   GET /api/orders/my
// @access  Private/Student
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('course', 'title image price');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page, limit: limitParam } = req.query;

    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email avatar')
      .populate('course', 'title image price');

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // If status changed to paid, add course to user's purchasedCourses
    if (paymentStatus === 'paid') {
      await User.findByIdAndUpdate(order.user, {
        $addToSet: { purchasedCourses: order.course }
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
