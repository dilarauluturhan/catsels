/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        narnoor: ['Narnoor', 'serif']
      },
      height: {
        '30' : '30rem'
      },
      zIndex : {
        '1' : '1',
        '2': '2',
        '5' : '5'
      }
    },
  },
  plugins: [],
}

