import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useState } from "react";
import Progress from "./components/ProgressForOrder";
import { Footer } from "./components/FooterForOrder";
import Header from "./components/HeaderForOrder";
import { useAuth } from "src/firebase/context/authContext";
import { useUsersProduct } from "@utils/infoContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent",
  "LiqPayWebView"
>;

export const PlacingOrderThirdScreen = () => {
  const route = useRoute();
  const { userFromDB, isDarkMode } = useAuth();
  const { cartProducts } = useUsersProduct();
  const { totalAmount, userInfo, cityRef, branchRef } = route.params || {};
  const totalSum = totalAmount;
  const myMoney = userFromDB?.wallet;

  const [myCash, setMyCash] = useState(userFromDB?.wallet);
  const navigation = useNavigation<AuthNavigationProp>();
  const [selectedId, setSelectedId] = useState<number>(1);
  const [promoCodeValue, setPromoCodeValue] = useState<number | null>(null);
  const [paymentMoney, setPaymentMoney] = useState<string | null>(null);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [finalSumState, setFinalSumState] = useState(totalAmount);
  const [promoCode, setPromoCode] = useState("");

  const correctPromoCode = "123qwe";

  const [isError, setIsError] = useState<{
    cash: null | boolean;
    promocode: null | boolean;
  }>({
    cash: null,
    promocode: null,
  });
  const handleClose = () => {
    navigation.navigate("MainContent", {
      screen: "BasketScreen",
    });
  };

  const handleActivate = () => {
    if (isPromoApplied) return;

    if (promoCode.trim() === correctPromoCode) {
      setPromoCodeValue(500);
      setFinalSumState((prev) => prev - 500);
      setIsPromoApplied(true);
      setIsError((prev) => ({
        ...prev,
        promocode: false,
      }));
    } else {
      setPromoCodeValue(null);
      setIsError((prev) => ({
        ...prev,
        promocode: true,
      }));
    }
  };
  const handleApply = (value: number) => {
    if (value >= Number(paymentMoney)) {
      setFinalSumState((prev) => prev - Number(paymentMoney));
      setIsError((prev) => ({
        ...prev,
        cash: false,
      }));
      setMyCash((prev) => prev - Number(paymentMoney));
    } else {
      setIsError((prev) => ({
        ...prev,
        cash: true,
      }));
    }
  };
  const deliveryOptions = [
    {
      id: 1,
      name: "Оплата карткою онлайн",
    },
    // {
    //   id: 2,
    //   name: "Оплата під час отримання товару",
    // },
    {
      id: 3,
      name: "Оплата коштами",
      description: `На вашому рахунку: ${
        myCash ? Number(myCash).toFixed(2) : "0.00"
      } коштів`,
    },
  ];
  const handlePayment = (userData) => {
    const orderId = `ORDER_${Date.now()}`;
    navigation.navigate("LiqPayWebView", {
      myCash,
      amount: finalSumState,
      totalSum,
      userData,
      orderId,
      description: "Оплата товару",
      cityRef,
      branchRef,
    });
  };

  const handleFinal = async () => {
    const data = {
      ...userInfo,
      totalAmount: finalSumState,
      status: "очікує відправлення",
      payment: 1,
      products: cartProducts,
      paymentType: "Оплата карткою онлайн",
      paymentByWayl: myMoney - myCash,
    };

    handlePayment(data);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-155}
            style={{ flex: 1 }}
          >
            <Header navigation={navigation} handleClose={handleClose} />

            <View className="px-3 py-5">
              <Progress status={"3/4"} />
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 340 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[20px] mb-5"
                    style={{
                      color: isDarkMode ? "white" : "black",
                    }}
                  >
                    Обрати спосіб оплати
                  </Text>
                  <View className="gap-3">
                    {deliveryOptions.map((option) => (
                      <View key={option.id}>
                        <TouchableOpacity
                          onPress={() => setSelectedId(option.id)}
                          className="py-3 border-b border-lightGrey flex-row justify-between items-center"
                        >
                          <View className="flex-row gap-3 items-center">
                            <View className="max-w-[236px]">
                              <Text
                                allowFontScaling={false}
                                className="text-base font-bold"
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                {option.name}
                              </Text>
                              {option.description && (
                                <Text
                                  allowFontScaling={false}
                                  className="mt-1"
                                  style={{
                                    color: isDarkMode ? "white" : "black",
                                  }}
                                >
                                  {option.description}
                                </Text>
                              )}
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => setSelectedId(option.id)}
                            className="w-6 h-6 rounded-full"
                            style={{
                              backgroundColor:
                                selectedId === option.id
                                  ? "#25C3B4"
                                  : "#AAE2DD",
                              borderColor: "#CBEAE7",
                              borderWidth: 3,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {selectedId == 3 && (
                      <View className="mt-3">
                        <View className="relative">
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Введіть суму"
                            value={paymentMoney}
                            onChangeText={(text) =>
                              setPaymentMoney(text.replace(/[^0-9]/g, ""))
                            }
                            className={`p-5 text-[16px] bg-lightLightGray rounded-full
                        ${isError.cash && "border border-red"}`}
                          />

                          <TouchableOpacity
                            onPress={() => handleApply(myCash)}
                            className="bg-black rounded-full px-6 py-4 self-start absolute right-1 top-1 shadow-md"
                          >
                            <Text
                              allowFontScaling={false}
                              className="text-white text-[14px] font-medium"
                            >
                              Застосувати
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                  <View className="mt-3">
                    <Text
                      allowFontScaling={false}
                      className="mb-3 text-base font-bold"
                      style={{
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Промокод
                    </Text>
                    <View className="relative">
                      <TextInput
                        placeholder="Промокод"
                        onChangeText={setPromoCode}
                        className={`${
                          isDarkMode
                            ? "bg-secondary border border-darkCardBorder text-white"
                            : "bg-lightLightGray text-black"
                        } p-5 text-[16px] rounded-full ${
                          isError.promocode ? "text-red" : "text-green"
                        }`}
                        placeholderTextColor="gray"
                      />
                      {isError.promocode !== null && (
                        <Text
                          allowFontScaling={false}
                          className={`text-[14px] font-medium mt-2 ${
                            isError.promocode ? "text-red" : "text-green"
                          }`}
                        >
                          {isError.promocode
                            ? "Промокод не дійсний, будь ласка, повторіть спробу."
                            : "Промокод активовано, знижка 500 грн."}
                        </Text>
                      )}

                      <TouchableOpacity
                        onPress={() => handleActivate()}
                        className={`${
                          isDarkMode ? "bg-white" : "bg-black "
                        } rounded-full px-6 py-4 self-start absolute right-1 top-2 shadow-md`}
                      >
                        <Text
                          allowFontScaling={false}
                          className="text-white text-[14px] font-medium"
                          style={{
                            color: isDarkMode ? "black" : "white",
                          }}
                        >
                          Активувати
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            <Footer
              navigation={navigation}
              handleContinue={handleFinal}
              totalAmount={finalSumState}
              totalSum={totalSum}
              isActive={!!selectedId}
              first={false}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
