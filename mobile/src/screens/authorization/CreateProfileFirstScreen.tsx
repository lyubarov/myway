import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthHeader } from "./components/AuthHeader";
import { CustomInput } from "@components/ui/CustomInput";
import { CustomButton } from "@components/ui/CustomButton";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import DatePicker from "./components/DatePicker";
import { registrationValidationSchema } from "@utils/validationsSchemes";
import { areAllFieldsValid } from "@utils/helpers";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EntryScreen"
>;

export const CreateProfileFirstScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { setRegistrationData, isDarkMode } = useAuth();

  const handleContinue = (data: {}) => {
    navigation.navigate("Authorization", {
      screen: "CreateProfileSecondStep",
    });
    setRegistrationData((prev: {}) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Створення профілю" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dateOfBirthday: { day: "", month: "", year: "" },
              }}
              validationSchema={registrationValidationSchema}
              onSubmit={(values) => {
                const displayName =
                  `${values.firstName} ${values.lastName}`.trim();
                const updatedValues = {
                  ...values,
                  displayName,
                };
                handleContinue(updatedValues);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => {
                return (
                  <View className="flex-1 px-3">
                    <View className="mt-5">
                      <Text
                        allowFontScaling={false}
                        className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                      >
                        Ім’я
                      </Text>
                      <CustomInput
                        placeholder="Ім’я"
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        error={touched.firstName && errors.firstName}
                      />
                    </View>
                    <View className="mt-6">
                      <Text
                        allowFontScaling={false}
                        className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                      >
                        Прізвище
                      </Text>
                      <CustomInput
                        placeholder="Прізвище"
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        error={touched.lastName && errors.lastName}
                      />
                    </View>
                    <DatePicker
                      value={values.dateOfBirthday}
                      setFieldValue={setFieldValue}
                      error={touched.dateOfBirthday && errors.dateOfBirthday}
                    />

                    <View className="mt-6">
                      <Text
                        allowFontScaling={false}
                        className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                      >
                        Пошта
                      </Text>
                      <CustomInput
                        placeholder="Пошта"
                        value={values.email}
                        keyboardType="email-address"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        error={touched.email && errors.email}
                        autoCapitalize="none"
                      />
                    </View>
                    <View className="mt-6">
                      <Text
                        allowFontScaling={false}
                        className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
                      >
                        Пароль
                      </Text>
                      <CustomInput
                        placeholder="Пароль"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        error={touched.password && errors.password}
                        autoCapitalize="none"
                      />
                    </View>

                    <CustomButton
                      title="Продовжити"
                      onPress={() => {
                        handleSubmit();
                      }}
                      disabled={!areAllFieldsValid(values, errors)}
                      style="bg-green py-4 rounded-full w-full font-bold mt-[45px]"
                      textColor={isDarkMode ? "text-black" : "text-white"}
                    />
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};
