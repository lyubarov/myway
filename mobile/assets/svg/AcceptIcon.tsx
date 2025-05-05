import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const AcceptIcon = ({ color }: { color: string }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        fill="white"
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.40015 12.8994L11.0183 15.5994C12.2503 12.0604 13.2764 10.5074 15.6001 8.39941"
        stroke={color}
        strokeWidth="2.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AcceptIcon;
