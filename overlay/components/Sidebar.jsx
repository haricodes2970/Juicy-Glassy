const navItems = [
  { label: 'Home', icon: '⌂', active: true },
  { label: 'Explore', icon: '◎', active: false },
  { label: 'Subscriptions', icon: '▣', active: false },
  { label: 'Library', icon: '☰', active: false },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col gap-2 p-4 pt-6 glass rounded-none border-l-0 border-t-0 border-b-0">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold gradient-text tracking-tight">Juicy Glassy</h1>
        <p className="text-xs text-text-muted mt-0.5">cinematic dashboard</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              item.active
                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                : 'text-text-secondary hover:text-white hover:bg-glass-bg'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-glass-border">
        <div className="flex items-center gap-3 px-3 py-2 text-text-muted text-xs">
          <div className="w-2 h-2 rounded-full bg-accent-success" />
          <span>Focus Mode</span>
        </div>
      </div>
    </aside>
  )
}
