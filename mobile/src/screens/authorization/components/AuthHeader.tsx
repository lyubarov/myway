import { RootStackParamList } from "@appTypes/navigationTypes";
import { ArrowBack, ArrowBackWhite } from "@assets/svg/ArrowBack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

export const AuthHeader = ({
  title,
  color,
}: {
  title: string;
  color?: string;
}) => {
  const { isDarkMode } = useAuth();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className="w-full flex-row items-center justify-between p-5">
      <Pressable onPress={() => navigation.goBack()} className="px-2">
        {color || isDarkMode ? <ArrowBackWhite /> : <ArrowBack />}
      </Pressable>
      <Text
        allowFontScaling={false}
        className={`font-main text-lg font-bold flex-1 text-center ${
          (color || isDarkMode) && "text-white"
        }`}
      >
        {title}
      </Text>
    </View>
  );
};
