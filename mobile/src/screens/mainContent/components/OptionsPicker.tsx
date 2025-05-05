import { ToggleIconOptions } from "@assets/svg/ToggleIcon";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
const OptionsPicker = ({
  selectedCategories,
  onCategorySelect,
}: {
  selectedCategories: string[];
  onCategorySelect: (category: string, subcategory: string) => void;
}) => {
  const { isDarkMode } = useAuth();
  const [items, setItems] = useState([
    {
      id: "1",
      title: "Вітаміни",
      expanded: false,
      subItems: [
        { id: "1-1", title: "Імунітет", selected: false },
        { id: "1-2", title: "Шкіра, нігті, волосся", selected: false },
        { id: "1-3", title: "Кістки, суглоби, хрящі", selected: false },
        { id: "1-4", title: "Зір", selected: false },
        { id: "1-5", title: "Серцево-судинна система", selected: false },
        { id: "1-6", title: "Енергія та бадьорість", selected: false },
        {
          id: "1-7",
          title: "Розумова активність та концентрація",
          selected: false,
        },
        { id: "1-8", title: "Антиоксидантний захист", selected: false },
        { id: "1-9", title: "Дитяче здоров'я", selected: false },
        { id: "1-10", title: "Чоловіче здоров'я", selected: false },
        { id: "1-11", title: "Жіноче здоров'я", selected: false },
        { id: "1-12", title: "Зниження ваги", selected: false },
        { id: "1-13", title: "Детоксикація та очищення", selected: false },
      ],
    },
    {
      id: "2",
      title: "Спортивне харчування",
      expanded: false,
      subItems: [
        { id: "2-1", title: "Набір м'язової маси", selected: false },
        { id: "2-2", title: "Відновлення після тренувань", selected: false },
        { id: "2-3", title: "Збільшення витривалості", selected: false },
        { id: "2-4", title: "Спалювання жиру ", selected: false },
        { id: "2-5", title: "Підтримка м'язів і суглобів ", selected: false },
        { id: "2-6", title: "Енергія та бадьорість", selected: false },
      ],
    },
    {
      id: "3",
      title: "Суперфуд",
      expanded: false,
      subItems: [
        { id: "3-1", title: "Детокс і очищення", selected: false },
        { id: "3-2", title: "Імунітет", selected: false },
        { id: "3-3", title: "Енергія та життєві сили", selected: false },
        { id: "3-4", title: "Антиоксидантний захист", selected: false },
        { id: "3-5", title: "Підтримка травлення", selected: false },
        { id: "3-6", title: "Здоров'я шкіри та молодість", selected: false },
      ],
    },
  ]);
  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        subItems: item.subItems.map((subItem) => ({
          ...subItem,
          selected: selectedCategories.includes(subItem.title),
        })),
      }))
    );
  }, [selectedCategories]);

  const toggleExpand = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const toggleSelect = (itemId: string, subItemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            subItems: item.subItems.map((subItem) =>
              subItem.id === subItemId
                ? { ...subItem, selected: !subItem.selected }
                : subItem
            ),
          };
        }
        return item;
      })
    );
    // Обробка вибору категорії
    const selectedCategory = items
      .flatMap((item) => item.subItems)
      .find((subItem) => subItem.id === subItemId);

    if (selectedCategory) {
      onCategorySelect(selectedCategory.title);
    }
  };

  const renderSubItem = (itemId: string, subItem: any) => (
    <TouchableOpacity
      onPress={() => toggleSelect(itemId, subItem.id)}
      key={subItem.id}
      className=" flex-row justify-between py-3"
    >
      <Text
        allowFontScaling={false}
        className={`font-bold text-base  ${
          subItem.selected
            ? isDarkMode
              ? "text-white"
              : "text-black"
            : "text-darkText"
        }`}
      >
        {subItem.title}
      </Text>

      <View
        className={`w-6 h-6 rounded-full border-2 ${
          isDarkMode ? "border-lightGreenOption" : "border-lightGreen "
        } ${subItem.selected ? "bg-green" : "bg-lightGreenOption"}`}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View
      className={`border-b border-lightGrey py-3 ${
        isDarkMode ? "border-secondary" : "border-lightGrey"
      }`}
    >
      <View className="py-3 gap-3">
        <TouchableOpacity
          className="flex-row justify-between pr-2"
          onPress={() => toggleExpand(item.id)}
        >
          <Text
            allowFontScaling={false}
            className={`font-bold text-[20px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {item.title}
          </Text>
          <ToggleIconOptions isOpen={item.expanded} />
        </TouchableOpacity>
        {item.expanded && (
          <View className="pt-3">
            {item.subItems.map((subItem: any) =>
              renderSubItem(item.id, subItem)
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      removeClippedSubviews={false}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};
export default OptionsPicker;
