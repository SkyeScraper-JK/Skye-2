/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#016A5D',
          700: '#0f4c48',
          900: '#134e4a',
        },
        accent: {
          gold: '#CBA135',
          'gold-light': '#e6c971',
        },
        neutral: {
          50: '#F8F9F9',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          500: '#777777',
          700: '#374151',
          800: '#333333',
          900: '#111827',
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.2em',
      }
    },
  },
  plugins: [],
};