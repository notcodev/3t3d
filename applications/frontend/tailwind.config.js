/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        pixel: {
          DEFAULT: 'var(--ui-pixel-size)',
          2: 'calc(var(--ui-pixel-size) * 2)',
          3: 'calc(var(--ui-pixel-size) * 3)',
          4: 'calc(var(--ui-pixel-size) * 4)',
          6: 'calc(var(--ui-pixel-size) * 6)',
          8: 'calc(var(--ui-pixel-size) * 8)',
        },
      },
      borderWidth: {
        pixel: 'var(--ui-pixel-size)',
      },
      colors: {
        white: 'hsl(var(--ui-color-white))',
        black: 'hsl(var(--ui-color-black))',
        dark: {
          0: 'hsl(var(--ui-color-dark-0))',
          1: 'hsl(var(--ui-color-dark-1))',
          2: 'hsl(var(--ui-color-dark-2))',
          3: 'hsl(var(--ui-color-dark-3))',
          4: 'hsl(var(--ui-color-dark-4))',
          5: 'hsl(var(--ui-color-dark-5))',
          6: 'hsl(var(--ui-color-dark-6))',
          7: 'hsl(var(--ui-color-dark-7))',
          8: 'hsl(var(--ui-color-dark-8))',
          9: 'hsl(var(--ui-color-dark-9))',
        },
        gray: {
          0: 'hsl(var(--ui-color-gray-0))',
          1: 'hsl(var(--ui-color-gray-1))',
          2: 'hsl(var(--ui-color-gray-2))',
          3: 'hsl(var(--ui-color-gray-3))',
          4: 'hsl(var(--ui-color-gray-4))',
          5: 'hsl(var(--ui-color-gray-5))',
          6: 'hsl(var(--ui-color-gray-6))',
          7: 'hsl(var(--ui-color-gray-7))',
          8: 'hsl(var(--ui-color-gray-8))',
          9: 'hsl(var(--ui-color-gray-9))',
        },
        primary: {
          filled: {
            DEFAULT: 'hsl(var(--ui-primary-color-filled))',
            hover: 'hsl(var(--ui-primary-color-filled-hover))',
          },
          light: {
            DEFAULT: 'hsl(var(--ui-primary-color-light))',
            hover: 'hsl(var(--ui-primary-color-light-hover))',
          },
          dark: {
            DEFAULT: 'hsl(var(--ui-primary-color-dark))',
            hover: 'hsl(var(--ui-primary-color-dark-hover))',
          },
        },
        destructive: {
          filled: {
            DEFAULT: 'hsl(var(--ui-destructive-color-filled))',
            hover: 'hsl(var(--ui-destructive-color-filled-hover))',
          },
          light: {
            DEFAULT: 'hsl(var(--ui-destructive-color-light))',
            hover: 'hsl(var(--ui-destructive-color-light-hover))',
          },
          dark: {
            DEFAULT: 'hsl(var(--ui-destructive-color-dark))',
            hover: 'hsl(var(--ui-destructive-color-dark-hover))',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default tailwindConfig
