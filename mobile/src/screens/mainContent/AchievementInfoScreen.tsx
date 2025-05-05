import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "src/firebase/context/authContext";
export default function AchievementInfoScreen() {
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
        <AuthHeader title="Мої досягнення" color="white" />
        <Image
          source={require("@assets/icons/referralCup.png")}
          className="mb-2 ml-auto mr-auto"
        />
        <View
          className="w-full h-full mt-4 rounded-t-[40px] p-5 relative"
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
              Мої досягнення — кожна дія має значення
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Тут починається твій шлях до винагород. У цьому розділі на тебе
              чекають завдання, які можна виконати протягом місяця. Кожне з них
              — це твій шанс отримати вейли, які перетворюються на реальні
              гривні. Ці кошти ти можеш витратити на продукцію прямо в додатку.
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              🎯 Навіщо це потрібно?
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              По-перше — за кожне досягнення ти отримуєш реальні бонуси.{"\n"}
              По-друге — виконавши всі завдання, ти автоматично потрапляєш до
              Клубу лідерів, де на тебе чекають додаткові призи!
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              📈 Як це працює?
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[16px]"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              {`• Виконуй завдання, накопичуй вейли. \n\n
• Слідкуй за прогресом — ми покажемо, що вже виконано, а що ще попереду. \n\n
• Увійди в трійку лідерів і отримай ексклюзивні подарунки в кінці місяця.`}
              {"\n"}
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[16px] mt-5"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              💡 Не відкладай на останні дні — у випадку однакової кількості
              балів, вище буде той, хто виконав завдання швидше.{"\n"}
              {"\n"}
              🔓 Розблокуй усі досягнення — і отримай максимум від додатку!
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
