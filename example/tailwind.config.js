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
    textColor: theme => ({
      ...theme('colors'),
      input: {
        normal: '#636E95',
        active: '#242F57',
        error: '#636E95',
        success: '#636E95',
        disabled: '#B3BBD7',
      },
    }),
    borderColor: theme => ({
      ...theme('colors'),
      input: {
        normal: '#97A0C3',
        active: '#0080FF',
        success: '#04B78A',
        error: '#FA5087',
        disabled: '#E2E7F4',
      },
    }),
    backgroundColor: theme => ({
      ...theme('colors'),
      input: {
        normal: '#FAFCFE',
        disabled: '#ECEFF8',
        hovered: '#EFF7FF',
      },
    }),
    extend: {
      colors: {
        primary: {
          lightest: '#B5B3FF',
          lighter: '#9390F3',
          base: '#6863FB',
          darker: '#4540BB',
          gradient: 'rgb(61, 169, 255)',
        },
        success: {
          lightest: '#8DEAD2',
          lighter: '#59DDBB',
          base: '#1FD0A3',
          darker: '#04B78A',
          gradient: 'rgb(71, 212, 57)',
        },
        info: {
          lightest: '#8FC6FE',
          lighter: '#56AAFF',
          base: '#369AFE',
          darker: '#0080FF',
          gradient: 'rgb(34, 211, 238)',
        },
        danger: {
          lightest: '#FF95B7',
          lighter: '#FE729F',
          base: '#FA5087',
          darker: '#EF2F6E',
          gradient: 'rgb(236, 72, 153)',
        },
        warning: {
          lightest: '#FFEAA7',
          lighter: '#FFD655',
          base: '#FFC800',
          darker: '#F2A626',
          gradient: 'rgb(250, 204, 21)',
        },
        'color-inherit': 'inherit',
      },
      maxWidth: {
        '9xl': '90rem',
      },
      borderRadius: {
        input: '10px',
        button: '8px',
      },
      minHeight: {
        input: '42px',
        'button-xs': '34px',
        'button-sm': '38px',
        'button-base': '42px',
        'button-lg': '46px',
        'button-xl': '48px',
        'button-2xl': '52px',
      },
      minWidth: {
        'button-xs': '84px',
        'button-sm': '94px',
        'button-base': '100px',
        'button-lg': '110px',
        'button-xl': '118px',
        'button-2xl': '134px',
      },
      backgroundImage: theme => ({
        'input-success': `url("data:image/svg+xml,%3Csvg width='16' height='11' viewBox='0 0 16 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 1L5.7827 10L1 5.43026' stroke='%2304B78A' stroke-opacity='0.8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A")`,
        'input-error': `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L14.5 14.5' stroke='%23FA5087' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15 1L1.5 14.5' stroke='%23FA5087' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A")`,

        'primary-linear-gradient': `linear-gradient(90deg,rgba(61, 169, 255, 1) 0%,rgba(2, 109, 255, 1) 100%);`,
        'info-linear-gradient': `linear-gradient(90deg,rgba(34, 211, 238, 1) 0%,rgba(14, 165, 237, 1) 100%);`,
        'success-linear-gradient': `linear-gradient(90deg,rgba(71, 212, 57, 1) 0%,rgba(9, 208, 26, 1) 100%);`,
        'danger-linear-gradient': `linear-gradient(90deg,rgba(236, 72, 153, 1) 0%,rgba(244, 63, 94, 1) 100%);`,
        'warning-linear-gradient': `linear-gradient(90deg,rgba(250, 204, 21, 1) 0%,rgba(249, 115, 22, 1) 100%);`,

        'primary-inverse-gradient': `linear-gradient(-90deg,rgba(61, 169, 255, 1) 0%,rgba(2, 109, 255, 1) 100%);`,
        'info-inverse-gradient': `linear-gradient(-90deg,rgba(34, 211, 238, 1) 0%,rgba(14, 165, 237, 1) 100%);`,
        'success-inverse-gradient': `linear-gradient(-90deg,rgba(71, 212, 57, 1) 0%,rgba(9, 208, 26, 1) 100%);`,
        'danger-inverse-gradient': `linear-gradient(-90deg,rgba(236, 72, 153, 1) 0%,rgba(244, 63, 94, 1) 100%);`,
        'warning-inverse-gradient': `linear-gradient(-90deg,rgba(250, 204, 21, 1) 0%,rgba(249, 115, 22, 1) 100%);`,
      }),
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      borderColor: ['disabled'],
      opacity: ['disabled'],
      backgroundImage: ['hover', 'disabled'],
    },
  },
  plugins: [],
};
