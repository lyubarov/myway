import { formatPhoneNumber } from "@utils/helpers";
import React from "react";
import { TextInput, Text, View, TextInputProps } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

interface PhoneInputProps extends TextInputProps {
  placeholder: string;
  error?: {};
}
export const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  ...props
}) => {
  const handleTextChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    if (onChangeText) {
      onChangeText(formatted);
    }
  };
  const { isDarkMode } = useAuth();

  return (
    <View
      className={`bg-lightGrey rounded-full flex-row items-center h-[60px] px-5 ${
        error && "border border-red"
      } ${isDarkMode ? "bg-secondary" : "bg-lightGrey"}`}
    >
      <Text
        className={`${error ? "text-red" : "text-darkBlack"} ${
          isDarkMode ? "text-lightGrey" : "text-darkBlack"
        }  font-main text-[16px] font-medium`}
      >
        +38 0
      </Text>

      <View className={"border-l border-gray-300  h-6 mx-2 items-center"} />
      <TextInput
        className={`flex-1 font-main  text-[16px] font-medium leading-none ${
          isDarkMode ? "text-lightGrey" : "text-darkBlack"
        } `}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        placeholderTextColor={`${error ? "red" : "#A0AEC0"}`}
        inputMode="numeric"
        keyboardType="numeric"
        {...props}
      />
    </View>
  );
};
