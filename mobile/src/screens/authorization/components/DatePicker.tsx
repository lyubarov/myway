import { ToggleIcon } from "@assets/svg/ToggleIcon";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

const CustomDropdown = ({
  data,
  selectedValue,
  onValueChange,
  placeholder,
  error,
  props,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useAuth();

  const handleSelect = (value) => {
    setIsOpen(false);
    onValueChange(value);
  };
  return (
    <View className={`flex-1 relative ${props}`}>
      <TouchableOpacity
        className={`px-4 py-5 rounded-[40px] flex-row justify-between items-center ${
          error && "border border-red"
        } ${isDarkMode ? "bg-secondary" : "bg-lightGrey"}`}
        onPress={() => setIsOpen(!isOpen)}
      >
        {selectedValue ? (
          <Text
            className={`text-[16px]  
        ${isDarkMode ? "text-lightBack" : "text-darkBlack"}

            `}
          >
            {selectedValue}
          </Text>
        ) : (
          <Text
            className={`text-[16px] ${error ? "text-red" : "text-customGray"} `}
          >
            {placeholder}
          </Text>
        )}
        <ToggleIcon isOpen={isOpen} error={error} />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-[-4] py-5  left-0 right-0 max-h-[232px] z-10 border border-green bg-lightGreen mt-1 rounded-[30px]">
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{
              zIndex: 10,
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(item.value)}
                className="px-4 pb-6"
              >
                <Text className="text-gray-400 text-center">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 0);
  return date.getDate();
};
const DatePicker = ({ value, setFieldValue, error }) => {
  const { isDarkMode } = useAuth();

  const months = [
    { label: "Січень", value: "Січень" },
    { label: "Лютий", value: "Лютий" },
    { label: "Березень", value: "Березень" },
    { label: "Квітень", value: "Квітень" },
    { label: "Травень", value: "Травень" },
    { label: "Червень", value: "Червень" },
    { label: "Липень", value: "Липень" },
    { label: "Серпень", value: "Серпень" },
    { label: "Вересень", value: "Вересень" },
    { label: "Жовтень", value: "Жовтень" },
    { label: "Листопад", value: "Листопад" },
    { label: "Грудень", value: "Грудень" },
  ];

  const years = Array.from({ length: 2006 - 1946 + 1 }, (_, i) => ({
    label: (2006 - i).toString(),
    value: (2006 - i).toString(),
  }));
  const generateDays = (month, year) => {
    if (!month || !year) {
      const currentDate = new Date();
      month = currentDate.getMonth() + 1;
      year = currentDate.getFullYear();
    }

    const monthIndex = months.findIndex((m) => m.value === month);
    const daysInMonth = getDaysInMonth(monthIndex + 1, year);

    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }));
  };
  const handleValueChange = (field: string, selectedValue: string) => {
    setFieldValue("dateOfBirthday", {
      ...value,
      [field]: selectedValue,
    });
  };

  return (
    <View className="mt-6">
      <Text
        allowFontScaling={false}
        className={`font-main text-base font-medium items-start mb-3
                        ${isDarkMode ? "text-white" : "text-darkStroke"}`}
      >
        Дата народження
      </Text>
      <View className="flex-row justify-between">
        <CustomDropdown
          data={generateDays(value.month, value.year)}
          selectedValue={value.day}
          onValueChange={(selectedValue: string) =>
            handleValueChange("day", selectedValue)
          }
          placeholder="День"
          error={error}
          props="mr-1"
        />

        <CustomDropdown
          data={months}
          selectedValue={value.month}
          onValueChange={(selectedValue: string) =>
            handleValueChange("month", selectedValue)
          }
          placeholder="Місяць"
          error={error}
          props="mr-1"
        />

        <CustomDropdown
          data={years}
          selectedValue={value.year}
          onValueChange={(selectedValue: string) =>
            handleValueChange("year", selectedValue)
          }
          placeholder="Рік"
          error={error}
          props=""
        />
      </View>
    </View>
  );
};

export default DatePicker;
