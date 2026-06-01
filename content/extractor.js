const MOCK_DATA = {
  videos: [
    {
      videoId: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      channelName: 'Rick Astley',
      viewCount: '1.5B views',
      publishedTime: '15 years ago',
      duration: '3:32',
      description: 'The official video for Never Gonna Give You Up by Rick Astley.',
      thumbnail: '',
    },
    {
      videoId: 'jNQXAC9IVRw',
      title: 'Me at the zoo',
      channelName: 'Jawed',
      viewCount: '350M views',
      publishedTime: '19 years ago',
      duration: '0:19',
      description: 'The first ever YouTube video.',
      thumbnail: '',
    },
    {
      videoId: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      channelName: 'officialpsy',
      viewCount: '5.2B views',
      publishedTime: '13 years ago',
      duration: '4:13',
      description: 'The music video that broke YouTube.',
      thumbnail: '',
    },
    {
      videoId: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      channelName: 'LuisFonsiVEVO',
      viewCount: '8.5B views',
      publishedTime: '8 years ago',
      duration: '4:42',
      description: 'Despacito music video.',
      thumbnail: '',
    },
    {
      videoId: 'JGwWNGJdvx8',
      title: 'Shape of You',
      channelName: 'Ed Sheeran',
      viewCount: '6.3B views',
      publishedTime: '8 years ago',
      duration: '4:24',
      description: 'Shape of You music video.',
      thumbnail: '',
    },
    {
      videoId: 'RgKAFK5djSk',
      title: 'See You Again',
      channelName: 'Wiz Khalifa',
      viewCount: '6.1B views',
      publishedTime: '10 years ago',
      duration: '4:18',
      description: 'Furious 7 soundtrack.',
      thumbnail: '',
    },
  ],
}

export function scrapeSubscriptionsFromDOM() {
  const subs = []
  const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer')
  
  guideEntries.forEach((el) => {
    const linkEl = el.querySelector('a')
    if (!linkEl) return
    const href = linkEl.getAttribute('href') || ''
    
    // We only want channel links, e.g. /@username or /channel/UC...
    if (!href.startsWith('/@') && !href.startsWith('/channel/') && !href.includes('/c/')) {
      return
    }
    
    const titleEl = el.querySelector('.title, #entry-title, yt-formatted-string.title')
    const name = titleEl ? titleEl.textContent.trim() : ''
    if (!name) return
    
    const avatarEl = el.querySelector('yt-img-shadow img, img')
    const avatarSrc = avatarEl ? avatarEl.getAttribute('src') : ''
    
    // Filter to known yt avatar domains to ensure it's a channel sub
    if (avatarSrc && (avatarSrc.includes('yt3.ggpht.com') || avatarSrc.includes('yt3.android.com'))) {
      subs.push({ name, url: href, avatar: avatarSrc })
    }
  })
  
  // Deduplicate by URL
  const uniqueSubs = []
  const urls = new Set()
  subs.forEach((sub) => {
    if (!urls.has(sub.url)) {
      urls.add(sub.url)
      uniqueSubs.push(sub)
    }
  })
  
  return uniqueSubs
}

export function scrapeVideosFromDOM() {
  const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer')
  const videos = []
  
  videoElements.forEach((el) => {
    const linkEl = el.querySelector('a#video-title-link, a#thumbnail, a#video-title')
    if (!linkEl) return
    
    const href = linkEl.getAttribute('href')
    if (!href) return
    
    const videoIdMatch = href.match(/[?&]v=([^&#]+)/)
    if (!videoIdMatch) return
    const videoId = videoIdMatch[1]
    
    const titleEl = el.querySelector('#video-title')
    const title = titleEl ? titleEl.textContent.trim() : ''
    if (!title) return
    
    const channelNameEl = el.querySelector('ytd-channel-name a, #channel-name a, #byline a')
    const channelName = channelNameEl ? channelNameEl.textContent.trim() : 'Unknown'
    
    const channelAvatarEl = el.querySelector('#avatar-container img, yt-img-shadow img, #avatar img, #channel-thumbnail img')
    let channelAvatar = channelAvatarEl ? channelAvatarEl.getAttribute('src') : ''
    if (channelAvatar && channelAvatar.startsWith('//')) {
      channelAvatar = 'https:' + channelAvatar
    }
    
    const metadataLines = el.querySelectorAll('#metadata-line span')
    let viewCount = ''
    let publishedTime = ''
    if (metadataLines.length > 0) {
      viewCount = metadataLines[0].textContent.trim()
    }
    if (metadataLines.length > 1) {
      publishedTime = metadataLines[1].textContent.trim()
    }
    
    const durationEl = el.querySelector('ytd-thumbnail-overlay-time-status-renderer span, badge-shape, ytd-badge-supported-renderer span')
    const duration = durationEl ? durationEl.textContent.trim() : ''
    
    // Construct real high-quality thumbnail without relying on lazy loading
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    
    videos.push({
      videoId,
      title,
      thumbnail,
      channelName,
      channelAvatar,
      viewCount,
      publishedTime,
      duration,
    })
  })
  
  return videos
}

function getMockData() {
  return {
    videos: MOCK_DATA.videos,
    featured: MOCK_DATA.videos[0],
    subscriptions: [],
  }
}

export function extractYouTubeData() {
  try {
    const videos = scrapeVideosFromDOM()
    const subscriptions = scrapeSubscriptionsFromDOM()
    
    if (videos.length === 0) {
      return getMockData()
    }
    
    return {
      videos,
      featured: videos[0] || null,
      subscriptions,
    }
  } catch (e) {
    console.warn('[Juicy Glassy] extractYouTubeData:', e.message)
    return getMockData()
  }
}
