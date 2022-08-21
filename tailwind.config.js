const plugin = require('tailwindcss/plugin')

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        in: {
          '0%': { width: '0', left: '0', right: 'auto' },
          '100%': { width: '100%', left: '0', right: 'auto' }
        },
        out: {
          '0%': { width: '100%', left: 'auto', right: '0' },
          '100%': { width: '0', left: 'auto', right: '0' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--gradient-color-stops))'
      },
      colors: {
        'l-bg': '#D3D3D1',
        'd-bg': '#141616',
        'l-primary': '#81B622',
        'd-primary': '#8bc225',
        comment: '#7D7F80',
        languageColor: 'var(--languageColor)'
      },
      height: {
        'list-indicator': 'var(--list-indicator)'
      },
      inset: {
        list: 'var(--list-left)'
      }
    },
    screens: {
      xl: { max: '1279px' },
      lg: { max: '1024px' },
      md: { max: '767px' },
      sm: { max: '639px' }
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'translate-z': value => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
          }) // this is actual CSS
        },
        { values: theme('translate') }
      )
    })
  ]
}
