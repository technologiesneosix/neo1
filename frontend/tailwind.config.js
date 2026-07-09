/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blue-violet used for gradient buttons, waves and solid brand blocks
        primary: {
          50: '#eef0ff',
          100: '#dfe3ff',
          200: '#c5cbff',
          300: '#a2aaff',
          400: '#7d80fb',
          500: '#5d5cf2',
          600: '#4c3de4',
          700: '#4130c9',
          800: '#362aa2',
          900: '#302a80',
          950: '#1e194b',
        },
        // Brighter blue used at the right edge of gradients
        azure: {
          400: '#5a8bff',
          500: '#3d64ff',
          600: '#2b4fe8',
        },
        // Cyan-blue accent used for active nav links and icons
        accent: {
          400: '#2ab6f1',
          500: '#0088cc',
          600: '#0072ab',
        },
        // Near-black surfaces (contact section, footers)
        ink: {
          800: '#25272e',
          900: '#1b1d23',
          950: '#141519',
        },
        // Page background tints
        mist: {
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e8ebf1',
        },
        body: '#777c87',
        heading: '#212529',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"PT Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['3.375rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-3': ['2rem', { lineHeight: '1.25', fontWeight: '700' }],
        label: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.25em', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 6px 25px rgba(23, 30, 60, 0.08)',
        'card-hover': '0 14px 40px rgba(23, 30, 60, 0.14)',
        header: '0 2px 18px rgba(23, 30, 60, 0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #4130c9 0%, #3d64ff 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #5d5cf2 0%, #2ab6f1 100%)',
      },
      borderRadius: {
        btn: '4px',
      },
      maxWidth: {
        container: '75rem',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(8px, -12px) scale(1.03)' },
          '66%': { transform: 'translate(-8px, 8px) scale(0.98)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 24s linear infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'blob-drift': 'blob-drift 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
