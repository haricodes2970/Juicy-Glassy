const placeholderCards = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  title: `Sample Video ${i + 1}`,
  channel: 'Creator Channel',
  views: `${(i + 3) * 1.2}K views`,
  time: `${i + 1} hour ago`,
}))

export default function VideoRow({ title = 'Continue Watching' }) {
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
        {placeholderCards.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0 w-56 glass-card p-0 overflow-hidden cursor-pointer group"
          >
            <div className="aspect-video bg-gradient-to-br from-accent-primary/10 to-accent-secondary/5 flex items-center justify-center relative">
              <span className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity">
                ▶
              </span>
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-medium glass rounded">
                8:4{card.id + 2}
              </span>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-white truncate">
                {card.title}
              </h4>
              <p className="text-xs text-text-muted mt-1">
                {card.channel}
              </p>
              <p className="text-xs text-text-muted">
                {card.views} · {card.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
