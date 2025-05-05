import { Text, View } from "react-native";
import { AuthHeader } from "./components/AuthHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomInput } from "@components/ui/CustomInput";
import { CustomButton } from "@components/ui/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "src/firebase/context/authContext";
export const ResetPasswordScreen = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Введіть правильну пошту")
      .required("Пошта обов’язкова"),
  });
  const { isDarkMode } = useAuth();

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Скидання паролю" />
      <Formik
        initialValues={{ password: "", newPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={() => {
          console.log("logingg");
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View className="flex-1 px-3">
            <View className="mt-10">
              <Text
                allowFontScaling={false}
                className="font-main text-base font-medium items-start mb-4"
              >
                Новий пароль
              </Text>
              <CustomInput
                placeholder="Введіть пароль"
                value={values.password}
                keyboardType="default"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                autoCapitalize="none"
              />
            </View>
            <View className="mt-8">
              <Text
                allowFontScaling={false}
                className={`font-main text-base font-medium items-start mb-4
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
              >
                Підтвердження нового паролю
              </Text>
              <CustomInput
                placeholder="Повторіть пароль"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={errors.newPassword}
                autoCapitalize="none"
              />
            </View>

            <CustomButton
              title="Увійти"
              onPress={() => handleSubmit()}
              style="bg-green py-3 rounded-full w-full font-bold mt-10"
            />
          </View>
        )}
      </Formik>
    </View>
  );
};
