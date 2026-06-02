import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'

const sectionIcons = {
  'Continue watching': '⏱',
  'Latest from your subscriptions': '🌟',
  'More to explore': '🔮',
}

export default function VideoRow({ title = 'Continue watching', limit = 5 }) {
  const videos = useStore((s) => s.youtubeData.videos)
  const scrollRef = useRef(null)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  const icon = sectionIcons[title] || '▶'

  // Offset the video range so each section shows different videos
  const sectionOffset =
    title === 'Continue watching'
      ? 4
      : title === 'Latest from your subscriptions'
        ? 9
        : 14

  const sourceVideos = videos && videos.length > 0 ? videos : []
  const sectionVideos = sourceVideos.slice(sectionOffset, sectionOffset + limit)

  function updateScrollButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [sectionVideos.length])

  function scroll(direction) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * 320, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 400)
  }

  function handleOpen(videoId) {
    if (!videoId) return
    window.open(`https://youtube.com/watch?v=${videoId}`, '_self')
  }

  if (sectionVideos.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
            {title}
          </h3>
        </div>
        <button className="text-[13px] font-medium text-white/50 transition hover:text-white bg-white/5 px-3 py-1 rounded-full hover:bg-white/10">
          View all
        </button>
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
          {sectionVideos.map((card) => {
            const isLive =
              card.isLive ||
              (typeof card.publishedTime === 'string' &&
                card.publishedTime.toUpperCase() === 'LIVE')

            return (
              <div
                key={card.videoId || card.title}
                onClick={() => handleOpen(card.videoId)}
                className="group w-[18rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/6 shadow-glass backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
              >
                <div className="relative aspect-video overflow-hidden bg-dark-surface">
                  {card.thumbnail ? (
                    <img
                      src={card.thumbnail}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-accent-primary/18 to-accent-secondary/14 text-white/35">
                      <span className="text-2xl">▶</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Duration / LIVE badge */}
                  {isLive ? (
                    <span className="live-badge absolute bottom-2 right-2">
                      🔴 LIVE
                    </span>
                  ) : (
                    card.duration && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/72 px-2 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm">
                        {card.duration}
                      </span>
                    )
                  )}
                </div>

                <div className="flex gap-3 p-3.5 relative">
                  {card.channelAvatar ? (
                    <img
                      src={card.channelAvatar}
                      alt={card.channelName}
                      className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white/90">
                      {String(card.channelName || 'YT')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 pr-5">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-white/95">
                      {card.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
                      <span className="truncate">
                        {card.channelName || 'YouTube'}
                      </span>
                      {card.isVerified && (
                        <span className="text-[9px]">✓</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/40">
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
                    className="absolute right-2 top-3 text-white/40 hover:text-white px-2 rounded-full transition-colors hover:bg-white/10"
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
