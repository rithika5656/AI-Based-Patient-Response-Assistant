/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
          DEFAULT: '#102a43',
        },
        accent: {
          50:  '#e6f6ff',
          100: '#bae3ff',
          200: '#7cc4fa',
          300: '#47a3f3',
          400: '#2186eb',
          500: '#0967d2',
          600: '#0552b5',
          700: '#03449e',
          DEFAULT: '#2186eb',
        },
        success: {
          50:  '#e3f9e5',
          400: '#31c48d',
          500: '#0e9f6e',
          600: '#057a55',
          DEFAULT: '#0e9f6e',
        },
        warning: {
          50:  '#fffbeb',
          400: '#fbbf24',
          500: '#f59e0b',
          DEFAULT: '#f59e0b',
        },
      },
      boxShadow: {
        'soft':  '0 2px 15px -3px rgba(10, 25, 41, 0.08), 0 10px 20px -2px rgba(10, 25, 41, 0.04)',
        'glow':  '0 0 24px rgba(33, 134, 235, 0.18)',
        'card':  '0 1px 3px rgba(10, 25, 41, 0.06), 0 8px 24px rgba(10, 25, 41, 0.05)',
        'dark':  '0 4px 24px rgba(10, 25, 41, 0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.35s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'pulse-soft':    'pulseSoft 2s ease-in-out infinite',
        'bounce-dot':    'bounceDot 1.4s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
