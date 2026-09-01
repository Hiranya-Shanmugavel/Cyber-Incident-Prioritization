/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080C14',
        card: '#111827',
        cardSecondary: '#151E2E',
        primary: '#4d8dff',
        danger: '#ff4d61',
        warning: '#ff9f43',
        medium: '#f59e0b',
        success: '#32d583',
        muted: '#7d8799',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
