import NotificationIcon from "@assets/svg/NotificationIcon";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { listenForUnreadNotifications } from "src/firebase/db";
import { BasketIcon, BasketIconIndicator } from "@assets/svg/BasketIcon";
import { useUsersProduct } from "@utils/infoContext";
import { LinearGradient } from "expo-linear-gradient";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

export default function HeaderAboutUser({ color }: { color?: string }) {
  const navigation = useNavigation<AuthNavigationProp>();

  const { userFromDB, currentUser, isDarkMode } = useAuth();

  const { cartProducts } = useUsersProduct();
  const [hasUnread, setHasUnread] = useState(false);
  useEffect(() => {
    if (!userFromDB) return;

    const unsubscribe = listenForUnreadNotifications(
      userFromDB.uid,
      setHasUnread
    );
    return () => unsubscribe();
  }, [userFromDB]);
  const handleBasket = () => {
    navigation.navigate("MainContent", {
      screen: "BasketScreen",
    });
  };
  const handleNotification = () => {
    navigation.navigate("MainContent", {
      screen: "NotificationScreen",
    });
  };

  return (
    <View className="p-3 flex-row justify-between items-center">
      <View className="flex-row gap-3 items-center">
        {userFromDB?.photoUrl ? (
          <Image
            source={
              userFromDB?.photoUrl
                ? { uri: userFromDB.photoUrl }
                : require("@assets/icons/icon.png")
            }
            className="w-[42px] h-[42px] rounded-full"
          />
        ) : (
          <LinearGradient
            colors={["#25C3B4", "#00A696"]}
            className="w-[42px] h-[42px] rounded-full items-center justify-center"
          >
            <Text className="text-white font-bold text-[12px]">
              {userFromDB?.displayName
                .split(" ")
                .map((word: string) => word[0])
                .join("")}
            </Text>
          </LinearGradient>
        )}
        <View>
          <Text
            allowFontScaling={false}
            className={`text-base font-bold ${
              color ? `text-${color}` : isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {currentUser ? userFromDB?.displayName : "Гість"}
          </Text>
          <Text
            allowFontScaling={false}
            className={`text-base font-bold ${
              color ? `text-${color}` : isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {currentUser && userFromDB?.wallet
              ? `${Math.round(userFromDB.wallet)} грн`
              : ""}
          </Text>
        </View>
      </View>

      <View className="flex-row ">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNotification}
          className={`mr-4 p-[9px] shadow-md rounded-full border-0.5  ${
            isDarkMode
              ? "bg-black  border-gray-500"
              : "bg-white border-greenStroke "
          }`}
        >
          <NotificationIcon isNot={hasUnread} isDarkMode={isDarkMode} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className={`p-[9px] shadow-md rounded-full border-0.5 ${
            isDarkMode
              ? "bg-black  border-gray-500"
              : "bg-white border-greenStroke "
          }`}
          onPress={handleBasket}
        >
          {cartProducts.length > 0 ? (
            <BasketIconIndicator isDarkMode={isDarkMode} />
          ) : (
            <BasketIcon isDarkMode={isDarkMode} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
