import cssText from '../overlay/index.css?inline'
import { createRoot } from 'react-dom/client'
import App from '../overlay/App'
import { createObserver, destroyObserver } from './observer'
import { extractYouTubeData } from './extractor'
import { useStore } from '../overlay/store/useStore'

let reactRoot = null
let shadowHost = null
let shadowRoot = null
let debounceTimer = null

function injectData() {
  const data = extractYouTubeData()
  useStore.getState().setYouTubeData(data)
}

function debouncedInjectData() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    injectData()
  }, 250)
}

function mountOverlay() {
  if (shadowHost) return

  const pageManager = document.querySelector('#page-manager, ytd-page-manager')
  if (pageManager) pageManager.style.setProperty('display', 'none', 'important')

  const masthead = document.querySelector('#masthead-container')
  if (masthead) masthead.style.setProperty('display', 'none', 'important')

  shadowHost = document.createElement('div')
  shadowHost.id = 'juicy-glassy-root'
  shadowHost.style.cssText = 'position:fixed;inset:0;z-index:2147483646;overflow:hidden;'
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

  injectData() // Initial inject without debounce

  const root = createRoot(rootContainer)
  root.render(<App />)
  reactRoot = root
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
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  const pageManager = document.querySelector('#page-manager, ytd-page-manager')
  if (pageManager) pageManager.style.removeProperty('display')

  const masthead = document.querySelector('#masthead-container')
  if (masthead) masthead.style.removeProperty('display')
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
  } else if (isHomepage && shadowHost) {
    debouncedInjectData()
  } else if (!isHomepage && shadowHost) {
    unmountOverlay()
  }
})
