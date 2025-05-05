import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const AddIcon = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        fill={isDarkMode ? "black" : "#E0F0EE"}
        stroke="#25C3B4"
        strokeWidth="2.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8V16"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M8 12H16"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default AddIcon;
