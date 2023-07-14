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
        '2': '2'
      }
    },
  },
  plugins: [],
}

