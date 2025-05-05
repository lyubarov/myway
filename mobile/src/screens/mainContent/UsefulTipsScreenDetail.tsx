import { RootStackParamList } from "@appTypes/navigationTypes";
import { ArrowBackWhite } from "@assets/svg/ArrowBack";
import ShareIcon from "@assets/svg/ShareIcon";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { Share } from "react-native";

export default function UsefulTipsScreenDetail() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { item } = route.params;
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

  return (
    <ViewShot ref={viewRef} options={{ format: "jpg", quality: 1 }}>
      <LinearGradient
        colors={["#19dcc9", "#0b5951"]}
        className="w-full h-screen"
      >
        <SafeAreaView className="flex-1 mb-0 pb-0">
          <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
            <View className="w-full flex-row items-center justify-between p-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2"
              >
                <ArrowBackWhite />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-white rounded-full"
                onPress={handleShare}
              >
                <ShareIcon />
              </TouchableOpacity>
            </View>
            <View className="px-3">
              <Image
                className="mb-8 ml-auto mr-auto"
                style={{ height: "auto", aspectRatio: 1.1 }}
                source={{ uri: item.imageUrl }}
                resizeMode="contain"
              />
              <Text
                allowFontScaling={false}
                className="text-[28px] font-bold mb-5 text-white"
              >
                {item.title}
              </Text>
              <Text allowFontScaling={false} className="text-[18px] text-white">
                {item.description}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ViewShot>
  );
}
