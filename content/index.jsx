import cssText from '../overlay/index.css?inline'
import { createRoot } from 'react-dom/client'
import App from '../overlay/App'
import { createObserver, destroyObserver } from './observer'

let reactRoot = null
let shadowHost = null

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

  const shadow = shadowHost.attachShadow({ mode: 'open' })

  const resetStyle = document.createElement('style')
  resetStyle.textContent = `:host{all:initial;display:block;width:100vw;height:100vh;overflow:hidden;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`
  shadow.appendChild(resetStyle)

  const style = document.createElement('style')
  style.textContent = cssText
  shadow.appendChild(style)

  const rootContainer = document.createElement('div')
  rootContainer.id = 'app-root'
  rootContainer.style.cssText = 'width:100%;height:100%;'
  shadow.appendChild(rootContainer)

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
  } else if (!isHomepage && shadowHost) {
    unmountOverlay()
  }
})
