import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getOrdersForUser } from "src/firebase/db";
import { useAuth } from "src/firebase/context/authContext";
import { CustomButton } from "@components/ui/CustomButton";
import { ToggleIconOptions } from "@assets/svg/ToggleIcon";
import { ArrowBack, ArrowBackWhite } from "@assets/svg/ArrowBack";

interface Order {
  id: string;
  orderNumber: number;
  city: string;
  branch?: string;
  street?: string;
  apartment?: string;
  totalAmount: number;
  status: string;
  products: Product[];
  ttn: string;
}

interface Product {
  product: {
    id: string;
    name: string;
    images: string[];
  };
  quantity: number;
}

export default function HistoryOrdersScreen() {
  const navigation = useNavigation();
  const { userFromDB, isDarkMode } = useAuth();

  const [listOrders, setListOrders] = useState<Order[]>([]);

  const [isOpen, setIsOpen] = useState<string[]>([]);

  useEffect(() => {
    const fetchListOrders = async () => {
      if (userFromDB) {
        const orders: Order[] = await getOrdersForUser(userFromDB.uid);
        setListOrders(orders || []);
      }
    };
    fetchListOrders();
  }, []);

  const toggleOrder = (orderId: string) => {
    setIsOpen((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  function formatFirestoreTimestamp(timestamp: {
    seconds: number;
    nanoseconds: number;
  }): string {
    const date = new Date(timestamp.seconds * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} / ${hours}:${minutes}`;
  }
  const handleToOffice = async () => {
    navigation.navigate("MainScreen", { screen: "Кабінет" });
  };
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <View className="w-full flex-row items-center justify-between p-5">
        <TouchableOpacity onPress={handleToOffice} className="px-2">
          {isDarkMode ? <ArrowBackWhite /> : <ArrowBack />}
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          className={`font-main text-lg font-bold flex-1 text-center ${
            isDarkMode && "text-white"
          }`}
        >
          Історія замовлень
        </Text>
      </View>
      <View className="flex-1">
        {listOrders.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
            <View className="px-3 gap-3">
              {listOrders
                .sort((a, b) => b.orderNumber - a.orderNumber)
                .map((item) => (
                  <View
                    key={item.id}
                    className={`relative p-3 rounded-[24px] ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <TouchableOpacity
                      onPress={() => toggleOrder(item.id)}
                      className="flex-row justify-between"
                    >
                      <Text className="text-[12px] text-darkStroke font-normal mb-2">
                        Замовлення №{item.orderNumber}
                      </Text>
                      <ToggleIconOptions isOpen={isOpen.includes(item.id)} />
                    </TouchableOpacity>
                    <Text className="text-[12px] text-darkStroke font-normal mb-2">
                      Дата: {formatFirestoreTimestamp(item.createdAt)}
                    </Text>
                    <Text className="text-[12px] text-darkStroke font-normal mb-2">
                      Адреса: {item.city}, {item.branch && item.branch}
                      {item.street ? item.street : item.apartment}
                    </Text>
                    <Text className="text-[12px] text-darkStroke font-normal mb-2">
                      Сума замовлення:{" "}
                      <Text
                        className="text-[14px]"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.totalAmount}₴
                      </Text>
                    </Text>
                    {item.ttn && (
                      <Text className="text-[12px] text-darkStroke font-normal mb-2">
                        TTN:{" "}
                        <Text
                          className="text-[14px]"
                          style={{ color: isDarkMode ? "white" : "black" }}
                        >
                          {item.ttn}
                        </Text>
                      </Text>
                    )}
                    <Text
                      className={`text-[12px] font-normal ${
                        item?.status?.includes("обробці")
                          ? "text-blue-500"
                          : item?.status?.includes("відправлено")
                          ? "text-orange-500"
                          : "text-green"
                      } ${isOpen.includes(item.id) && "mb-3"}`}
                    >
                      {item.status}
                    </Text>
                    {isOpen.includes(item.id) && (
                      <View className="border-t border-gray-200 p-3 pb-0">
                        {Array.isArray(item.products) &&
                          item.products.map((product) => (
                            <View
                              key={product.product.id}
                              className=" flex-row gap-2 items-center"
                            >
                              <Image
                                source={{ uri: product.product.images[0] }}
                                className="w-[41px] h-[48px] mb-3"
                              />
                              <View>
                                <Text
                                  className="text-black font-bold"
                                  style={{
                                    color: isDarkMode ? "white" : "black",
                                  }}
                                >
                                  {product.product.name}
                                </Text>
                                <Text
                                  className="text-black mt-1"
                                  style={{
                                    color: isDarkMode ? "white" : "black",
                                  }}
                                >
                                  {product.quantity} шт
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>
                    )}
                  </View>
                ))}
            </View>
          </ScrollView>
        ) : (
          <View className="px-3 flex-1 justify-end mb-[50px]">
            <Image
              className="ml-auto mr-auto mb-10"
              source={require("@assets/emptyHistory.png")}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: 1 / 1,
                resizeMode: "contain",
              }}
            />
            <Text
              className="font-bold text-[28px] text-center mb-3"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Історія порожня
            </Text>
            <Text
              className="text-base text-center mb-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Не хвилюйся, це легко виправити!{"\n"} Зроби свою першу покупку.
            </Text>
            <CustomButton
              title="Перейти до каталогу"
              onPress={() => {
                navigation.navigate("MainScreen", { screen: "Каталог" });
              }}
              style="bg-green py-5 rounded-full w-full font-bold"
              textColor={isDarkMode ? "text-black" : "text-white"}
            />
          </View>
        )}
      </View>
    </View>
  );
}
