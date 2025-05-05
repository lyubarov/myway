import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import HeaderAboutUser from "./components/HeaderAboutUser";
import ToggleTypeFood from "./components/ToggleTypeFood";
import SearchIcon from "@assets/svg/SearchIcon";
import { ModalSortOptions } from "./components/ModalSortOptions";
import OptionsPicker from "./components/OptionsPicker";
import FavoriteButton from "./components/FavoriteButton";
import { useUsersProduct } from "@utils/infoContext";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "src/firebase/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  subcategory: string;
  status: string;
  availability: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink: string;
  images: string[];
}

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

export const CatalogScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const screenWidth = Dimensions.get("window").width;

  const { cartProducts, handleAddToBasket, typeFood, products } =
    useUsersProduct();
  const { isDarkMode } = useAuth();

  const [search, setSearch] = useState("");

  const [modalSortOptionsIsOpen, setModalSortOptionsIsOpen] = useState(false);
  const [productss, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<{
    [key: string]: string[];
  }>({});

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedProducts = await AsyncStorage.getItem(
          `products_${typeFood}`
        );
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts) as Product[];
          setProducts(parsedProducts);
          setFilteredProducts(parsedProducts);
        }

        // Отримуємо нові дані
        const newData = products.filter(
          (product) =>
            product.category.trim().toLowerCase() === typeFood.toLowerCase()
        );

        // Порівнюємо зі збереженими даними
        if (JSON.stringify(newData) !== storedProducts) {
          setProducts(newData);
          setFilteredProducts(newData);
          // Зберігаємо нові дані
          await AsyncStorage.setItem(
            `products_${typeFood}`,
            JSON.stringify(newData)
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [typeFood]);

  const toggleSortModal = () => {
    setModalSortOptionsIsOpen(!modalSortOptionsIsOpen);
  };

  const handleDetail = (item: Product) => {
    navigation.navigate("MainContent", {
      screen: "CatalogDetailScreen",
      params: { product: item },
    });
  };

  useEffect(() => {
    const filtered = productss.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, productss]);
  const handleCategorySelect = (category: string, subcategory: string) => {
    const updatedCategories = [...selectedCategories];

    // Вибір категорії
    if (updatedCategories.includes(category)) {
      // Видаляємо категорію, якщо вона вже вибрана
      updatedCategories.splice(updatedCategories.indexOf(category), 1);
    } else {
      updatedCategories.push(category); // Додаємо категорію
    }

    // Вибір підкатегорії
    const updatedSubCategories = { ...selectedSubCategories };

    if (updatedSubCategories[category]?.includes(subcategory)) {
      // Якщо підкатегорія вже вибрана, видаляємо її
      updatedSubCategories[category] = updatedSubCategories[category].filter(
        (item) => item !== subcategory
      );
    } else {
      // Якщо підкатегорія не вибрана, додаємо її
      if (!updatedSubCategories[category]) {
        updatedSubCategories[category] = [];
      }
      updatedSubCategories[category].push(subcategory);
    }

    setSelectedCategories(updatedCategories);
    setSelectedSubCategories(updatedSubCategories);

    // Фільтрація продуктів за категорією та підкатегорією
    const filtered = productss.filter((item) => {
      // Перевіряємо, чи відповідає категорії
      const isCategoryMatch =
        updatedCategories.length === 0 ||
        updatedCategories.includes(item.category);

      // Перевіряємо, чи відповідає підкатегорії
      const isSubCategoryMatch =
        !updatedSubCategories[item.category] ||
        updatedSubCategories[item.category].includes(item.subcategory);

      return isCategoryMatch && isSubCategoryMatch;
    });

    setFilteredProducts(filtered);
  };

  const handleAddToBasketWithLoading = async (item: any) => {
    setLoadingItems((prev) => ({ ...prev, [item.id]: true })); // Починаємо завантаження

    try {
      await handleAddToBasket(item);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <HeaderAboutUser />
        <View className="px-3">
          <View className="relative mb-3">
            <View className="absolute left-3 top-2 transform -translate-y-1/2 z-10">
              <SearchIcon />
            </View>
            <TextInput
              placeholder="Пошук"
              className={`${
                isDarkMode ? "bg-darkCard text-white" : "bg-white text-black"
              } pl-12 py-[10.5px] rounded-full w-full `}
              value={search}
              onChangeText={(text) => setSearch(text)}
              placeholderTextColor={isDarkMode ? "white" : "#B0B0B0"}
            />
          </View>
          <ToggleTypeFood isCatalog={true} toggleSortModal={toggleSortModal} />
          <View className="flex-row flex-wrap gap-3">
            {loading ? (
              <View
                style={{ width: screenWidth * 0.5 - 18 }}
                className={`h-[268px] p-[14px] mr-[8px] rounded-[32px] items-center justify-center  ${
                  isDarkMode ? "bg-darkCard" : "bg-white"
                }`}
              >
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : productss.length > 0 ? (
              filteredProducts.map((item, index) => (
                <View
                  key={index}
                  className={`relative py-[14px] px-4 rounded-[32px] items-center justify-between  ${
                    isDarkMode ? "bg-darkCard" : "bg-white"
                  }`}
                  style={{ width: screenWidth * 0.5 - 18 }}
                >
                  {item.status === "Новинка" && !item.discount && (
                    <View
                      className="absolute left-0 top-6 z-50 px-2 py-[8px] rounded-r-full"
                      style={{
                        backgroundColor: isDarkMode
                          ? "rgba(37, 195, 180, 0.2)"
                          : "#E0F0EE",
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-[14px] "
                        style={{
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        Новинка
                      </Text>
                    </View>
                  )}
                  {item.discount && (
                    <View
                      className="absolute left-0 top-6 z-50 px-2 py-[8px] rounded-r-full"
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
                        className="font-bold text-base mb-[6px]"
                        style={{
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className="font-medium text-[12px] mb-[6px]"
                        style={{
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {item.category}
                      </Text>
                      <View className="flex-row gap-3">
                        <Text
                          allowFontScaling={false}
                          className={`font-bold text-base ${
                            item.discount ? "text-darkText line-through" : ""
                          }`}
                          style={{
                            color: isDarkMode ? "white" : "black",
                          }}
                        >
                          {item.price} {!item.discount && "грн"}
                        </Text>
                        {item.discount && (
                          <Text
                            allowFontScaling={false}
                            className="font-bold text-base text-green"
                          >
                            {(Number(item.price) *
                              (100 - Number(item.discount))) /
                              100}
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
                        className="min-w-[90px] py-3 rounded-full items-center "
                      >
                        <Text
                          allowFontScaling={false}
                          className={`font-bold text-[14px] ${
                            isDarkMode ? "text-black" : "text-white"
                          }`}
                        >
                          {loadingItems[item.id] ? (
                            <ActivityIndicator
                              size="small"
                              color={isDarkMode ? "#000" : "#fff"}
                            />
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
              ))
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text
                  allowFontScaling={false}
                  className="pt-20 text-[18px] font-bold text-center"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  Нічого не знайдено
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <ModalSortOptions
        isVisible={modalSortOptionsIsOpen}
        onClose={toggleSortModal}
        height={60}
      >
        <OptionsPicker
          selectedCategories={selectedCategories}
          onCategorySelect={handleCategorySelect}
        />
      </ModalSortOptions>
    </View>
  );
};
