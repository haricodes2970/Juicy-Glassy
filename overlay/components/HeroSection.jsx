import { useStore } from '../store/useStore'

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
  const cards = dedupedVideos.length > 0 ? dedupedVideos.slice(0, 4) : fallbackCards

  function handleOpen(videoId) {
    if (!videoId) return
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-primary/90">
            Recommended
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Curated for the current session</h2>
        </div>
        <button className="text-sm text-white/65 transition hover:text-white">
          Refresh feed
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {cards.map((card) => {
          const isLive = typeof card.publishedTime === 'string' && card.publishedTime.toUpperCase() === 'LIVE'

          return (
            <button
              key={card.videoId || card.title}
              onClick={() => handleOpen(card.videoId)}
              className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 text-left shadow-glass backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/10 hover:shadow-[0_18px_48px_rgba(0,0,0,0.45)]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                  {card.duration || '—'}
                </span>
              </div>

              <div className="flex gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white/90">
                  {String(card.channelName || 'YT').slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/64">{card.channelName || 'YouTube'}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-white/46">
                    <span>{card.viewCount || '—'}</span>
                    <span className="h-1 w-1 rounded-full bg-white/35" />
                    <span className={isLive ? 'text-emerald-400' : ''}>{card.publishedTime || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
