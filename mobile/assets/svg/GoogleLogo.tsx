import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const GoogleLogo = () => {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_138_5579)" fillRule="evenodd" clipRule="evenodd">
        <Path
          d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.642h6.458a5.52 5.52 0 01-2.394 3.622v3.01h3.878c2.269-2.088 3.578-5.165 3.578-8.82z"
          fill="#4285F4"
        />
        <Path
          d="M12 24c3.24 0 5.956-1.075 7.942-2.907l-3.878-3.011c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.77-2.11-6.715-4.947H1.276v3.109A11.995 11.995 0 0012 23.999z"
          fill="#13B86B"
        />
        <Path
          d="M5.285 14.28A7.213 7.213 0 014.91 12c0-.791.136-1.56.376-2.28V6.61H1.276A11.995 11.995 0 000 12c0 1.936.464 3.769 1.276 5.389l4.01-3.11z"
          fill="#FBBC05"
        />
        <Path
          d="M12 4.773c1.762 0 3.344.605 4.587 1.794l3.442-3.442C17.951 1.19 15.235 0 12 0 7.31 0 3.25 2.69 1.276 6.61l4.01 3.11C6.228 6.884 8.874 4.773 12 4.773z"
          fill="#EA4335"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_138_5579">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default GoogleLogo;
