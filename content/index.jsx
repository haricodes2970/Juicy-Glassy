import cssText from '../overlay/index.css?inline'
import { createRoot } from 'react-dom/client'
import App from '../overlay/App'
import { createObserver, destroyObserver } from './observer'
import { useStore } from '../overlay/store/useStore'

let reactRoot = null
let shadowHost = null
let shadowRoot = null
let dataReceived = false

/* ------------------------------------------------------------------ */
/*  Inject the MAIN-world extractor                                   */
/* ------------------------------------------------------------------ */
function injectExtractor() {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('content/injector.js')
  script.onload = () => script.remove()
  ;(document.head || document.documentElement).appendChild(script)
}

/* ------------------------------------------------------------------ */
/*  Listen for data from the MAIN-world injector                      */
/* ------------------------------------------------------------------ */
window.addEventListener('message', (event) => {
  if (event.source !== window) return

  if (event.data && event.data.type === 'JUICY_GLASSY_DATA') {
    const { videos, featured, subscriptions, chips } = event.data.payload
    dataReceived = true

    useStore.getState().setYouTubeData({
      videos: videos || [],
      featured: featured || null,
      subscriptions: subscriptions || [],
    })

    if (chips && chips.length > 0) {
      useStore.getState().setChips(chips)
    }

    // Now it's safe to hide the native page
    hideNativePage()
  }

  if (event.data && event.data.type === 'JUICY_GLASSY_DATA_APPEND') {
    const { videos } = event.data.payload
    if (videos && videos.length > 0) {
      useStore.getState().appendVideos(videos)
    }
  }
})

/* ------------------------------------------------------------------ */
/*  Hide the native YouTube page (only after data is captured)        */
/* ------------------------------------------------------------------ */
function hideNativePage() {
  const pageManager = document.querySelector('#page-manager, ytd-page-manager')
  if (pageManager) pageManager.style.setProperty('display', 'none', 'important')

  const masthead = document.querySelector('#masthead-container')
  if (masthead) masthead.style.setProperty('display', 'none', 'important')
}

function showNativePage() {
  const pageManager = document.querySelector('#page-manager, ytd-page-manager')
  if (pageManager) pageManager.style.removeProperty('display')

  const masthead = document.querySelector('#masthead-container')
  if (masthead) masthead.style.removeProperty('display')
}

/* ------------------------------------------------------------------ */
/*  Mount / unmount the React overlay                                 */
/* ------------------------------------------------------------------ */
function mountOverlay() {
  if (shadowHost) return

  shadowHost = document.createElement('div')
  shadowHost.id = 'juicy-glassy-root'
  shadowHost.style.cssText =
    'position:fixed;inset:0;z-index:2147483646;overflow:hidden;'
  document.body.appendChild(shadowHost)

  shadowRoot = shadowHost.attachShadow({ mode: 'open' })

  const resetStyle = document.createElement('style')
  resetStyle.textContent = `:host{all:initial;display:block;width:100vw;height:100vh;overflow:hidden;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`
  shadowRoot.appendChild(resetStyle)

  const style = document.createElement('style')
  style.textContent = cssText
  shadowRoot.appendChild(style)

  const rootContainer = document.createElement('div')
  rootContainer.id = 'app-root'
  rootContainer.style.cssText = 'width:100%;height:100%;'
  shadowRoot.appendChild(rootContainer)

  const root = createRoot(rootContainer)
  root.render(<App />)
  reactRoot = root

  // Inject the extractor into MAIN world
  injectExtractor()

  // Safety: if no data arrives within 4s, hide native page anyway (with mock data)
  setTimeout(() => {
    if (!dataReceived) {
      hideNativePage()
    }
  }, 4000)
}

function unmountOverlay() {
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }
  if (shadowHost) {
    shadowHost.remove()
    shadowHost = null
  }
  shadowRoot = null
  dataReceived = false

  showNativePage()
}

function isYouTubeHomepage() {
  try {
    const url = new URL(location.href)
    return url.hostname.includes('youtube.com') && url.pathname === '/'
  } catch {
    return false
  }
}

if (isYouTubeHomepage()) {
  mountOverlay()
}

createObserver(({ isHomepage }) => {
  if (isHomepage && !shadowHost) {
    mountOverlay()
  } else if (!isHomepage && shadowHost) {
    unmountOverlay()
  }
})
