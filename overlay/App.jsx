import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import HeroSection from './components/HeroSection'
import VideoRow from './components/VideoRow'
import { useStore } from './store/useStore'

export default function App() {
  const ambientColor = useStore((s) => s.ambientColor)
  const chips = useStore((s) => s.chips)

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // If within 400px of the bottom, trigger a scroll on the main page to load more videos
    if (scrollHeight - scrollTop - clientHeight < 400) {
      window.scrollTo(
        0,
        document.documentElement.scrollHeight || document.body.scrollHeight
      )
    }
  }

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-dark-bg text-white"
      style={{
        backgroundImage: [
          `radial-gradient(circle at 18% 14%, rgba(${ambientColor}, 0.34), transparent 26%)`,
          'radial-gradient(circle at 82% 18%, rgba(255, 136, 96, 0.18), transparent 20%)',
          'radial-gradient(circle at 50% 100%, rgba(75, 91, 255, 0.16), transparent 36%)',
          'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        ].join(', '),
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)] opacity-70" />
      <div className="relative z-10 flex h-full overflow-hidden">
        <Sidebar />
        <main
          onScroll={handleScroll}
          className="flex min-w-0 flex-1 flex-col overflow-y-auto px-5 pb-24 pt-4 scrollbar-glass lg:px-6"
        >
          {/* Top header */}
          <header className="flex items-center gap-4">
            <button className="glass-button flex h-11 w-11 items-center justify-center rounded-full px-0 text-base shadow-glass">
              ☰
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/7 px-4 py-2.5 shadow-glass backdrop-blur-glass transition-colors focus-within:bg-white/10 focus-within:border-white/20">
              <span className="text-lg text-white/45">⌕</span>
              <input
                aria-label="Search"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                placeholder="Search"
                type="search"
              />
              <span className="hidden h-5 w-px bg-white/10 sm:block" />
              <button className="rounded-full p-1.5 text-base text-white/75 transition hover:bg-white/10 hover:text-white">
                🎙
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="glass-button flex h-11 w-11 items-center justify-center rounded-full px-0 text-base">
                ⊞
              </button>
              <button className="glass-button flex h-11 w-11 items-center justify-center rounded-full px-0 text-base relative">
                🔔
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-accent-secondary" />
              </button>
              <button className="h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-white/25 via-white/10 to-white/5 shadow-glass transition hover:scale-105">
                <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                  JG
                </span>
              </button>
            </div>
          </header>

          {/* Category chips */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {chips.map((chip, index) => (
              <button
                key={chip.text}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  chip.isSelected || index === 0
                    ? 'border-white/15 bg-white/85 text-dark-bg shadow-[0_10px_30px_rgba(255,255,255,0.15)]'
                    : 'border-white/10 bg-white/6 text-white/72 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {chip.text}
              </button>
            ))}
          </div>

          {/* Video sections */}
          <div className="mt-6 space-y-7 pb-8">
            <HeroSection />
            <VideoRow title="Continue watching" limit={5} />
            <VideoRow title="Latest from your subscriptions" limit={5} />
            <VideoRow title="More to explore" limit={10} />
          </div>
        </main>
      </div>
    </div>
  )
}
