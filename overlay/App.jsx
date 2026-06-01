import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import HeroSection from './components/HeroSection'
import VideoRow from './components/VideoRow'
import CustomHub from './components/CustomHub'
import FocusWidget from './components/FocusWidget'
import NowPlaying from './components/NowPlaying'
import { useStore } from './store/useStore'

function extractDominantColor(imgSrc) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(undefined)
        ctx.drawImage(img, 0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        resolve(`${r}, ${g}, ${b}`)
      } catch {
        resolve(undefined)
      }
    }
    img.onerror = () => resolve(undefined)
    img.src = imgSrc
  })
}

export default function App() {
  const thumbnail = useStore((s) => s.youtubeData.featuredVideo?.thumbnail)
  const setAmbientColor = useStore((s) => s.setAmbientColor)
  const ambientColor = useStore((s) => s.ambientColor)

  useEffect(() => {
    if (!thumbnail) return
    extractDominantColor(thumbnail).then((color) => {
      if (color) setAmbientColor(color)
    })
  }, [thumbnail])

  return (
    <div
      className="w-screen h-screen bg-dark-bg overflow-hidden flex flex-col"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(${ambientColor}, 0.25), transparent 70%)`,
      }}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 scrollbar-glass">
          <HeroSection />
          <VideoRow title="Continue Watching" />
          <VideoRow title="Recommended for You" />
        </main>
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 p-4 pt-6">
          <CustomHub />
          <FocusWidget />
        </aside>
      </div>
      <NowPlaying />
    </div>
  )
}
