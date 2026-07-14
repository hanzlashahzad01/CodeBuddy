/**
 * generateMarkdownPlaylists.js
 * Reads playlists and videos from MongoDB and creates a beautifully formatted README.md
 * inside each corresponding folder in the "Playlists" directory.
 * Run: node generateMarkdownPlaylists.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Playlist = require('./models/Playlist');
const Video = require('./models/Video');

const playlistsDir = path.join(__dirname, '../Playlists');

const folderMapping = [
  { keyword: 'HTML', folder: 'HTML Playlist' },
  { keyword: 'Grid', folder: 'CSS Grid Playlist' },
  { keyword: 'Flexbox', folder: 'CSS Flexbox Playlist' },
  { keyword: 'JavaScript', folder: 'JavaScript Playlist' },
  { keyword: 'Roadmap', folder: 'Mastering Modern Web & App Dev Projects' },
  { keyword: 'CSS', folder: 'CSS Playlist' } // CSS is fallback for other CSS folders, so keep it lower or check carefully
];

function getFolderForPlaylist(title) {
  if (title.includes('HTML')) return 'HTML Playlist';
  if (title.includes('Grid')) return 'CSS Grid Playlist';
  if (title.includes('Flexbox')) return 'CSS Flexbox Playlist';
  if (title.includes('JavaScript')) return 'JavaScript Playlist';
  if (title.includes('Roadmap') || title.includes('Web & App Dev')) return 'Mastering Modern Web & App Dev Projects';
  if (title.includes('CSS')) return 'CSS Playlist';
  return null;
}

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codebuddy';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    const playlists = await Playlist.find({});
    
    for (const playlist of playlists) {
      // Find videos for this playlist
      const videos = await Video.find({ playlist: playlist._id }).sort({ order: 1 });
      
      const folderName = getFolderForPlaylist(playlist.title);
      if (!folderName) {
        console.log(`⚠️ No matching folder found for playlist: "${playlist.title}"`);
        continue;
      }

      const targetFolder = path.join(playlistsDir, folderName);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const readmePath = path.join(targetFolder, 'README.md');
      
      // Build markdown content
      let mdContent = `# 📺 ${playlist.title}\n\n`;
      mdContent += `> **Category:** ${playlist.category} | **Total Videos:** ${videos.length}\n\n`;
      mdContent += `## 📝 Description\n${playlist.description}\n\n`;
      
      if (playlist.thumbnail && playlist.thumbnail !== 'no-thumbnail.jpg') {
        mdContent += `![Playlist Thumbnail](${playlist.thumbnail})\n\n`;
      }
      
      mdContent += `## 📚 Video Lectures List\n\n`;
      mdContent += `| # | Thumbnail | Lecture Title | Duration | Watch Link |\n`;
      mdContent += `|---|-----------|---------------|----------|------------|\n`;
      
      for (const video of videos) {
        // Render a small markdown thumbnail
        const thumbImg = video.thumbnailUrl ? `<img src="${video.thumbnailUrl}" width="120" alt="${video.title}"/>` : 'No Thumbnail';
        // Watch link
        const watchLink = `[Watch on YouTube](${video.videoUrl})`;
        
        mdContent += `| ${video.order} | ${thumbImg} | **${video.title}** | ⏱️ ${video.duration} | 🔗 ${watchLink} |\n`;
      }
      
      mdContent += `\n\n---\n*Generated automatically by CodeBuddy Playlist Manager.*`;
      
      fs.writeFileSync(readmePath, mdContent);
      console.log(`📝 Generated: ${readmePath} (${videos.length} videos)`);
    }

    console.log('\n🎉 All README.md files created in Playlists folder!');
    process.exit(0);
  } catch (err) {
    console.error('Error generating markdown files:', err);
    process.exit(1);
  }
}

run();
