import SortIcon from "@assets/svg/SortIcon";
import {
  SportFoodIcon,
  SuperFoodIcon,
  VitaminsIcon,
} from "@assets/svg/TypeFoodIcons";
import { useUsersProduct } from "@utils/infoContext";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

const ToggleTypeFood = ({
  isCatalog,
  toggleSortModal,
}: {
  isCatalog: boolean;
  toggleSortModal?: () => void;
}) => {
  const { isDarkMode } = useAuth();

  const { changeTypeFood, typeFood } = useUsersProduct();
  const toggleSelect = (label: string) => {
    changeTypeFood(label);
  };

  const data = [
    {
      id: 1,
      label: "Вітаміни та мінерали",
      icon: (
        <VitaminsIcon
          stroke={
            typeFood === "Вітаміни та мінерали"
              ? isDarkMode
                ? "black"
                : "white"
              : "#25C3B4"
          }
        />
      ),
    },
    {
      id: 2,
      label: "Суперфуд",
      icon: (
        <SuperFoodIcon
          stroke={
            typeFood === "Суперфуд"
              ? isDarkMode
                ? "black"
                : "white"
              : "#25C3B4"
          }
        />
      ),
    },
    {
      id: 3,
      label: "Спортивне харчування",
      icon: (
        <SportFoodIcon
          stroke={
            typeFood === "Спортивне харчування"
              ? isDarkMode
                ? "black"
                : "white"
              : "#25C3B4"
          }
        />
      ),
    },
  ];

  return (
    <View className="mb-4 flex-row">
      {isCatalog && (
        <TouchableOpacity
          onPress={toggleSortModal}
          className="px-[9px] py-[9px] mr-[6px] rounded-full "
          style={{
            backgroundColor: isDarkMode ? "#171717" : "white",
            borderWidth: 0.5,
            borderColor: isDarkMode ? "#434343" : "#deeceb",
          }}
        >
          <SortIcon isDarkMode={isDarkMode} />
        </TouchableOpacity>
      )}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <LinearGradient
            colors={
              typeFood === item.label
                ? ["#25C3B4", "#00A696"]
                : isDarkMode
                ? ["rgba(37, 195, 180, 0.5)", "rgba(37, 195, 180, 0.5)"]
                : ["#fff", "#fff"]
            }
            className="px-3 py-[10px] mr-[6px] rounded-full flex-row items-center"
          >
            {item.icon}
            <Text
              allowFontScaling={false}
              className={`ml-1 text-center font-semibold text-[14px] ${
                typeFood === item.label
                  ? isDarkMode
                    ? "text-black"
                    : "text-white"
                  : isDarkMode
                  ? "text-white"
                  : "text-black"
              }`}
              onPress={() => toggleSelect(item.label)}
            >
              {item.label}
            </Text>
          </LinearGradient>
        )}
      />
    </View>
  );
};

export default ToggleTypeFood;
