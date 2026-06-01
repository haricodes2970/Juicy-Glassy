import { useStore } from '../store/useStore'

export default function VideoRow({ title = 'Continue Watching' }) {
  const videos = useStore((s) => s.youtubeData.videos)

  if (!videos || videos.length === 0) return null

  function handleOpen(videoId) {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </h3>
        <button className="text-xs text-accent-primary hover:text-accent-primary/80 transition-colors">
          See all →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-glass">
        {videos.slice(0, 10).map((card) => (
          <div
            key={card.videoId}
            onClick={() => handleOpen(card.videoId)}
            className="flex-shrink-0 w-56 glass-card p-0 overflow-hidden cursor-pointer group"
          >
            <div className="aspect-video bg-dark-surface flex items-center justify-center relative overflow-hidden">
              {card.thumbnail ? (
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-2xl opacity-30">▶</span>
              )}
              {card.duration && (
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-medium glass rounded">
                  {card.duration}
                </span>
              )}
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-white truncate">
                {card.title}
              </h4>
              <p className="text-xs text-text-muted mt-1 truncate">
                {card.channelName}
              </p>
              <p className="text-xs text-text-muted truncate">
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
