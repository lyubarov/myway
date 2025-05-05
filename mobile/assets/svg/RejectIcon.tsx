import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const RejectIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        fill="#FECACA"
        fill-opacity="0.2"
        stroke="#FF5555"
        strokeWidth={2.16}
      />
      <Path
        d="M19.1068 6.42082C19.5286 5.99906 19.5286 5.31525 19.1068 4.89347C18.6851 4.47171 18.0014 4.47171 17.5796 4.89347L19.1068 6.42082ZM4.90079 17.5723C4.47903 17.9939 4.47903 18.6778 4.90079 19.0996C5.32256 19.5213 6.00638 19.5213 6.42814 19.0996L4.90079 17.5723ZM17.5796 4.89347L4.90079 17.5723L6.42814 19.0996L19.1068 6.42082L17.5796 4.89347Z"
        fill="#FF5555"
        strokeWidth="2.16"
      />
    </Svg>
  );
};

export default RejectIcon;
