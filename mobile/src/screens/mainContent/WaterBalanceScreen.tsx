import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import TrashIcon from "@assets/svg/TreshIcon";
import { CuplIcon2 } from "@assets/svg/CuplIcon";
import { CircularProgress } from "./components/CircularProgress";
import { ModalSortOptions } from "./components/ModalSortOptions";
import CorrectIcon from "@assets/svg/CorrenctIcon";
import ClockIcon from "@assets/svg/ClockIcon";
import AddIcon from "@assets/svg/AddIcon";
import { useAuth } from "src/firebase/context/authContext";
import {
  addReminder,
  addWaterIntakeRecord,
  getReminders,
  getWaterIntakeHistory,
  removeReminder,
  updateWaterBalance,
} from "src/firebase/db";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ClockIconBlack } from "@assets/svg/ClockIconBlack";
import { LinearGradient } from "expo-linear-gradient";
import { addNotification } from "src/firebase/notification";
import { getAdjustedTime } from "@utils/functionsForCalc";
import TimePickerScreen from "./components/TimePickerScreen";

const formatTimestamp = (timestamp: any) => {
  if (!timestamp || !timestamp.seconds) return "Невідомий час";

  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WaterBalanceScreen() {
  const { userFromDB, refreshUserData, isDarkMode } = useAuth();
  const [waterList, setWaterList] = useState([]);
  const [waterReminder, setWaterReminder] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const [timePicker, setTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const handleEditReminder = (time: string) => {
    setSelectedTime(time);
    setTimePicker(true);
  };

  const saveEditedReminder = async (oldTime: string, newTime: string) => {
    await removeReminder(userFromDB.uid, oldTime);
    await addReminder(userFromDB.uid, newTime);

    await refreshUserData(userFromDB.uid);
    const updatedReminders = await getReminders(userFromDB.uid);
    setWaterReminder(updatedReminders as any);

    const adjustedTime = getAdjustedTime(newTime);

    await addNotification({
      userId: userFromDB.uid,
      title: `💧 Залишайся зарядженим!`,
      description:
        "Час поповнити водний баланс – зроби ковток і відчуй енергію в кожній клітині!",
      category: "info",
      date: new Date().toISOString().split("T")[0],
      time: adjustedTime,
      type: "push",
      screen: "CalendarScreen",
    });
  };
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [characteristics, setCharacteristics] = useState({
    weight: "",
    height: "",
    waterNorm: userFromDB?.waterBalance.goal,
    waterIntake: userFromDB?.waterBalance.waterIntake,
  });
  const [number, setNumber] = useState(1);

  const handleToggleSettings = async () => {
    setIsOpenSettings(!isOpenSettings);
    if (!isOpenSettings) {
      await refreshUserData(userFromDB.uid);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refreshUserData(userFromDB.uid);
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    const fetchWater = async () => {
      const data = await getWaterIntakeHistory(userFromDB.uid);
      const reminder = await getReminders(userFromDB.uid);
      setWaterList(data);
      setWaterReminder(reminder as any);
    };
    if (userFromDB) {
      fetchWater();
    }
  }, []);

  const water =
    (Number(characteristics.weight) + Number(characteristics.height)) * 10;

  const handleAddWater = async () => {
    if (!userFromDB) return;
    await addWaterIntakeRecord(
      userFromDB.uid,
      userFromDB?.waterBalance.waterIntake
    );
    await refreshUserData(userFromDB.uid);
    const updatedHistory = await getWaterIntakeHistory(userFromDB.uid);
    setWaterList(updatedHistory);
  };

  const addNewTime = async () => {
    let newTime = 10;

    while (
      waterReminder.some((reminder: any) => reminder.time === `${newTime}:00`)
    ) {
      newTime++;
    }

    setSelectedTime(`${newTime}:00`);
    setTimePicker(true);

    await addReminder(userFromDB.uid, `${newTime}:00`);
    await refreshUserData(userFromDB.uid);
    const reminder = await getReminders(userFromDB.uid);
    setWaterReminder(reminder as any);
  };

  const renderComponent = () => {
    switch (number) {
      case 1:
        return (
          <View className="flex-1">
            <View className="flex-row justify-between mb-8">
              <TouchableOpacity onPress={handleToggleSettings}>
                <Text
                  allowFontScaling={false}
                  className="text-[20px] font-bold text-darkGrey"
                >
                  Назад
                </Text>
              </TouchableOpacity>
              <Text
                allowFontScaling={false}
                className="text-[20px] font-bold"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Налаштування
              </Text>
              <TouchableOpacity onPress={handleToggleSettings}>
                <Text
                  allowFontScaling={false}
                  className="text-[20px] font-bold text-green"
                >
                  Готово
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text
                allowFontScaling={false}
                className="font-bold text-[18px]"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Моя норма
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setNumber(2);
                }}
              >
                <Text
                  allowFontScaling={false}
                  className="font-semibold text-[14px] text-darkStroke"
                >
                  Редагувати
                </Text>
              </TouchableOpacity>
            </View>
            <View
              className=" p-3 rounded-[24px] border  flex-row items-center mb-5"
              style={{
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
            >
              <View
                className="bg-lightBack rounded-full p-[9px] border border-greenStroke"
                style={{
                  backgroundColor: isDarkMode ? "#212121" : "white",
                  borderColor: isDarkMode ? "#434343" : "#deeceb",
                }}
              >
                <CorrectIcon isDarkMode={isDarkMode} />
              </View>
              <Text
                allowFontScaling={false}
                className="font-bold text-[16px] ml-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                {userFromDB?.waterBalance?.goal} мл
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text
                allowFontScaling={false}
                className="font-bold text-[18px]"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Вимір прийому води
              </Text>
              <TouchableOpacity onPress={() => setNumber(5)}>
                <Text
                  allowFontScaling={false}
                  className="font-semibold text-[14px] text-darkStroke"
                >
                  Редагувати
                </Text>
              </TouchableOpacity>
            </View>
            <View
              className=" p-3 rounded-[24px] border  flex-row items-center mb-8 justify-between"
              style={{
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="bg-lightBack rounded-full p-[9px] border border-greenStroke"
                  style={{
                    backgroundColor: isDarkMode ? "#212121" : "white",
                    borderColor: isDarkMode ? "#434343" : "#deeceb",
                  }}
                >
                  <CuplIcon2 isDarkMode={isDarkMode} />
                </View>
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[16px] ml-3"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  {characteristics.waterIntake} мл
                </Text>
              </View>
            </View>
            <Text
              allowFontScaling={false}
              className="font-bold text-[18px] mb-3"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Нагадування
            </Text>
            <ScrollView
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              style={{
                maxHeight: "25%",
              }}
            >
              <View
                className={`pb-4 ${
                  userFromDB.historyIntakeWater.length > 0 &&
                  "border-b border-lightGrey"
                }`}
              >
                <FlatList
                  data={waterReminder}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={false}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    zIndex: 10,
                  }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleEditReminder(item.time)}
                      activeOpacity={0.8}
                      style={{ pointerEvents: "box-none" }}
                    >
                      <View
                        className="bg-white p-3 rounded-[24px] border border-greenStroke flex-row items-center mb-[6px] justify-between"
                        style={{
                          backgroundColor: isDarkMode ? "#272727" : "white",
                          borderColor: isDarkMode ? "#434343" : "#deeceb",
                        }}
                      >
                        <View className="flex-row items-center">
                          <View
                            className="bg-lightBack rounded-full p-[9px] border border-greenStroke"
                            style={{
                              backgroundColor: isDarkMode ? "#212121" : "white",
                              borderColor: isDarkMode ? "#434343" : "#deeceb",
                            }}
                          >
                            <ClockIcon isDarkMode={isDarkMode} />
                          </View>

                          <TouchableOpacity
                            onPress={() => handleEditReminder(item.time)}
                          >
                            <TimePickerScreen
                              visible={timePicker}
                              onClose={() => setTimePicker(false)}
                              selectedTime={selectedTime}
                              onSelectTime={(newTime: any) => {
                                saveEditedReminder(item.time, newTime);
                              }}
                            />
                            <Text
                              allowFontScaling={false}
                              className="font-bold text-[16px] ml-3"
                              style={{ color: isDarkMode ? "white" : "black" }}
                            >
                              {item.time}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            await removeReminder(userFromDB.uid, item.time);
                            await refreshUserData(userFromDB.uid);
                            const reminder = await getReminders(userFromDB.uid);
                            setWaterReminder(reminder as any);
                          }}
                          className="bg-lightBack rounded-full p-[9px] border border-greenStroke "
                        >
                          <TrashIcon isDarkMode={isDarkMode} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </ScrollView>
            <View
              className=" p-3 rounded-full border  flex-row items-center mt-4 justify-between"
              style={{
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="bg-lightBack rounded-[24px] p-[9px] border border-greenStroke"
                  style={{
                    backgroundColor: isDarkMode ? "#212121" : "white",
                    borderColor: isDarkMode ? "#434343" : "#deeceb",
                  }}
                >
                  <ClockIconBlack isDarkMode={isDarkMode} />
                </View>
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[16px] ml-3"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  Додати час
                </Text>
              </View>
              <TouchableOpacity
                onPress={addNewTime}
                className="bg-lightBack rounded-full p-[9px] border border-greenStroke "
                style={{
                  backgroundColor: isDarkMode ? "#212121" : "white",
                  borderColor: isDarkMode ? "#434343" : "#deeceb",
                }}
              >
                <AddIcon isDarkMode={isDarkMode} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text
              allowFontScaling={false}
              className="mb-8 text-[20px] font-bold text-center mt-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Вкажи вагу
            </Text>
            <View
              className="bg-lightLightGray rounded-[40px] h-[84px] flex-row items-center justify-center px-5"
              style={{
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
            >
              <TextInput
                value={characteristics.weight}
                onChangeText={(value) => {
                  const cleanedValue = value.replace(/[^0-9]/g, "");

                  setCharacteristics((prev) => ({
                    ...prev,
                    weight: cleanedValue,
                  }));
                }}
                placeholder="0"
                className="text-[36px] font-bold text-center"
                keyboardType="number-pad"
                autoFocus={true}
                style={{ color: isDarkMode ? "white" : "black" }}
                placeholderTextColor="gray"
              />
              <Text className="text-[20px] font-bold text-gray-500 ml-3">
                кг
              </Text>
            </View>
            <View className="flex-row gap-2 justify-center mt-6 mb-9">
              <TouchableOpacity
                onPress={() => setNumber(1)}
                className="bg-darkStroke py-5  rounded-full"
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <Text
                  allowFontScaling={false}
                  className=" font-bold text-[14px] text-center"
                  style={{ color: isDarkMode ? "black" : "white" }}
                >
                  Відмінити
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNumber(3)}>
                <LinearGradient
                  colors={["#25C3B4", "#00A696"]}
                  className="py-5  rounded-full"
                  style={{ width: screenWidth * 0.5 - 16 }}
                >
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[14px] text-center"
                    style={{ color: isDarkMode ? "black" : "white" }}
                  >
                    Продовжити
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text
              allowFontScaling={false}
              className="mb-8 text-[20px] font-bold text-center mt-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Вкажи зріст
            </Text>

            <View
              className="bg-lightLightGray rounded-[40px] h-[84px] flex-row items-center justify-center px-5"
              style={{
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
            >
              <TextInput
                value={characteristics.height}
                onChangeText={(value) => {
                  const cleanedValue = value.replace(/[^0-9]/g, "");

                  setCharacteristics((prev) => ({
                    ...prev,
                    height: cleanedValue,
                  }));
                }}
                placeholder="0"
                className="text-[36px] font-bold text-center"
                keyboardType="number-pad"
                autoFocus={true}
                style={{ color: isDarkMode ? "white" : "black" }}
                placeholderTextColor="gray"
              />
              <Text className="text-[20px] font-bold text-gray-500 ml-3">
                см
              </Text>
            </View>
            <View className="flex-row gap-2 justify-center mt-6 mb-9">
              <TouchableOpacity
                onPress={() => setNumber(1)}
                className="bg-darkStroke py-5  rounded-full"
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-white font-bold text-[14px] text-center"
                >
                  Відмінити
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNumber(4)}>
                <LinearGradient
                  colors={["#25C3B4", "#00A696"]}
                  className="py-5 rounded-full"
                  style={{ width: screenWidth * 0.5 - 16 }}
                >
                  <Text
                    allowFontScaling={false}
                    className="text-white font-bold text-[14px] text-center"
                  >
                    Продовжити
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text
              allowFontScaling={false}
              className="mb-8 text-[20px] font-bold text-center mt-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Твоя норма на день
            </Text>
            <TextInput
              value={`${water} мл`}
              editable={false}
              placeholder="мл"
              className="rounded-full h-[84px] text-[36px] font-bold text-center"
              keyboardType="number-pad"
              autoFocus={true}
              style={{
                color: isDarkMode ? "white" : "black",
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
              placeholderTextColor="gray"
            />
            <Text
              allowFontScaling={false}
              className="mb-8 text-[28px] font-bold text-center mt-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Розрахунок твоєї норми
            </Text>
            <Text
              allowFontScaling={false}
              className="text-darkStroke text-[16px]"
            >
              Ми враховуємо ваш зріст і вагу, щоб точно визначити, скільки води
              вам потрібно для підтримки оптимального водного балансу.
              {"\n"}
              {"\n"}
              Регулярне споживання необхідної кількості води покращує роботу
              організму, підвищує енергію та сприяє гарному самопочуттю. 💧
            </Text>
            <TouchableOpacity
              onPress={async () => {
                setNumber(1);
                handleToggleSettings();
                setCharacteristics((prev) => ({ ...prev, waterNorm: water }));

                await updateWaterBalance(
                  userFromDB.uid,
                  water,
                  userFromDB.waterBalance?.drunk,
                  userFromDB.waterBalance?.waterIntake
                );
                await refreshUserData(userFromDB.uid);
              }}
            >
              <LinearGradient
                colors={["#25C3B4", "#00A696"]}
                className="py-5 px-12 rounded-full mt-10"
              >
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[14px] text-center"
                  style={{ color: isDarkMode ? "black" : "white" }}
                >
                  Зберегти дані
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      case 5:
        return (
          <View>
            <Text
              allowFontScaling={false}
              className="mb-8 text-[20px] font-bold text-center mt-6"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Оберіть вимір прийому води
            </Text>
            <TextInput
              value={characteristics.waterIntake}
              onChangeText={(value) => {
                const cleanedValue = value.replace(/[^0-9]/g, "");

                setCharacteristics((prev) => ({
                  ...prev,
                  waterIntake: cleanedValue,
                }));
              }}
              placeholder="мл"
              className="rounded-full h-[84px] text-[36px] font-bold text-center"
              keyboardType="number-pad"
              autoFocus={true}
              style={{
                color: isDarkMode ? "white" : "black",
                backgroundColor: isDarkMode ? "#272727" : "white",
                borderColor: isDarkMode ? "#434343" : "#deeceb",
              }}
              placeholderTextColor="gray"
            />
            <View className="flex-row gap-2 justify-center mt-6 mb-9">
              <TouchableOpacity
                onPress={() => setNumber(1)}
                className="bg-darkStroke py-5  rounded-full"
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <Text
                  allowFontScaling={false}
                  className="font-bold text-[14px] text-center"
                  style={{ color: isDarkMode ? "black" : "white" }}
                >
                  Відмінити
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setNumber(1);
                  updateWaterBalance(
                    userFromDB?.uid,
                    userFromDB?.waterBalance.goal,
                    userFromDB?.waterBalance.drunk,
                    characteristics.waterIntake
                  );
                  await refreshUserData(userFromDB?.uid);
                }}
              >
                <LinearGradient
                  colors={["#25C3B4", "#00A696"]}
                  className="py-5 rounded-full items-center"
                  style={{ width: screenWidth * 0.5 - 16 }}
                >
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-[14px] text-center"
                    style={{ color: isDarkMode ? "black" : "white" }}
                  >
                    Зберегти
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Трекер водного балансу" />
      <View className="px-3">
        <CircularProgress
          value={userFromDB?.waterBalance.drunk}
          maxValue={userFromDB?.waterBalance.goal}
        />
        <View className="flex-row gap-2 justify-center mt-6 mb-9">
          <TouchableOpacity onPress={() => handleAddWater()}>
            <LinearGradient
              colors={["#25C3B4", "#00A696"]}
              className="py-3 px-4 rounded-full"
            >
              <Text
                allowFontScaling={false}
                className="text-white font-bold text-[14px]"
                style={{ color: isDarkMode ? "black" : "white" }}
              >
                Додати {characteristics.waterIntake} мл
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleSettings}
            className="bg-black py-3 px-[27px] rounded-full"
            style={{ backgroundColor: isDarkMode ? "white" : "black" }}
          >
            <Text
              allowFontScaling={false}
              className="text-white font-bold text-[14px]"
              style={{ color: isDarkMode ? "black" : "white" }}
            >
              Редагувати
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between  items-center">
          <Text
            allowFontScaling={false}
            className="text-base font-bold mb-4"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Історія за сьогодні
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 500 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className={`gap-[6px] pb-4 ${
              userFromDB.historyIntakeWater.length > 0 && "border-b"
            }`}
            style={{
              borderColor:
                userFromDB.historyIntakeWater.length > 0 && isDarkMode
                  ? "#272727"
                  : "#cbcbcb",
            }}
          >
            {waterList.length > 0 ? (
              waterList.map((item: any, index: any) => (
                <View
                  key={index}
                  className=" flex-row justify-between items-center p-[13.5px]  rounded-[24px] border border-gray-300"
                  style={{
                    backgroundColor: isDarkMode ? "#272727" : "white",
                    borderColor: isDarkMode ? "#434343" : "gray-300",
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`border border-gray-200 p-[9px] rounded-full ${
                        isDarkMode
                          ? "bg-darkCard border-darkCardBorder"
                          : "bg-gray-100"
                      }`}
                    >
                      <CuplIcon2 isDarkMode={isDarkMode} />
                    </View>
                    <View className="ml-3">
                      <Text
                        allowFontScaling={false}
                        className="text-base font-bold"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.amount} мл
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className="text-[14px] text-darkText"
                      >
                        {formatTimestamp(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View>
                <Text
                  allowFontScaling={false}
                  className="text-center text-darkText w-[70%] mx-auto mt-20 text-[16px]"
                >
                  Кинь собі виклик – випий першу ʼсклянку вже зараз!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <ModalSortOptions
        isVisible={isOpenSettings}
        onClose={handleToggleSettings}
        height={number == 1 ? 80 : 70}
      >
        {renderComponent()}
      </ModalSortOptions>
    </View>
  );
}
