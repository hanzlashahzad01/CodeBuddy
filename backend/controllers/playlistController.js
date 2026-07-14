const Playlist = require('../models/Playlist');
const Video = require('../models/Video');

// ─────────────────────────────────────────────────────────────────
// Helper: scrape all videos from a YouTube playlist URL
// ─────────────────────────────────────────────────────────────────
const YOUTUBE_PLAYLIST_URLS = {
  'HTML'       : 'https://youtube.com/playlist?list=PL6bs4zdklHd4lAyzv9ePmDVVh_CyTGs-P',
  'CSS'        : 'https://youtube.com/playlist?list=PL6bs4zdklHd7cPvHp4rDlNZHcY0lclBkV',
  'CSS Grid'   : 'https://youtube.com/playlist?list=PL6bs4zdklHd5n4kAyxDAhrzIdjVlrPAZ3',
  'CSS Flexbox': 'https://youtube.com/playlist?list=PL6bs4zdklHd6jFm0l62msswF2CuNZeAme',
  'JavaScript' : 'https://youtube.com/playlist?list=PL6bs4zdklHd4KH_gYpvmwJxRcMmqv3rp9',
  'Projects'   : 'https://youtube.com/playlist?list=PL6bs4zdklHd4JDKr_AofBAuFZeLlmVxcF',
};

async function scrapeYouTubePlaylist(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent'      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language' : 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`);

  const html  = await response.text();
  const match = html.match(/ytInitialData\s*=\s*({.+?});/s);
  if (!match) throw new Error('ytInitialData not found');

  const data = JSON.parse(match[1]);

  // ── Playlist meta ──────────────────────────────────────────────
  const info        = data.sidebar?.playlistSidebarRenderer?.items?.[0]?.playlistSidebarPrimaryInfoRenderer;
  const title       = info?.title?.runs?.[0]?.text ?? null;
  const description = info?.description?.simpleText ?? info?.description?.runs?.[0]?.text ?? null;
  const thumbArr    = info?.thumbnailRenderer?.playlistVideoThumbnailRenderer?.thumbnail?.thumbnails ?? [];
  const thumbnail   = thumbArr.length ? thumbArr[thumbArr.length - 1].url : null;

  // ── Video list ─────────────────────────────────────────────────
  const rawItems = data.contents?.twoColumnBrowseResultsRenderer
    ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
    ?.contents?.[0]?.itemSectionRenderer?.contents ?? [];

  const videos = [];
  for (const item of rawItems) {
    const model   = item.lockupViewModel;
    if (!model) continue;
    const videoId = model.contentId;
    if (!videoId) continue;

    const videoTitle = model.metadata?.lockupMetadataViewModel?.title?.content ?? 'Untitled';
    const overlays   = model.contentImage?.thumbnailViewModel?.overlays ?? [];
    let duration     = '0:00';
    for (const o of overlays) {
      const badge = o.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel;
      if (badge?.text) { duration = badge.text; break; }
    }

    videos.push({
      title       : videoTitle,
      videoId,
      videoUrl    : `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      duration,
    });
  }

  return { title, description, thumbnail, videos };
}

// ─────────────────────────────────────────────────────────────────
// @desc  Get all playlists with optional category filter
// @route GET /api/playlists
// @access Public
// ─────────────────────────────────────────────────────────────────
exports.getPlaylists = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const playlists = await Playlist.find(query)
      .sort({ createdAt: -1 })
      .populate('instructor', 'name avatar');

    // Attach real video count from Video collection
    const withCount = await Promise.all(
      playlists.map(async (pl) => {
        const count = await Video.countDocuments({ playlist: pl._id });
        const obj   = pl.toObject();
        obj.videoCount = count;
        return obj;
      })
    );

    res.status(200).json({ success: true, count: withCount.length, data: withCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc  Get single playlist with its videos populated + real count
// @route GET /api/playlists/:id
// @access Public
// ─────────────────────────────────────────────────────────────────
exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate({ path: 'videos', options: { sort: { order: 1 } } });

    if (!playlist) return res.status(404).json({ success: false, error: 'Playlist not found' });

    const obj = playlist.toObject();
    obj.videoCount = obj.videos ? obj.videos.length : 0;

    res.status(200).json({ success: true, data: obj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc  Create new playlist
// @route POST /api/playlists
// @access Private/Admin
// ─────────────────────────────────────────────────────────────────
exports.createPlaylist = async (req, res) => {
  try {
    if (!req.body.instructor) req.body.instructor = req.user.id;
    const playlist = await Playlist.create(req.body);
    res.status(201).json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc  Update playlist
// @route PUT /api/playlists/:id
// @access Private/Admin
// ─────────────────────────────────────────────────────────────────
exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!playlist) return res.status(404).json({ success: false, error: 'Playlist not found' });
    res.status(200).json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc  Delete playlist
// @route DELETE /api/playlists/:id
// @access Private/Admin
// ─────────────────────────────────────────────────────────────────
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, error: 'Playlist not found' });
    res.status(200).json({ success: true, data: {}, message: 'Playlist deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc  Sync all playlists from YouTube (re-scrape & update DB)
// @route POST /api/playlists/sync
// @access Private/Admin
// ─────────────────────────────────────────────────────────────────
exports.syncPlaylists = async (req, res) => {
  try {
    const results = [];

    // Find all playlists that have a known YouTube category
    const playlists = await Playlist.find({ category: { $in: Object.keys(YOUTUBE_PLAYLIST_URLS) } });

    for (const playlist of playlists) {
      const ytUrl = YOUTUBE_PLAYLIST_URLS[playlist.category];
      if (!ytUrl) continue;

      try {
        const scraped = await scrapeYouTubePlaylist(ytUrl);

        // Update playlist meta
        const updates = {};
        if (scraped.title)       updates.title       = scraped.title;
        if (scraped.description) updates.description = scraped.description;
        if (scraped.thumbnail)   updates.thumbnail   = scraped.thumbnail;
        await Playlist.findByIdAndUpdate(playlist._id, updates);

        // Get existing videos for this playlist
        const existingVideos = await Video.find({ playlist: playlist._id }).sort({ order: 1 });
        const existingIds    = existingVideos.map(v => {
          const m = v.videoUrl.match(/watch\?v=([^&]+)/);
          return m ? m[1] : null;
        }).filter(Boolean);

        const scrapedIds = scraped.videos.map(v => v.videoId);

        // Add new videos that don't exist yet
        let nextOrder = existingVideos.length > 0 ? Math.max(...existingVideos.map(v => v.order)) + 1 : 1;
        const toAdd   = scraped.videos.filter(v => !existingIds.includes(v.videoId));
        for (const v of toAdd) {
          await Video.create({
            title       : v.title,
            description : `Lecture video from ${scraped.title || playlist.title}.`,
            playlist    : playlist._id,
            videoUrl    : v.videoUrl,
            thumbnailUrl: v.thumbnailUrl,
            duration    : v.duration,
            order       : nextOrder++,
          });
        }

        // Remove videos deleted from YouTube
        const toRemove = existingVideos.filter(v => {
          const m = v.videoUrl.match(/watch\?v=([^&]+)/);
          const id = m ? m[1] : null;
          return id && !scrapedIds.includes(id);
        });
        for (const v of toRemove) await Video.findByIdAndDelete(v._id);

        results.push({
          playlist: playlist.title,
          added   : toAdd.length,
          removed : toRemove.length,
          total   : scraped.videos.length,
        });
      } catch (scrapeErr) {
        results.push({ playlist: playlist.title, error: scrapeErr.message });
      }
    }

    res.status(200).json({ success: true, message: 'Sync complete', results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
