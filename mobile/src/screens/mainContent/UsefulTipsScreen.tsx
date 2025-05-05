import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { getAllUsefulTips } from "src/firebase/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;
export default function UsefulTipsScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [tips, setTips] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const { isDarkMode } = useAuth();

  const handleClickOnTipsDetail = useCallback(
    (item: any) => {
      navigation.navigate("MainContent", {
        screen: "UsefulTipsScreenDetail",
        params: { item },
      });
    },
    [navigation]
  );

  useEffect(() => {
    const fetchTips = async () => {
      try {
        // Перевіряємо, чи є збережені поради в AsyncStorage
        const storedTips = await AsyncStorage.getItem("usefulTips");
        const newTips = await getAllUsefulTips(); // Отримуємо нові поради з Firebase

        // Якщо збережених порад немає або нові відрізняються, зберігаємо нові
        if (!storedTips || JSON.stringify(newTips) !== storedTips) {
          setTips(newTips); // Оновлюємо стан
          await AsyncStorage.setItem("usefulTips", JSON.stringify(newTips)); // Оновлюємо AsyncStorage
        } else {
          // Якщо збережені поради актуальні, використовуємо їх
          setTips(JSON.parse(storedTips));
        }
      } catch (error) {
        alert("Щось пішло не так!");
      }
    };

    fetchTips();
  }, []);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <AuthHeader title="Корисні поради" />
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <View className="flex-row justify-start gap-3 flex-wrap px-3">
          {tips.map((item, index) => (
            <TouchableOpacity
              onPress={() => handleClickOnTipsDetail(item)}
              key={index}
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
      </ScrollView>
    </View>
  );
}
