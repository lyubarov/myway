import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useUsersProduct } from "@utils/infoContext";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "src/firebase/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoriteButton from "./FavoriteButton";
type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

const NoveltyList = ({ blockId }: { blockId: string }) => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isDarkMode } = useAuth();

  const { handleAddToBasket, cartProducts, products, typeFood } =
    useUsersProduct();
  const [productss, setProducts] = useState([]);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Спробуємо отримати збережені продукти
        const storedProducts = await AsyncStorage.getItem(
          `products_${blockId}`
        );
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }

        const newData = products.filter(
          (product) =>
            product.category.trim().toLowerCase() === typeFood.toLowerCase()
        );

        if (JSON.stringify(newData) !== storedProducts) {
          setProducts(newData);
          await AsyncStorage.setItem(
            `products_${blockId}`,
            JSON.stringify(newData)
          );
        }
      } catch (error) {
        console.error("Помилка отримання товарів", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    fetchData();
  }, []);

  const handleDetail = (item: object) => {
    navigation.navigate("MainContent", {
      screen: "CatalogDetailScreen",
      params: { product: item },
    });
  };
  const handleAddToBasketWithLoading = async (item: any) => {
    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

    try {
      await handleAddToBasket(item);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <FlatList
      data={productss}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      removeClippedSubviews={false}
      renderItem={({ item }) =>
        loading ? (
          <View
            className={`w-[172px] h-[268px] p-[14px] mr-[8px] rounded-[32px] items-center justify-center  ${
              isDarkMode ? "bg-darkCard" : "bg-white"
            }`}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View
            className={`max-w-[172px] p-[14px] mr-[8px] rounded-[32px] items-center justify-between ${
              isDarkMode ? "bg-darkCard" : "bg-white"
            } `}
          >
            {item.discount && (
              <View
                className="absolute left-0 top-6 z-50 px-2 py-[8px] rounded-r-full
                "
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(37, 195, 180, 0.2)"
                    : "#E0F0EE",
                }}
              >
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[14px]"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  Акція
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => handleDetail(item)}
              className="items-center"
            >
              <Image
                source={{ uri: item.images[0] }}
                style={{ width: 100, height: 100, resizeMode: "cover" }}
              />
              <View className=" my-[10px] items-center">
                <Text
                  allowFontScaling={false}
                  className={`font-bold text-base mb-[6px] ${
                    isDarkMode && "text-white"
                  }`}
                >
                  {item.name}
                </Text>
                <Text
                  allowFontScaling={false}
                  className={`font-medium text-[12px] mb-[6px] ${
                    isDarkMode && "text-white"
                  }`}
                >
                  {item.category}
                </Text>
                <View className="flex-row gap-3">
                  <Text
                    allowFontScaling={false}
                    className={`font-bold text-base ${
                      item.discount ? "text-darkText line-through" : ""
                    } ${isDarkMode && "text-white"}`}
                  >
                    {item.price} {!item.discount && "грн"}
                  </Text>
                  {item.discount && (
                    <Text
                      allowFontScaling={false}
                      className="font-bold text-base text-green"
                    >
                      {(Number(item.price) * (100 - Number(item.discount))) /
                        100}{" "}
                      грн
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleAddToBasketWithLoading(item)}
              >
                <LinearGradient
                  colors={
                    cartProducts.some(
                      (cartItem) => cartItem.product.id === item.id
                    )
                      ? ["#25C3B4", "#00A696"]
                      : isDarkMode
                      ? ["#fff", "#fff"]
                      : ["#000", "#000"]
                  }
                  className="py-3 rounded-full w-[90px] items-center "
                >
                  <Text
                    allowFontScaling={false}
                    className={`text-white font-bold text-center text-[14px] ${
                      isDarkMode ? "text-black" : "ext-white"
                    }`}
                  >
                    {loadingItems[item.id] ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : cartProducts.some(
                        (cartItem) => cartItem.product.id === item.id
                      ) ? (
                      "В кошику"
                    ) : (
                      "В кошик"
                    )}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <FavoriteButton product={item} />
            </View>
          </View>
        )
      }
    />
  );
};
export default NoveltyList;
