/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        blackText: "#212529",
        contentBg: "#222222",
        green: "#25C3B4",
        greenStroke: "#f3f3f3",
        darkBlack: "#161616",
        darkGrey: "#B1BFBD",
        darkText: "#727877",
        darkStroke: "#606060",
        lightGreen: "#E0F0EE",
        lightGrey: "#E5E5E5",
        red: "#FF5555",
        white: "#FDFEFE",
        primaryStart: '#0b5951',
        primaryEnd: '#19dcc9',
        LightBack:'#F4F4F4',
      },
      width: {
        'scrollbar': '12px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
