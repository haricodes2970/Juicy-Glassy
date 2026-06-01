export default function NowPlaying() {
  return (
    <div className="h-14 glass rounded-none border-b-0 border-l-0 border-r-0 flex items-center px-6 gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded glass flex items-center justify-center text-xs flex-shrink-0">
          ▶
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Nothing playing</p>
          <p className="text-xs text-text-muted">Browse to start watching</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-text-muted">
        <button className="hover:text-white transition-colors text-sm">⏮</button>
        <button className="hover:text-white transition-colors text-lg">▶</button>
        <button className="hover:text-white transition-colors text-sm">⏭</button>
      </div>

      <div className="w-32 h-1 rounded-full bg-glass-bg overflow-hidden">
        <div className="w-0 h-full bg-accent-primary rounded-full" />
      </div>
    </div>
  )
}
