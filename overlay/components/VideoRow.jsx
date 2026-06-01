import { useStore } from '../store/useStore'

export default function VideoRow({ title = 'Continue Watching', limit = 5 }) {
  const videos = useStore((s) => s.youtubeData.videos)

  const fallbackVideos = [
    {
      videoId: 'row-1',
      title: 'The Future of Developer Tools',
      channelName: 'Fireship',
      viewCount: '124K views',
      publishedTime: '2 days ago',
      duration: '15:20',
    },
    {
      videoId: 'row-2',
      title: 'System Design in 100 Seconds',
      channelName: 'Tech Burner',
      viewCount: '85K views',
      publishedTime: '3 days ago',
      duration: '8:40',
    },
    {
      videoId: 'row-3',
      title: "What's Inside a Black Hole?",
      channelName: 'Veritasium',
      viewCount: '512K views',
      publishedTime: '5 days ago',
      duration: '17:05',
    },
    {
      videoId: 'row-4',
      title: 'lofi hip hop radio - beats to relax/study to',
      channelName: 'Lofi Girl',
      viewCount: '8.9K watching',
      publishedTime: 'LIVE',
      duration: '54:31',
    },
    {
      videoId: 'row-5',
      title: 'The $0 to $1M Roadmap (2024)',
      channelName: 'Iman Gadzhi',
      viewCount: '41K views',
      publishedTime: '1 week ago',
      duration: '13:07',
    },
  ]

  const sourceVideos = videos.length > 0 ? videos : fallbackVideos

  if (!sourceVideos || sourceVideos.length === 0) return null

  function handleOpen(videoId) {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/65">
          {title}
        </h3>
        <button className="text-sm text-white/65 transition hover:text-white">
          View all
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 pr-1 scrollbar-glass">
        {sourceVideos.slice(0, limit).map((card) => (
          <div
            key={card.videoId}
            onClick={() => handleOpen(card.videoId)}
            className="group w-[17rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/6 shadow-glass backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/10"
          >
            <div className="relative aspect-video overflow-hidden bg-dark-surface">
              {card.thumbnail ? (
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-accent-primary/18 to-accent-secondary/14 text-white/35">
                  <span className="text-2xl">▶</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              {card.duration && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/72 px-2 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                  {card.duration}
                </span>
              )}
            </div>

            <div className="p-3.5">
              <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                {card.title}
              </h4>
              <p className="mt-1.5 text-xs text-white/64">{card.channelName}</p>
              <p className="mt-1 text-xs text-white/46">
                {card.viewCount}
                {card.publishedTime ? ` · ${card.publishedTime}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
