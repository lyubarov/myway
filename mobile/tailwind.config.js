module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ["Roboto"],
      },
      colors: {
        black: "#000000",
        blackText: "#00100E",
        borderGrey: "#CCCCCC",
        darkBlack: "#161616",
        darkGrey: "#B1BFBD",
        darkText: "#727877",
        darkStroke: "#606060",
        green: "#25C3B4",
        lightBack: "#F4F4F4",
        darkTheme: "#171717",
        darkCard:"#212121",
        secondary:"#272727",
        darkCardBorder: "#434343",

        lightGreen: "#E0F0EE",
        lightLightGray:"#e5e5e5",
        lightGreenOption:"#25C3B433",
        customGray: "#A0AEC0",
        lightGrey: "#E5E5E5",
        greyGrey:'#CBCBCB',
        red: "#FF5555",
        white: "#FDFEFE",
        greenStroke:"#deeceb"
        
      },
     
    },
  },
  plugins: [],
};
