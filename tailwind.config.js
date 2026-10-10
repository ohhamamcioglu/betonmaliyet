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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36b0fa',
          500: '#0c94eb',
          600: '#0076c9',
          700: '#025ea3',
          800: '#065086',
          900: '#0b436f',
          950: '#072b4a',
        },
        concrete: {
          50: '#f6f7f8',
          100: '#eceef0',
          200: '#d5dae0',
          300: '#b1bcc7',
          400: '#8696a7',
          500: '#677789',
          600: '#526071',
          700: '#434e5d',
          800: '#3a424e',
          900: '#343a43',
          950: '#21252b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
