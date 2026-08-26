/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          void: '#030014',
          abyss: '#080420',
          deep: '#0f072e',
          indigo: '#180c45',
          purple: '#28136b',
        },
        cosmos: {
          950: '#030014',
          900: '#080420',
          800: '#0e0728',
          700: '#180b3d',
          600: '#251259',
          500: '#3b1c8a',
        },
        stellar: {
          blue: '#38bdf8',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          purple: '#a855f7',
          violet: '#8b5cf6',
          magenta: '#d946ef',
          pink: '#ec4899',
          rose: '#f43f5e',
          gold: '#fbbf24',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin-reverse 25s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite alternate',
        'float-fast': 'float 3.5s ease-in-out infinite alternate',
        'planet-orbit': 'orbit 40s linear infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'twinkle-slow': 'twinkle 4s ease-in-out infinite',
        'twinkle-fast': 'twinkle 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'meteor': 'meteor 6s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.35), 0 0 40px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(217, 70, 239, 0.6), 0 0 70px rgba(168, 85, 247, 0.4), 0 0 100px rgba(6, 182, 212, 0.25)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-600px)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.4), 0 0 50px rgba(6, 182, 212, 0.15)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.45), 0 0 60px rgba(168, 85, 247, 0.2)',
        'glow-magenta': '0 0 25px rgba(217, 70, 239, 0.45), 0 0 60px rgba(217, 70, 239, 0.2)',
        'glow-gold': '0 0 25px rgba(251, 191, 36, 0.5), 0 0 70px rgba(251, 191, 36, 0.25)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.45), 0 0 60px rgba(16, 185, 129, 0.2)',
        'glass-luxury': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-galaxy': 'radial-gradient(ellipse at 50% 0%, #1a083a 0%, #08031d 50%, #030014 100%)',
        'gradient-card-cosmic': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(168,85,247,0.05) 100%)',
      },
    },
  },
  plugins: [],
}
