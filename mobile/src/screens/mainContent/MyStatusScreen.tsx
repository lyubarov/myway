import StepCorrectIconIcon from "@assets/svg/StepCorrectIcon";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { myStatus, updatedStatusCards } from "@utils/payScreenDetailFunction";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import { useAuth } from "src/firebase/context/authContext";

export default function MyStatusScreen() {
  const { userFromDB, isDarkMode } = useAuth();
  const cards = updatedStatusCards(userFromDB?.myStatus, userFromDB);
  const status = myStatus(userFromDB?.myStatus, userFromDB);

  return (
    <LinearGradient
      colors={["#19DCC9", "#0B5951"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-screen"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#19DCC9"
        translucent={true}
      />
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <AuthHeader
          title="Програма знижок"
          color={isDarkMode ? "black" : "white"}
        />
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
                Підвищуй знижку: плюсуй{" "}
                {Math.round(
                  Number(status?.goal) - Number(userFromDB?.myStatus)
                )}{" "}
                грн
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
                    className="absolute left-0 top-0 h-full "
                    style={{
                      backgroundColor: isDarkMode ? "#25c3b4" : "white",
                      width: `${(userFromDB?.myStatus / status?.goal) * 100}%`,
                    }}
                  />
                  <Text
                    allowFontScaling={false}
                    className="font-semibold text-[14px] left-3"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    накопичено: {Math.round(userFromDB?.myStatus)} з{" "}
                    {status?.goal}
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
            contentContainerStyle={{ paddingBottom: 255 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View className="p-5">
              <Text
                allowFontScaling={false}
                className="mb-[6px] text-[18px] font-bold "
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Досягни нового рівня: знижка {status?.achievement}%
              </Text>
              <Text
                allowFontScaling={false}
                className={`mb-5 text-[14px]  ${
                  isDarkMode ? "text-white" : "text-darkStroke"
                }`}
              >
                З кожною покупкою ти наближаєшся до нового статусу та підвищуєш
                відсоток своєї знижки!
              </Text>

              <Text
                allowFontScaling={false}
                className="text-[18px] font-bold mb-3"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Мій статус
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
                  {cards.map((status, index) => (
                    <View
                      key={index}
                      className={`-top-[84px]  rounded-full  border-2 border-white 
                       mt-[157px] ${
                         status.active
                           ? "bg-green w-[24px] h-[24px] right-[3px] border-green"
                           : "bg-green w-[18px] h-[18px]"
                       }
                    `}
                    />
                  ))}
                </View>

                <View className="flex-1 relative">
                  {cards.map((status, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={status.icon}
                        className={`absolute z-10 ${status.position}`}
                        resizeMode="contain"
                      />

                      <LinearGradient
                        colors={[status.colors[0], status.colors[1]]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        className="rounded-[20px] px-3 pt-[17px] pb-3 mb-5 flex-row items-center min-h-[142px] w-full"
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
                            необхідний об'єм:
                            <Text className="font-bold">{status.volume}</Text>
                          </Text>
                          <Text
                            allowFontScaling={false}
                            className="text-white text-base"
                          >
                            дохід:
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
