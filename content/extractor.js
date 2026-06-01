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

function extractVideoRenderer(item) {
  const renderer =
    item?.richItemRenderer?.content?.videoRenderer ||
    item?.videoRenderer
  if (!renderer) return null

  const thumbnails = renderer.thumbnail?.thumbnails || []
  const bestThumb = thumbnails[thumbnails.length - 1]?.url || ''

  return {
    videoId: renderer.videoId || '',
    title: renderer.title?.runs?.[0]?.text || 'Untitled',
    thumbnail: bestThumb,
    channelName: renderer.ownerText?.runs?.[0]?.text || 'Unknown',
    viewCount:
      renderer.viewCountText?.simpleText ||
      renderer.viewCountText?.runs?.[0]?.text ||
      '',
    publishedTime: renderer.publishedTimeText?.simpleText || '',
    duration: renderer.lengthText?.simpleText || '',
    description:
      renderer.detailedMetadataSnippets?.[0]?.snippetText?.runs?.[0]?.text ||
      renderer.title?.runs?.[0]?.text ||
      '',
  }
}

function getMockData() {
  return {
    videos: MOCK_DATA.videos,
    featured: MOCK_DATA.videos[0],
  }
}

export function extractYouTubeData() {
  try {
    const data = window.ytInitialData
    if (!data) throw new Error('ytInitialData not found')

    const contents =
      data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.richGridRenderer?.contents

    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      throw new Error('no video contents found')
    }

    const videos = contents.map(extractVideoRenderer).filter(Boolean)

    if (videos.length === 0) throw new Error('no video items extracted')

    return { videos, featured: videos[0] }
  } catch (e) {
    console.warn('[Juicy Glassy] extractYouTubeData:', e.message)
    return getMockData()
  }
}
