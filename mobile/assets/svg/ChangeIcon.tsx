import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ChangeIcon = ({
  size,
  isDarkMode,
}: {
  size: string;
  isDarkMode: boolean;
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.4455 19.0714L19.8966 10.1232C21.4676 8.63586 21.3461 6.0029 19.6287 4.31454C17.9517 2.66594 15.394 2.55266 13.9157 4.0615L4.72229 13.4453C4.72229 13.4453 6.75884 14.2555 8.19005 15.6624C9.62126 17.0693 10.4455 19.0714 10.4455 19.0714Z"
        fill={isDarkMode ? "#161616" : "#E5E5E5"}
        stroke={isDarkMode ? "#E5E5E5" : "#161616"}
        strokeWidth="2.19159"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.98278 20.7417L10.4399 19.0796C10.4399 19.0796 9.61759 17.0769 8.18767 15.6686C6.75776 14.2603 4.72196 13.4482 4.72196 13.4482L3.02429 19.7749C2.8764 20.326 3.42963 20.884 3.98278 20.7417Z"
        fill={isDarkMode ? "#161616" : "#E5E5E5"}
        stroke={isDarkMode ? "#E5E5E5" : "#161616"}
        strokeWidth="2.19159"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChangeIcon;
