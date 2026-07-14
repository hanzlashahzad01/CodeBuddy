/**
 * seedPlaylists.js
 * Scrapes and seeds the 6 playlists from YouTube into the CodeBuddy MongoDB database.
 * Run: node seedPlaylists.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Playlist = require('./models/Playlist');
const Video = require('./models/Video');

const playlistsConfig = [
  {
    name: "HTML Playlist",
    category: "HTML",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd4lAyzv9ePmDVVh_CyTGs-P"
  },
  {
    name: "CSS Playlist",
    category: "CSS",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd7cPvHp4rDlNZHcY0lclBkV"
  },
  {
    name: "CSS Grid Playlist",
    category: "CSS Grid",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd5n4kAyxDAhrzIdjVlrPAZ3"
  },
  {
    name: "CSS Flexbox Playlist",
    category: "CSS Flexbox",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd6jFm0l62msswF2CuNZeAme"
  },
  {
    name: "JavaScript Playlist",
    category: "JavaScript",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd4KH_gYpvmwJxRcMmqv3rp9"
  },
  {
    name: "Mastering Modern Web & App Dev Projects",
    category: "Projects",
    url: "https://youtube.com/playlist?list=PL6bs4zdklHd4JDKr_AofBAuFZeLlmVxcF"
  }
];

// Helper function to scrape playlist details
async function fetchAndParsePlaylist(url, defaultName) {
  try {
    console.log(`\n🔍 Fetching playlist: ${defaultName} (${url})`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const regex = /ytInitialData\s*=\s*({.+?});/s;
    const match = html.match(regex);
    if (!match) {
      throw new Error('Could not find ytInitialData in page HTML.');
    }

    const data = JSON.parse(match[1]);
    
    // 1. Extract Playlist Details from Sidebar
    let playlistTitle = defaultName;
    let playlistDescription = `Tutorials for ${defaultName}.`;
    let playlistThumbnail = 'no-thumbnail.jpg';

    const info = data.sidebar?.playlistSidebarRenderer?.items?.[0]?.playlistSidebarPrimaryInfoRenderer;
    if (info) {
      playlistTitle = info.title?.runs?.[0]?.text || playlistTitle;
      playlistDescription = info.description?.simpleText || info.description?.runs?.[0]?.text || playlistDescription;
      
      const thumbArray = info.thumbnailRenderer?.playlistVideoThumbnailRenderer?.thumbnail?.thumbnails;
      if (thumbArray && thumbArray.length > 0) {
        playlistThumbnail = thumbArray[thumbArray.length - 1].url;
      }
    }

    // 2. Extract Videos list
    const items = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    const videos = [];

    for (const item of items) {
      if (item.lockupViewModel) {
        const model = item.lockupViewModel;
        const videoId = model.contentId;
        if (!videoId) continue;

        const title = model.metadata?.lockupMetadataViewModel?.title?.content || 'No Title';
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        // Extract duration from overlays
        let duration = '0:00';
        const overlays = model.contentImage?.thumbnailViewModel?.overlays || [];
        for (const overlay of overlays) {
          if (overlay.thumbnailBottomOverlayViewModel?.badges) {
            const badge = overlay.thumbnailBottomOverlayViewModel.badges[0]?.thumbnailBadgeViewModel;
            if (badge && badge.text) {
              duration = badge.text;
              break;
            }
          }
        }

        videos.push({
          title,
          description: `Lecture video for ${playlistTitle}.`,
          videoUrl,
          thumbnailUrl,
          duration
        });
      }
    }

    console.log(`✅ Scraped "${playlistTitle}" successfully.`);
    console.log(`   Description length: ${playlistDescription.length} chars`);
    console.log(`   Found ${videos.length} videos.`);

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      videos
    };
  } catch (error) {
    console.error(`❌ Failed to scrape playlist ${defaultName}:`, error.message);
    return null;
  }
}

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codebuddy';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // 1. Ensure instructor (Admin) exists
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found. Creating a default admin user...');
      admin = await User.create({
        name: 'CodeBuddy Admin',
        email: 'admin@codebuddy.com',
        password: 'Admin@1234',
        role: 'admin'
      });
      console.log(`✅ Default admin created (ID: ${admin._id})`);
    } else {
      console.log(`✅ Found existing admin user: ${admin.email} (ID: ${admin._id})`);
    }

    // 2. Clear old Playlists and Videos (only those that are linked to these categories/playlists)
    // To be safe, we will clear playlists matching these titles or categories
    const categories = playlistsConfig.map(p => p.category);
    
    // Find matching playlists first
    const existingPlaylists = await Playlist.find({ category: { $in: categories } });
    const playlistIds = existingPlaylists.map(p => p._id);

    // Delete videos that belong to these playlists
    const deletedVideos = await Video.deleteMany({ playlist: { $in: playlistIds } });
    console.log(`🗑️  Deleted ${deletedVideos.deletedCount} existing videos.`);

    // Delete the playlists
    const deletedPlaylists = await Playlist.deleteMany({ _id: { $in: playlistIds } });
    console.log(`🗑️  Deleted ${deletedPlaylists.deletedCount} existing playlists.`);

    // 3. Scrape and save playlists
    for (const config of playlistsConfig) {
      const scraped = await fetchAndParsePlaylist(config.url, config.name);
      if (!scraped) continue;

      // Create playlist
      const playlist = await Playlist.create({
        title: scraped.title,
        description: scraped.description,
        thumbnail: scraped.thumbnail,
        instructor: admin._id,
        category: config.category,
        tags: [config.category.toLowerCase(), 'tutorial', 'codebuddy']
      });

      console.log(`💾 Saved Playlist "${playlist.title}" to DB with ID: ${playlist._id}`);

      // Insert all videos
      const videoDocs = scraped.videos.map((v, index) => ({
        title: v.title,
        description: v.description,
        playlist: playlist._id,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        duration: v.duration,
        order: index + 1
      }));

      if (videoDocs.length > 0) {
        const savedVideos = await Video.insertMany(videoDocs);
        console.log(`💾 Saved ${savedVideos.length} videos to DB.`);
      } else {
        console.log('⚠️ No videos found/saved for this playlist.');
      }
    }

    console.log('\n🎉 Playlist Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection or Execution error:', err);
    process.exit(1);
  }
}

run();
