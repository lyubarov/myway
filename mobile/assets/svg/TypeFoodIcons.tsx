import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "src/firebase/context/authContext";

export const VitaminsIcon = ({ stroke }: { stroke: string }) => {
  return (
    <Svg width="23" height="23" viewBox="0 0 23 23" fill="none">
      <Path
        d="M13.2416 16.7273C11.0528 18.9161 7.5041 18.9161 5.3153 16.7273C3.12651 14.5385 3.12651 10.9898 5.3153 8.80097L9.71882 4.39745C11.9076 2.20866 15.4564 2.20866 17.6452 4.39746C19.834 6.58625 19.834 10.135 17.6452 12.3238L13.2416 16.7273Z"
        fill="rgba(255, 255, 255, 0.2)"
        stroke={stroke}
        strokeWidth="1.89902"
        strokeLinejoin="round"
      />
      <Path
        d="M7.51685 6.59873L9.7186 4.39697C11.9074 2.20817 15.4561 2.20817 17.6449 4.39697C19.8337 6.58576 19.8337 10.1345 17.6449 12.3233L15.4432 14.525L7.51685 6.59873Z"
        fill="rgba(255, 255, 255, 0.2)"
        stroke={stroke}
        strokeWidth="1.89902"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const SuperFoodIcon = ({ stroke }: { stroke: string }) => {
  return (
    <Svg width="19" height="22" viewBox="0 0 19 22" fill="none">
      <Path
        d="M5.62683 2L9.3923 5.76547L13.1578 2"
        fill="rgba(37, 195, 180, 0.2)"
      />
      <Path
        d="M5.62683 2L9.3923 5.76547L13.1578 2"
        stroke={stroke}
        strokeWidth="2.25928"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.6158 5.81651C10.0617 5.74817 8.69036 5.74924 7.1702 5.81625C5.19491 5.90334 3.29062 6.83722 2.52011 8.65811C2.44887 8.82649 2.38213 8.99313 2.31976 9.15658C1.69977 10.7812 2.01529 12.5725 2.97318 14.0238C4.08578 15.7096 5.732 17.9374 7.4389 19.3045C8.59035 20.2268 10.1957 20.2322 11.355 19.3199C13.1038 17.9438 14.7535 15.6906 15.8545 13.9967C16.7871 12.5619 17.0865 10.7994 16.4811 9.19882C16.4139 9.02136 16.3416 8.83998 16.264 8.65655C15.4936 6.83668 13.5901 5.90334 11.6158 5.81651Z"
        fill="rgba(37, 195, 180, 0.2)"
        stroke={stroke}
        strokeWidth="2.44755"
        strokeLinejoin="round"
      />
      <Path
        d="M6.29919 10.4131L6.74311 10.857L6.29919 10.4131Z"
        fill="rgba(37, 195, 180, 0.2)"
      />
      <Path
        d="M6.29919 10.4131L6.74311 10.857"
        stroke={stroke}
        strokeWidth="2.25928"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.09204 13.8408L9.53596 14.2847L9.09204 13.8408Z"
        fill="rgba(37, 195, 180, 0.2)"
      />
      <Path
        d="M9.09204 13.8408L9.53596 14.2847"
        stroke={stroke}
        strokeWidth="2.25928"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.0416 10.4131L12.4855 10.857L12.0416 10.4131Z"
        fill="rgba(37, 195, 180, 0.2)"
      />
      <Path
        d="M12.0416 10.4131L12.4855 10.857"
        stroke={stroke}
        strokeWidth="2.25928"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const SportFoodIcon = ({ stroke }: { stroke: string }) => {
  return (
    <Svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <Path
        d="M2.0019 11.3909C2.13558 8.78673 2.63321 5.39009 3.8931 2.89561C4.08588 2.51394 4.45496 2.25872 4.87947 2.20731C5.6926 2.10885 7.07056 2 8.89239 2C10.2112 2 11.3753 2.09819 12.2771 2.21673C13.1861 2.33621 13.662 3.28288 13.2994 4.12488L11.8692 7.44456C13.1219 7.49101 14.0992 7.58994 15.008 7.77514C15.8425 7.94523 16.2567 8.836 15.8299 9.57302C14.238 12.3221 10.4806 16.8503 5.04959 20.7794C5.04959 17.8423 5.56538 15.8209 6.4692 12.8921H3.46449C2.63477 12.8921 1.95937 12.2195 2.0019 11.3909Z"
        fill="rgba(37, 195, 180, 0.2)"
        stroke={stroke}
        strokeWidth="2.25353"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const FavoriteIcon = ({
  opacity = 0.2,
  isFavorite,
}: {
  opacity?: number;
  isFavorite?: boolean;
}) => {
  const { isDarkMode } = useAuth();

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7.33505C8.13476 2.59247 4.0537 5.96227 4 9.59486C4 15.0028 10.4705 19.4415 12 19.4415C13.5295 19.4415 20 15.0028 20 9.59486C19.9462 5.96227 15.8652 2.59247 12 7.33505Z"
        fill={`rgba(37, 195, 180, ${opacity})`}
        stroke={`${!isFavorite ? "#25C3B4" : isDarkMode ? "black" : "white"}`}
        strokeWidth="1.92"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const AchievementIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
      />
      <Path
        d="M13.9695 9.85214C13.9695 9.85214 13.2292 9.02688 12.0284 9.13001C10.8277 9.23315 10.2489 9.97084 10.2489 10.7106C10.2489 12.8681 13.9695 11.3729 13.9695 13.5854C13.9695 14.726 11.5014 15.5311 10.031 14.1892"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.1757 7.67969V9.12159"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M12.1757 14.8779V16.3198"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};
export const InfoIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.56502 19.0835C3.63987 19.7808 4.19312 20.3336 4.89025 20.4099C7.1644 20.6585 9.5464 21 12 21C14.4536 21 16.8356 20.6585 19.1097 20.4099C19.8069 20.3336 20.3601 19.7808 20.4349 19.0835C20.6782 16.8177 20.9999 14.4445 20.9999 12C20.9999 9.55549 20.6782 7.18229 20.4349 4.91645C20.3601 4.21915 19.8069 3.66638 19.1097 3.59014C16.8356 3.34147 14.4536 3 12 3C9.5464 3 7.1644 3.34147 4.89025 3.59014C4.19312 3.66638 3.63987 4.21915 3.56501 4.91645C3.32178 7.18229 3 9.55549 3 12C3 14.4445 3.32178 16.8177 3.56502 19.0835Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
      />
      <Path
        d="M16.6271 16.7051H13.8801"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.74634 3.22452V9.78144C8.74634 10.5834 9.39646 11.2335 10.1984 11.2335H13.8171C14.613 11.2335 15.2606 10.5929 15.2692 9.79704L15.34 3.2031C14.8009 3.10839 13.4136 3.01172 12.0919 3.01172C10.7701 3.01172 9.32445 3.16208 8.74634 3.22452Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export const ReferralIcon = () => {
  return (
    <Svg width="18" height="19" viewBox="0 0 18 19" fill="none">
      <Path
        d="M8.99989 9.04593C11.2217 9.04593 13.0229 7.24479 13.0229 5.02297C13.0229 2.80114 11.2217 1 8.99989 1C6.77807 1 4.97693 2.80114 4.97693 5.02297C4.97693 7.24479 6.77807 9.04593 8.99989 9.04593Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.1424 13.6726C17.8674 14.8245 16.7855 17.0921 14.7113 17.0921H3.28869C1.21449 17.0921 0.132671 14.8245 1.85757 13.6726C3.90143 12.3075 6.35777 11.5117 8.99998 11.5117C11.6422 11.5117 14.0985 12.3075 16.1424 13.6726Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
      />
    </Svg>
  );
};
export const WarningIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.21514 17.0923L9.28486 4.69993C10.395 2.43336 13.6257 2.43336 14.7359 4.69993L20.8055 17.0923C21.0092 17.5078 21.1533 18.0121 20.8327 18.3456C18.7124 20.5515 5.30832 20.5515 3.18809 18.3456C2.86742 18.0121 3.01161 17.5078 3.21514 17.0923Z"
        fill="#E0F0EE"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M11.9863 8.97461V12.4125"
        stroke="#25C3B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M11.9863 17.7241C12.8184 17.7241 13.4929 17.0496 13.4929 16.2175C13.4929 15.3854 12.8184 14.7109 11.9863 14.7109C11.1542 14.7109 10.4797 15.3854 10.4797 16.2175C10.4797 17.0496 11.1542 17.7241 11.9863 17.7241Z"
        fill="#25C3B4"
      />
    </Svg>
  );
};
