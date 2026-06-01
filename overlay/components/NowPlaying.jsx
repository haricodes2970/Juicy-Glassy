export default function NowPlaying() {
  return (
    <div className="flex h-16 items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/7 px-4 shadow-glass backdrop-blur-2xl">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/80">
          ▶
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white">Nothing playing</p>
          <p className="text-xs text-white/55">Browse to start watching</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-white/55">
        <button className="text-sm transition hover:text-white">⏮</button>
        <button className="text-base transition hover:text-white">▶</button>
        <button className="text-sm transition hover:text-white">⏭</button>
      </div>

      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-0 rounded-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
      </div>
    </div>
  )
}
