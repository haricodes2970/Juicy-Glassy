import { useStore } from '../store/useStore'
import { extractYouTubeData } from '../../content/extractor'

export default function HeroSection() {
  const featured = useStore((s) => s.youtubeData.featuredVideo)
  const videos = useStore((s) => s.youtubeData.videos)

  const fallbackCards = [
    {
      videoId: 'fallback-1',
      title: 'Building a $10K/Month SaaS Product in Public',
      channelName: 'Fireship',
      viewCount: '124K views',
      publishedTime: '2 days ago',
      duration: '18:45',
      description: 'A clean, glassmorphic take on a YouTube-style recommendation feed.',
    },
    {
      videoId: 'fallback-2',
      title: 'AI Agents Explained in Simple Terms',
      channelName: 'Veritasium',
      viewCount: '512K views',
      publishedTime: '5 days ago',
      duration: '22:31',
      description: 'Keep the layout cinematic while still feeling native to YouTube.',
    },
    {
      videoId: 'fallback-3',
      title: 'Lo-fi coding session with cinematic lighting',
      channelName: 'Lofi Girl',
      viewCount: '12K watching',
      publishedTime: 'LIVE',
      duration: '1:02:15',
      description: 'A calm, modern dashboard surface built with layered glass and blur.',
    },
    {
      videoId: 'fallback-4',
      title: 'The Only Productivity System You’ll Ever Need',
      channelName: 'Ali Abdaal',
      viewCount: '230K views',
      publishedTime: '1 day ago',
      duration: '14:23',
      description: 'The top shelf should feel like a featured YouTube feed, not a generic card wall.',
    },
  ]

  const sourceVideos = [featured, ...(videos || [])].filter(Boolean)
  const dedupedVideos = sourceVideos.filter(
    (video, index, allVideos) =>
      allVideos.findIndex((candidate) => candidate.videoId === video.videoId) === index,
  )
  // Show up to 8 recommended videos in the hero carousel
  const cards = dedupedVideos.length > 0 ? dedupedVideos.slice(0, 8) : fallbackCards

  function handleOpen(videoId) {
    if (!videoId) return
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  function handleRefresh() {
    try {
      const data = extractYouTubeData()
      if (data && data.videos) {
        useStore.getState().setYouTubeData(data)
      }
    } catch (e) {
      console.warn('Refresh failed', e)
    }
  }

  return (
    <section className="space-y-4 relative">
      <div className="flex items-center gap-3">
        <span className="text-xl text-white/80">✨</span>
        <h2 className="text-xl font-bold text-white tracking-wide">Recommended</h2>
        <div className="ml-auto">
          <button onClick={handleRefresh} className="text-sm text-white/50 transition hover:text-white bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10">
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-glass">
        {cards.map((card) => {
          const isLive = typeof card.publishedTime === 'string' && card.publishedTime.toUpperCase() === 'LIVE'

          return (
            <div
              key={card.videoId || card.title}
              className="group w-[22rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 text-left shadow-glass backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/10 hover:shadow-[0_18px_48px_rgba(0,0,0,0.45)]"
              onClick={() => handleOpen(card.videoId)}
            >
              <div className="relative aspect-video overflow-hidden">
                {card.thumbnail ? (
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-accent-primary/20 to-accent-secondary/20">
                    <div className="h-14 w-14 rounded-full border border-white/12 bg-black/25 text-center text-2xl leading-[3.5rem] text-white/60 backdrop-blur-md">
                      ▶
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                  {card.duration || '—'}
                </span>
              </div>

              <div className="flex gap-3 p-4 relative">
                {card.channelAvatar ? (
                  <img src={card.channelAvatar} alt={card.channelName} className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white/90">
                    {String(card.channelName || 'YT').slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1 pr-6">
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.3] text-white/95">
                    {card.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/60">
                    <span>{card.channelName || 'YouTube'}</span>
                    <span className="text-[10px]">✓</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/40">
                    <span>{card.viewCount || '—'}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className={isLive ? 'text-red-400 font-semibold' : ''}>{card.publishedTime || 'Recently'}</span>
                  </div>
                </div>

                <button 
                  className="absolute right-3 top-4 text-white/40 hover:text-white px-2 rounded-full transition-colors hover:bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  ⋮
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
