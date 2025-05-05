import { ArrowBack, ArrowBackWhite } from "@assets/svg/ArrowBack";
import CloseIcon from "@assets/svg/CloseIcon";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

export default function Header({
  navigation,
  handleClose,
}: {
  navigation: any;
  handleClose: () => void;
}) {
  const { isDarkMode } = useAuth();
  return (
    <View className="w-full flex-row items-center justify-between p-4">
      <Pressable onPress={() => navigation.goBack()} className="p-2">
        {isDarkMode ? <ArrowBackWhite /> : <ArrowBack />}
      </Pressable>
      <Text
        allowFontScaling={false}
        className="font-bold text-[20px]"
        style={{ color: isDarkMode ? "white" : "black" }}
      >
        Оформлення
      </Text>
      <Pressable onPress={handleClose}>
        <CloseIcon color={isDarkMode ? "white" : "black"} />
      </Pressable>
    </View>
  );
}
