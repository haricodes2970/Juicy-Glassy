const placeholderVideo = {
  title: 'Featured Video',
  channel: 'Juicy Glassy',
  views: '12K views',
  duration: '15:24',
  description: 'Cinematic glassmorphism dashboard for your YouTube experience.'
}

export default function HeroSection() {
  return (
    <section className="relative w-full aspect-video max-h-[420px] rounded-glass overflow-hidden glass-card p-0">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-dark-bg to-accent-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(108,99,255,0.15),transparent_50%)]" />

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-bg/90 via-dark-bg/50 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-lg flex-shrink-0">
            ▶
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white truncate">
              {placeholderVideo.title}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {placeholderVideo.channel} · {placeholderVideo.views}
            </p>
            <p className="text-xs text-text-muted mt-1 line-clamp-1">
              {placeholderVideo.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="px-2 py-1 text-xs font-medium glass rounded-md">
              {placeholderVideo.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-semibold text-white bg-accent-primary/40 backdrop-blur-md rounded-full border border-accent-primary/30">
          FEATURED
        </span>
      </div>
    </section>
  )
}
