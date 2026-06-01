import { create } from 'zustand'

const initialState = {
  youtubeData: {
    videos: [],
    featuredVideo: null,
    categories: [],
  },
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

  setFeaturedVideo: (video) =>
    set((state) => ({ youtubeData: { ...state.youtubeData, featuredVideo: video } })),

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
