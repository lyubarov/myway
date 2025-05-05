import { CustomInput } from "@components/ui/CustomInput";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import DatePicker from "@screens/authorization/components/DatePicker";
import { Formik } from "formik";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomPhoneInput } from "@components/ui/CustomPhoneInput";
import ChangeIcon from "@assets/svg/ChangeIcon";
import { useAuth } from "src/firebase/context/authContext";
import { updateUserInFirestore } from "src/firebase/db";
import { CustomButton } from "@components/ui/CustomButton";
import { useEffect, useState } from "react";
import CorrectIcon from "@assets/svg/CorrenctIcon";
import { uploadUserPhoto } from "src/firebase/storage";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
  const { userFromDB, refreshUserData, isDarkMode } = useAuth();
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [editedAddress, setEditedAddress] = useState({
    city: "",
    branch: "",
    street: "",
    houseNumber: "",
    apartment: "",
  });
  const [photoURL, setPhotoURL] = useState<string | null>(userFromDB?.photoUrl);
  const [loader, setLoader] = useState(false);
  const initialValues = {
    firstName: userFromDB?.displayName?.split(" ")[0] || "",
    lastName: userFromDB?.displayName?.split(" ")[1] || "",
    email: userFromDB?.email || "",
    phoneNumber: userFromDB?.phoneNumber || "",
    dateOfBirthday: {
      day: userFromDB?.dateOfBirthday?.day || "",
      month: userFromDB?.dateOfBirthday?.month || "",
      year: userFromDB?.dateOfBirthday?.year || "",
    },
  };
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    const refresh = async () => await refreshUserData(userFromDB?.uid);
    refresh();
  }, []);

  const handleContinue = async (data: any) => {
    try {
      const uid = userFromDB?.uid;
      if (!uid) {
        console.log("errooor");
        return;
      }
      console.log("fffff");

      await updateUserInFirestore(uid, data);
      await refreshUserData(uid);
      setIsChanged(false);
    } catch (error) {
      console.error("Помилка при оновленні користувача:", error);
    }
  };

  const handlePhotoUpload = async () => {
    if (!userFromDB?.uid) {
      console.error("UID користувача не знайдено");
      return;
    }

    const newPhotoURL = await uploadUserPhoto(userFromDB.uid);
    if (newPhotoURL) {
      try {
        setLoader(true);
        setPhotoURL(newPhotoURL);
        await refreshUserData(userFromDB.uid);
      } catch (error) {
      } finally {
        setLoader(false);
      }
    }
  };

  const handleChangeAddress = async (index: number) => {
    if (!userFromDB?.uid) return;

    const updatedAddresses = [...userFromDB.DateForOrder];
    updatedAddresses[index] = editedAddress;

    await updateUserInFirestore(userFromDB.uid, {
      DateForOrder: updatedAddresses,
    });

    refreshUserData(userFromDB.uid);
    setEditingAddress(null);
  };
  const handleAddAddress = async () => {
    const newAddress = {
      city: "",
      branch: "",
      street: "",
      houseNumber: "",
      apartment: "",
    };
    setEditedAddress(newAddress);

    const updatedAddresses = [newAddress, ...(userFromDB?.DateForOrder || [])];
    await updateUserInFirestore(userFromDB?.uid, {
      DateForOrder: updatedAddresses,
    });
    await refreshUserData(userFromDB?.uid);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 150 }}
          nestedScrollEnabled={true}
        >
          <AuthHeader title="Контактна інформація" />
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={async (values) => {
              const displayName =
                `${values.firstName} ${values.lastName}`.trim();
              const updatedValues = { ...values, displayName };

              await handleContinue(updatedValues);
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
              useEffect(() => {
                const hasChanged =
                  JSON.stringify(values) !== JSON.stringify(initialValues);
                setIsChanged(hasChanged);
              }, [values]);
              return (
                <View className="flex-1 px-3">
                  <View className="items-center">
                    <View className="relative ">
                      {loader ? (
                        <View className="w-40 h-40 rounded-full border bg-gray-200 justify-center items-center">
                          <Text allowFontScaling={false}>
                            Loading new photo...
                          </Text>
                        </View>
                      ) : (
                        <Image
                          source={
                            photoURL
                              ? { uri: photoURL }
                              : userFromDB.photoUrl
                              ? { uri: userFromDB.photoUrl }
                              : require("@assets/icons/icon.png")
                          }
                          className="w-40 h-40 rounded-full border-[0.5px] "
                        />
                      )}
                      <TouchableOpacity onPress={handlePhotoUpload}>
                        <View
                          className={`absolute bottom-2 right-2 ${
                            isDarkMode
                              ? "bg-darkCard border border-darkCardBorder"
                              : "bg-gray-300"
                          } p-1 rounded-full w-[42px] h-[42px] justify-center items-center`}
                        >
                          <ChangeIcon size="22" isDarkMode={isDarkMode} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="mt-5">
                    <Text
                      allowFontScaling={false}
                      className="font-main text-base font-medium items-start mb-4"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      Ім'я
                    </Text>
                    <CustomInput
                      placeholder="Ім'я"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      error={touched.firstName && errors.firstName}
                    />
                  </View>
                  <View className="mt-6">
                    <Text
                      allowFontScaling={false}
                      className="font-main text-base font-medium items-start mb-4"
                      style={{ color: isDarkMode ? "white" : "black" }}
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
                  <View className="mt-5">
                    <Text
                      allowFontScaling={false}
                      className="font-main text-base font-medium items-start mb-4"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      Номер телефонy
                    </Text>
                    <CustomPhoneInput
                      placeholder="95 000 00 00"
                      value={values.phoneNumber}
                      onChangeText={handleChange("phoneNumber")}
                      error={errors.phoneNumber}
                    />
                  </View>

                  <View className="mt-6">
                    <Text
                      allowFontScaling={false}
                      className="font-main text-base font-medium items-start mb-4"
                      style={{ color: isDarkMode ? "white" : "black" }}
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
                  <CustomButton
                    title="Зберегти"
                    style="bg-green text-white py-5 rounded-full mt-5"
                    onPress={() => handleSubmit()}
                    disabled={!isChanged}
                    textColor={isDarkMode ? "text-black" : "text-white"}
                  />

                  <View className="mt-12">
                    <View className="flex-row justify-between">
                      <Text
                        allowFontScaling={false}
                        className="text-[20px] font-bold"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        Мої адреси
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (userFromDB?.DateForOrder?.length == 3) {
                            Alert.alert("Ви можете додати лише 3 адреси");
                          } else {
                            handleAddAddress();
                            setEditingAddress(0);
                          }
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          className="text-base font-bold text-green pointer"
                        >
                          Додати
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="mt-6">
                      {userFromDB?.DateForOrder?.length > 0 &&
                        [...(userFromDB?.DateForOrder || [])].map(
                          (item, index) => (
                            <View key={index} className="mb-3">
                              <View className="flex-row justify-between">
                                <Text
                                  allowFontScaling={false}
                                  className="text-base text-darkStroke max-w-[80%]"
                                >
                                  {item.city === "" ? (
                                    "Відсутня адреса"
                                  ) : (
                                    <>
                                      {item.city},{item.branch && item.branch}
                                      {item.street && item.street}
                                      {item.street && ", "}
                                      {item.street && item.houseNumber}
                                      {item.apartment && ", "}
                                      {item.apartment && item.apartment}
                                    </>
                                  )}
                                </Text>
                                {editingAddress !== index ? (
                                  <TouchableOpacity
                                    className={`bg-gray-200 p-[9px] rounded-full w-[36px] h-[36px] justify-center items-center ${
                                      isDarkMode
                                        ? "bg-darkCard border border-darkCardBorder"
                                        : "bg-gray-300"
                                    }`}
                                    onPress={() => {
                                      setEditingAddress(index);
                                      setEditedAddress(item);
                                    }}
                                  >
                                    <ChangeIcon
                                      size="20"
                                      isDarkMode={isDarkMode}
                                    />
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    className={` p-[9px] rounded-full ${
                                      isDarkMode
                                        ? "bg-darkCard border border-darkCardBorder"
                                        : "bg-gray-200"
                                    }`}
                                    onPress={() => handleChangeAddress(index)}
                                  >
                                    <CorrectIcon isDarkMode={isDarkMode} />
                                  </TouchableOpacity>
                                )}
                              </View>
                              {editingAddress === index && (
                                <View className="mt-3">
                                  <View
                                    className={`${
                                      isDarkMode
                                        ? "bg-darkCard border border-darkCardBorder"
                                        : "bg-gray-200"
                                    } rounded-full flex-row items-center h-[60px] px-5 
                              `}
                                  >
                                    <TextInput
                                      className={`flex-1 font-main text-darkBlack text-[16px] font-medium leading-none ${
                                        isDarkMode ? "text-white" : "text-black"
                                      }`}
                                      placeholder="Місто"
                                      value={editedAddress.city}
                                      onChangeText={(text) =>
                                        setEditedAddress((prev) => ({
                                          ...prev,
                                          city: text,
                                        }))
                                      }
                                      placeholderTextColor="gray"
                                    />
                                  </View>

                                  <View
                                    className={`${
                                      isDarkMode
                                        ? "bg-darkCard border border-darkCardBorder"
                                        : "bg-lightGrey"
                                    } rounded-full flex-row items-center h-[60px] px-5 mt-2
                              `}
                                  >
                                    <TextInput
                                      className={` flex-1 font-main text-darkBlack text-[16px] font-medium leading-none ${
                                        isDarkMode ? "text-white" : "text-black"
                                      }`}
                                      placeholder="Вулиця"
                                      value={editedAddress.street}
                                      onChangeText={(text) =>
                                        setEditedAddress((prev) => ({
                                          ...prev,
                                          street: text,
                                        }))
                                      }
                                      placeholderTextColor="gray"
                                    />
                                  </View>
                                  <View className="flex-row justify-between mt-2">
                                    <View
                                      className={`${
                                        isDarkMode
                                          ? "bg-darkCard border border-darkCardBorder"
                                          : "bg-lightGrey"
                                      } rounded-full flex-row items-center h-[60px] px-5 w-[48%]
                              `}
                                    >
                                      <TextInput
                                        className={`flex-1 font-main text-[16px] font-medium leading-none ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-black"
                                        }`}
                                        placeholder="Номер будинку"
                                        value={editedAddress.houseNumber}
                                        onChangeText={(text) =>
                                          setEditedAddress((prev) => ({
                                            ...prev,
                                            houseNumber: text,
                                          }))
                                        }
                                        placeholderTextColor="gray"
                                      />
                                    </View>
                                    <View
                                      className={`${
                                        isDarkMode
                                          ? "bg-darkCard border border-darkCardBorder"
                                          : "bg-lightGrey"
                                      } rounded-full flex-row items-center h-[60px] px-5 w-[48%]
                              `}
                                    >
                                      <TextInput
                                        className={`flex-1 font-main text-[16px] font-medium leading-none ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-black"
                                        }`}
                                        placeholder="Квартира"
                                        value={editedAddress.apartment}
                                        onChangeText={(text) =>
                                          setEditedAddress((prev) => ({
                                            ...prev,
                                            apartment: text,
                                          }))
                                        }
                                        placeholderTextColor="gray"
                                      />
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          )
                        )}
                    </View>
                  </View>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
