/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#000000',
          900: '#050201',
          800: '#0a0503',
          700: '#140905',
          600: '#1f0d07',
          500: '#2d140a',
        },
        accretion: {
          fire: '#ff6b00',
          orange: '#f97316',
          amber: '#f59e0b',
          gold: '#fbbf24',
          sun: '#fef08a',
          crimson: '#dc2626',
          violet: '#9333ea',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'accretion-spin': 'accretionSpin 24s linear infinite',
        'accretion-spin-reverse': 'accretionSpinRev 30s linear infinite',
        'photon-pulse': 'photonPulse 3s ease-in-out infinite alternate',
        'gravity-wave': 'gravityWave 6s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3.5s linear infinite',
      },
      keyframes: {
        accretionSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        accretionSpinRev: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        photonPulse: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        gravityWave: {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.04) translate3d(0, -6px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-accretion': '0 0 25px rgba(249, 115, 22, 0.45), 0 0 60px rgba(251, 191, 36, 0.2)',
        'glow-photon': '0 0 30px rgba(251, 191, 36, 0.5), 0 0 70px rgba(249, 115, 22, 0.25)',
        'glow-void': '0 0 40px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.95)',
        'card-obsidian': '0 8px 30px -5px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(251, 191, 36, 0.15)',
      },
    },
  },
  plugins: [],
}
