import CopyIcon from "@assets/svg/CopyIcon";
import { InfoIconBlack } from "@assets/svg/InfoIcon";
import StepCorrectIconIcon from "@assets/svg/StepCorrectIcon";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "src/firebase/context/authContext";
import {
  updatedReferralCards,
  myRefStatus,
} from "@utils/referralScreenFunction";
import Clipboard from "@react-native-clipboard/clipboard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralProgramScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { dynamicLink } = route.params || "";

  const { userFromDB, isDarkMode } = useAuth();

  const textToCopy =
    dynamicLink || `referallink${userFromDB?.uniqueReferralLink}`;

  const handleCopy = () => {
    Clipboard.setString(textToCopy);
    Alert.alert(
      "Скопійовано!",
      `"${textToCopy}" було скопійовано у буфер обміну.`
    );
  };
  const sum =
    userFromDB?.referrals?.reduce(
      (acc: number, friend: { spent: number }) =>
        Number(acc) + Number(friend.spent || 0),
      0
    ) || 0;
  const STATUS_CARDS = updatedReferralCards(sum, userFromDB);
  const status = myRefStatus(sum, userFromDB);

  return (
    <LinearGradient
      colors={["#19DCC9", "#0B5951"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-screen flex-1"
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#19DCC9"
        translucent={true}
      />

      <SafeAreaView className="flex-1" edges={["top"]}>
        <View>
          <AuthHeader title="Реферальна програма" color="white" />
          <View className="flex-row gap-[6px] absolute right-3 top-[9px]">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MainContent", {
                  screen: "ReferralProgramDetailScreen",
                });
              }}
              className="w-[42px] h-[42px] bg-white rounded-full items-center justify-center"
            >
              <InfoIconBlack />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-3">
          <View
            className="px-3 py-5 rounded-[24px]  "
            style={{
              backgroundColor: isDarkMode
                ? "rgba(16, 17, 16, 0.4)"
                : "rgba(255, 255, 255, 0.2)",
              borderWidth: 1,
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.3)",
            }}
          >
            <View>
              <Text
                allowFontScaling={false}
                className="text-base font-bold text-white mb-3"
              >
                Доходи зростають: добирай {status.goal - sum} грн
              </Text>
              <View
                className="w-full rounded-full overflow-hidden"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(37, 195, 180, 0.2)"
                    : "rgba(255, 255, 255, 0.3)",
                }}
              >
                <View className="w-full h-[36px] justify-center">
                  <View
                    className="absolute left-0 top-0 h-full bg-white"
                    style={{
                      backgroundColor: isDarkMode ? "#25c3b4" : "white",
                      width: `${(sum / status.goal) * 100}%`,
                    }}
                  />
                  <Text
                    allowFontScaling={false}
                    className="font-semibold text-[14px] left-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    накопичено: {Math.round(sum)} з {status.goal}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          className="w-full h-full mt-4 rounded-t-[40px]  relative pt-3"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(16, 17, 16, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 240 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-5">
              <Text
                allowFontScaling={false}
                className="mb-[6px] text-[18px] font-bold "
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Відкрий новий статус: дохід {status.achievement}%
              </Text>
              <Text
                allowFontScaling={false}
                className={`mb-5 text-[14px] ${
                  isDarkMode ? "text-white" : "text-darkStroke"
                }`}
              >
                Ділись посиланням, розширюй можливості і збільшуй дохід разом із
                друзями!
              </Text>
              <Text
                allowFontScaling={false}
                className="text-[18px] font-bold mb-2"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Реферальне посилання:
              </Text>
              <View
                className="justify-center rounded-full"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(37, 195, 180, 0.2)"
                    : "#E0F0EE",
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? "rgba(37, 195, 180, 0.2)"
                    : "#DEECEB",
                }}
              >
                <TouchableOpacity
                  onPress={handleCopy}
                  className="px-3 py-[9px] flex-row justify-between items-center "
                >
                  <Text
                    allowFontScaling={false}
                    className="font-semibold text-[14pxs] "
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {`referallink${userFromDB?.uniqueReferralLink}`}
                  </Text>
                  <CopyIcon />
                </TouchableOpacity>
              </View>
              <Text
                allowFontScaling={false}
                className="text-[18px] font-bold mt-5 mb-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Реферальний статус
              </Text>
              <View className="flex-row gap-5 items-start">
                <View className="relative">
                  <View className="absolute left-2 top-[83px] bottom-0">
                    <Svg height="100%" width="2">
                      <Line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="100%"
                        stroke="black"
                        strokeWidth="2"
                        strokeDasharray="6, 6"
                      />
                    </Svg>
                  </View>
                  {STATUS_CARDS.map((status, index) => (
                    <View
                      key={index}
                      className={`-top-[89px]  rounded-full bg-white border-2 border-green 
                       mt-[157px] ${
                         status.active
                           ? "bg-green w-[24px] h-[24px] right-[3px]"
                           : "bg-white w-[18px] h-[18px]"
                       }
                    `}
                    />
                  ))}
                </View>

                <View className="flex-1 relative">
                  {STATUS_CARDS.map((status, index) => (
                    <View key={index} className="relative ">
                      <Image
                        source={status.icon}
                        className={`absolute z-10  ${status.position}`}
                        resizeMode="contain"
                      />

                      <LinearGradient
                        colors={[status.colors[0], status.colors[1]]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        className="rounded-[20px] px-3 pt-[17px] pb-[11px] mb-5 flex-row items-center min-h-[142px] w-full"
                        style={{
                          borderColor: status.border,
                          borderWidth: 2,
                        }}
                      >
                        <View>
                          <LinearGradient
                            colors={[
                              status.titleColors[0],
                              status.titleColors[1],
                            ]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            className="p-[9px] rounded-full mb-[37px] inline-flex flex-row"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.2)",
                              borderWidth: 1,
                              alignSelf: "flex-start",
                            }}
                          >
                            <Text
                              allowFontScaling={false}
                              className="text-white font-semibold text-[14px] mr-[10px]"
                            >
                              {status.title}
                            </Text>
                            <StepCorrectIconIcon />
                          </LinearGradient>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-base "
                          >
                            необхідний об'єм:{" "}
                            <Text className="font-bold">{status.volume}</Text>
                          </Text>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-base"
                          >
                            дохід:{" "}
                            <Text className="font-bold text-base">
                              {status.income}
                            </Text>
                          </Text>
                        </View>
                      </LinearGradient>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
