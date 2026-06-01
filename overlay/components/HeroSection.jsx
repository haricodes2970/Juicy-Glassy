import { useStore } from '../store/useStore'

export default function HeroSection() {
  const featured = useStore((s) => s.youtubeData.featuredVideo)

  if (!featured) return null

  const thumbnail = featured.thumbnail
    ? featured.thumbnail
    : ''

  function handleWatch() {
    window.open(`https://youtube.com/watch?v=${featured.videoId}`, '_self')
  }

  return (
    <section
      className="relative w-full flex rounded-glass overflow-hidden glass-card p-0"
      style={{ height: '380px', maxHeight: '380px' }}
    >
      <div className="flex-1 flex flex-col justify-center p-8 gap-4 z-10">
        <span className="text-[10px] font-semibold text-accent-primary uppercase tracking-[0.2em]">
          Featured Video
        </span>

        <h2 className="text-3xl font-bold text-white leading-tight line-clamp-2">
          {featured.title}
        </h2>

        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>{featured.channelName}</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span>{featured.viewCount || '—'}</span>
          {featured.publishedTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-text-muted" />
              <span>{featured.publishedTime}</span>
            </>
          )}
          {featured.duration && (
            <>
              <span className="w-1 h-1 rounded-full bg-text-muted" />
              <span>{featured.duration}</span>
            </>
          )}
        </div>

        <p className="text-sm text-text-muted line-clamp-2 max-w-lg leading-relaxed">
          {featured.description}
        </p>

        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={handleWatch}
            className="px-6 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/80 transition-all duration-200 flex items-center gap-2"
          >
            <span>▶</span>
            <span>Watch</span>
          </button>
          <button className="px-6 py-2.5 rounded-xl glass-button text-sm flex items-center gap-2">
            <span>+</span>
            <span>Later</span>
          </button>
        </div>
      </div>

      <div className="w-[420px] flex-shrink-0 relative overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-primary/20 via-dark-bg to-accent-secondary/10 flex items-center justify-center">
            <span className="text-4xl opacity-20">▶</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-l from-dark-bg/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg/80 to-transparent" />
      </div>
    </section>
  )
}
