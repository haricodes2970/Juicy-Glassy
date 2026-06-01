import Sidebar from './components/Sidebar'
import HeroSection from './components/HeroSection'
import VideoRow from './components/VideoRow'
import CustomHub from './components/CustomHub'
import FocusWidget from './components/FocusWidget'
import NowPlaying from './components/NowPlaying'

export default function App() {
  return (
    <div className="w-screen h-screen bg-dark-bg overflow-hidden flex flex-col">
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
