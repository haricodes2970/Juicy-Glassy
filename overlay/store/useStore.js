import { create } from 'zustand'

const initialState = {
  youtubeData: {
    videos: [],
    featuredVideo: null,
    categories: [],
    subscriptions: [],
  },
  ambientColor: '108, 99, 255',
  ui: {
    sidebarCollapsed: false,
    overlayActive: false,
    focusMode: false,
  },
  settings: {
    apiKey: '',
    mode: 'focus',
    notifications: true,
  },
}

export const useStore = create((set) => ({
  ...initialState,

  setVideos: (videos) =>
    set((state) => ({ youtubeData: { ...state.youtubeData, videos } })),

  appendVideos: (newVideos) =>
    set((state) => {
      const currentVideos = state.youtubeData.videos || []
      const combined = [...currentVideos, ...newVideos]
      // Deduplicate by videoId
      const uniqueVideos = combined.filter(
        (v, index, self) => index === self.findIndex((t) => t.videoId === v.videoId)
      )
      return { youtubeData: { ...state.youtubeData, videos: uniqueVideos } }
    }),

  setFeaturedVideo: (video) =>
    set((state) => ({ youtubeData: { ...state.youtubeData, featuredVideo: video } })),

  setYouTubeData: ({ videos, featured, subscriptions }) =>
    set((state) => ({
      youtubeData: {
        videos,
        featuredVideo: featured,
        categories: [],
        subscriptions: subscriptions || state.youtubeData.subscriptions || [],
      },
    })),

  setAmbientColor: (color) => set({ ambientColor: color }),

  toggleSidebar: () =>
    set((state) => ({ ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed } })),

  setOverlayActive: (active) =>
    set((state) => ({ ui: { ...state.ui, overlayActive: active } })),

  toggleFocusMode: () =>
    set((state) => ({ ui: { ...state.ui, focusMode: !state.ui.focusMode } })),

  setApiKey: (apiKey) =>
    set((state) => ({ settings: { ...state.settings, apiKey } })),

  setMode: (mode) =>
    set((state) => ({ settings: { ...state.settings, mode } })),

  setNotifications: (notifications) =>
    set((state) => ({ settings: { ...state.settings, notifications } })),

  reset: () => set(initialState),
}))
