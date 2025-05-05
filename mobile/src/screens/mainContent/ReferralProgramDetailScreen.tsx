import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { useAuth } from "src/firebase/context/authContext";
export default function ReferralProgramDetailScreen() {
  const { isDarkMode } = useAuth();

  return (
    <LinearGradient
      colors={["#000", "#09D0AE"]}
      locations={[0.2, 1]}
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
        <AuthHeader title="Реферальна програма" color="white" />
        <Image
          source={require("@assets/icons/referralCup.png")}
          className="mb-2 ml-auto mr-auto"
        />
        <View
          className="w-full h-full  mt-4 rounded-t-[40px] p-5 relative"
          style={{
            backgroundColor: isDarkMode ? "#171717" : "white",
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 550 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              allowFontScaling={false}
              className="mb-[6px] text-[18px] font-bold "
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Запрошуй — заробляй! Твій дохід починається з одного посилання
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              У тебе є потужний інструмент для заробітку — і він прямо в
              додатку. Реферальна програма — це реальна можливість отримувати
              гроші на свій баланс просто за те, що ділишся своїм досвідом і
              посиланням.
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              🔗 Як це працює?
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Ти ділишся своїм реферальним посиланням — друзі переходять за ним,
              купують продукти, а ти заробляєш. Так, усе настільки просто.
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              💸 Скільки можна отримати?
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Чим активніші твої запрошені користувачі — тим вищий твій відсоток
              доходу:
            </Text>
            <View className="w-full mb-5">
              <View className="bg-[#A6D4D1] px-3 flex-row items-center rounded-t-[20px]">
                <Text
                  allowFontScaling={false}
                  className="text-[16px] font-bold max-w-[70%] w-full border-r border-[#bcded7] py-[10px]"
                >
                  Сума замовлень друзів
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-[16px] font-bold max-w-[30%] w-full pl-3 py-[10px]"
                >
                  Твій дохід
                </Text>
              </View>

              <View
                className="flex-row justify-between px-3 border-b border-[#bcded7]"
                style={{ backgroundColor: "#e0f0ee" }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-[16px]  max-w-[70%] w-full border-r border-[#bcded7] py-[10px]"
                >
                  До 10 000 грн
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-[16px] max-w-[30%] w-full pl-3 py-[10px]"
                >
                  7%
                </Text>
              </View>

              {/* Row 2 */}
              <View
                className="flex-row justify-between px-3 border-b border-[#bcded7]"
                style={{ backgroundColor: "#e0f0ee" }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-[16px] max-w-[70%] w-full border-r border-[#bcded7] py-[10px]"
                >
                  До 20 000 грн
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-[16px] max-w-[30%] w-full pl-3 py-[10px]"
                >
                  10%
                </Text>
              </View>

              {/* Row 3 */}
              <View
                className="flex-row justify-between  px-3 border-b border-[#bcded7]"
                style={{ backgroundColor: "#e0f0ee" }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-[16px] max-w-[70%] w-full border-r border-[#bcded7] py-[10px]"
                >
                  До 30 000 грн
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-[16px]  max-w-[30%] w-full pl-3 py-[10px]"
                >
                  14%
                </Text>
              </View>

              {/* Row 4 */}
              <View
                className="flex-row justify-between px-3 border-b border-[#bcded7] rounded-b-[20px]"
                style={{ backgroundColor: "#e0f0ee" }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-[16px]  max-w-[70%] w-full border-r border-[#bcded7] py-[10px]"
                >
                  Від 30 000 грн
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-[16px]  max-w-[30%] w-full pl-3 py-[10px]"
                >
                  20%
                </Text>
              </View>
            </View>

            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              💥 І так — це реальні гроші.
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Вони автоматично нараховуються у гривнях на твій баланс і доступні
              для покупок у додатку. Ніяких віртуальних балів — чистий дохід,
              який працює на тебе.
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              🚀 Чому це вигідно?
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] font-norma"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              • Не потрібно нічого продавати {"\n"}
              {"\n"}• Ти просто рекомендуєш те, що використовуєш сам {"\n"}
              {"\n"} • Усе працює автоматично — ти лише ділишся посиланням
              {"\n"}
            </Text>

            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-3"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              🔓 Запрошуй активно — формуй свій дохід{" "}
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Не втрачай можливість заробляти, просто розповідаючи про продукт,
              який тобі подобається.{"\n"} З кожним новим другом твій баланс
              зростає. А з ним — і твоя свобода вибору.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
