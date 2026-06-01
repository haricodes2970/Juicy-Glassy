const navItems = [
  { label: 'Home', icon: '⌂', active: true },
  { label: 'Explore', icon: '✦', active: false },
  { label: 'Subscriptions', icon: '▣', active: false },
  { label: 'You', icon: '◔', active: false },
  { label: 'History', icon: '↺', active: false },
  { label: 'Playlists', icon: '≡', active: false },
  { label: 'Your videos', icon: '▢', active: false },
  { label: 'Watch later', icon: '⌛', active: false },
  { label: 'Liked videos', icon: '♥', active: false },
  { label: 'Downloads', icon: '⇩', active: false },
]

const subscriptions = [
  { name: 'Neon Man', tone: 'bg-cyan-400' },
  { name: 'Fireship', tone: 'bg-orange-400' },
  { name: 'Tech Burner', tone: 'bg-fuchsia-400' },
  { name: 'Veritasium', tone: 'bg-blue-400' },
  { name: 'ColdFusion', tone: 'bg-emerald-400' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-white/6 p-4 pt-5 backdrop-blur-2xl lg:flex h-full">
      <div className="flex h-full flex-col">
        <div className="mb-5 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-500 to-red-600 text-sm font-semibold text-white shadow-glow">
            ▶
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">YouTube</h1>
            <p className="text-xs text-text-muted">glass dashboard</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <nav className="flex flex-col gap-1 rounded-[1.5rem] border border-white/8 bg-black/10 p-2 shadow-glass">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'border border-white/12 bg-white/14 text-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                    : 'text-text-secondary hover:bg-white/7 hover:text-white'
                }`}
              >
                <span className="text-base opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/10 p-3 shadow-glass">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
              Subscriptions
            </p>
            <div className="flex flex-col gap-1.5">
              {subscriptions.map((subscription) => (
                <button
                  key={subscription.name}
                  className="flex items-center gap-3 rounded-[0.95rem] px-3 py-2 text-left text-sm text-white/82 transition hover:bg-white/7 hover:text-white"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${subscription.tone} shadow-[0_0_12px_rgba(255,255,255,0.2)]`} />
                  <span className="flex-1 truncate">{subscription.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/6 px-3 py-2 text-xs text-text-muted">
            <div className="h-2 w-2 rounded-full bg-accent-success shadow-[0_0_10px_rgba(46,213,115,0.8)]" />
            <span>Focus mode ready</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
