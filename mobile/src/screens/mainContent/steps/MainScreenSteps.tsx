import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, View } from "react-native";
import MyTabs from "../components/MyTabs";

export default function MainScreenSteps() {
  return (
    <LinearGradient colors={["#19dcc9", "#0b5951"]} className="w-full h-screen">
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <AuthHeader title="Сповіщення" />
        <View className="px-3"></View>
        <MyTabs />
      </SafeAreaView>
    </LinearGradient>
  );
}
