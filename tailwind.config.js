/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sun: '#FFC93C',
        sky: '#4EC5F1',
        coral: '#FF6F61',
        leaf: '#6BCB77',
        grape: '#9B5DE5',
        paper: '#FFF8EC',
        ink: '#2B2140',
        chalk: '#F4F1E6'
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        blob: '42% 58% 65% 35% / 45% 40% 60% 55%'
      },
      boxShadow: {
        sticker: '0 8px 0 rgba(43,33,64,0.15), 0 12px 24px rgba(43,33,64,0.12)',
        stickerPress: '0 3px 0 rgba(43,33,64,0.15), 0 6px 12px rgba(43,33,64,0.12)'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' }
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(.2,1.4,.4,1)',
        wiggle: 'wiggle 0.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
