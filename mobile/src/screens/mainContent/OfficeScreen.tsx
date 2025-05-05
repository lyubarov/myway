import { CustomButton } from "@components/ui/CustomButton";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signOut } from "src/firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "src/firebase/context/authContext";
import HeaderAboutUser from "./components/HeaderAboutUser";
import CopyIcon from "@assets/svg/CopyIcon";
import ClockIcon from "@assets/svg/ClockIcon";
import { NextIcon } from "@assets/svg/NextIcon";
import { FavoriteIcon } from "@assets/svg/TypeFoodIcons";
import {
  ConfidenceIcon,
  LogOutIcon,
  MailIcon,
} from "@assets/svg/SettingsIcons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { ModalSortOptions } from "./components/ModalSortOptions";
import { Formik } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import { useUsersProduct } from "@utils/infoContext";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { removeFcmTokenFromFirestore } from "src/firebase/db";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Authorization"
>;

export const OfficeScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { currentUser, setUserFromDB, userFromDB, isDarkMode } = useAuth();
  const { setCartProducts } = useUsersProduct();

  const [rightUsModalIsOpen, setRightUsModalIsOpen] = useState(false);
  const [rightUs, setRightUs] = useState({ email: "", comment: "" });
  const [dynamicLink, setDynamicLink] = useState<string | null>(null); // Створюємо стан для збереження посилання

  const handleCloseModal = () => {
    setRightUsModalIsOpen(!rightUsModalIsOpen);
  };
  const handleSend = () => {
    handleCloseModal();
    setRightUs({ email: "", comment: "" });
  };
  const handleLogout = async () => {
    try {
      if (userFromDB) await removeFcmTokenFromFirestore(userFromDB?.uid);
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      navigation.navigate("Authorization", { screen: "LoginScreen" });
    }
  };
  const textToCopy =
    dynamicLink || `referallink${userFromDB?.uniqueReferralLink}`;

  const handleCopy = () => {
    Clipboard.setString(textToCopy);
    Alert.alert(
      "Скопійовано!",
      `${dynamicLink} було скопійовано у буфер обміну.`
    );
  };
  const handleLogin = () => {
    navigation.navigate("Authorization", { screen: "LoginScreen" });
  };

  const generateDynamicLink = async (userId: string) => {
    const link = await dynamicLinks().buildShortLink({
      link: `https://myway767.page.link/home?userId=${userId}`,
      domainUriPrefix: "https://myway767.page.link",
      android: { packageName: "com.myway.dev767" },
      ios: { bundleId: "com.myway.dev767" },
    });

    return link;
  };
  useEffect(() => {
    const fetchLink = async () => {
      if (currentUser?.uid) {
        const link = await generateDynamicLink(currentUser?.uid);
        setDynamicLink(link);
      }
    };

    fetchLink();
  }, [currentUser?.uid]);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <HeaderAboutUser />
      {currentUser ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
          <View className="px-3 gap-4 pb-7">
            <View
              className={`py-5 rounded-[24px] ${
                isDarkMode
                  ? "bg-secondary border-darkCardBorder"
                  : "bg-white border-gray-200"
              } border `}
            >
              <View className="flex-row  items-center mb-4">
                <View className="w-1/3 justify-center items-center ">
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[24px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {userFromDB?.wayWallet}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    className="text-[14px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    вейли
                  </Text>
                </View>
                <View className="border border-gray-200 h-9" />

                <View className="w-1/3 justify-center items-center ">
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[24px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {userFromDB?.myAchievement}%
                  </Text>
                  <Text
                    allowFontScaling={false}
                    className="text-[14px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    моя знижка
                  </Text>
                </View>
                <View className="border border-gray-200 h-9" />

                <View className="w-1/3 justify-center items-center">
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[24px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {userFromDB?.referrals.length}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    className="text-[14px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    реферали
                  </Text>
                </View>
              </View>
              <View className="px-3">
                <View
                  className={`flex-1 justify-center rounded-full ${
                    isDarkMode ? "border-darkCardBorder" : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: isDarkMode
                      ? "rgba(37, 195, 180, 0.2)"
                      : "#E0F0EE",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleCopy}
                    className="px-[10px] py-3 flex-row justify-between items-center "
                  >
                    <Text
                      allowFontScaling={false}
                      className="font-semibold text-[14pxs] "
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      referallink{userFromDB?.uniqueReferralLink}
                    </Text>
                    <CopyIcon />
                  </TouchableOpacity>
                </View>
                <CustomButton
                  title="Редагувати профіль"
                  onPress={() => {
                    navigation.navigate("MainContent", {
                      screen: "SettingsScreen",
                    });
                  }}
                  style="py-3 rounded-full w-full font-bold"
                  color={isDarkMode ? "white" : "black"}
                  textColor={isDarkMode ? "text-black" : "text-white"}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MainContent", {
                    screen: "HistoryOrdersScreen",
                  });
                }}
                className={`p-3 pr-5 mb-[6px] ${
                  isDarkMode
                    ? "bg-secondary border-darkCardBorder"
                    : "bg-white border-gray-200"
                } border  rounded-[24px] flex-row justify-between items-center`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-gray-100"
                    } p-[9px]`}
                  >
                    <ClockIcon isDarkMode={isDarkMode} />
                  </View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[16pxs] ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Історія замовлень
                  </Text>
                </View>
                <NextIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MainContent", {
                    screen: "FavoritesScreen",
                  });
                }}
                className={`p-3 pr-5 border ${
                  isDarkMode
                    ? "bg-secondary border-darkCardBorder"
                    : "bg-white border-gray-200"
                } rounded-[24px] flex-row justify-between items-center`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-gray-100"
                    } p-[9px]`}
                  >
                    <FavoriteIcon />
                  </View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[16pxs] ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Список бажань
                  </Text>
                </View>
                <NextIcon />
              </TouchableOpacity>
            </View>

            <View>
              <Text
                allowFontScaling={false}
                className="font-bold text-base mb-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Налаштування
              </Text>

              <TouchableOpacity
                onPress={handleCloseModal}
                className={`p-3 pr-5 mb-[6px] border ${
                  isDarkMode
                    ? "bg-secondary border-darkCardBorder"
                    : "bg-white border-gray-200"
                } rounded-[24px] flex-row justify-between items-center`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-gray-100"
                    } p-[9px]`}
                  >
                    <MailIcon isDarkMode={isDarkMode} />
                  </View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[16pxs] ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Написати нам
                  </Text>
                </View>
                <NextIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MainContent", {
                    screen: "ConfidentialityScreen",
                  });
                }}
                className={`p-3 pr-5 border ${
                  isDarkMode
                    ? "bg-secondary border-darkCardBorder"
                    : "bg-white border-gray-200"
                } rounded-[24px] flex-row justify-between items-center`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-gray-100"
                    } p-[9px]`}
                  >
                    <ConfidenceIcon isDarkMode={isDarkMode} />
                  </View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[16pxs] ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Політика конфіденційності
                  </Text>
                </View>
                <NextIcon />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                allowFontScaling={false}
                className="font-bold text-base mb-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Вихід
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setUserFromDB(null);
                  setCartProducts([]);
                  handleLogout();
                }}
                className={`p-3 pr-5 border ${
                  isDarkMode
                    ? "bg-secondary border-darkCardBorder"
                    : "bg-white border-gray-200"
                } rounded-[24px] flex-row justify-between items-center`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full ${
                      isDarkMode
                        ? "bg-darkCard border border-darkCardBorder"
                        : "bg-gray-100"
                    } p-[9px]`}
                  >
                    <LogOutIcon isDarkMode={isDarkMode} />
                  </View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[16pxs] ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Вийти з акаунту
                  </Text>
                </View>
                <NextIcon />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-[24px] font-bold"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Авторизуйтесь
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="mt-5 border border-gray-500 rounded-full px-3 py-2"
          >
            <Text
              className="text-[18px] font-bold"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Увійти
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ModalSortOptions
        isVisible={rightUsModalIsOpen}
        onClose={handleCloseModal}
        height={70}
      >
        <Text
          allowFontScaling={false}
          className="text-center font-bold text-xl mb-8"
          style={{ color: isDarkMode ? "white" : "black" }}
        >
          Написати нам
        </Text>
        <ScrollView>
          <Formik
            initialValues={{ email: "", comment: "" }}
            onSubmit={(values) => handleSend()}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="flex-1 px-3">
                <View>
                  <Text
                    allowFontScaling={false}
                    className="font-main text-base font-medium items-start mb-2"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Електронна пошта
                  </Text>
                  <View
                    className={`${
                      isDarkMode
                        ? "bg-secondary border border-darkCardBorder text-white"
                        : "bg-lightGrey text-black"
                    } rounded-[24px] flex-row items-center h-[60px] px-5 
                  `}
                  >
                    <TextInput
                      className={`font-main ${
                        isDarkMode ? "text-white" : "text-darkBlack"
                      } text-[16px] font-medium leading-none`}
                      placeholder="example@gmail.com"
                      value={values.email}
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      autoCapitalize="none"
                      placeholderTextColor="gray"
                    />
                  </View>
                </View>

                <View className="mt-5">
                  <Text
                    allowFontScaling={false}
                    className="font-main text-base font-medium items-start mb-2"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Коментар
                  </Text>
                  <TextInput
                    placeholder="Додай коментар"
                    value={values.comment}
                    onChangeText={handleChange("comment")}
                    onBlur={handleBlur("comment")}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`${
                      isDarkMode
                        ? "bg-secondary border border-darkCardBorder text-white"
                        : "bg-lightGrey text-black"
                    } rounded-[24px] flex-row items-center h-[116px] px-5 py-3`}
                    placeholderTextColor="gray"
                  />
                </View>

                <LinearGradient
                  colors={["#25C3B4", "#00A696"]}
                  className="py-3 rounded-full w-full font-bold my-12"
                >
                  <CustomButton
                    title="Надіслати"
                    onPress={() => {
                      handleSubmit();
                    }}
                    textColor={isDarkMode ? "text-black" : "text-white"}
                  />
                </LinearGradient>
              </View>
            )}
          </Formik>
        </ScrollView>
      </ModalSortOptions>
    </View>
  );
};
