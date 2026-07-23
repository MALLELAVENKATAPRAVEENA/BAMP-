/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7cc8fc',
          400: '#38abf9',
          500: '#0e90e9',
          600: '#0272c6',
          700: '#035ba1',
          800: '#074e85',
          900: '#0c426e',
          950: '#082a4a',
        },
        darkbg: {
          DEFAULT: '#0b111e',
          card: '#151f32',
          border: '#23334f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
