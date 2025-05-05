import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const NextIcon = () => {
  return (
    <Svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <Path
        d="M1 13L7 7L1 1"
        stroke="#B1BFBD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const NextIconBlack = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  return (
    <Svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <Path
        d="M1 13L7 7L1 1"
        stroke={isDarkMode ? "white" : "black"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
