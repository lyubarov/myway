import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ItemsInCart from "./components/ItemsInCart";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { InfoIcon } from "@assets/svg/InfoIcon";
import { useEffect, useState } from "react";
import { useAuth } from "src/firebase/context/authContext";
import { useUsersProduct } from "@utils/infoContext";
import CloseIcon from "@assets/svg/CloseIcon";
import { ArrowBack, ArrowBackWhite } from "@assets/svg/ArrowBack";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent",
  "MainScreen"
>;

export const BasketScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { currentUser, isDarkMode } = useAuth();
  const [disabled, setDisabled] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  const {
    handleAddToBasket,
    cartProducts,
    fetchCartProducts,
    totalAmount,
    products,
  } = useUsersProduct();
  const [recommendedProduct, setRecommendedProduct] = useState([]);

  useEffect(() => {
    if (cartProducts.length === 0 || products.length === 0) return;

    const recommendedNames = new Set(
      cartProducts.flatMap((product) => product.product.recommended || [])
    );

    const recommendedProductsList = products.filter((product) =>
      recommendedNames.has(product.name)
    );

    setRecommendedProduct(recommendedProductsList as any);
  }, [cartProducts, products]);

  const handleInfo = (name: string) => {
    navigation.navigate("MainContent", {
      screen: "InfoScreen",
      params: { nameProduct: name },
    });
  };
  const handleBack = () => {
    navigation.navigate("MainScreen", { screen: "Каталог" });
  };

  useEffect(() => {
    fetchCartProducts();
  }, [currentUser]);

  const handleOrder = () => {
    navigation.navigate("MainContent", {
      screen: "PlacingOrderFirstScreen",
      params: { totalAmount },
    });
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      {cartProducts.length > 0 ? (
        <View className="w-full flex-row items-center justify-between p-5">
          <Pressable onPress={() => handleBack()}>
            {isDarkMode ? <ArrowBackWhite /> : <ArrowBack />}
          </Pressable>
          <Text
            allowFontScaling={false}
            className={`font-main text-lg font-bold flex-1 text-center ${
              isDarkMode && "text-white"
            }`}
          >
            Кошик
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleBack} className="p-3 items-end">
          <CloseIcon color={isDarkMode ? "white" : "#000"} />
        </TouchableOpacity>
      )}
      {cartProducts.length > 0 ? (
        <View className="flex-1 px-3 pt-[22px]">
          <ScrollView contentContainerStyle={{ paddingBottom: 155 }}>
            <ItemsInCart setDisabled={setDisabled} />
            {recommendedProduct.length > 0 && (
              <Text
                allowFontScaling={false}
                className="font-bold text-[14px] px-3 mt-4"
                style={{
                  color: isDarkMode ? "white" : "black",
                }}
              >
                Купують для кращого засвоєння:
              </Text>
            )}
            {recommendedProduct &&
              recommendedProduct.slice(0, 3).map(
                (item: any) =>
                  item && (
                    <View className="ml-3 mt-2" key={item.id}>
                      <View
                        className={`p-3 mt-[6px] ${
                          isDarkMode
                            ? "bg-darkCard border-1 border-darkCardBorder"
                            : "bg-white"
                        } flex-row rounded-[24px]`}
                      >
                        <Image
                          source={{ uri: item.images[0] }}
                          className="w-[40px] h-[45px]"
                        />
                        <View className="flex-row flex-1 justify-between items-center ml-3">
                          <View>
                            <Text
                              allowFontScaling={false}
                              className="mb-1 font-bold text-base"
                              style={{
                                color: isDarkMode ? "white" : "black",
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={{
                                color: isDarkMode ? "white" : "black",
                              }}
                            >
                              {item.price}₴
                            </Text>
                          </View>
                          <View className="flex-row gap-[6px]">
                            <TouchableOpacity
                              onPress={() => handleAddToBasket(item)}
                              className={`px-5 py-[12px] ${
                                isDarkMode ? "bg-lightGreen" : "bg-darkBlack"
                              } rounded-full`}
                            >
                              <Text
                                allowFontScaling={false}
                                className=" font-bold text-[14px] m-0 p-0"
                                style={{
                                  color: isDarkMode ? "black" : "white",
                                }}
                              >
                                В кошик
                              </Text>
                            </TouchableOpacity>
                            <LinearGradient
                              colors={["#25C3B4", "#00A696"]}
                              className="rounded-full p-2"
                            >
                              <TouchableOpacity
                                onPress={() => handleInfo(item.name)}
                              >
                                <InfoIcon isDarkMode={isDarkMode} />
                              </TouchableOpacity>
                            </LinearGradient>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
              )}
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 55 }}>
          <View className="flex-1 justify-center items-center px-3">
            <Image
              source={require("@assets/emptyCard.png")}
              className={`w-full px-2 ${Platform.OS === "ios" ? "" : ""}`}
              resizeMode="contain"
            />
            <View className="px-2 mt-[23px]">
              <Text
                allowFontScaling={false}
                className="font-bold text-[28px] text-center mb-3"
                style={{
                  color: isDarkMode ? "white" : "black",
                }}
              >
                Твій кошик порожній
              </Text>
              <Text
                allowFontScaling={false}
                className="text-base text-center mb-6"
                style={{
                  color: isDarkMode ? "white" : "black",
                }}
              >
                {/* Не хвилюйся, це легко виправити!{"\n"}
                Оберіть товари та додайте їх до кошика. */}
                Наповни його силою, енергією та ресурсами — зроби крок до свого
                результату
              </Text>
              <TouchableOpacity onPress={handleBack}>
                <LinearGradient
                  colors={["#25C3B4", "#00A696"]}
                  className="py-5 rounded-full w-full font-bold"
                >
                  <Text
                    allowFontScaling={false}
                    className="text-center text-white text-base font-bold"
                  >
                    Перейти до каталогу
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      {cartProducts.length > 0 && (
        <View
          className="absolute bottom-0 left-0 right-0 h-[155px] bg-white pt-5 px-3"
          style={{ backgroundColor: isDarkMode ? "black" : "white" }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              До сплати:
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[24px] font-bold "
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              {parseFloat(totalAmount.toFixed(1))}₴
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleBack}
              className="rounded-full py-5"
              style={{
                width: screenWidth * 0.5 - 16,
                backgroundColor: isDarkMode ? "white" : "black",
              }}
            >
              <Text
                allowFontScaling={false}
                className=" font-bold text-sm text-center"
                style={{ color: isDarkMode ? "black" : "white" }}
              >
                Продовжити покупки
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (currentUser) {
                  handleOrder();
                } else {
                  Alert.alert(
                    "Увага!",
                    "Для завершення покупки необхідно створити обліковий запис.",
                    [{ text: "OK" }]
                  );
                }
              }}
              disabled={cartProducts.length <= 0 || disabled}
            >
              <LinearGradient
                colors={
                  disabled ? ["#B0B0B0", "#B0B0B0"] : ["#25C3B4", "#00A696"]
                }
                className="flex-1  h-full py-5 rounded-full "
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-white font-bold text-sm text-center"
                  style={{ color: isDarkMode ? "black" : "white" }}
                >
                  Оформити замовлення
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
