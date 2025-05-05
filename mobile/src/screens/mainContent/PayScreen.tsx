import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderAboutUser from "./components/HeaderAboutUser";
import { NextIconBlack } from "@assets/svg/NextIcon";
import CopyIcon from "@assets/svg/CopyIcon";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "src/firebase/context/authContext";
import { myStatus } from "@utils/payScreenDetailFunction";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;
export const PayScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { currentUser, userFromDB, isDarkMode } = useAuth();
  const [dynamicLink, setDynamicLink] = useState<string | null>(null);

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
  const textToCopy =
    dynamicLink || `referallink${userFromDB?.uniqueReferralLink}`;

  const handleLogin = () => {
    navigation.navigate("Authorization", { screen: "LoginScreen" });
  };
  const handleCopy = () => {
    Clipboard.setString(textToCopy);
    Alert.alert(
      "Скопійовано!",
      `${dynamicLink} було скопійовано у буфер обміну.`
    );
  };

  const status = myStatus(userFromDB?.myStatus, userFromDB);

  return (
    <LinearGradient
      colors={["#19DCC9", "#0B5951"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full flex-1"
    >
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <HeaderAboutUser color="white" />
        {currentUser ? (
          <View className="mt-1">
            <View className="px-3">
              <View
                className=" py-5 rounded-[20px]  "
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(16, 17, 16, 0.4)"
                    : "rgba(255, 255, 255, 0.2)",
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.3)",
                }}
              >
                <View className="flex-row items-center ">
                  <View className="w-1/3 justify-center items-center">
                    <Text
                      allowFontScaling={false}
                      className="font-bold text-[24px] text-white"
                    >
                      {userFromDB?.wayWallet}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      className="text-[14px] text-white"
                    >
                      Вейли
                    </Text>
                  </View>
                  <View
                    className="h-9"
                    style={{
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  />

                  <View className="w-1/3 justify-center items-center ">
                    <Text
                      allowFontScaling={false}
                      className="font-bold text-[24px] text-white"
                    >
                      {userFromDB?.myAchievement}%
                    </Text>
                    <Text
                      allowFontScaling={false}
                      className="text-[14px] text-white"
                    >
                      моя знижка
                    </Text>
                  </View>
                  <View
                    className="h-9"
                    style={{
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  />
                  <View className="w-1/3 justify-center items-center">
                    <Text
                      allowFontScaling={false}
                      className="font-bold text-[24px] text-white"
                    >
                      {userFromDB?.referrals.length}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      className="text-[14px] text-white"
                    >
                      реферали
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              className="w-full h-full mt-4 pt-5 rounded-t-[40px] "
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(16, 17, 16, 0.6)"
                  : "rgba(255, 255, 255, 0.6)",
              }}
            >
              <ScrollView
                contentContainerStyle={{ paddingBottom: 300 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="p-5 pt-0">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("MainContent", {
                        screen: "ReferralProgramScreen",
                        params: { dynamicLink: dynamicLink },
                      })
                    }
                    className="mb-6"
                  >
                    <View className="flex-row items-center justify-between  mb-3">
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-base"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        Реферальна програма
                      </Text>
                      <NextIconBlack isDarkMode={isDarkMode} />
                    </View>

                    <View className="shadow-sm shadow-[#0095FF] rounded-[24px]">
                      <ImageBackground
                        source={require("@assets/icons/stepsIcons/darkGradient.png")}
                        resizeMode="cover"
                        className="relative p-[14px] flex-row flex-grow flex-shrink-0 overflow-hidden"
                        imageStyle={{ borderRadius: 24 }}
                      >
                        <View className="w-[60%]">
                          <Text
                            className="text-[20px] font-bold text-white mb-5"
                            allowFontScaling={false}
                          >
                            Запрошуй друзів - заробляй більше
                          </Text>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-[12px] font-semibold mb-2"
                          >
                            Реферальне посилання:
                          </Text>
                          <View
                            className="justify-center rounded-full border border-gray-200"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            <TouchableOpacity
                              onPress={handleCopy}
                              className="px-3 py-[9px] flex-row justify-between items-center "
                            >
                              <Text
                                allowFontScaling={false}
                                className="font-semibold text-[14pxs] text-white "
                              >
                                referallink{userFromDB?.uniqueReferralLink}
                              </Text>
                              <CopyIcon />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Image
                          source={require("@assets/icons/stepsIcons/2.png")}
                          className="right-0 bottom-0 absolute max-w-[162px] w-full h-[160px]"
                        />
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("MainContent", {
                        screen: "MyStatusScreen",
                      })
                    }
                    className="mb-6"
                  >
                    <View className="flex-row items-center justify-between  mb-3">
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-base"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        Програма персональних знижок
                      </Text>
                      <NextIconBlack isDarkMode={isDarkMode} />
                    </View>

                    <View className="shadow-sm shadow-[#FF50D4] rounded-[24px]">
                      <ImageBackground
                        source={require("@assets/icons/stepsIcons/darkGradient1.png")}
                        resizeMode="cover"
                        className="relative p-[14px] flex-row flex-grow flex-shrink-0 overflow-hidden"
                        imageStyle={{ borderRadius: 24 }}
                      >
                        <View className="w-[60%]">
                          <Text
                            allowFontScaling={false}
                            className="text-[20px] font-bold text-white mb-5"
                          >
                            Візьми максимум % в новому статусі
                          </Text>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-[11px] font-semibold mb-2"
                          >
                            Зроби крок і отримай{" "}
                            <Text className="text-green">
                              знижку {status?.achievement}%
                            </Text>
                          </Text>
                          <View
                            className="w-full rounded-full overflow-hidden"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <View className="w-full h-[36px] justify-center">
                              <View
                                className="absolute left-0 top-0 h-full bg-green"
                                style={{
                                  width: `${
                                    (userFromDB?.myStatus / status?.goal) * 100
                                  }%`,
                                }}
                              />
                              <Text
                                allowFontScaling={false}
                                className="ml-[10px] text-start text-white font-semibold text-[12px]"
                              >
                                накопичено: {Math.round(userFromDB?.myStatus)} з{" "}
                                {status?.goal}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Image
                          source={require("@assets/icons/stepsIcons/1.png")}
                          className="right-0 bottom-0 absolute max-w-[162px] w-full h-[160px]"
                        />
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("MainContent", {
                        screen: "AchievementScreen",
                      })
                    }
                  >
                    <View className="flex-row items-center justify-between  mb-3">
                      <Text
                        allowFontScaling={false}
                        className="font-bold text-base"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        Мої досягнення
                      </Text>
                      <NextIconBlack isDarkMode={isDarkMode} />
                    </View>
                    <View className="shadow-sm shadow-[#A149FF] rounded-[24px]">
                      <ImageBackground
                        source={require("@assets/icons/stepsIcons/darkGradient2.png")}
                        resizeMode="cover"
                        className="p-[14px] flex-row flex-grow flex-shrink-0 overflow-hidden relative"
                        imageStyle={{ borderRadius: 24 }}
                      >
                        <View className="w-[60%]">
                          <Text
                            allowFontScaling={false}
                            className="text-[20px] font-bold text-white mb-[19px]"
                          >
                            Більше вейлів більше доходів
                          </Text>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-[12px] font-semibold mb-2 whitespace-nowrap"
                            style={{ flexShrink: 1 }}
                          >
                            Очікують виконання: 12 завдань
                          </Text>
                          <View
                            className="w-full rounded-full overflow-hidden"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <View className="w-full h-[36px] justify-center">
                              <View
                                className="absolute left-0 top-0 h-full bg-green"
                                style={{
                                  width: `${userFromDB?.medals / 100}%`,
                                }}
                              />
                              <Text
                                allowFontScaling={false}
                                className="pl-[10px] text-start text-white font-semibold text-[12px]"
                              >
                                отримано: {userFromDB?.medals} з 10 000
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Image
                          source={require("@assets/icons/stepsIcons/3.png")}
                          className="right-0 bottom-0 absolute max-w-[162px] w-full h-[160px]"
                        />
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-[24px] font-bold text-white">
              Авторизуйтесь
            </Text>
            <TouchableOpacity
              onPress={handleLogin}
              className="mt-5 border border-gray-100 rounded-full px-3 py-2"
            >
              <Text className="text-[18px] font-bold text-white">Увійти</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};
