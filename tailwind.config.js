/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter',          'system-ui',    'sans-serif'],
        display: ['Fraunces',       'Georgia',       'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#e6efff',
          100: '#e6efff',
          200: '#c0d4f7',
          300: '#6e9bdb',
          400: '#3a72c4',
          500: '#0f4cab',
          600: '#0a3275',
          700: '#0b3d8c',
          800: '#0a3275',
          900: '#071f50',
          950: '#040f2a',
        },
        'accent-up':   '#d04a3b',
        'accent-down': '#1f7a5a',
        'accent-warn': '#b87514',
        ink: {
          900: '#0f1722',
          700: '#2c3848',
          500: '#5a6779',
          400: '#8390a3',
          300: '#b3bccb',
          200: '#d8dee8',
          100: '#eceff5',
          50:  '#f6f8fb',
        },
        paper: '#ffffff',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(15, 23, 34, 0.05)',
        md: '0 4px 14px rgba(15, 23, 34, 0.08)',
        lg: '0 8px 30px rgba(15, 23, 34, 0.12)',
      },
    },
  },
  plugins: [],
}
