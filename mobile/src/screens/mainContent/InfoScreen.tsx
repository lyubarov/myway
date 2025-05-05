import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowBack } from "@assets/svg/ArrowBack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShareIcon from "@assets/svg/ShareIcon";
import { recommendations } from "@utils/recommendations";
import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { Share } from "react-native";

export const InfoScreen = () => {
  const route = useRoute();
  const { nameProduct } = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const product = recommendations.find((item) => item.title === nameProduct);
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
    <SafeAreaView className="flex-1 bg-lightGreen mb-0 pb-0">
      <View className="w-full flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowBack />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          className="p-2 bg-white rounded-full"
        >
          <ShareIcon />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <ViewShot ref={viewRef} options={{ format: "jpg", quality: 1 }}>
          <View className="px-6">
            <Image
              source={product?.image || recommendations[0].image}
              className="mb-10 ml-auto mr-auto"
            />
            {product?.descriptions}
            {/* <View>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}
              >
                Комплексний підхід до краси та здоров'я
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Чому Омега-3, Вітамін D3 і комплекс «Шкіра, Нігті, Волосся»
                працюють краще разом?
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Щоб отримати{" "}
                <Text style={{ fontWeight: "bold" }}>
                  максимальну користь для організму
                </Text>
                , важливо поєднувати вітаміни, які підсилюють дію один одного.
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Саме тому ми рекомендуємо приймати Омега-3, Вітамін D3 та
                комплекс «Шкіра, Нігті, Волосся» разом:
              </Text>

              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                • Омега-3
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                — сприяє кращому засвоєнню Вітаміну D3, а також покращує
                кровообіг, допомагаючи корисним речовинам з комплексу краси
                краще проникати у клітини.
              </Text>

              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                • Вітамін D3
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                — бере участь у метаболізмі кальцію, що критично важливо для
                міцності нігтів і здорового росту волосся.
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Омега-3 та жиророзчинні вітаміни (D3) бажано приймати під час
                їжі, що містить жири.
              </Text>

              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                • Комплекс «Шкіра, Нігті, Волосся»
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                — містить біотин, цинк і колаген, які разом із Вітаміном D3 та
                Омега-3 зміцнюють волосся, нігті та підтримують еластичність
                шкіри.
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Разом ці вітаміни працюють у синергії, посилюючи дію один одного
                та забезпечуючи видимий ефект з часом.
              </Text>
            </View> */}
          </View>
        </ViewShot>
      </ScrollView>
    </SafeAreaView>
  );
};
