/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dcff',
          300: '#7cc0ff',
          400: '#369eff',
          500: '#0b7cee',
          600: '#005fcc',
          700: '#004ba5',
          800: '#054088',
          900: '#0a3671',
        },
      },
    },
  },
  plugins: [],
};
