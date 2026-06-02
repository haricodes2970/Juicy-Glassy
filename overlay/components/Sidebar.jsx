import { useState } from 'react'
import { useStore } from '../store/useStore'

const navItems = [
  { label: 'Home', icon: '⌂', active: true, route: '/' },
  { label: 'Explore', icon: '✦', active: false, route: '/feed/trending' },
  {
    label: 'Subscriptions',
    icon: '▣',
    active: false,
    route: '/feed/subscriptions',
  },
  { label: 'You', icon: '◔', active: false, route: '/feed/you' },
  { label: 'History', icon: '↺', active: false, route: '/feed/history' },
  { label: 'Playlists', icon: '≡', active: false, route: '/feed/playlists' },
  { label: 'Your videos', icon: '▢', active: false, route: '/studio' },
  {
    label: 'Watch later',
    icon: '⌛',
    active: false,
    route: '/playlist?list=WL',
  },
  {
    label: 'Liked videos',
    icon: '♥',
    active: false,
    route: '/playlist?list=LL',
  },
  {
    label: 'Downloads',
    icon: '⇩',
    active: false,
    route: '/feed/downloads',
  },
]

const INITIAL_SUBS_COUNT = 6

export default function Sidebar() {
  const subscriptions = useStore((s) => s.youtubeData.subscriptions) || []
  const [showAllSubs, setShowAllSubs] = useState(false)

  const visibleSubs = showAllSubs
    ? subscriptions
    : subscriptions.slice(0, INITIAL_SUBS_COUNT)

  function handleNavigate(route) {
    if (!route) return
    if (route === '/studio') {
      window.open('https://studio.youtube.com', '_self')
    } else {
      window.open(`https://youtube.com${route}`, '_self')
    }
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-white/6 p-4 pt-5 backdrop-blur-2xl lg:flex h-full min-h-0">
      <div className="flex h-full flex-col min-h-0">
        {/* YouTube Logo */}
        <div className="mb-5 flex shrink-0 items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-500 to-red-600 text-sm font-semibold text-white shadow-glow">
            ▶
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              YouTube
            </h1>
            <p className="text-xs text-text-muted">glass dashboard</p>
          </div>
        </div>

        {/* Scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4 scrollbar-glass">
          {/* Navigation */}
          <nav className="flex flex-col gap-1 rounded-[1.5rem] border border-white/8 bg-black/10 p-2 shadow-glass">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.route)}
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

          {/* Subscriptions */}
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/10 p-3 shadow-glass">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
              Subscriptions
            </p>
            <div className="flex flex-col gap-1.5">
              {visibleSubs.length > 0 ? (
                <>
                  {visibleSubs.map((subscription) => (
                    <button
                      key={subscription.name}
                      onClick={() => handleNavigate(subscription.url)}
                      className="flex items-center gap-3 rounded-[0.95rem] px-3 py-2 text-left text-sm text-white/82 transition hover:bg-white/7 hover:text-white"
                    >
                      {subscription.avatar ? (
                        <img
                          src={subscription.avatar}
                          alt={subscription.name}
                          className="h-6 w-6 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                        />
                      ) : (
                        <span className="h-6 w-6 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
                      )}
                      <span className="flex-1 truncate">
                        {subscription.name}
                      </span>
                      <span className="text-[10px] text-white/30">▸</span>
                    </button>
                  ))}

                  {/* Show more / Show less */}
                  {subscriptions.length > INITIAL_SUBS_COUNT && (
                    <button
                      onClick={() => setShowAllSubs((prev) => !prev)}
                      className="flex items-center gap-3 rounded-[0.95rem] px-3 py-2 text-left text-sm text-white/50 transition hover:bg-white/7 hover:text-white"
                    >
                      <span className="flex h-6 w-6 items-center justify-center text-xs">
                        {showAllSubs ? '▴' : '▾'}
                      </span>
                      <span>
                        {showAllSubs
                          ? 'Show less'
                          : `Show more (${subscriptions.length - INITIAL_SUBS_COUNT})`}
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <div className="px-2 py-4 text-center text-xs text-text-muted">
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-primary" />
                    Loading subscriptions…
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Focus mode indicator */}
        <div className="mt-auto shrink-0 pt-4">
          <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/6 px-3 py-2 text-xs text-text-muted transition-colors hover:bg-white/10 cursor-pointer">
            <div className="h-2 w-2 rounded-full bg-accent-success shadow-[0_0_10px_rgba(46,213,115,0.8)]" />
            <span>Focus mode ready</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
