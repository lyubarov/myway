import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Calendar from "./components/Calendar";
import { VitaminsIcon } from "@assets/svg/TypeFoodIcons";
import RejectIcon from "@assets/svg/RejectIcon";
import { LinearGradient } from "expo-linear-gradient";
import AcceptIcon from "@assets/svg/AcceptIcon";
import { useEffect, useState } from "react";
import AddIcon from "@assets/svg/AddIcon";
import ChangeIcon from "@assets/svg/ChangeIcon";
import TrashIcon from "@assets/svg/TreshIcon";
import { useAuth } from "src/firebase/context/authContext";
import { ModalSortOptions } from "./components/ModalSortOptions";
import { useUsersProduct } from "@utils/infoContext";
import { ClockIconBlack } from "@assets/svg/ClockIconBlack";
import ClockIcon from "@assets/svg/ClockIcon";
import TimePickerScreen from "./components/TimePickerScreen";
import {
  addVitaminRecord,
  removeVitaminRecord,
  updateVitaminStatus,
  updateVitaminTime,
} from "src/firebase/db";
import moment from "moment";
import "moment/locale/uk";
import { addNotification } from "src/firebase/notification";
import {
  getAdjustedTime,
  getNextNotificationDate,
} from "@utils/functionsForCalc";

moment.locale("uk");

export default function CalendarScreen({ route }) {
  const { addVitamin } = route.params || {};

  const { userFromDB, refreshUserData, isDarkMode } = useAuth();
  const { takingVitamins, refreshTakingVitamins } = useUsersProduct();
  const [isChange, setIsChange] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [timePickerUpdate, setTimePickerUpdate] = useState(false);
  const { products } = useUsersProduct();
  const [selectedTime, setSelectedTime] = useState("");
  const [characteristics, setCharacteristics] = useState<{
    vitamin: {};
    time: string[];
    days: string[];
  }>({
    vitamin: {},
    time: [],
    days: [],
  });
  console.log("characteristics", characteristics.time);

  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));
  const selectedWeekday = moment(selectedDay).format("dddd");

  const filteredVitamins = takingVitamins.filter((vitamin) =>
    vitamin.days.some(
      (day) => day.toLowerCase() === selectedWeekday.toLowerCase()
    )
  );

  const handleEditReminder = (time: string) => {
    setSelectedTime(time);
    setTimePicker(true);
  };

  const [number, setNumber] = useState(1);

  const handleToggleSettings = async () => {
    setIsOpenSettings(!isOpenSettings);
    setNumber(1);
    if (!isOpenSettings) {
      await refreshUserData(userFromDB?.uid);
    }
  };
  useEffect(() => {
    if (addVitamin) {
      handleToggleSettings();
    }
  }, [addVitamin]);

  const handleOnChange = () => {
    setIsChange(!isChange);
  };

  const days = [
    { id: 1, day: "Щодня" },
    { id: 2, day: "Понеділок" },
    { id: 3, day: "Вівторок" },
    { id: 4, day: "Середа" },
    { id: 5, day: "Четвер" },
    { id: 6, day: "П'ятниця" },
    { id: 7, day: "Субота" },
    { id: 8, day: "Неділя" },
  ];
  const dayShortNames: { [key: string]: string } = {
    Понеділок: "Пн",
    Вівторок: "Вт",
    Середа: "Ср",
    Четвер: "Чт",
    "П'ятниця": "Пт",
    Субота: "Сб",
    Неділя: "Нд",
  };
  const handleRemoveTime = (timeToRemove: string) => {
    setCharacteristics((prev) => ({
      ...prev,
      time: prev.time.filter((time) => time !== timeToRemove),
    }));
  };
  const handleRemoveVitamin = async (vitaminId: string) => {
    await removeVitaminRecord(userFromDB?.uid, vitaminId);

    await refreshTakingVitamins(userFromDB?.uid);
  };
  const handleAddVitamin = async () => {
    if (!userFromDB?.uid) {
      console.error("Користувач не знайдений!");
      return;
    }

    await addVitaminRecord(
      userFromDB.uid,
      characteristics.vitamin,
      characteristics.time,
      characteristics.days,
      true
    );
    await refreshTakingVitamins(userFromDB.uid);

    const nextDate = getNextNotificationDate(characteristics.days);
    const adjustedTime = getAdjustedTime(characteristics.time[0]);

    await addNotification({
      userId: userFromDB.uid,
      title: `Час приймати ${characteristics.vitamin.name}`,
      description:
        "🚀 Час підзарядитися! Твоє тіло чекає підтримки – прийми вітаміни, і енергія буде з тобою весь день!",
      category: "info",
      date: nextDate,
      time: adjustedTime,
      calendar: true,
      type: "push",
      screen: "CalendarScreen",
    });
  };

  const handleUpdateStatus = async (vitaminId: string, status: boolean) => {
    await updateVitaminStatus(
      userFromDB.uid,
      vitaminId,
      selectedWeekday,
      status
    );
    await refreshTakingVitamins(userFromDB.uid);
  };
  const handleUpdateVitaminTime = async (
    vitaminId: string,
    newTime: string[]
  ) => {
    if (!userFromDB) return;

    await updateVitaminTime(userFromDB.uid, vitaminId, newTime);
    await refreshTakingVitamins(userFromDB.uid);
  };
  const handleSelectDay = (selectedDay: string) => {
    setCharacteristics((prev) => {
      if (selectedDay === "Щодня") {
        return {
          ...prev,
          days: prev.days.includes("Щодня") ? [] : days.map((d) => d.day),
        };
      }

      const updatedDays = prev.days.includes(selectedDay)
        ? prev.days.filter((day) => day !== selectedDay)
        : [...prev.days, selectedDay];

      if (
        updatedDays.length === days.length - 1 &&
        !updatedDays.includes("Щодня")
      ) {
        updatedDays.push("Щодня");
      }

      if (updatedDays.includes("Щодня") && updatedDays.length < days.length) {
        updatedDays.splice(updatedDays.indexOf("Щодня"), 1);
      }

      return { ...prev, days: updatedDays };
    });
  };

  const renderComponent = () => {
    switch (number) {
      case 1:
        return (
          <View>
            <View className="flex-row justify-between mb-8">
              <TouchableOpacity
                onPress={() => {
                  handleToggleSettings();
                  setCharacteristics({
                    vitamin: {},
                    time: [],
                    days: [],
                  });
                }}
              >
                <Text className="text-[20px] font-bold text-darkGrey">
                  Вийти
                </Text>
              </TouchableOpacity>
              <Text
                className="text-[20px] font-bold "
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Оберіть вітамін
              </Text>
              <TouchableOpacity
                onPress={() => setNumber(2)}
                disabled={!characteristics.vitamin?.name}
              >
                <Text
                  className={`text-[20px] font-bold ${
                    characteristics.vitamin?.name
                      ? "text-green"
                      : "text-gray-400"
                  }`}
                >
                  Далі
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View className="px-3 gap-[28px]">
                {products
                  .filter(
                    (item) =>
                      item.category.toLowerCase().includes("вітам") ||
                      item.category.toLowerCase().includes("добав")
                  )
                  .map((item) => (
                    <TouchableOpacity
                      onPress={() =>
                        setCharacteristics((prev) => ({
                          ...prev,
                          vitamin: { name: item.name, photo: item.images[0] },
                        }))
                      }
                      key={item.id}
                      className=" flex-row justify-between items-center"
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: item.images[0] }}
                          className="w-[58px] h-[72px]"
                        />
                        <Text
                          className="font-bold text-[18px] ml-3"
                          style={{ color: isDarkMode ? "white" : "black" }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      <View
                        className={`w-6 h-6 rounded-full border-2 border-lightGreen 
                           ${
                             characteristics.vitamin?.name == item.name
                               ? "bg-green"
                               : "bg-lightGreenOption"
                           }
                      }`}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          </View>
        );
      case 2:
        return (
          <View className="relative">
            <View className="flex-row justify-between mb-9">
              <TouchableOpacity
                onPress={() => {
                  setNumber(1);
                }}
              >
                <Text className="text-[20px] font-bold text-darkGrey">
                  Назад
                </Text>
              </TouchableOpacity>
              <Text
                className="text-[20px] font-bold"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Оберіть час прийому
              </Text>
              <TouchableOpacity
                onPress={() => setNumber(3)}
                disabled={
                  characteristics.days.length === 0 ||
                  characteristics.time.length === 0
                }
              >
                <Text
                  className={`text-[20px] font-bold ${
                    characteristics.days.length > 0 &&
                    characteristics.time.length > 0
                      ? "text-green"
                      : "text-gray-400"
                  }`}
                >
                  Далі
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                <Text
                  className="font-bold text-[18px] mb-4"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  Частота
                </Text>
                <View className="flex-row flex-wrap gap-x-14 justify-between">
                  {days.map((item) => (
                    <TouchableOpacity
                      onPress={() => handleSelectDay(item.day)}
                      key={item.id}
                      className="w-1/3 py-3 flex-row justify-between items-center"
                    >
                      <Text
                        className="font-normal text-[16px] ml-3"
                        style={{ color: isDarkMode ? "white" : "black" }}
                      >
                        {item.day}
                      </Text>

                      <View
                        className={`w-6 h-6 rounded-full border-2 border-lightGreen 
                           ${
                             characteristics.days.includes(item.day)
                               ? "bg-green"
                               : "bg-lightGreenOption"
                           }
                      }`}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text
                  className="font-bold text-[18px] mt-9 mb-4"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  Час
                </Text>
                <ScrollView
                  nestedScrollEnabled={true}
                  contentContainerStyle={{
                    paddingBottom: 40,
                  }}
                  style={{
                    maxHeight: "20%",
                  }}
                >
                  <View>
                    {characteristics.time.map((item, index) => (
                      <View
                        key={index}
                        className="bg-white p-3 rounded-[24px] border border-greenStroke flex-row items-center mb-[6px] justify-between"
                        style={{
                          backgroundColor: isDarkMode ? "#212121" : "white",
                        }}
                      >
                        <View className="flex-row items-center">
                          <View
                            className="bg-lightBack rounded-full p-[9px] border border-greenStroke"
                            style={{
                              backgroundColor: isDarkMode ? "#212121" : "white",
                            }}
                          >
                            <ClockIcon isDarkMode={isDarkMode} />
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              handleEditReminder(item);
                            }}
                          >
                            <Text
                              className="font-bold text-[16px] ml-3"
                              style={{ color: isDarkMode ? "white" : "black" }}
                            >
                              {item}
                            </Text>
                            <Text
                              className="font-normal text-[14px] ml-3"
                              style={{ color: isDarkMode ? "white" : "black" }}
                            >
                              1 капсула
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveTime(item)}
                          className="rounded-full p-[9px] "
                          style={{
                            backgroundColor: isDarkMode ? "#212121" : "white",
                            borderWidth: 1,
                            borderColor: isDarkMode ? "#434343" : "#deeceb",
                          }}
                        >
                          <TrashIcon />
                        </TouchableOpacity>
                        <TimePickerScreen
                          visible={timePicker}
                          onClose={() => setTimePicker(false)}
                          selectedTime={selectedTime}
                          onSelectTime={(newTime) => {
                            const updatedTimes = characteristics.time.map((t) =>
                              t === selectedTime ? newTime : t
                            );
                            setCharacteristics({
                              ...characteristics,
                              time: updatedTimes,
                            });
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <View
                  className="bg-white p-3 rounded-[24px] flex-row items-center mt-8 justify-between"
                  style={{
                    backgroundColor: isDarkMode ? "#212121" : "white",
                    borderWidth: 1,
                    borderColor: isDarkMode ? "#434343" : "#deeceb",
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="bg-lightBack rounded-full p-[9px] border border-greenStroke"
                      style={{
                        backgroundColor: isDarkMode ? "#212121" : "#F4F4F4",
                        borderColor: isDarkMode ? "#434343" : "##DEECEB",
                      }}
                    >
                      <ClockIconBlack isDarkMode={isDarkMode} />
                    </View>
                    <Text
                      className="font-bold text-[16px] ml-3"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      Додати час
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      const newTime = "00:00";

                      setCharacteristics((prev) => ({
                        ...prev,
                        time: [...prev.time, newTime],
                      }));
                      handleEditReminder(newTime);
                    }}
                    className="bg-lightBack rounded-full p-[9px]"
                    style={{
                      backgroundColor: isDarkMode ? "#212121" : "#F4F4F4",
                      borderWidth: 1,
                      borderColor: isDarkMode ? "#434343" : "#deeceb",
                    }}
                  >
                    <AddIcon isDarkMode={isDarkMode} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <View className="flex-row justify-between mb-8">
              <TouchableOpacity onPress={() => setNumber(2)}>
                <Text className="text-[20px] font-bold text-darkGrey">
                  Назад
                </Text>
              </TouchableOpacity>
              <Text
                className="text-[20px] font-bold"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Підтвердження
              </Text>
              <TouchableOpacity
                onPress={() => {
                  handleAddVitamin();
                  handleToggleSettings();
                  setNumber(1);
                  setCharacteristics({
                    vitamin: {},
                    time: [],
                    days: [],
                  });
                }}
              >
                <Text className="text-[20px] font-bold text-green">Готово</Text>
              </TouchableOpacity>
            </View>
            <Text
              className="font-bold text-[18px] mt-5 mb-4"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Вітамін
            </Text>
            <View className="flex-row items-center mb-5">
              <Image
                source={{ uri: characteristics.vitamin.photo }}
                className="w-[58px] h-[72px]"
              />
              <Text
                className="font-bold text-[18px] ml-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                {characteristics.vitamin.name}
              </Text>
            </View>
            <View className="flex-row items-center justify-between mt-5 mb-4">
              <Text
                className="font-bold text-[18px]"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Розклад
              </Text>
              <View className="flex-row">
                {characteristics.days.map((item, index) => (
                  <Text
                    key={index}
                    className="text-[16px]"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {dayShortNames[item] || item}{" "}
                  </Text>
                ))}
              </View>
            </View>
            {characteristics.time.map((item, index) => (
              <View
                key={index}
                className="bg-white p-3 rounded-[24px] flex-row items-center mb-[6px] justify-between"
                style={{
                  backgroundColor: isDarkMode ? "#212121" : "white",
                  borderWidth: 1,
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
                    <Text
                      className="font-bold text-[16px] ml-3"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      {item}
                    </Text>
                    <Text
                      className="font-normal text-[14px] ml-3"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    >
                      1 капсула
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveTime(item)}
                  className="rounded-full p-[9px] "
                  style={{
                    backgroundColor: isDarkMode ? "#212121" : "white",
                    borderWidth: 1,
                    borderColor: isDarkMode ? "#434343" : "#deeceb",
                  }}
                >
                  <TrashIcon />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <AuthHeader title="Календар" />
        <View className="px-3 overflow-auto">
          <Calendar onSelectDate={setSelectedDay} />
          <View className="flex-row justify-between  items-center mt-4">
            <Text
              allowFontScaling={false}
              className={`text-base font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Трекер прийому вітамінів
            </Text>
            <TouchableOpacity onPress={handleOnChange}>
              <Text className="text-[14px] font-semibold text-darkText mb-4">
                Редагувати
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`gap-[6px] pb-4 ${
              isChange && "border-b border-gray-200"
            }`}
          >
            {filteredVitamins.length > 0 ? (
              filteredVitamins.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={` flex-row justify-between items-center p-[13.5px] rounded-[24px] border border-gray-300 ${
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
                        <Text className="text-[14px] text-darkText">
                          {item.time[0]}
                        </Text>
                      </View>
                      <TimePickerScreen
                        visible={timePickerUpdate}
                        onClose={() => setTimePickerUpdate(false)}
                        selectedTime={item.time[0]}
                        onSelectTime={(newTime) => {
                          const parts = newTime.split(" ");
                          const formattedTime = `${parts[0]} ${parts[1]}`;
                          handleUpdateVitaminTime(item.id, [formattedTime]);
                        }}
                      />
                    </View>
                    {isChange ? (
                      <View className="flex-row gap-[6px]">
                        <TouchableOpacity
                          onPress={() => {
                            setTimePickerUpdate(true);
                          }}
                          className={`border border-gray-200 p-[9px] rounded-full ${
                            isDarkMode
                              ? "bg-darkCard border-darkCardBorder"
                              : "bg-gray-100"
                          }`}
                        >
                          <ChangeIcon size="24" isDarkMode={isDarkMode} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleRemoveVitamin(item.id)}
                          className={`border border-gray-200 p-[9px] rounded-full ${
                            isDarkMode
                              ? "bg-darkCard border-darkCardBorder"
                              : "bg-gray-100"
                          }`}
                        >
                          <TrashIcon />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="flex-row gap-[6px]">
                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(item.id, false)}
                          className={`border border-gray-200 p-[9px] rounded-full ${
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
                                    ? "black"
                                    : "#FDFEFE"
                                  : "#25C3B4"
                              }
                            />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View
                className={`mt-4 flex-row justify-between items-center p-[13.5px] rounded-[24px] border border-gray-300 ${
                  isDarkMode ? "bg-darkCard border-darkCardBorder" : "bg-white"
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
                    className="text-base font-bold ml-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Додати новий прийом
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleToggleSettings}
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
          {isChange && filteredVitamins.length > 0 && (
            <View
              className={`mt-4 flex-row justify-between items-center p-[13.5px] rounded-[24px] border border-gray-300 ${
                isDarkMode ? "bg-darkCard border-darkCardBorder" : "bg-white"
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
                  className="text-base font-bold ml-3"
                  style={{ color: isDarkMode ? "white" : "black" }}
                >
                  Додати новий прийом
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleSettings}
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
      </ScrollView>
      <ModalSortOptions
        isVisible={isOpenSettings}
        onClose={handleToggleSettings}
        height={80}
      >
        {renderComponent()}
      </ModalSortOptions>
    </View>
  );
}
