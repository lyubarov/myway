import { Alert, Text, View } from "react-native";
import { AuthHeader } from "./components/AuthHeader";
import { CustomInput } from "@components/ui/CustomInput";
import { CustomButton } from "@components/ui/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { resetPassword, signIn } from "src/firebase/auth";
import { useAuth } from "src/firebase/context/authContext";
import { LinearGradient } from "expo-linear-gradient";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Authorization"
>;

export const LoginByEmailScreen = () => {
  const { isDarkMode } = useAuth();

  const navigation = useNavigation<AuthNavigationProp>();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Введіть правильну пошту")
      .required("Пошта обов’язкова"),
  });
  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      if (user) {
        navigation.navigate("MainContent", { screen: "MainScreen" });
      }
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert(
          "Невірна пошта або пароль",
          "Будь ласка, перевірте свої дані та спробуйте ще раз."
        );
      } else {
        Alert.alert("Помилка входу", "Сталася помилка, спробуйте ще раз.");
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    console.log(email);

    if (!email) {
      window.alert("Введіть пошту!");
    } else {
      await resetPassword(email);
      window.alert("✅ Лист із відновленням паролю надіслано!");
    }
  };
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Увійти до профілю" />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values.email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View className="flex-1 px-3">
            <View className="mt-10">
              <Text
                allowFontScaling={false}
                className={`font-main text-base font-medium items-start mb-4 ${
                  isDarkMode ? "text-white" : "text-darkStroke"
                }`}
              >
                Пошта
              </Text>
              <CustomInput
                placeholder="Пошта"
                value={values.email}
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                autoCapitalize="none"
              />
            </View>
            <View className="mt-8">
              <Text
                allowFontScaling={false}
                className={`font-main text-base font-medium items-start mb-4
                                ${
                                  isDarkMode ? "text-white" : "text-darkStroke"
                                }`}
              >
                Пароль
              </Text>
              <CustomInput
                placeholder="Пароль"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                autoCapitalize="none"
              />
            </View>

            <Text
              allowFontScaling={false}
              className={`font-main text-base  font-medium text-right mt-6 underline underline-offset-8
                ${isDarkMode ? "text-white" : "text-darkStroke"}`}
              onPress={() => handleResetPassword(values.email)}
            >
              Скинути пароль
            </Text>

            <LinearGradient
              colors={["#25C3B4", "#00A696"]}
              className="py-3 rounded-full w-full font-bold my-9"
            >
              <CustomButton
                title="Увійти"
                onPress={() => {
                  handleSubmit();
                }}
                textColor={isDarkMode ? "text-black" : "text-white"}
              />
            </LinearGradient>
          </View>
        )}
      </Formik>
    </View>
  );
};
