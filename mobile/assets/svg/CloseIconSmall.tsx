import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CloseIconSmall = ({ color }: { color: string }) => {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 5L11.7742 12.2258L5 19"
        stroke={color}
        strokeWidth="2.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 19L11.7742 11.7742L5 5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CloseIconSmall;
