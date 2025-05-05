import { useRoute } from "@react-navigation/native";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function NotificationDetails() {
  const route = useRoute();
  const { notification } = route.params;
  console.log("notification", notification);

  return (
    <LinearGradient colors={["#19dcc9", "#0b5951"]} className="w-full h-screen">
      <SafeAreaView className="flex-1 mb-0 pb-0">
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
          <AuthHeader title="Сповіщення" />
          <View className="px-3">
            {/* <Image
              className="ml-auto mr-auto w-[183px] h-[275px] mb-5"
              source={require("@assets/icons/vitamins.png")}
            /> */}
            <Text className="text-[24px] font-bold mb-5">
              {notification.title}
            </Text>
            <Text className="text-[18px]">
              {notification.content} {notification.body}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
