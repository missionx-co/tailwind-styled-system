const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['IBM Plex Mono', 'monospace'],
    },
    colors: {
      gray: colors.blueGray,
      red: colors.rose,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.emerald,
      teal: colors.teal,
      blue: colors.blue,
      indigo: colors.indigo,
      pink: colors.pink,
      black: colors.black,
      white: colors.white,
      cyan: colors.cyan,
    },
    extend: {
      colors: {
        primary: {
          lightest: '#B5B3FF',
          lighter: '#9390F3',
          base: '#6863FB',
          darker: '#4540BB',
        },
        success: {
          lightest: '#8DEAD2',
          lighter: '#59DDBB',
          base: '#1FD0A3',
          darker: '#04B78A',
        },
        info: {
          lightest: '#8FC6FE',
          lighter: '#56AAFF',
          base: '#369AFE',
          darker: '#0080FF',
        },
        danger: {
          lightest: '#FF95B7',
          lighter: '#FE729F',
          base: '#FA5087',
          darker: '#EF2F6E',
        },
        warning: {
          lightest: '#FFEAA7',
          lighter: '#FFD655',
          base: '#FFC800',
          darker: '#F2A626',
        },
      },
      maxWidth: {
        '9xl': '90rem',
      },
      screens: {
        print: { raw: '(orientation: portrait)' },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
