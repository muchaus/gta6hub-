import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#e8c84a',
        base: '#0a0a0f',
        surface: '#13131d',
        elevated: '#0d0d14',
        border: '#1e1e2e',
      },
    },
  },
  plugins: [],
}

export default config
