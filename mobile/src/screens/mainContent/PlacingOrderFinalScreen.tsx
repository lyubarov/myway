import { useNavigation, useRoute } from "@react-navigation/native";
import { useUsersProduct } from "@utils/infoContext";
import { createOrder, getRecipientRef } from "@utils/novaPay";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
import {
  addUserNotification,
  clearCart,
  createOrderForUsers,
  updateReferralSpent,
  updateUserWallet,
} from "src/firebase/db";

export default function PlacingOrderFinalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { myCash, totalAmount, totalSum, data, cityRef, branchRef } =
    route.params;
  const { userFromDB, refreshUserData, isDarkMode } = useAuth();
  const { setCartProducts } = useUsersProduct();
  console.log(cityRef);

  const clearUserCart = async () => {
    const newMyStatus = userFromDB?.myStatus + totalAmount;
    const userRef = await getRecipientRef({
      cityRef,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: `380${data.number}`,
    });
    console.log("userRef==>>", userRef);

    if (userFromDB.referralCode) {
      await updateReferralSpent(
        userFromDB.referralCode,
        userFromDB.uid,
        totalSum
      );
    }
    await clearCart(userFromDB?.uid);
    await updateUserWallet(userFromDB?.uid, myCash, newMyStatus);
    const resPhone = data.number.replace(/\D/g, "");

    const orderData = {
      cityRecipient: cityRef, // Ref міста отримувача
      recipientWarehouse: branchRef, // Ref відділення отримувача
      recipientRef: userRef.recipientRef, // Ref отримувача
      contactRecipient: userRef.recipientContactRef,
      recipientName: `${data.firstName} ${data.lastName}`, // Ім'я отримувача
      recipientPhone: `380${resPhone}`, // Телефон отримувача
    };

    console.log("orderData", orderData);

    const ttn = await createOrder(orderData);
    const dataWithTtn = {
      ...data,
      ttn,
    };
    await createOrderForUsers(userFromDB.uid, dataWithTtn);
    setCartProducts([]);
    await refreshUserData(userFromDB?.uid);
    await addUserNotification(
      userFromDB.uid,
      "Ваше замовлення оформлено!",
      "Замовлення успішно оформлено і незабаром його буде відправлено!",
      "info"
    );
  };
  const handleToCatalog = async () => {
    await clearUserCart();
    navigation.navigate("MainScreen", { screen: "Каталог" });
  };
  const handleToHolovna = async () => {
    await clearUserCart();
    navigation.navigate("MainScreen", { screen: "Головна" });
  };
  const handleToStatusOrder = async () => {
    await clearUserCart();
    navigation.navigate("MainContent", { screen: "HistoryOrdersScreen" });
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 55 }}>
        <View className="items-center pt-[70px] px-3">
          <Image source={require("@assets/icons/Illustration.png")} />
          <Text
            allowFontScaling={false}
            className="text-[28px] font-bold mt-[36px] mb-3"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Замовлення прийнято!
          </Text>
          <Text
            allowFontScaling={false}
            className="font-medium text-base text-darkStroke mb-9"
          >
            Чудовий вибір! Готуйся отримати максимум користі та розкрити свій
            потенціал
          </Text>
          <LinearGradient
            colors={["#25c3b4", "#00a696"]}
            className="w-full py-5 rounded-full mb-3"
          >
            <TouchableOpacity onPress={handleToCatalog}>
              <Text
                allowFontScaling={false}
                className="text-center  text-[20px] font-bold"
                style={{ color: isDarkMode ? "black" : "white" }}
              >
                Продожити покупки
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={handleToHolovna}
            className={`${
              isDarkMode ? "bg-white" : "bg-black"
            }  w-full py-5 rounded-full `}
          >
            <Text
              allowFontScaling={false}
              className="text-center text-white text-[20px] font-bold"
              style={{ color: isDarkMode ? "black" : "white" }}
            >
              На головну
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToStatusOrder}>
            <Text
              allowFontScaling={false}
              className="text-darkStroke text-base mt-9 underline"
            >
              Переглянути статус замовлення
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
