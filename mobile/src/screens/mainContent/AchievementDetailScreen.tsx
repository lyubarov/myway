import { ArrowBackWhite } from "@assets/svg/ArrowBack";
import ShareIcon from "@assets/svg/ShareIcon";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { CustomButton } from "@components/ui/CustomButton";
import StepCorrectIconIcon from "@assets/svg/StepCorrectIcon";
import { useAuth } from "src/firebase/context/authContext";
import { useCallback, useRef } from "react";
import { achievementsCards } from "@utils/achievement";
import { sendNotificationToUsers } from "src/firebase/notification";
import { addAchievement } from "src/firebase/db";
import ViewShot from "react-native-view-shot";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { Share } from "react-native";
import { InstagramConnect } from "@components/InstagramConnect";
import { FacebookConnect } from "@components/FacebookConnect";
import { GoogleConnect } from "@components/GoogleConnect";
import { TikTokConnect } from "@components/TikTokConnect";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

export default function AchievementDetailScreen() {
  const { userFromDB, isDarkMode } = useAuth();
  const route = useRoute();
  const { card } = route.params || {};

  const sendNotification = useCallback(
    async (title: string, body: string) => {
      await sendNotificationToUsers(
        userFromDB.uid,
        title,
        body,
        "NotificationScreen"
      );
    },
    [userFromDB.uid]
  );

  const navigation = useNavigation<AuthNavigationProp>();

  const viewRef = useRef<ViewShot | null>(null);

  const generateDynamicLink = async () => {
    const link = await dynamicLinks().buildShortLink({
      link: `https://myway767.page.link/home`,
      domainUriPrefix: "https://myway767.page.link",
      android: { packageName: "com.myway.dev767" },
      ios: { bundleId: "com.myway.dev767" },
    });

    return link;
  };
  const handleShare = async () => {
    try {
      const link = await generateDynamicLink();

      await Share.share({
        message: `Приєднуйся до мене: ${link}`,
      });
    } catch (error) {
      console.log("Error sharing the link", error);
    }
  };
  const selectedItem = achievementsCards.find((item) =>
    item.title === "Соціальний старт"
      ? item.title === card.name &&
        card.description.toLowerCase().includes(item.description)
      : item.title === card.name
  );

  // const clientId = "2226248151106494"; // Ваш Facebook App ID
  // const redirectUri = "https://www.instagram.com"; // або "myapp://auth/callback" для мобільного додатку
  // const clientSecret = "48acda7155d1b8f5a30635d8297eec7b";
  // const scope = "user_profile"; // Запит на доступ до профілю користувача
  const socialMediaPlatforms = ["facebook", "instagram", "tiktok", "youtube"];

  let socialMedia: string | null = null;
  socialMediaPlatforms.forEach((platform) => {
    if (selectedItem.link.includes(platform)) {
      socialMedia = platform;
    }
  });
  console.log(socialMedia);

  const handleStartExecution = () => {
    if (selectedItem) {
      if (selectedItem.link.includes("http")) {
        // navigation.navigate("WebViewScreen", {
        //   url: selectedItem.link,
        // });
        Linking.openURL(selectedItem.link).catch((err) => {
          console.error("Failed to open URL:", err);
        });
        if (selectedItem?.titleNot) {
          // addNotToList(card.id, card.waylMoney);
          // sendNotification(selectedItem.titleNot, selectedItem.bodyNot);
        }
      } else {
        navigation.navigate("MainContent", {
          screen: "ReferralProgramScreen",
        });
      }
    }
  };

  const addNotToList = async (achievementId: string, value: number) => {
    const newList = [...userFromDB.achievementList, achievementId];
    let newWayWallet = userFromDB.wayWallet + value;
    let newMedals = userFromDB.medals + value;

    await addAchievement(userFromDB.uid, newList, newWayWallet, newMedals);
  };

  return (
    <ViewShot ref={viewRef} options={{ format: "jpg", quality: 1 }}>
      <LinearGradient
        colors={
          selectedItem?.color1
            ? ["#151515", selectedItem?.color, selectedItem?.color1]
            : ["#151515", selectedItem?.color || "#09D0AE"]
        }
        locations={selectedItem?.color1 ? [0.1, 0.4, 1] : [0.2, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-screen"
      >
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
          backgroundColor="#151515"
          translucent={true}
        />
        <SafeAreaView className="flex-1 mb-0 pb-0">
          <View className="w-full flex-row items-center justify-between p-4">
            <Pressable onPress={() => navigation.goBack()} className="p-2">
              <ArrowBackWhite />
            </Pressable>
            <TouchableOpacity
              className="p-2 bg-white rounded-full"
              onPress={handleShare}
            >
              <ShareIcon />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 155 }}>
            <View className="px-6">
              <Image
                source={{ uri: card.img }}
                className="mb-2 ml-auto mr-auto w-full h-[350px]"
                resizeMode="contain"
              />
              <Text className="text-[28px] text-white text-center font-bold mb-3">
                {card.name}
              </Text>
              <View
                className="px-6 py-4 rounded-full mb-3 ml-auto mr-auto flex-row items-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgb(255, 255, 255)",
                  borderWidth: 1,
                  alignSelf: "flex-start",
                }}
              >
                <Text className="text-base font-bold text-white text-center">
                  Винагорода: {card.waylMoney}{" "}
                </Text>
                <Image
                  source={require("@assets/icons/coin.png")}
                  className="w-5 h-5"
                />
              </View>
              <Text className="text-[18px] font-bold text-white text-center">
                {card.description}
              </Text>
              {!userFromDB?.achievementList?.includes(card.id) ? (
                <CustomButton
                  title="Почати зараз"
                  style="bg-black py-[22px] rounded-full w-full font-bold mt-9"
                  onPress={() => {
                    handleStartExecution();
                  }}
                  textColor={"text-white"}
                />
              ) : (
                <TouchableOpacity
                  className="border-2 border-white py-[22px] rounded-full w-full font-bold my-9 flex-row items-center justify-center"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  <Text className="text-white text-base font-bold mr-[6px]">
                    Завдання виконано
                  </Text>
                  <StepCorrectIconIcon />
                </TouchableOpacity>
              )}
              {/* const socialMediaPlatforms = ["facebook", "instagram", "tiktok",
              "youtube"]; */}
              {socialMedia === "instagram" ? (
                <InstagramConnect />
              ) : socialMedia === "facebook" ? (
                <FacebookConnect />
              ) : socialMedia === "youtube" ? (
                <GoogleConnect />
              ) : (
                socialMedia === "tiktok" && <TikTokConnect />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ViewShot>
  );
}
