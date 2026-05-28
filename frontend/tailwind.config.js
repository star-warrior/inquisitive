/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sora: ['var(--font-sora)', 'sora Fallback', 'sans-serif'],
      },
      colors: {
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          hover: 'var(--glass-hover)',
        },
        btn: {
          primary: {
            bg: 'var(--btn-primary-bg)',
            text: 'var(--btn-primary-text)',
            hover: 'var(--btn-primary-hover)',
          },
          secondary: {
            bg: 'var(--btn-secondary-bg)',
            border: 'var(--btn-secondary-border)',
            hover: 'var(--btn-secondary-hover)',
          }
        }
      }
    },
  },
  plugins: [],
}
