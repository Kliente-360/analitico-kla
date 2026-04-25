/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0fff0',
          100: '#dcffdc',
          200: '#b9ffb9',
          300: '#7fff7f',
          400: '#3fff3f',
          500: '#00dd00',
          600: '#00bb00',
          700: '#009900',
          800: '#007700',
          900: '#005500',
          950: '#003300',
        },
      },
    },
  },
  plugins: [],
}
