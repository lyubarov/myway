import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "src/firebase/context/authContext";

export const CircularProgress = ({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) => {
  const [progress, setProgress] = useState((value / maxValue) * 100);
  const progressRef = React.useRef<AnimatedCircularProgress | null>(null);
  const { isDarkMode } = useAuth();
  useEffect(() => {
    const newProgress = (value / maxValue) * 100;
    setProgress(newProgress);

    // ✅ Гладко оновлюємо прогрес без ререндеру компонента
    if (progressRef.current) {
      progressRef.current.reAnimate(progress, newProgress, 500);
    }
  }, [value]);

  return (
    <View className=" w-full items-center">
      <View
        className="bg-white rounded-full p-1 border-8 border-greenStroke relative"
        style={{
          backgroundColor: isDarkMode ? "black" : "white",
          borderWidth: 8,
          borderColor: isDarkMode ? "rgba(37, 195, 180, 0.2)" : "greenStroke",
        }}
      >
        <AnimatedCircularProgress
          ref={progressRef}
          size={240}
          width={30}
          fill={progress}
          tintColor="#25c3b4"
          backgroundColor={isDarkMode ? "rgba(37, 195, 180, 0.2)" : "#F4F4F4"}
          rotation={225}
          arcSweepAngle={270}
          lineCap="round"
        >
          {() => (
            <Text
              allowFontScaling={false}
              className=" font-bold text-[36px]"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              {Number(value)} мл
            </Text>
          )}
        </AnimatedCircularProgress>
        <Text
          allowFontScaling={false}
          className="absolute left-[90px] bottom-[21px] text-[18px] text-darkGrey"
        >
          {maxValue} мл
        </Text>
      </View>
    </View>
  );
};
