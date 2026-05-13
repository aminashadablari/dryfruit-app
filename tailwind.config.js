/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0f1e35', 800: '#1a2f4e', 700: '#1e3a5f' },
        teal: { 600: '#0e7c6a', 500: '#12a08a', 400: '#16c4ab' },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
