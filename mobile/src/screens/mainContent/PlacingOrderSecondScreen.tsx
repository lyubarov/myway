import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomInput } from "@components/ui/CustomInput";
import { Formik, FormikProps } from "formik";
import { CustomPhoneInput } from "@components/ui/CustomPhoneInput";
import { useEffect, useRef, useState } from "react";
import { Footer } from "./components/FooterForOrder";
import Progress from "./components/ProgressForOrder";
import Header from "./components/HeaderForOrder";
import { addOrderData } from "src/firebase/db";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

type PlacingOrderSecondScreenRouteProp = RouteProp<
  RootStackParamList,
  "MainContent"
>;

export const PlacingOrderSecondScreen = () => {
  const route = useRoute<PlacingOrderSecondScreenRouteProp>();
  const { currentUser, userFromDB, isDarkMode } = useAuth();
  const { totalAmount, address, cityRef, branchRef } = route.params || {};
  const [isActive, setIsActive] = useState(false);

  const [onSave, setOnSave] = useState(false);
  const navigation = useNavigation<AuthNavigationProp>();
  const formikRef = useRef<
    FormikProps<{
      firstName: string;
      lastName: string;
      number: string;
    }>
  >(null);

  const handleClose = () => {
    navigation.navigate("MainContent", {
      screen: "BasketScreen",
    });
  };

  const handleContinue = async () => {
    // if (!formikRef.current?.values) return;

    formikRef.current.setTouched({
      firstName: true,
      lastName: true,
      number: true,
    });

    // Перевіряємо чи є помилки валідації
    const errors = formikRef.current.errors;

    if (errors && Object.keys(errors).length > 0) return;

    // Перевіряємо чи всі поля заповнені
    const { firstName, lastName, number } = formikRef.current.values;
    if (!firstName || !lastName || !number) return;

    // Перевіряємо чи номер телефону має 9 цифр
    const phoneNumber = number.replace(/\D/g, "");
    if (phoneNumber.length !== 9) return;

    const userInfo = { ...address, ...formikRef.current?.values };
    if (onSave) {
      await addOrderData(currentUser?.uid, userInfo);
    }
    navigation.navigate("MainContent", {
      screen: "PlacingOrderThirdScreen",
      params: { totalAmount, userInfo, cityRef, branchRef },
    });
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <Header navigation={navigation} handleClose={handleClose} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-155}
            style={{ flex: 1 }}
          >
            <View className="px-3 py-5">
              <Progress status={"1/2"} />

              <View>
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[20px] mb-5"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  Отримувач
                </Text>
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 400 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View>
                    <Formik
                      innerRef={formikRef}
                      initialValues={{
                        firstName: userFromDB?.displayName
                          ? userFromDB?.displayName.split(" ")[0]
                          : "",
                        lastName: userFromDB?.displayName
                          ? userFromDB?.displayName.split(" ")[1]
                          : "",
                        number: userFromDB?.phoneNumber || "",
                      }}
                      validate={(values) => {
                        const errors: {
                          number?: string;
                          firstName?: string;
                          lastName?: string;
                        } = {};
                        const phoneNumber = values.number.replace(/\D/g, "");
                        if (phoneNumber.length !== 9) {
                          errors.number = "Номер телефону має містити 9 цифр";
                        }
                        const nameRegExp = /^[а-яА-ЯіІїЇєЄґҐ]+$/;
                        if (!nameRegExp.test(values.firstName)) {
                          errors.firstName =
                            "Ім'я має містити тільки українські літери без пробілів";
                        }

                        // Валідація для прізвища
                        if (!nameRegExp.test(values.lastName)) {
                          errors.lastName =
                            "Прізвище має містити тільки українські літери без пробілів";
                        }
                        return errors;
                      }}
                      onSubmit={(value) => {
                        address.push(value);
                      }}
                    >
                      {({
                        handleBlur,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                      }) => {
                        useEffect(() => {
                          setIsActive(
                            !!(
                              values.firstName &&
                              values.lastName &&
                              values.number
                            )
                          );
                        }, [values]);

                        return (
                          <View className="flex-1 mb-5">
                            <View className="mt-5">
                              <Text
                                allowFontScaling={false}
                                className="font-main text-base font-medium items-start mb-3"
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                Ім'я
                              </Text>
                              <CustomInput
                                placeholder="Ім'я"
                                value={values.firstName}
                                onChangeText={(text) => {
                                  setFieldValue("firstName", text);
                                }}
                                onBlur={handleBlur("firstName")}
                                error={touched.firstName && errors.firstName}
                              />
                              {touched.firstName && errors.firstName && (
                                <Text className="text-red text-xs">
                                  {errors.firstName}
                                </Text>
                              )}
                            </View>
                            <View className="mt-5">
                              <Text
                                allowFontScaling={false}
                                className="font-main text-base font-medium items-start mb-3"
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                Прізвище
                              </Text>
                              <CustomInput
                                placeholder="Прізвище"
                                value={values.lastName}
                                onChangeText={(text) => {
                                  setFieldValue("lastName", text);
                                }}
                                onBlur={handleBlur("lastName")}
                                error={touched.lastName && errors.lastName}
                              />
                              {touched.lastName && errors.lastName && (
                                <Text className="text-red text-xs">
                                  {errors.lastName}
                                </Text>
                              )}
                            </View>
                            <View className="mt-5">
                              <Text
                                allowFontScaling={false}
                                className="font-main text-base font-medium items-start mb-3"
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                Номер телефону
                              </Text>
                              <CustomPhoneInput
                                placeholder="95 000 00 00"
                                value={values.number}
                                onChangeText={(text) => {
                                  setFieldValue("number", text);
                                }}
                                error={errors.number}
                              />
                              {touched.number && errors.number && (
                                <Text className="text-red text-xs">
                                  {errors.number}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    </Formik>

                    <TouchableOpacity
                      onPress={() => setOnSave(!onSave)}
                      className="py-8 border-b border-lightGrey flex-row justify-between items-center"
                    >
                      <View className="flex-row gap-3 items-center">
                        <Text
                          allowFontScaling={false}
                          className="font-bold"
                          style={{
                            color: isDarkMode ? "white" : "black",
                          }}
                        >
                          Зберегти дані для доставки
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setOnSave((prev) => !prev);
                        }}
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: onSave ? "#25C3B4" : "#AAE2DD",
                          borderColor: "#CBEAE7",
                          borderWidth: 3,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>

            <Footer
              navigation={navigation}
              handleContinue={handleContinue}
              totalAmount={totalAmount}
              isActive={isActive}
              first={false}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
