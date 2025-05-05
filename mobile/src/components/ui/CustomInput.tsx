import {
  Keyboard,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

interface InputProps extends TextInputProps {
  placeholder: string;
  color?: string;
  error?: {};
}

export const CustomInput: React.FC<InputProps> = ({
  placeholder,
  value,
  keyboardType = "default",
  onChangeText,
  color,
  error,
  ...props
}) => {
  const { isDarkMode } = useAuth();

  return (
    <View
      className={`rounded-full flex-row items-center h-[60px] px-5 ${
        error && "border border-red"
      } ${isDarkMode ? "bg-secondary" : "bg-lightGrey"}`}
    >
      <TextInput
        className={`flex-1 font-main text-darkBlack text-[16px] font-medium leading-none 
                ${isDarkMode ? "text-lightBack" : "text-darkBlack"}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={`${error ? "red" : "#A0AEC0"}`}
        {...props}
      />
    </View>
  );
};
