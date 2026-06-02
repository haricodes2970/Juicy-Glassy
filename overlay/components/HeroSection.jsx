import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function HeroSection() {
  const featured = useStore((s) => s.youtubeData.featuredVideo)
  const videos = useStore((s) => s.youtubeData.videos)
  const scrollRef = useRef(null)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  const sourceVideos = [featured, ...(videos || [])].filter(Boolean)
  const dedupedVideos = sourceVideos.filter(
    (video, index, allVideos) =>
      allVideos.findIndex((c) => c.videoId === video.videoId) === index
  )
  const cards = dedupedVideos.slice(0, 8)

  function updateScrollButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [cards.length])

  function scroll(direction) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * 360, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 400)
  }

  function handleOpen(videoId) {
    if (!videoId) return
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  if (cards.length === 0) {
    return (
      <section className="flex items-center justify-center py-16 text-white/40 text-sm">
        Loading your feed…
      </section>
    )
  }

  return (
    <section className="space-y-4 relative">
      <div className="flex items-center gap-3">
        <span className="text-xl text-white/80">✨</span>
        <h2 className="text-xl font-bold text-white tracking-wide">
          Recommended
        </h2>
        <div className="ml-auto">
          <button
            onClick={() => location.reload()}
            className="text-sm text-white/50 transition hover:text-white bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="relative group/scroll">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="scroll-arrow-btn left-0"
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-glass scroll-smooth"
        >
          {cards.map((card) => {
            const isLive =
              card.isLive ||
              (typeof card.publishedTime === 'string' &&
                card.publishedTime.toUpperCase() === 'LIVE')

            return (
              <div
                key={card.videoId || card.title}
                className="group w-[22rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 text-left shadow-glass backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/10 hover:shadow-[0_18px_48px_rgba(0,0,0,0.45)]"
                onClick={() => handleOpen(card.videoId)}
              >
                <div className="relative aspect-video overflow-hidden">
                  {card.thumbnail ? (
                    <img
                      src={card.thumbnail}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-accent-primary/20 to-accent-secondary/20">
                      <div className="h-14 w-14 rounded-full border border-white/12 bg-black/25 text-center text-2xl leading-[3.5rem] text-white/60 backdrop-blur-md">
                        ▶
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Duration / LIVE badge */}
                  {isLive ? (
                    <span className="live-badge absolute bottom-2 right-2">
                      🔴 LIVE
                    </span>
                  ) : (
                    card.duration && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                        {card.duration}
                      </span>
                    )
                  )}
                </div>

                <div className="flex gap-3 p-4 relative">
                  {card.channelAvatar ? (
                    <img
                      src={card.channelAvatar}
                      alt={card.channelName}
                      className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white/90">
                      {String(card.channelName || 'YT')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 pr-6">
                    <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.3] text-white/95">
                      {card.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/60">
                      <span>{card.channelName || 'YouTube'}</span>
                      {card.isVerified && (
                        <span className="text-[10px]">✓</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/40">
                      <span>{card.viewCount || '—'}</span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span
                        className={
                          isLive ? 'text-red-400 font-semibold' : ''
                        }
                      >
                        {isLive
                          ? 'Streaming now'
                          : card.publishedTime || 'Recently'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="absolute right-3 top-4 text-white/40 hover:text-white px-2 rounded-full transition-colors hover:bg-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="scroll-arrow-btn right-0"
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </section>
  )
}
