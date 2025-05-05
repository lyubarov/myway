import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const CuplIcon = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 14.9076C20 7.13269 12 2 12 2C12 2 4 7.13269 4 14.9076C4 16.7199 4.84285 18.4581 6.34314 19.7397C7.84342 21.0211 9.87825 21.7411 12 21.7411C14.1217 21.7411 16.1565 21.0211 17.6568 19.7397C19.1571 18.4581 20 16.7199 20 14.9076Z"
        fill={isDarkMode ? "#434343" : "#E0F0EE"}
        stroke="#25C3B4"
        strokeWidth="2.36893"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.9998 10V16"
        stroke="#25C3B4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M9 13H15"
        stroke="#25C3B4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export const CuplIcon2 = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 14.9076C20 7.13269 12 2 12 2C12 2 4 7.13269 4 14.9076C4 16.7199 4.84285 18.4581 6.34314 19.7397C7.84342 21.0211 9.87825 21.7411 12 21.7411C14.1217 21.7411 16.1565 21.0211 17.6568 19.7397C19.1571 18.4581 20 16.7199 20 14.9076Z"
        fill={isDarkMode ? "#434343" : "#E0F0EE"}
        stroke="#25C3B4"
        strokeWidth="2.36893"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.4525 15C15.4525 15.5556 15.1941 16.0884 14.7342 16.4813C14.2742 16.8742 13.6504 17.0949 13 17.0949"
        stroke="#25C3B4"
        strokeWidth="2.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
