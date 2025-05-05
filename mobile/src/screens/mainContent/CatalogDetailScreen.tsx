import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProductSlider from "./components/ProductSlider";
import { useAuth } from "src/firebase/context/authContext";
import { useUsersProduct } from "@utils/infoContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent",
  "MainScreen"
>;
interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  status: string;
  availability: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink?: string;
  images: string[];
}
export default function CatalogDetailScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  const route = useRoute();
  // const { changeTypeFood, typeFood } = useUsersProduct();
  const { userFromDB, isDarkMode } = useAuth();
  const { product } = route.params as { product: Product };
  const images = product.images;

  const discountedPrice = (item: any) => {
    const basePrice = Number(item.price);
    const discount = item.discount ? Number(item.discount) : 0;

    const priceAfterDiscount = basePrice * ((100 - discount) / 100);

    const achievementDiscount = userFromDB?.myAchievement
      ? (100 - Number(userFromDB?.myAchievement)) / 100
      : 1;

    const finalPrice = priceAfterDiscount * achievementDiscount;

    return finalPrice;
  };
  // const toggleSelect = (label: string) => {
  //   changeTypeFood(label);
  //   navigation.navigate("MainScreen", { screen: "Каталог" });
  // };
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <AuthHeader title="" />
        <View className="px-3">
          <View className="items-center mb-5">
            <ProductSlider productImages={images} />
          </View>
          <Text
            allowFontScaling={false}
            className="text-2xl font-bold mb-3 mt-5"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            {product.name}
          </Text>
          <Text
            allowFontScaling={false}
            className="text-[18px] font-bold mb-3"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Ціна:{" "}
            <Text
              className={`${
                product.discount && "text-darkStroke line-through"
              }`}
            >
              {product.price}
            </Text>
            {product.discount && (
              <Text allowFontScaling={false} className="text-green">
                {" "}
                {(Number(product.price) * (100 - Number(product.discount))) /
                  100}{" "}
                грн
              </Text>
            )}{" "}
            {!product.discount && "грн"}
          </Text>
          {userFromDB && userFromDB?.myAchievement !== 0 && (
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-3"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Ціна з вашою знижкою:
              <Text className="text-green underline">
                {" "}
                {discountedPrice(product)} грн
              </Text>
            </Text>
          )}
          {/* <Text
            allowFontScaling={false}
            className="text-[18px] font-bold mb-3"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Склад:
            <Text className="font-medium"> {product.composition}</Text>
          </Text>
          <View className="mb-5 flex-row">
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold "
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Категорія:{" "}
            </Text>
            <TouchableOpacity onPress={() => toggleSelect(product.category)}>
              <Text className="text-green underline text-[18px] font-bold">
                {product.category}
              </Text>
            </TouchableOpacity>
          </View> */}
          <Text
            allowFontScaling={false}
            className="text-[24px] font-bold mb-3"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Опис
          </Text>
          <Text
            allowFontScaling={false}
            className="font-normal text-base mb-5"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            {product.description}
          </Text>
          {product.videoLink && (
            <View>
              <Text
                allowFontScaling={false}
                className="text-[24px] font-bold mb-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Відеоогляд
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(product.videoLink)}
              >
                <Text
                  allowFontScaling={false}
                  className="font-medium text-base text-blue-600 underline"
                >
                  {product.videoLink}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
