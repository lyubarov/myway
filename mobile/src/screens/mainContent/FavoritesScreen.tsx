import { RootStackParamList } from "@appTypes/navigationTypes";
import CloseIconSmall from "@assets/svg/CloseIconSmall";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { useUsersProduct } from "@utils/infoContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "src/firebase/context/authContext";
import { toggleFavorite } from "src/firebase/db";
type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Authorization"
>;
export default function FavoritesScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  const { currentUser, isDarkMode } = useAuth();
  const { handleAddToBasket, favorites, setFavorites } = useUsersProduct();
  const handleToggleFavorite = async (product: any) => {
    if (!currentUser) return;
    await toggleFavorite(currentUser.uid, product);
    setFavorites((prev) => prev.filter((item) => item.id !== product.id));
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Список бажань" />
      <View className="flex-1 ">
        {favorites.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
            <View className="px-3 gap-3">
              {favorites.map((item) => (
                <View
                  key={item.id}
                  className={`flex-row p-3 pl-0 items-center justify-between border border-greenStroke bg-white rounded-[24px] ${
                    isDarkMode
                      ? "bg-darkCard border border-darkCardBorder"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <View className="flex-row">
                    <View>
                      <Image
                        source={{ uri: item.images[0] }}
                        className="w-[92px] h-[92px]"
                      />
                    </View>
                    <View className="items-start">
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-base mb-[6px]"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="font-medium text-[12px] mb-[6px] w-[100px]"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.category}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className="text-base"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.price}₴
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-[12px] text-green"
                      >
                        в наявності
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-7">
                    <TouchableOpacity
                      onPress={() => handleToggleFavorite(item)}
                    >
                      <CloseIconSmall color={"#b1bfbd"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await handleAddToBasket(item);
                        handleToggleFavorite(item);
                      }}
                      className={`bg-black py-3 px-5 rounded-full ${
                        isDarkMode ? "bg-white" : "bg-black"
                      }`}
                    >
                      <Text
                        allowFontScaling={false}
                        className="text-white text-[14px] font-semibold "
                        style={{ color: isDarkMode ? "black" : "white" }}
                      >
                        В кошик
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 55 }}>
            <View className="flex-1 justify-center items-center px-3">
              <Image
                source={require("@assets/favorites.png")}
                className={`w-full px-2 ${Platform.OS === "ios" ? "" : ""}`}
                resizeMode="contain"
              />
              <View className="px-2">
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[28px] text-center mb-3"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  Список бажань порожній
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-base text-center mb-6"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  Збережи свої бажання. Додай улюблені товари, щоб легко знайти
                  їх пізніше та не пропустити вигідні пропозиції
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MainScreen", { screen: "Каталог" });
                  }}
                >
                  <LinearGradient
                    colors={["#25C3B4", "#00A696"]}
                    className="py-5 rounded-full w-full font-bold"
                  >
                    <Text
                      allowFontScaling={false}
                      className="text-center text-base font-bold"
                      style={{ color: isDarkMode ? "black" : "white" }}
                    >
                      Перейти до каталогу
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
