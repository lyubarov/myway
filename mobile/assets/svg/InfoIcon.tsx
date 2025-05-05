import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const InfoIcon = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 22.75C18.3848 22.75 22.75 18.3848 22.75 13C22.75 7.61522 18.3848 3.25 13 3.25C7.61522 3.25 3.25 7.61522 3.25 13C3.25 18.3848 7.61522 22.75 13 22.75Z"
        fill="rgba(255, 255, 255, 0.2)"
        stroke={isDarkMode ? "black" : "#FDFEFE"}
        strokeWidth="2.34"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 17.3335V13.502V17.3335Z"
        fill={isDarkMode ? "black" : "#FDFEFE"}
      />
      <Path
        d="M13 17.3335V13.502"
        stroke={isDarkMode ? "black" : "#F4F4F4"}
        strokeWidth="2.53673"
        stroke-linecap="round"
      />
      <Path
        d="M13.8336 9.26236C13.8336 8.80205 13.4604 8.4289 13.0001 8.4289C12.5398 8.4289 12.1666 8.80205 12.1666 9.26236C12.1666 9.72268 12.5398 10.0958 13.0001 10.0958C13.4604 10.0958 13.8336 9.72268 13.8336 9.26236Z"
        fill={isDarkMode ? "black" : "#FDFEFE"}
        stroke={isDarkMode ? "black" : "#F4F4F4"}
        strokeWidth="1.69115"
      />
    </Svg>
  );
};

export const InfoIconBlack = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 22.75C18.3848 22.75 22.75 18.3848 22.75 13C22.75 7.61522 18.3848 3.25 13 3.25C7.61522 3.25 3.25 7.61522 3.25 13C3.25 18.3848 7.61522 22.75 13 22.75Z"
        fill="rgba(255, 255, 255, 0.2)"
        stroke="black"
        strokeWidth="2.34"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13 17.3335V13.502V17.3335Z" fill="#FDFEFE" />
      <Path
        d="M13 17.3335V13.502"
        stroke="black"
        strokeWidth="2.53673"
        stroke-linecap="round"
      />
      <Path
        d="M13.8336 9.26236C13.8336 8.80205 13.4604 8.4289 13.0001 8.4289C12.5398 8.4289 12.1666 8.80205 12.1666 9.26236C12.1666 9.72268 12.5398 10.0958 13.0001 10.0958C13.4604 10.0958 13.8336 9.72268 13.8336 9.26236Z"
        fill="black"
        stroke="black"
        strokeWidth="1.69115"
      />
    </Svg>
  );
};
