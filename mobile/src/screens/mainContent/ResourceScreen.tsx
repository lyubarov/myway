import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderAboutUser from "./components/HeaderAboutUser";
import { NextIcon } from "@assets/svg/NextIcon";
import Calendar from "./components/Calendar";
import { VitaminsIcon } from "@assets/svg/TypeFoodIcons";
import RejectIcon from "@assets/svg/RejectIcon";
import AcceptIcon from "@assets/svg/AcceptIcon";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAuth } from "src/firebase/context/authContext";
import { CuplIcon } from "@assets/svg/CuplIcon";
import {
  addWaterIntakeRecord,
  getAllUsefulTips,
  updateVitaminStatus,
} from "src/firebase/db";
import { useUsersProduct } from "@utils/infoContext";
import moment from "moment";
import AddIcon from "@assets/svg/AddIcon";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

export const ResourceScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { currentUser, userFromDB, refreshUserData, isDarkMode } = useAuth();
  const { takingVitamins, refreshTakingVitamins } = useUsersProduct();
  const [tips, setTips] = useState([]);

  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));
  const selectedWeekday = moment(selectedDay).format("dddd");
  const screenWidth = Dimensions.get("window").width;

  const filteredVitamins = takingVitamins.filter((vitamin) =>
    vitamin.days.some(
      (day) => day.toLowerCase() === selectedWeekday.toLowerCase()
    )
  );

  const handleClickAddVitamin = () => {
    navigation.navigate("MainContent", {
      screen: "CalendarScreen",
      params: { addVitamin: true },
    });
  };
  const handleClickOnCalendar = () => {
    navigation.navigate("MainContent", { screen: "CalendarScreen" });
  };
  const handleClickOnWater = () => {
    navigation.navigate("MainContent", { screen: "WaterBalanceScreen" });
  };

  const handleClickOnTips = () => {
    navigation.navigate("MainContent", { screen: "UsefulTipsScreen" });
  };
  const handleLogin = () => {
    navigation.navigate("Authorization", { screen: "LoginScreen" });
  };
  const handleClickOnTipsDetail = (item: any) => {
    navigation.navigate("MainContent", {
      screen: "UsefulTipsScreenDetail",
      params: { item },
    });
  };
  const difference =
    userFromDB?.waterBalance.goal - userFromDB?.waterBalance.drunk;

  const handleAddWater = async () => {
    if (!userFromDB) return;
    await addWaterIntakeRecord(
      userFromDB.uid,
      userFromDB?.waterBalance.waterIntake
    );
    await refreshUserData(userFromDB.uid);
  };
  const handleUpdateStatus = async (vitaminId: string, status: boolean) => {
    await updateVitaminStatus(
      userFromDB.uid,
      vitaminId,
      selectedWeekday,
      status
    );
    // await refreshUserData(userFromDB.uid);
    await refreshTakingVitamins(userFromDB.uid);
  };
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const data = await getAllUsefulTips();
        setTips(data);
      } catch (error) {
        alert("Щось пішло не так!");
      }
    };
    fetchTips();
  }, []);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <HeaderAboutUser />
      {currentUser ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
          <View>
            <View className="pt-3">
              <Calendar onSelectDate={setSelectedDay} />
            </View>
            <View className="px-3">
              <TouchableOpacity
                onPress={handleClickOnCalendar}
                className="flex-row justify-between mt-4"
              >
                <Text
                  allowFontScaling={false}
                  className={`text-base font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Трекер прийому вітамінів
                </Text>
                <NextIcon />
              </TouchableOpacity>
              <View className="gap-[6px] mb-4">
                {filteredVitamins.length > 0 ? (
                  filteredVitamins.slice(0, 2).map((item, index) => {
                    // const isActive = vitaminStatus[item.id];

                    return (
                      <View
                        key={index}
                        className={` flex-row justify-between items-center p-[13.5px] rounded-[24px] ${
                          isDarkMode
                            ? "bg-darkCard border border-darkCardBorder"
                            : "bg-white border border-gray-300"
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View
                            className={`border border-gray-200 p-[9px] rounded-full ${
                              isDarkMode
                                ? "bg-darkCard border-darkCardBorder"
                                : "bg-gray-100"
                            }`}
                          >
                            <VitaminsIcon stroke="#25C3B4" />
                          </View>
                          <View className="ml-3">
                            <Text
                              allowFontScaling={false}
                              className={`text-base font-bold ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {item.vitamin.name}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              className="text-[14px] text-darkText"
                            >
                              {item.time[0]}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row gap-[6px]">
                          <TouchableOpacity
                            onPress={() => handleUpdateStatus(item.id, false)}
                            className={`border border-gray-200  p-[9px] rounded-full ${
                              isDarkMode
                                ? "bg-darkCard border-darkCardBorder"
                                : "bg-gray-100"
                            }`}
                          >
                            <RejectIcon />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleUpdateStatus(item.id, true)}
                          >
                            <LinearGradient
                              colors={
                                !item.statusByDay[selectedWeekday]
                                  ? isDarkMode
                                    ? ["#212121", "#212121"]
                                    : ["#f3f3f3", "#f3f3f3"]
                                  : ["#25C3B4", "#00A696"]
                              }
                              className={`p-[9px] rounded-full border border-gray-200 ${
                                isDarkMode
                                  ? "border-darkCardBorder"
                                  : "border-gray-200"
                              }`}
                            >
                              <AcceptIcon
                                color={
                                  item.statusByDay[selectedWeekday]
                                    ? isDarkMode
                                      ? "#000"
                                      : "#FDFEFE"
                                    : isDarkMode
                                    ? "#25C3B4"
                                    : "#25C3B4"
                                }
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View
                    className={`mt-4 flex-row justify-between items-center p-[13.5px] rounded-[24px] border border-gray-300 ${
                      isDarkMode
                        ? "bg-darkCard border-darkCardBorder"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`border border-gray-200 p-[9px] rounded-full ${
                          isDarkMode
                            ? "bg-darkCard border-darkCardBorder"
                            : "bg-gray-100"
                        }`}
                      >
                        <VitaminsIcon stroke="#25C3B4" />
                      </View>
                      <Text
                        allowFontScaling={false}
                        className={`text-base font-bold ml-3 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Додати прийом
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleClickAddVitamin}
                      className={`border border-gray-200 p-[9px] rounded-full ${
                        isDarkMode
                          ? "bg-darkCard border-darkCardBorder"
                          : "bg-gray-100"
                      }`}
                    >
                      <AddIcon isDarkMode={isDarkMode} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View>
                <TouchableOpacity
                  onPress={handleClickOnWater}
                  className="flex-row justify-between mt-4"
                >
                  <Text
                    allowFontScaling={false}
                    className={`text-base font-bold mb-4 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Трекер водного балансу
                  </Text>
                  <NextIcon />
                </TouchableOpacity>
                <View
                  className={`p-3 rounded-[20px] ${
                    isDarkMode
                      ? "bg-darkCard border border-darkCardBorder"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <Text
                    allowFontScaling={false}
                    className={`mb-[5px] text-base font-bold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Залишилось: {difference <= 0 ? 0 : difference} мл
                  </Text>
                  <View className="flex-row justify-between">
                    <View
                      className={`rounded-full overflow-hidden `}
                      style={{
                        width: screenWidth - 96,
                        backgroundColor: isDarkMode
                          ? "rgba(37, 195, 180, 0.2)"
                          : "#F4F4F4",
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? "rgba(37, 195, 180, 0.2)"
                          : "#deeceb",
                      }}
                    >
                      <View className="h-[42px] justify-center">
                        <LinearGradient
                          colors={["#25c3b4", "#00a696"]}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: `${
                              (userFromDB?.waterBalance.drunk /
                                userFromDB?.waterBalance.goal) *
                              100
                            }%`,
                          }}
                        />
                        <Text
                          allowFontScaling={false}
                          className={`text-start pl-2  font-bold text-[14px] ${
                            isDarkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
                          твоя ціль на сьогодні:{" "}
                          {userFromDB?.waterBalance?.goal ?? "—"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleAddWater()}
                      className={`p-[9px] rounded-full ${
                        isDarkMode
                          ? "bg-darkCard border border-darkCardBorder"
                          : "bg-lightBack border border-greenStroke"
                      }`}
                    >
                      <CuplIcon isDarkMode={isDarkMode} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={handleClickOnTips}
                  className="flex-row justify-between mt-4"
                >
                  <Text
                    allowFontScaling={false}
                    className={`text-base font-bold mb-4 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Корисні поради
                  </Text>
                  <NextIcon />
                </TouchableOpacity>
                <View className="flex-row justify-start gap-3">
                  {tips.slice(0, 2).map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleClickOnTipsDetail(item)}
                      className={`rounded-[32px] px-[14px] py-[22px] ${
                        isDarkMode
                          ? "bg-darkCard border border-darkCardBorder"
                          : "bg-white border border-gray-300"
                      }`}
                      style={{ width: screenWidth * 0.5 - 18 }}
                    >
                      <Image
                        className="w-[150px] mb-3 ml-auto mr-auto"
                        style={{ height: "auto", aspectRatio: 1.1 }}
                        source={{ uri: item.imageUrl }}
                        resizeMode="contain"
                      />

                      <Text
                        allowFontScaling={false}
                        className={`font-bold text-[15px] ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
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
    </View>
  );
};
