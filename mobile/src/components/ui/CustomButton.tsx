import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  GestureResponderEvent,
} from "react-native";

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: string;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  color?: string;
  icon?: React.ReactNode;
  textColor?: string;
};

export const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style = "",
  loading = false,
  disabled = false,
  loadingText = "Loading...",
  color,
  icon,
  textColor,
}) => {
  const isButtonDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={onPress}
      disabled={isButtonDisabled}
      className={`h-13 justify-center items-center rounded-xl px-4 my-2 ${
        isButtonDisabled ? "bg-green" : color
      } ${style}`}
      style={[
        color && !isButtonDisabled ? { backgroundColor: color } : undefined,
        isButtonDisabled && { opacity: 0.4 },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View className="flex-row items-center">
          <Text
            allowFontScaling={false}
            className={`text-base font-bold ${textColor}`}
          >
            {title}
          </Text>
          {icon && <View className="ml-2">{icon}</View>}
        </View>
      )}
      {loading && (
        <Text className="text-white ml-2 text-[14px]">{loadingText}</Text>
      )}
    </TouchableOpacity>
  );
};
