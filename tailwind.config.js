/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          red: {
            light: '#ffb3ba',
            DEFAULT: '#ff6b6b',
            dark: '#ee5253',
          },
          blue: {
            light: '#bae1ff',
            DEFAULT: '#4facfe',
            dark: '#00f2fe',
          }
        }
      }
    },
  },
  plugins: [],
}
