const features = [
  {
    title: 'AI Summary',
    icon: '✦',
    desc: 'Smart video summaries',
    color: 'from-accent-primary/20 to-transparent',
  },
  {
    title: 'Deep Focus',
    icon: '◎',
    desc: 'Distraction-free mode',
    color: 'from-accent-success/20 to-transparent',
  },
  {
    title: 'Smart Recs',
    icon: '◈',
    desc: 'AI-curated picks',
    color: 'from-accent-warning/20 to-transparent',
  },
  {
    title: 'Community',
    icon: '♢',
    desc: 'Hub discussions',
    color: 'from-accent-secondary/20 to-transparent',
  },
]

export default function CustomHub() {
  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        Features Hub
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {features.map((f) => (
          <button
            key={f.title}
            className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-glass-surface hover:bg-glass-hover border border-transparent hover:border-glass-border transition-all duration-200 text-left group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              {f.icon}
            </span>
            <span className="text-xs font-medium text-white">{f.title}</span>
            <span className="text-[10px] text-text-muted leading-tight">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
