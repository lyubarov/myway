import { Alert, Keyboard, Text, View } from "react-native";
import { AuthHeader } from "./components/AuthHeader";
import { CustomPhoneInput } from "@components/ui/CustomPhoneInput";
import { CustomButton } from "@components/ui/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { Formik } from "formik";
import { areAllFieldsValid } from "@utils/helpers";
import { phoneValidationSchema } from "@utils/validationsSchemes";
import { useAuth } from "src/firebase/context/authContext";
import { signInWithPhoneNumber } from "src/firebase/auth";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EntryScreen"
>;

export const CreateProfileSecondScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { setRegistrationData, setConfirmation, isDarkMode } = useAuth();

  const [sendingLoader, setSendingLoader] = useState(false);

  const handleContinue = async (values: { number: string }) => {
    const phoneNumber = `+380${values.number.replace(/\s/g, "")}`;
    try {
      setSendingLoader(true);
      const confirmation = await signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);

      setRegistrationData((prev: any) => ({
        ...prev,
        ...values,
      }));

      navigation.navigate("Authorization", {
        screen: "CreateProfileThirdStep",
      });
    } catch (error: any) {
      Alert.alert("❌ Помилка відправки OTP", error.message);
    } finally {
      setSendingLoader(false);
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Створення профілю" />
      <Formik
        initialValues={{ number: "" }}
        validationSchema={phoneValidationSchema}
        onSubmit={(values) => {
          handleContinue(values);
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => {
          const handlePhoneChange = (text: string) => {
            handleChange("number")(text);
            if (text.replace(/\s/g, "").length === 9) {
              Keyboard.dismiss();
            }
          };
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              <View className="flex-1 px-3 pb-5 justify-between">
                <View className="mt-5">
                  <Text
                    allowFontScaling={false}
                    className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                  >
                    Номер телефонy
                  </Text>
                  <CustomPhoneInput
                    placeholder="95 000 00 00"
                    value={values.number}
                    onChangeText={handlePhoneChange}
                    error={errors.number}
                  />
                </View>

                <View style={{ marginBottom: Platform.OS === "ios" ? 40 : 0 }}>
                  <CustomButton
                    title={sendingLoader ? "Надсилання..." : "Продовжити"}
                    onPress={() => handleSubmit()}
                    disabled={!areAllFieldsValid(values, errors)}
                    style="bg-green py-5 rounded-full w-full font-bold"
                    textColor={isDarkMode ? "text-black" : "text-white"}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </View>
  );
};
