import daisyui from 'daisyui';
import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}',"./node_modules/flowbite/**/*.js"
],
  theme: {
    screens: {
      'mobile': '320px',
      'laptop': '1024px',
      'labtop-L': '1440px'
    },
    extend: {
      fontFamily: {
        itim: "'Itim', cursive",
        istok: "'Istok Web', sans-serif",
        Saira: "'Saira Stencil One'",
      },
    },
    backgroundBoxColors: {
      'correct-color': '#62EC70',
      'incorrect-color': '#FC6C6C',
      'white-color': '#FAEDE5'
    },
  },
  plugins: [daisyui, flowbite],
}
