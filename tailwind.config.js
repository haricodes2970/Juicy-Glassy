/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './overlay/**/*.{js,jsx}',
    './content/**/*.{js,jsx}',
    './popup/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
          surface: 'rgba(255, 255, 255, 0.03)',
        },
        accent: {
          primary: '#6C63FF',
          secondary: '#FF6584',
          success: '#2ED573',
          warning: '#FFA502',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#12121A',
          card: '#1A1A26',
        },
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(108, 99, 255, 0.3)',
        'glow-secondary': '0 0 20px rgba(255, 101, 132, 0.3)',
      },
      borderRadius: {
        glass: '16px',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
