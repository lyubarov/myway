import { useRoute } from "@react-navigation/native";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function BannerInfoScreen() {
  const route = useRoute();
  const { banner } = route.params;
  console.log("notification", banner);

  return (
    <LinearGradient colors={["#19dcc9", "#0b5951"]} className="w-full h-screen">
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#19dcc9"
          translucent={true}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
          <AuthHeader title="Сповіщення" />
          <View className="px-3">
            {/* <Image
              className="ml-auto mr-auto w-[183px] h-[275px] mb-5"
              source={require("@assets/icons/vitamins.png")}
            /> */}
            <Text className="text-[24px] font-bold mb-5">{banner.title}</Text>
            <Text className="text-[18px]">{banner.description}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
