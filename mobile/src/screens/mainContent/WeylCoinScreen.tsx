import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { useAuth } from "src/firebase/context/authContext";

export default function WeylCoinScreen() {
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
        barStyle="dark-content"
        backgroundColor="#000"
        translucent={true}
      />
      <SafeAreaView className="flex-1  mb-0 pb-0">
        <AuthHeader title="Мої досягнення" color="white" />
        <Image
          source={require("@assets/icons/coin.png")}
          className="mb-2 ml-auto mr-auto"
        />
        <View className="w-full h-full bg-white mt-4 rounded-t-[40px] p-5 relative">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 550 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              allowFontScaling={false}
              className="mb-[6px] text-[18px] font-bold "
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              Вейли – перетворюй зусилля на реальні гривні!
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Хочеш, щоб твоя активність у додатку працювала на тебе? Тоді саме
              час познайомитись із вейлами (WEYL) — внутрішньою валютою, яку ти
              заробляєш, виконуючи завдання в розділі «Мої досягнення».
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              💰 Що це таке?
            </Text>
            <Text
              allowFontScaling={false}
              className="mb-5 text-[16px] text-darkStroke"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              Це не просто бонуси. Це твої гроші всередині додатку. За кожне
              виконане завдання ти отримуєш вейли — і можеш обміняти їх на
              гривні, які одразу зараховуються на твій баланс.{"\n"}
              {"\n"}А далі — ще простіше: купуй продукцію за власноруч зароблені
              кошти. Ти проходиш завдання — додаток дякує тобі гривнями. Все
              проходиш завдання — додаток дякує тобі гривнями. Все чесно і
              прозоро.
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[18px] font-bold mb-2"
              style={{ color: isDarkMode ? "white" : "black" }}
            >
              📌 Що важливо знати:
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[16px]"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              {`• Вейли можна використати лише одним способом — перевести у гривні для покупок \n\n
• Чим швидше і більше завдань ти проходиш — тим більше заробляєш \n\n
• Це твоя особиста система мотивації — і вона працює
`}
              {"\n"}
            </Text>
            <Text
              allowFontScaling={false}
              className="text-[16px] mt-5"
              style={{ color: isDarkMode ? "white" : "#727877" }}
            >
              🏆 А якщо хочеш більше: Виконуй завдання серед перших — і маєш
              шанс потрапити до Клубу лідерів, де щомісяця даруємо круті призи.
              Це не обов’язково, але приємно 😉{"\n"}
              {"\n"}🔥 Заробляй. Обмінюй. Купуй. Вейли — це не про гейміфікацію.
              Це про вигоду, яку ти реально відчуваєш. відчуваєш.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
