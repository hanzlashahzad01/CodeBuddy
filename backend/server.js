const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
const path = require('path');
const auth         = require('./routes/authRoutes');
const courseRoutes   = require('./routes/courseRoutes');
const videoRoutes    = require('./routes/videoRoutes');
const blogRoutes     = require('./routes/blogRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const messageRoutes  = require('./routes/messageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const faqRoutes      = require('./routes/faqRoutes');
const couponRoutes   = require('./routes/couponRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const searchRoutes   = require('./routes/searchRoutes');
const noteRoutes     = require('./routes/noteRoutes');
const uploadRoutes   = require('./routes/uploadRoutes');

// Mount routers
app.use('/api/auth',      auth);
app.use('/api/courses',   courseRoutes);
app.use('/api/videos',    videoRoutes);
app.use('/api/blogs',     blogRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/messages',  messageRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/faqs',      faqRoutes);
app.use('/api/coupons',   couponRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/search',    searchRoutes);
app.use('/api/notes',     noteRoutes);
app.use('/api/upload',    uploadRoutes);

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Basic route
app.get('/', (req, res) => {
  res.send('CodeBuddy API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Try connecting to DB, catch error but don't crash if local DB isn't setup
  try {
    await connectDB();
  } catch (err) {
    console.log('MongoDB connection failed. Please ensure MongoDB is running locally or provide a valid connection string.');
  }
});
