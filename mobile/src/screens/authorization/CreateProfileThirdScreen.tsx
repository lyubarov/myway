import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { AuthHeader } from "./components/AuthHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomInput } from "@components/ui/CustomInput";
import { CustomButton } from "@components/ui/CustomButton";

import { Formik } from "formik";
import { useEffect, useState } from "react";
import { otpValidationSchema } from "@utils/validationsSchemes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useAuth } from "src/firebase/context/authContext";
import { confirmAndLinkPhone, signInWithPhoneNumber } from "src/firebase/auth";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Authorization"
>;

export const CreateProfileThirdScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    registrationData,
    confirmation,
    setConfirmation,
    setLoading,
    loading,
    isDarkMode,
  } = useAuth();

  const [resendTimer, setResendTimer] = useState(0);

  const handleSendCode = async (phoneNumber: string) => {
    if (resendTimer > 0) return; // Не дозволяємо надсилати повторно, поки таймер активний

    try {
      const confirmationResult = await signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      Alert.alert(`📩 Код відправлено на ${phoneNumber}!`);
      setResendTimer(30); // Запускаємо таймер для повторної відправки
      startResendTimer();
    } catch (error: any) {
      Alert.alert("❌ Помилка відправки коду", error.message);
    }
  };
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = async (values: { code: string }) => {
    setLoading(true);
    try {
      const user = await confirmAndLinkPhone(
        confirmation,
        values.code,
        registrationData
      );
      navigation.navigate("MainContent", {
        screen: "HomeScreen",
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        error.code === "auth/credential-already-in-use"
          ? "Не вдалося привязати номер телефону, оскільки він вже використовується"
          : "❌ Помилка підтвердження OTP",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResendTimer(30);
    startResendTimer();
  }, []);
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Створення профілю" />
      <Formik
        initialValues={{ code: "" }}
        validationSchema={otpValidationSchema}
        onSubmit={(values) => handleVerifyCode(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
          return (
            <View className="flex-1 px-3 justify-between">
              <View>
                <View className="mt-5">
                  <Text
                    allowFontScaling={false}
                    className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                  >
                    Код підтвердження
                  </Text>
                  <CustomInput
                    placeholder="000000"
                    value={values.code}
                    keyboardType="numeric"
                    onBlur={handleBlur("code")}
                    onChangeText={handleChange("code")}
                    error={errors.code}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const number =
                      "+380" + registrationData.number.replace(/\s/g, "");
                    handleSendCode(number);
                  }}
                  disabled={resendTimer > 0}
                  className={`flex-row gap-3 mt-6 justify-end`}
                >
                  <Text
                    allowFontScaling={false}
                    className={`underline underline-offset-8 
                                              ${
                                                isDarkMode
                                                  ? "text-white"
                                                  : "text-darkStroke"
                                              }

                      `}
                  >
                    {resendTimer > 0
                      ? `Надіслати код повторно ${resendTimer} сек`
                      : "Надіслати код повторно"}
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomButton
                title={loading ? "Загрузка..." : "Продовжити"}
                onPress={() => {
                  handleSubmit();
                }}
                disabled={values.code === ""}
                style="bg-green py-5 rounded-full w-full font-bold"
                textColor={isDarkMode ? "text-black" : "text-white"}
              />
            </View>
          );
        }}
      </Formik>
    </View>
  );
};
