/**
 * seedNotes.js
 * Seeds the notes collection in the database.
 * Run: node seedNotes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Note = require('./models/Note');

const notesData = [
  {
    title: "HTML5 Learning Notes & Cheatsheet",
    description: "Complete HTML5 hand-written code snippets and tutorial references to master web layout structure.",
    fileUrl: "/uploads/html_notes.zip",
    thumbnailUrl: "/html_notes_thumbnail.png",
    format: "ZIP",
    size: "95 KB"
  },
  {
    title: "CSS3 & Flexbox CSS Grid Guide",
    description: "Sleek, comprehensive reference guide for modern CSS layouts, Flexbox alignments, and CSS Grid grids.",
    fileUrl: "/uploads/css_notes.zip",
    thumbnailUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    format: "ZIP",
    size: "40 KB"
  },
  {
    title: "JavaScript ES6+ Cheatsheet",
    description: "Master JS syntax, variables, modern ES6 array functions, async-await, and DOM manipulation.",
    fileUrl: "/uploads/javascript_notes.zip",
    thumbnailUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    format: "ZIP",
    size: "55 KB"
  },
  {
    title: "PHP Back-End Fundamentals",
    description: "Comprehensive reference codes for PHP variables, database connections, loops, and server configurations.",
    fileUrl: "/uploads/php_notes.zip",
    thumbnailUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    format: "ZIP",
    size: "25 KB"
  },
  {
    title: "SQL Database Queries Guide",
    description: "Master SQL commands, SELECT queries, JOIN operations, table relations, and database indexing.",
    fileUrl: "/uploads/mysql_notes.zip",
    thumbnailUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    format: "ZIP",
    size: "15 KB"
  }
];

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codebuddy';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Find admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Seeding a default admin user first...');
      admin = await User.create({
        name: 'CodeBuddy Admin',
        email: 'admin@codebuddy.com',
        password: 'Admin@1234',
        role: 'admin'
      });
    }

    // Clear old notes
    const deleted = await Note.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} existing notes.`);

    // Insert new notes
    const notesToSave = notesData.map(note => ({
      ...note,
      instructor: admin._id
    }));

    const savedNotes = await Note.insertMany(notesToSave);
    console.log(`💾 Seeded ${savedNotes.length} notes successfully.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding notes:', err);
    process.exit(1);
  }
}

run();
