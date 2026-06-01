let callback = null
let mutationObserver = null

function handleNavigation() {
  let url
  try {
    url = new URL(location.href)
  } catch {
    return
  }
  const isHomepage = url.hostname.includes('youtube.com') && url.pathname === '/'
  if (callback) callback({ isHomepage, url: url.href })
}

export function createObserver(cb) {
  callback = cb

  document.addEventListener('yt-navigate-finish', handleNavigation)

  mutationObserver = new MutationObserver(() => {
    if (document.querySelector('ytd-app')) {
      handleNavigation()
    }
  })

  const target = document.querySelector('ytd-app') || document.body
  mutationObserver.observe(target, {
    childList: true,
    subtree: true,
  })
}

export function destroyObserver() {
  document.removeEventListener('yt-navigate-finish', handleNavigation)
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
  callback = null
}
