import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import CountdownTimer from "./components/Timer";
import { useAuth } from "src/firebase/context/authContext";
import { useEffect, useState } from "react";
import { getClubOfLeaders } from "src/firebase/db";
import LoadingScreen from "@screens/authorization/components/LoadingScreen";
export default function ClubOfLidersInfoScreen() {
  const [info, setInfo] = useState(null);
  const { isDarkMode } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClubOfLeaders();
        setInfo(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Функція для обробки тексту
  const processText = (text: string, isDarkMode: boolean) => {
    if (!text) {
      return null;
    }
    const titleRegex = /<title:(.*?)>/g;
    const descriptionRegex = /<description:(.*?)>/g;

    const titleMatches = [...text.matchAll(titleRegex)];
    const descriptionMatches = [...text.matchAll(descriptionRegex)];

    const components: JSX.Element[] = [];

    const maxLength = Math.max(titleMatches.length, descriptionMatches.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < titleMatches.length) {
        const titleText = titleMatches[i][1];
        components.push(
          <Text
            key={`title-${i}`}
            allowFontScaling={false}
            className="mb-3 text-[18px] font-bold"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            {titleText}
          </Text>
        );
      }

      if (i < descriptionMatches.length) {
        const descriptionText = descriptionMatches[i][1];
        const formattedDescription = descriptionText
          .split("/n")
          .map((line, index) => (
            <Text
              key={`description-${i}-${index}`}
              allowFontScaling={false}
              className={`mb-5 text-[16px] ${
                isDarkMode ? "text-white" : "text-darkStroke"
              }`}
            >
              {`${line}`}
            </Text>
          ));

        components.push(...formattedDescription);
      }
    }

    return <View>{components}</View>;
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={["#000", "#09D0AE"]}
      locations={[0.2, 1]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-screen"
    >
      <SafeAreaView className="flex-1  mb-0 pb-0">
        <AuthHeader title="Клуб лідерів" color="white" />

        <Image
          source={
            info
              ? { uri: info?.зображення }
              : require("@assets/icons/referralCup.png")
          }
          className="mb-[106px] ml-auto mr-auto w-[165px] h-[213px]"
        />
        <View className="relative">
          <View className="px-3 items-center ">
            <View
              className="px-3 py-5 rounded-[24px] absolute top-[-130px] min-h-[159px] items-center z-30 w-full"
              style={{
                backgroundColor: "#294f4b",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: 1,
              }}
            >
              <Text
                allowFontScaling={false}
                className="font-bold text-[24px] text-center text-white mb-3"
              >
                {info?.title}
              </Text>
              <Text
                allowFontScaling={false}
                className="text-[14px] text-white mb-3"
              >
                Встигни зробити максимум за:
              </Text>
              <CountdownTimer start={info?.датаПочатку} />
            </View>
          </View>
          <View
            className={`w-full h-full mt-4 rounded-t-[40px] p-5 pt-[60px] relative ${
              Platform.OS === "ios" ? "pt-[60px]" : "pt-[72px]"
            }`}
            style={{
              backgroundColor: isDarkMode ? "#171717" : "white",
            }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 550 }}
              showsVerticalScrollIndicator={false}
            >
              {processText(info?.description, isDarkMode)}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
