import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "src/firebase/context/authContext";

const SearchIcon = () => {
  const { isDarkMode } = useAuth();
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.4167 11.0833C18.4167 15.1334 15.1334 18.4167 11.0833 18.4167C7.03325 18.4167 3.75 15.1334 3.75 11.0833C3.75 7.03325 7.03325 3.75 11.0833 3.75C15.1334 3.75 18.4167 7.03325 18.4167 11.0833Z"
        fill={isDarkMode ? "#212121" : "#E5E5E5"}
      />
      <Path
        d="M20.25 20.25L16.2688 16.2688M16.2688 16.2688C17.5959 14.9417 18.4167 13.1084 18.4167 11.0833C18.4167 7.03325 15.1334 3.75 11.0833 3.75C7.03325 3.75 3.75 7.03325 3.75 11.0833C3.75 15.1334 7.03325 18.4167 11.0833 18.4167C13.1084 18.4167 14.9417 17.5959 16.2688 16.2688Z"
        stroke={isDarkMode ? "white" : "#161616"}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
