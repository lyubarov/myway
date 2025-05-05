import * as React from "react";
import Svg, { Path } from "react-native-svg";

const NotificationIcon = ({
  isNot,
  isDarkMode,
}: {
  isNot: boolean;
  isDarkMode?: boolean;
}) => {
  return (
    <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <Path
        d="M8.62848 6.43954C9.53019 5.53783 10.7532 5.03125 12.0284 5.03125C13.3036 5.03125 14.5266 5.53783 15.4283 6.43954C16.33 7.34127 16.8366 8.56425 16.8366 9.83948C16.8366 10.9388 17.0309 11.8031 17.3182 12.4787C17.6065 13.1565 18.3998 13.3877 18.9918 13.826C19.8753 14.4801 19.7045 15.8798 18.9696 16.4232C18.9696 16.4232 17.783 17.4506 12.0284 17.4506C6.27388 17.4506 5.08724 16.4232 5.08724 16.4232C4.35228 15.8798 4.18145 14.4801 5.06507 13.826C5.65703 13.3877 6.45037 13.1565 6.73858 12.4787C7.02587 11.8031 7.22019 10.9388 7.22019 9.83948C7.22019 8.56425 7.72676 7.34127 8.62848 6.43954Z"
        fill={isDarkMode ? "#161616" : "#E5E5E5"}
        stroke={isDarkMode ? "#fff" : "#161616"}
        strokeWidth="2.06988"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.3248 20.1523C10.6737 20.8028 11.3603 21.2454 12.1501 21.2454C12.94 21.2454 13.6265 20.8028 13.9754 20.1523"
        stroke={isDarkMode ? "#fff" : "#161616"}
        strokeWidth="2.06988"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      {isNot && (
        <Path
          d="M20 9C22.2092 9 24 7.20915 24 5C24 2.79086 22.2092 1 20 1C17.7909 1 16 2.79086 16 5C16 7.20915 17.7909 9 20 9Z"
          fill="#25C3B4"
          stroke="#161616"
          strokeWidth="1.5"
          stroke-linecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};

export default NotificationIcon;
