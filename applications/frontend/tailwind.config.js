/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        pixel: {
          DEFAULT: 'var(--pixel-size)',
          2: 'calc(var(--pixel-size) * 2)',
        },
      },
      borderWidth: {
        pixel: 'var(--pixel-size)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          highlight: 'hsl(var(--primary-highlight))',
          shadow: 'hsl(var(--primary-shadow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          highlight: 'hsl(var(--destructive-highlight))',
          shadow: 'hsl(var(--destructive-shadow))',
        },
        disabled: {
          DEFAULT: 'hsl(var(--disabled))',
          foreground: 'hsl(var(--disabled-foreground))',
          highlight: 'hsl(var(--disabled-highlight))',
          shadow: 'hsl(var(--disabled-shadow))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          disabled: 'hsl(var(--border-disabled))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default tailwindConfig
