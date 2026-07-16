const mongoose = require('mongoose');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Announcement = require('../models/Announcement');
const LiveClass = require('../models/LiveClass');
const FAQ = require('../models/FAQ');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codebuddy')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Seed Data
const seedData = async () => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Blog.deleteMany({});
    await Announcement.deleteMany({});
    await LiveClass.deleteMany({});
    await FAQ.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Create Premium Courses
    const premiumCourses = [
      {
        title: 'Complete MERN Stack Development',
        description: 'Master MongoDB, Express, React, and Node.js from scratch. Build real-world projects including e-commerce, social media, and more.',
        instructor: admin._id,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
        price: 4999,
        discount: 20,
        level: 'Intermediate',
        category: 'Web Development',
        language: 'Urdu/Hindi',
        isPremium: true,
        totalLectures: 85,
        duration: '45 hours',
        averageRating: 4.8
      },
      {
        title: 'Advanced React & Redux Masterclass',
        description: 'Deep dive into React hooks, Redux Toolkit, context API, and advanced patterns. Build scalable applications with best practices.',
        instructor: admin._id,
        image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=500&fit=crop',
        price: 3999,
        discount: 15,
        level: 'Advanced',
        category: 'Web Development',
        language: 'Urdu/Hindi',
        isPremium: true,
        totalLectures: 60,
        duration: '35 hours',
        averageRating: 4.9
      },
      {
        title: 'Python for Data Science & Machine Learning',
        description: 'Learn Python programming, data analysis with Pandas, visualization with Matplotlib, and machine learning with Scikit-learn.',
        instructor: admin._id,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
        price: 5999,
        discount: 25,
        level: 'Beginner',
        category: 'Data Science',
        language: 'Urdu/Hindi',
        isPremium: true,
        totalLectures: 100,
        duration: '50 hours',
        averageRating: 4.7
      },
      {
        title: 'Flutter Mobile App Development',
        description: 'Build beautiful iOS and Android apps with Flutter and Dart. Learn widgets, state management, Firebase integration, and more.',
        instructor: admin._id,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
        price: 4499,
        discount: 10,
        level: 'Intermediate',
        category: 'Mobile Development',
        language: 'Urdu/Hindi',
        isPremium: true,
        totalLectures: 70,
        duration: '40 hours',
        averageRating: 4.6
      },
      {
        title: 'Cybersecurity & Ethical Hacking',
        description: 'Learn network security, penetration testing, ethical hacking tools, and security best practices. Become a certified ethical hacker.',
        instructor: admin._id,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
        price: 6999,
        discount: 30,
        level: 'Advanced',
        category: 'Cybersecurity',
        language: 'Urdu/Hindi',
        isPremium: true,
        totalLectures: 90,
        duration: '55 hours',
        averageRating: 4.8
      }
    ];

    const createdCourses = await Course.insertMany(premiumCourses);
    console.log(`✅ Created ${createdCourses.length} premium courses`);

    // Create Tech Blogs
    const techBlogs = [
      {
        title: '10 React Hooks You Should Know in 2024',
        slug: '10-react-hooks-2024',
        content: `React hooks have revolutionized how we write React components. In this article, we'll explore 10 essential hooks that every React developer should know.

1. useState - The most basic hook for managing state in functional components.
2. useEffect - Handle side effects in your components.
3. useContext - Access context values without nesting.
4. useReducer - Manage complex state logic.
5. useCallback - Memoize functions to prevent unnecessary re-renders.
6. useMemo - Memoize expensive calculations.
7. useRef - Access DOM elements and persist values.
8. useLayoutEffect - Similar to useEffect but fires synchronously.
9. useImperativeHandle - Customize instance value exposed to parent.
10. useDebugValue - Display custom labels for custom hooks in React DevTools.`,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
        author: admin._id,
        tags: ['React', 'JavaScript', 'Frontend'],
        category: 'Web Development',
        isPublished: true,
        views: 0
      },
      {
        title: 'Getting Started with Machine Learning in Python',
        slug: 'machine-learning-python',
        content: `Machine learning is transforming industries worldwide. Python is the most popular language for ML due to its simplicity and powerful libraries.

Prerequisites: Basic Python knowledge, Understanding of mathematics (linear algebra, statistics)

Essential Libraries:
1. NumPy - Numerical computing
2. Pandas - Data manipulation
3. Matplotlib - Data visualization
4. Scikit-learn - Machine learning algorithms

Your First ML Model:
Let's build a simple linear regression model to predict house prices using sklearn.

Next Steps:
- Deep learning with TensorFlow/Keras
- Natural language processing
- Computer vision`,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
        author: admin._id,
        tags: ['Python', 'Machine Learning', 'Data Science'],
        category: 'Data Science',
        isPublished: true,
        views: 0
      },
      {
        title: 'Building REST APIs with Node.js and Express',
        slug: 'rest-api-nodejs-express',
        content: `REST APIs are the backbone of modern web applications. Node.js with Express makes it easy to build scalable APIs.

What is a REST API?
REST (Representational State Transfer) is an architectural style for designing networked applications.

Setting Up Express:
Run npm init -y and npm install express to get started.

Basic Server:
Create a simple Express server with app.get and app.listen methods.

Best Practices:
1. Use proper HTTP methods (GET, POST, PUT, DELETE)
2. Implement authentication and authorization
3. Validate input data
4. Handle errors gracefully
5. Use middleware for common functionality

Database Integration:
Connect to MongoDB using Mongoose for data persistence.

Deployment:
Deploy your API to platforms like Heroku, Vercel, AWS, or DigitalOcean.`,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop',
        author: admin._id,
        tags: ['Node.js', 'Express', 'Backend'],
        category: 'Backend Development',
        isPublished: true,
        views: 0
      }
    ];

    const createdBlogs = await Blog.insertMany(techBlogs);
    console.log(`✅ Created ${createdBlogs.length} tech blogs`);

    // Create Webinars (Live Classes)
    const webinars = [
      {
        title: 'Live Q&A: React Best Practices',
        description: 'Join us for an interactive session where we discuss React best practices, common pitfalls, and answer your questions live.',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        joinUrl: 'https://meet.google.com/abc-defg-hij',
        instructor: admin._id
      },
      {
        title: 'Career in Tech: From Beginner to Professional',
        description: 'Learn how to start your tech career, build a portfolio, and land your first job. Industry experts will share their journey.',
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        joinUrl: 'https://meet.google.com/xyz-uvw-rst',
        instructor: admin._id
      }
    ];

    const createdWebinars = await LiveClass.insertMany(webinars);
    console.log(`✅ Created ${createdWebinars.length} webinars`);

    // Create Announcements
    const announcements = [
      {
        title: '🎉 New Course Launch: Complete MERN Stack',
        content: 'We are excited to announce the launch of our comprehensive MERN Stack course! Learn MongoDB, Express, React, and Node.js from industry experts. Special launch discount of 20% available for limited time.',
        tag: 'New Course',
        instructor: admin._id
      },
      {
        title: '📢 Free Webinar: React Best Practices',
        content: 'Join our free live webinar on React Best Practices happening this Sunday at 7 PM PST. Learn tips and tricks from senior developers. Register now to secure your spot!',
        tag: 'Update',
        instructor: admin._id
      }
    ];

    const createdAnnouncements = await Announcement.insertMany(announcements);
    console.log(`✅ Created ${createdAnnouncements.length} announcements`);

    // Create FAQs
    const faqs = [
      {
        question: 'What is CodeBuddy?',
        answer: 'CodeBuddy is Pakistan\'s #1 coding education platform offering free tutorials, premium courses, and live webinars in Urdu/Hindi. We help students and professionals learn web development, mobile development, data science, and more.',
        category: 'General',
        order: 1,
        isPublished: true
      },
      {
        question: 'Are the courses really free?',
        answer: 'Yes! We offer hundreds of free video tutorials on YouTube and our platform. Additionally, we have premium courses with advanced content, projects, and certification for those who want to take their skills to the next level.',
        category: 'Courses',
        order: 2,
        isPublished: true
      },
      {
        question: 'How do I purchase a premium course?',
        answer: 'Simply browse our courses page, select the course you want, and click "Buy Now". You can pay securely via JazzCash, EasyPaisa, bank transfer, or credit card. After payment, you\'ll get instant access to all course content.',
        category: 'Payment',
        order: 3,
        isPublished: true
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept multiple payment methods including JazzCash, EasyPaisa, bank transfers, and major credit/debit cards. All transactions are secure and encrypted.',
        category: 'Payment',
        order: 4,
        isPublished: true
      },
      {
        question: 'Do I get a certificate after completing a course?',
        answer: 'Yes! Upon completing a premium course, you\'ll receive a verified certificate that you can share on LinkedIn and include in your CV. Our certificates are recognized by top tech companies in Pakistan.',
        category: 'Courses',
        order: 5,
        isPublished: true
      },
      {
        question: 'Can I access courses on mobile?',
        answer: 'Absolutely! Our platform is fully responsive and works on all devices - desktop, tablet, and mobile. You can learn anytime, anywhere with our mobile-friendly interface.',
        category: 'Technical',
        order: 6,
        isPublished: true
      },
      {
        question: 'How long do I have access to a purchased course?',
        answer: 'Once you purchase a premium course, you get lifetime access. You can watch the videos as many times as you want, download resources, and access any future updates to the course content.',
        category: 'Courses',
        order: 7,
        isPublished: true
      },
      {
        question: 'What if I\'m not satisfied with a course?',
        answer: 'We offer a 7-day money-back guarantee on all premium courses. If you\'re not satisfied with the content, simply contact our support team within 7 days of purchase for a full refund.',
        category: 'Payment',
        order: 8,
        isPublished: true
      },
      {
        question: 'Do you offer corporate training?',
        answer: 'Yes! We offer customized corporate training programs for companies. Contact us at hanzlashahzadhanzlashahzad@gmail.com to discuss your training needs and get a custom quote.',
        category: 'General',
        order: 9,
        isPublished: true
      },
      {
        question: 'How can I contact support?',
        answer: 'You can reach our support team through the Contact Us form on our website, or email us directly at hanzlashahzadhanzlashahzad@gmail.com. We typically respond within 24 hours.',
        category: 'Technical',
        order: 10,
        isPublished: true
      },
      {
        question: 'Are the courses suitable for beginners?',
        answer: 'Yes! We have courses for all skill levels - from complete beginners to advanced developers. Each course clearly indicates the required skill level, so you can choose the right one for you.',
        category: 'Courses',
        order: 11,
        isPublished: true
      },
      {
        question: 'Can I download the videos for offline viewing?',
        answer: 'Currently, videos are available for online streaming only. However, you can access them anytime with an internet connection. We\'re working on adding offline download functionality soon.',
        category: 'Technical',
        order: 12,
        isPublished: true
      }
    ];

    const createdFaqs = await FAQ.insertMany(faqs);
    console.log(`✅ Created ${createdFaqs.length} FAQs`);

    console.log('\n✅ Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
