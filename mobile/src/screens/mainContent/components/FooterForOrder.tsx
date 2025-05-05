import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
export const Footer = ({
  navigation,
  handleContinue,
  totalAmount,
  totalSum,
  isActive,
  first,
}: {
  navigation: any;
  handleContinue: () => void;
  totalAmount: number;
  totalSum?: number;
  isActive: boolean;
  first: boolean;
}) => {
  const { isDarkMode } = useAuth();
  const screenWidth = Dimensions.get("window").width;
  return (
    <View
      className={`absolute bottom-0 left-0 right-0 h-[155px] ${
        isDarkMode ? "bg-black" : "bg-white"
      } pt-5 px-3`}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          allowFontScaling={false}
          className="text-[18px] font-bold"
          style={{ color: isDarkMode ? "white" : "black" }}
        >
          До сплати:
        </Text>
        <View className="flex-row items-center gap-3">
          <Text
            allowFontScaling={false}
            className="text-[24px] font-bold"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            {totalAmount}₴
          </Text>
          {totalSum && totalSum > totalAmount && (
            <Text
              allowFontScaling={false}
              className="text-[24px] font-bold "
              style={{ color: "#B1BFBD", textDecorationLine: "line-through" }}
            >
              {totalSum}₴
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className={`${
            first ? "bg-gray-400" : isDarkMode ? "bg-white" : "bg-black"
          } rounded-full py-5`}
          style={{ width: screenWidth * 0.5 - 16 }}
          disabled={first}
          onPress={() => navigation.goBack()}
        >
          <Text
            allowFontScaling={false}
            className="text-white font-bold text-[14px] text-center"
            style={{ color: isDarkMode ? "black" : "white" }}
          >
            Назад
          </Text>
        </TouchableOpacity>
        <LinearGradient
          colors={["#25c3b4", "#00a696"]}
          className={`rounded-full py-5 ${!isActive && "opacity-40"}`}
          style={{ width: screenWidth * 0.5 - 16 }}
        >
          <TouchableOpacity onPress={handleContinue} disabled={!isActive}>
            <Text
              allowFontScaling={false}
              className="text-white font-bold text-[14px] text-center"
              style={{ color: isDarkMode ? "black" : "white" }}
            >
              Продовжити
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};
