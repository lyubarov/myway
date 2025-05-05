import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { AuthHeader } from "./components/AuthHeader";
import { CustomInput } from "@components/ui/CustomInput";
import { CustomPhoneInput } from "@components/ui/CustomPhoneInput";
import { CustomButton } from "@components/ui/CustomButton";
import AppleLogo from "@assets/svg/AppleLogo";
import MailLogo from "@assets/svg/MailLogo";
import GoogleLogo from "@assets/svg/GoogleLogo";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { LinearGradient } from "expo-linear-gradient";
import {
  confirmOTP,
  signIn,
  signInWithApple,
  signInWithGoogle,
} from "src/firebase/auth";
import { useState } from "react";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Authorization",
  "MainContent"
>;

export const LoginScreen = () => {
  const { isDarkMode } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<AuthNavigationProp>();
  const handleEmailLogin = () => {
    navigation.navigate("Authorization", { screen: "LoginByEmail" });
  };
  const [resendTimer, setResendTimer] = useState(0);

  const validationSchema = Yup.object().shape({
    number: Yup.string()
      .matches(
        /^\d{2} \d{3} \d{2} \d{2}$/,
        "Phone number must be exactly 9 digits and contain only numbers"
      )
      .required("Phone number is required"),
    code: Yup.string()
      .matches(/^\d{6}$/, "Code must be exactly 6 digits")
      .required("Code is required"),
  });
  const [confirmation, setConfirmation] = useState(null);

  const handleSendCode = async (phoneNumber: string) => {
    if (resendTimer > 0) return;

    try {
      const confirmationResult = await signIn(phoneNumber);
      setConfirmation(confirmationResult);
      setResendTimer(30);
      startResendTimer();
    } catch (error: any) {
      Alert.alert("❌ Помилка відправки коду", error.message);
    }
  };

  const handleVerifyCode = async (code: string, phoneNumber: string) => {
    if (!confirmation) {
      Alert.alert("❌ Помилка", "Спочатку надішліть код підтвердження.");
      return;
    }
    try {
      setLoading(true);
      const user = await confirmOTP(confirmation, code, phoneNumber);

      if (user) {
        Alert.alert("✅ Вхід успішний!", `Ласкаво просимо!`);
        navigation.navigate("MainContent", { screen: "MainScreen" });
      } else {
        Alert.alert("❌ Невірний код", "Код підтвердження невірний.");
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log(user);

      if (user) {
        navigation.navigate("MainContent", {
          screen: "MainScreen",
        });
      }
    } catch (error) {
      console.error("Помилка входу через Google:", error);
    }
  };
  const handleAppleSignIn = async () => {
    try {
      const user = await signInWithApple();
      console.log(user);

      if (user) {
        navigation.navigate("MainContent", {
          screen: "MainScreen",
        });
      }
    } catch (error) {
      console.error("Помилка входу через Google:", error);
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
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Увійти до профілю" />
      <Formik
        initialValues={{ number: "", code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleVerifyCode(values.code, values.number);
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View className="flex-1 px-3">
            <View className="mt-10">
              <Text
                allowFontScaling={false}
                className="font-main text-base font-medium items-start mb-4"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Номер телефонy
              </Text>
              <CustomPhoneInput
                placeholder="95 000 00 00"
                value={values.number}
                onChangeText={handleChange("number")}
                error={touched.number && errors.number}
              />
            </View>
            <View className="mt-6">
              <Text
                allowFontScaling={false}
                className={`font-main text-base font-medium items-start mb-4 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Код підтвердження
              </Text>
              <CustomInput
                placeholder="000000"
                value={values.code}
                onChangeText={handleChange("code")}
                error={touched.code && errors.code}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                const number = "+380" + values.number.replace(/\s/g, "");
                handleSendCode(number);
              }}
              disabled={resendTimer > 0}
              className={`flex-row gap-3 mt-6 justify-end`}
            >
              <Text
                allowFontScaling={false}
                className={`underline underline-offset-8 ${
                  isDarkMode ? "text-white" : "text-darkStroke"
                }`}
              >
                {resendTimer > 0
                  ? `Повторно через ${resendTimer} сек`
                  : "Надіслати код"}
              </Text>
            </TouchableOpacity>
            <LinearGradient
              colors={["#25C3B4", "#00A696"]}
              className="py-2 rounded-full w-full font-bold my-9"
            >
              <CustomButton
                title={loading ? "Перевірка..." : "Увійти"}
                onPress={() => {
                  handleSubmit();
                }}
                textColor={isDarkMode ? "text-black" : "text-white"}
              />
            </LinearGradient>
            <View className="flex-row justify-center items-center gap-x-6 mb-9">
              <View className="flex-1 border border-borderGrey" />
              <Text
                allowFontScaling={false}
                className={`font-main text-base font-medium opacity-70
                   ${isDarkMode ? "text-white" : "text-black"}`}
              >
                Або увійти через
              </Text>
              <View className="flex-1 border border-borderGrey" />
            </View>
            <View className="flex-row w-full justify-between space-x-3">
              <TouchableOpacity
                className={`rounded-full  flex-1 py-5 items-center
                  ${isDarkMode ? "bg-white" : "bg-darkBlack"}`}
                onPress={handleEmailLogin}
              >
                <MailLogo isDarkMode={isDarkMode} />
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-full flex-1 py-5 items-center
                                  ${isDarkMode ? "bg-white" : "bg-darkBlack"}`}
                onPress={() => handleGoogleSignIn()}
              >
                <GoogleLogo />
              </TouchableOpacity>
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => handleAppleSignIn()}
                  className={`rounded-full  flex-1 py-5 items-center
                  ${isDarkMode ? "bg-white" : "bg-darkBlack"}`}
                >
                  <AppleLogo isDarkMode={isDarkMode} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
