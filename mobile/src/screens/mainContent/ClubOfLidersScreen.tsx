import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { InfoIconBlack } from "@assets/svg/InfoIcon";
import { useEffect, useState } from "react";
import { getAllUsers } from "src/firebase/db";
import { useAuth } from "src/firebase/context/authContext";
import { Dimensions } from "react-native";

export default function ClubOfLidersScreen() {
  const { width } = Dimensions.get("window");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleInfo = () => {
    navigation.navigate("MainContent", {
      screen: "ClubOfLidersInfoScreen",
    });
  };
  const { userFromDB, isDarkMode } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Помилка: отримані користувачі не є масивом", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Помилка під час отримання користувачів:", error);
      }
    };

    fetchUsers();
  }, []);
  if (!users.length) {
    return <Text>Завантаження користувачів...</Text>;
  }
  console.log(users);

  const sortedData = [...users].sort(
    (a, b) => (b.medals || 0) - (a.medals || 0)
  );

  const top3 = sortedData.slice(0, 3);
  const rest = sortedData.slice(3);
  const reorderedTop3 = [top3[1], top3[0], top3[2]];
  console.log(reorderedTop3);

  return (
    <LinearGradient
      colors={["#000", "#09D0AE"]}
      locations={[0.1, 1]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-screen"
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#000"
        translucent={true}
      />
      <SafeAreaView className="flex-1  mb-0 pb-0">
        <View>
          <AuthHeader title="Клуб лідерів" color="white" />
          <View className="flex-row gap-[6px] absolute right-3 top-[9px]">
            <TouchableOpacity
              onPress={handleInfo}
              className="p-[9px] bg-white rounded-full"
            >
              <InfoIconBlack />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-center items-end gap-3 mt-[26px]">
          {reorderedTop3.map((leader, index) => (
            <View key={index} className="items-center">
              <View className="relative ">
                <Image
                  source={
                    leader.photoUrl
                      ? { uri: leader.photoUrl }
                      : require("@assets/icons/icon.png")
                  }
                  style={{
                    width: index === 1 ? 80 : 65,
                    height: index === 1 ? 80 : 65,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: "white",
                  }}
                  className="mb-6 rounded-full"
                />
                <View
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center ${
                    index == 1 ? "bottom-2 right-5" : "bottom-1 right-4"
                  }`}
                  style={{ backgroundColor: "#0DBD8B" }}
                >
                  <Text
                    allowFontScaling={false}
                    className="text-white font-bold text-[20px]"
                  >
                    {index == 0 ? "2" : index == 1 ? "1" : "3"}
                  </Text>
                </View>
              </View>

              <View className="items-center gap-1 mb-3">
                <Text
                  allowFontScaling={false}
                  className="text-white font-bold mt-2"
                >
                  {leader.displayName}
                </Text>
                <View className="flex-row justify-center items-center gap-[6px]">
                  <Image
                    source={require("@assets/icons/coin.png")}
                    className="ml-4 w-5 h-5"
                  />
                  <Text
                    allowFontScaling={false}
                    className="text-white font-bold"
                  >
                    {leader.medals || "0"}
                  </Text>
                </View>
              </View>

              <LinearGradient
                colors={["#00c3ac", "#005e54"]}
                className={`${
                  index === 1
                    ? "h-[140px]"
                    : index === 0
                    ? "h-[116px]"
                    : "h-[98px]"
                } mt-2 rounded-t-[24px] flex items-center justify-center border border-lightGreen`}
                style={{
                  width: (width - 94) / 3,
                }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-white font-bold text-[40px]"
                >
                  {index == 0 ? "2" : index == 1 ? "1" : "3"}
                </Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        <View
          className="w-full  rounded-t-[40px] p-5 flex-1 mt-[-20px]"
          style={{
            backgroundColor: isDarkMode ? "#171717" : "#fdfefe",
          }}
        >
          <FlatList
            data={rest}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              paddingBottom: 40,
            }}
            renderItem={({ item, index }) => (
              <View
                className="flex-row justify-between items-center rounded-[24px] p-3"
                style={{
                  backgroundColor:
                    userFromDB.uid == item.uid
                      ? "rgba(37, 195, 180, 1)"
                      : "rgba(37, 195, 180, 0.2)",
                }}
              >
                <View className="flex-row items-center">
                  <Text
                    allowFontScaling={false}
                    className={`text-[18px] font-bold mr-[22px]  ml-4 ${
                      userFromDB.uid == item.uid
                        ? isDarkMode
                          ? "text-black"
                          : "text-white"
                        : isDarkMode
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {index + 4}
                  </Text>
                  <Image
                    source={
                      item.photoUrl
                        ? { uri: item.photoUrl }
                        : require("@assets/icons/icon.png")
                    }
                    className="w-[42px] h-[42px] rounded-full"
                  />
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className={`ml-3 text-base font-bold max-w-[130px]  ${
                      userFromDB.uid == item.uid
                        ? isDarkMode
                          ? "text-black"
                          : "text-white"
                        : isDarkMode
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.displayName}
                  </Text>
                </View>
                <View className="flex-row justify-center items-center gap-[6px]">
                  <Image
                    source={require("@assets/icons/coin.png")}
                    className="ml-4 w-5 h-5"
                  />
                  <Text
                    allowFontScaling={false}
                    className={`text-base font-bold ${
                      userFromDB?.uid == item.uid
                        ? isDarkMode
                          ? "text-black"
                          : "text-white"
                        : isDarkMode
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.medals ? item.medals : "0"}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
