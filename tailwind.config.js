/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{html,js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          'bgColor': 'blue',
          'headingColor': 'white',
          'bodyColor': 'black',
          'btnColor': 'red',
        },
        fontFamily: {
          'headingFont': ['Oswald'],
          'bodyFont': ['Poppins'],
        },
      }, 
    },
    plugins: [],
  }