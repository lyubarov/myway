import CupIcon from "@assets/svg/CupIcon";
import { InfoIconBlack } from "@assets/svg/InfoIcon";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ModalCoin } from "./components/ModalCoin";
import { useAuth } from "src/firebase/context/authContext";
import {
  addUserNotification,
  getAllAchievements,
  updateWallet,
} from "src/firebase/db";
import { Video } from "expo-av";
import { achievementsCards } from "@utils/achievement";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;
interface Achievements {
  id: string;
  name: string;
  waylMoney: number;
  img: string;
  description: string;
}

export default function AchievementScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { userFromDB, refreshUserData, isDarkMode } = useAuth();
  const [cards, setCards] = useState<Achievements[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cachedData = await AsyncStorage.getItem("achievements");

        if (cachedData) {
          setCards(JSON.parse(cachedData));
        }

        const data = (await getAllAchievements()) || [];

        if (JSON.stringify(data) !== cachedData) {
          setCards(data);
          await AsyncStorage.setItem("achievements", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Помилка завантаження досягнень:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetail = useCallback(
    (card: Achievements) => {
      navigation.navigate("MainContent", {
        screen: "AchievementDetailScreen",
        params: { card },
      });
    },
    [navigation]
  );
  const handleInfo = () => {
    navigation.navigate("MainContent", {
      screen: "AchievementInfoScreen",
    });
  };
  const handleCup = () => {
    navigation.navigate("MainContent", {
      screen: "ClubOfLidersScreen",
    });
  };

  const getMoney = async () => {
    const wayWalletToMoney = userFromDB?.wayWallet / 100;
    const newWallet = userFromDB?.wallet + wayWalletToMoney;
    await updateWallet(userFromDB?.uid, newWallet);
    await refreshUserData(userFromDB?.uid);
    await addUserNotification(
      userFromDB?.uid,
      "Вейли перетворено!",
      "Ви перетворили свої вейли в гривні!",
      "achievement"
    );
  };
  const handleToggle = () => {
    setIsOpenModal(!isOpenModal);
  };
  const getNextMonthDate = async () => {
    let storedDate = await AsyncStorage.getItem("nextMonthDate");
    if (!storedDate) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
      storedDate = nextMonth.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      await AsyncStorage.setItem("nextMonthDate", storedDate);
    }

    return storedDate;
  };

  return (
    <LinearGradient
      colors={["#19DCC9", "#0B5951"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-screen relative"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#19DCC9"
        translucent={true}
      />
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <View>
          <AuthHeader title="Мої досягнення" color="white" />
          <View className="flex-row gap-[6px] absolute right-3 top-[9px]">
            <TouchableOpacity
              onPress={handleInfo}
              className="p-[9px] bg-white rounded-full"
            >
              <InfoIconBlack />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCup}
              className="p-[9px] bg-white rounded-full w-[42px] h-[42px]"
            >
              <CupIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-3">
          <View
            className="px-3 py-5 mt-3 rounded-[24px]  "
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
            <View>
              <Text
                allowFontScaling={false}
                className="text-base font-bold text-white mb-3"
              >
                Здобудь максимум: ще {10000 - Number(userFromDB?.medals)} вейлів
              </Text>
              <View
                className="w-full rounded-full overflow-hidden"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(37, 195, 180, 0.2)"
                    : "rgba(255, 255, 255, 0.3)",
                }}
              >
                <View className=" flex-row w-full h-[36px] justify-start items-center ">
                  <View
                    className="absolute left-0 top-0 h-full bg-white"
                    style={{
                      backgroundColor: isDarkMode ? "#25c3b4" : "white",
                      width: `${userFromDB?.medals / 100}%`,
                    }}
                  />
                  <Text
                    allowFontScaling={false}
                    className="font-semibold text-[14px] left-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    отримано: {userFromDB?.medals} з 10 000
                  </Text>
                  <Image
                    source={require("@assets/icons/coin.png")}
                    className="ml-4 w-5 h-5"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          className="w-full h-full mt-4 rounded-t-[40px] p-5 relative"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(16, 17, 16, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 235 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row justify-between">
              <View>
                <View className="flex-row items-center mb-3 gap-[6px]">
                  <Text
                    allowFontScaling={false}
                    className="text-[18px] font-bold "
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Отримано: {userFromDB?.wayWallet}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("MainContent", {
                        screen: "WeylCoinScreen",
                      });
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <Image
                        source={require("@assets/icons/coin.png")}
                        className="w-5 h-5"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <Text
                  allowFontScaling={false}
                  className="mb-3 font-semibold text-[12px]"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  * 100 вейлів = 1 грн
                </Text>
                <Text
                  allowFontScaling={false}
                  className="mb-3 text-[18px] font-bold "
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  {userFromDB?.wayWallet} вейлів = {userFromDB?.wayWallet / 100}{" "}
                  грн
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleToggle();
                  if (userFromDB?.wayWallet > 0) {
                    getMoney();
                  }
                }}
                className="px-5 py-3 bg-black  h-[42px] rounded-full"
              >
                <Text
                  allowFontScaling={false}
                  className="text-white text-[14px] font-semibold"
                >
                  Вивести кошти
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[14px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#606060" }}
            >
              Зверни увагу! Зароблені бонуси активні протягом{"\n"}3 місяців.
              Використай їх до{" "}
              <Text className={`${isDarkMode ? "text-green" : "text-black"}`}>
                {getNextMonthDate()}
              </Text>
            </Text>

            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Досягнення
            </Text>

            <View className="flex-row gap-[10px] items-start justify-start flex-wrap mx-auto">
              {cards.map((card, index) => {
                const selectedItem = achievementsCards.find((item) =>
                  item.title === "Соціальний старт"
                    ? item.title === card.name &&
                      card.description.toLowerCase().includes(item.description)
                    : item.title === card.name
                );

                const gradientColors = selectedItem?.littleGradient || [
                  "#000",
                  "#fff",
                ];

                return (
                  <TouchableOpacity
                    onPress={() => handleDetail(card)}
                    key={index}
                    className="items-center w-[30%]"
                  >
                    <LinearGradient
                      colors={gradientColors}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      className="rounded-full w-full aspect-square justify-center items-center relative overflow-hidden"
                    >
                      <Text
                        allowFontScaling={false}
                        className="text-[40px] -top-3"
                      >
                        <Image
                          source={{ uri: card.img }}
                          className="w-full h-[86px] mb-3 ml-auto mr-auto"
                          resizeMode="contain"
                        />
                      </Text>
                      <View
                        className={`${
                          userFromDB?.achievementList?.includes(card.id)
                            ? "bg-green"
                            : isDarkMode
                            ? "bg-white"
                            : "bg-black"
                        } absolute bottom-0 w-full items-center pb-[5px] flex-row justify-center gap-1`}
                      >
                        <Text
                          allowFontScaling={false}
                          className="text-white text-[12px] font-semibold"
                          style={{ color: isDarkMode ? "black" : "white" }}
                        >
                          {card.waylMoney}
                        </Text>
                        <Image
                          source={require("@assets/icons/coin.png")}
                          className="w-5 h-5"
                        />
                      </View>
                    </LinearGradient>
                    <Text
                      allowFontScaling={false}
                      className="text-[14px] font-bold mt-2 text-center"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      {card.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <ModalCoin isVisible={isOpenModal} onClose={handleToggle}>
        <Video
          source={require("@assets/video/Coin.mp4")}
          style={{
            width: 200,
            height: 200,
            marginBottom: 10,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          repeat={false}
          onEnd={handleToggle}
        />
        <Text
          allowFontScaling={false}
          className="font-bold text-[20px] text-center mb-3"
        >
          {userFromDB?.wayWallet === 0
            ? "На твоєму рахунку 0 вейлів."
            : "Вейли успішно перетворено на гривні."}
        </Text>
        <Text className="text-center text-[12px] text-darkStroke">
          {userFromDB?.wayWallet === 0 &&
            "Виконуй досягнення та отримуй вейли на свій рахунок!"}
        </Text>
      </ModalCoin>
    </LinearGradient>
  );
}
