/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif']
    },
    extend: {
      colors: {
        'primary': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
          dark: {
            100: '#e6c39a',
            200: '#cc975e',
            800: '#4d4033',
            900: '#332b22'
          }
        },
        'secondary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          dark: {
            100: '#85b2e6',
            200: '#769dcc',
            300: '#4e87cc',
            400: '#4476b3',
            500: '#3B5F8D',
            600: '#254366',
            700: '#1c334d',
            800: '#293137',
            900: '#1d2126'
          }
        }
      }
    }
  },
  plugins: [],
}
