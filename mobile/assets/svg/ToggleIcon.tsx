import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const ToggleIcon = ({ isOpen, error }) => {
  return (
    <Svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      style={{
        transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
      }}
    >
      <Path
        d="M1.33337 3L6.33337 8L11.3334 3"
        stroke={error ? "red" : "#A0AEC0"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const ToggleIconOptions = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Svg
      width="12"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      style={{
        transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
      }}
    >
      <Path
        d="M1.33337 3L6.33337 8L11.3334 3"
        stroke="#A0AEC0"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
