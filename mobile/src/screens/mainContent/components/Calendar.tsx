import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import moment from "moment";
import RejectIcon from "@assets/svg/RejectIcon";
import AcceptIcon from "@assets/svg/AcceptIcon";
import { useUsersProduct } from "@utils/infoContext";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "src/firebase/context/authContext";
type DayItem = {
  id: string;
  day: string;
  label: string;
};
const Calendar = ({
  onSelectDate,
}: {
  onSelectDate: (date: string) => void;
}) => {
  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));
  const flatListRef = useRef(null);
  const { takingVitamins } = useUsersProduct();
  const { isDarkMode } = useAuth();

  const daysInMonth = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const days = [];

    for (
      let date = moment(startOfMonth);
      date.isBefore(endOfMonth) || date.isSame(endOfMonth);
      date.add(1, "day")
    ) {
      days.push({
        id: date.format("YYYY-MM-DD"),
        day: date.format("D"),
        label: date.format("dd"),
      });
    }

    return days;
  };

  const today = moment().format("YYYY-MM-DD");
  const todayIndex = daysInMonth().findIndex((day) => day.id === today);

  const isAllVitaminsTaken = (day: string) => {
    const selectedWeekday = moment(day).format("dddd").toLowerCase();

    const vitaminsForDay = takingVitamins.filter((vitamin) =>
      vitamin.days.some((d) => d.toLowerCase() === selectedWeekday)
    );

    return (
      vitaminsForDay.length >= 0 &&
      vitaminsForDay.every((v) => v.statusByDay?.[selectedWeekday] === true)
    );
  };

  const handleSelectDay = (date: string) => {
    setSelectedDay(date);
    onSelectDate(date);
  };
  const dayShortNames: { [key: string]: string } = {
    Понеділок: "Пн",
    Вівторок: "Вт",
    Середа: "Ср",
    Четвер: "Чт",
    "П’ятниця": "Пт",
    Субота: "Сб",
    Неділя: "Нд",
  };
  const getFullDayName = (shortName: string): string | undefined => {
    for (let key in dayShortNames) {
      if (dayShortNames[key].toLowerCase() === shortName.toLowerCase()) {
        return key;
      }
    }
    return undefined; // Якщо не знайдено
  };

  const isVitaminsInDay = (day: string) => {
    // Перетворюємо коротку форму на повну
    const fullDay = getFullDayName(day);

    if (!fullDay) {
      return false;
    }

    return takingVitamins.some((vitamin) =>
      vitamin.days.some((d) => d.toLowerCase() === fullDay.toLowerCase())
    );
  };

  const renderDay = ({ item }: { item: DayItem }) => {
    const isSelected = selectedDay === item.id;
    const isFuture = moment(item.id).isAfter(today);
    const allVitaminsTaken = isAllVitaminsTaken(item.id);
    const isVitamins = isVitaminsInDay(item.label);

    return (
      <View style={{ overflow: "visible" }}>
        <TouchableOpacity onPress={() => handleSelectDay(item.id)}>
          <View style={{ overflow: "visible", position: "relative" }}>
            <LinearGradient
              colors={
                isSelected
                  ? ["#25c3b4", "#00a696"]
                  : isDarkMode
                  ? ["#212121", "#212121"]
                  : ["#fff", "#fff"]
              }
              className={`w-[68px] h-[99px] justify-center items-center rounded-full mx-[5px] relative ${
                !isSelected && isDarkMode
                  ? "border border-darkCardBorder"
                  : "border border-gray-300"
              }`}
              style={{ overflow: "visible" }}
            >
              <Text
                allowFontScaling={false}
                className={`text-2xl font-bold ${
                  isSelected
                    ? isDarkMode
                      ? "text-black"
                      : "text-white"
                    : "text-gray-400"
                }`}
              >
                {item.day}
              </Text>
              <Text
                allowFontScaling={false}
                className={`text-base font-bold ${
                  isSelected
                    ? isDarkMode
                      ? "text-black"
                      : "text-white"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </Text>
            </LinearGradient>
            {!isFuture && isVitamins && (
              <View
                className="absolute z-1000 top-0 right-0 w-[24px] h-[24px] rounded-full bg-white justify-center items-center p-[3px]"
                style={{ overflow: "visible" }}
              >
                {allVitaminsTaken ? (
                  <AcceptIcon color={"#25C3B4"} />
                ) : (
                  <RejectIcon />
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={daysInMonth()}
        keyExtractor={(item) => item.id}
        renderItem={renderDay}
        removeClippedSubviews={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
        }}
        initialScrollIndex={todayIndex}
        getItemLayout={(data, index) => ({
          length: 70,
          offset: 70 * index,
          index,
        })}
      />
    </View>
  );
};

export default Calendar;
