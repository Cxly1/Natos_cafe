import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:           '#130a05',
        'bg-2':       '#1d1008',
        'bg-card':    '#24150b',
        accent:       '#f07a2b',
        'accent-dim': '#b9521f',
        'accent-dark':'#5a2814',
        text:         '#f6ead3',
        'text-muted': '#a8927a',
        border:       'rgba(240,122,43,0.14)',
        saffron:      '#f5b841',
        chile:        '#c8321a',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
