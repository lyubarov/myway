import React from "react";
import Svg, { Path } from "react-native-svg";

export const ArrowBack = () => {
  return (
    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none">
      <Path
        d="M10 2L2 10L10 18"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const ArrowBackWhite = () => {
  return (
    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none">
      <Path
        d="M10 2L2 10L10 18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
