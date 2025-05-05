import { RootStackParamList } from "@appTypes/navigationTypes";
import { CustomButton } from "@components/ui/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View, ImageBackground, Animated, Image } from "react-native";
import { Pagination } from "./components/Pagination";
import { OnboardingProps } from "@appTypes/onboardingProps";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "src/firebase/context/authContext";
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "@screens/authorization/components/LoadingScreen";
import { findFcmToken } from "src/firebase/db";
import { getToken } from "src/firebase/notification";

type OnboardingNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OnboardingOne",
  "MainContent"
>;

export const OnboardingOne: React.FC<OnboardingProps> = () => {
  const { currentUser, loading } = useAuth();

  const navigation = useNavigation<OnboardingNavigationProp>();

  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onboarding = [
    {
      title: "Кожний крок в ресурсі",
      description:
        "Вітаміни, БАДи та спортивне харчування — усе, що потрібно для твого активного та наповненого життя!",
      photo: require("../../../assets/icons/1_onboarding.png"),
    },
    {
      title: "Бери максимум",
      description:
        "Досягнення, рейтинги та круті бонуси — приймай участь, перемагай, отримуй знижки та круті бонуси!",
      photo: require("../../../assets/icons/2_onboarding.png"),
    },
    {
      title: "Заробляй з командою",
      description:
        "Запрошуй друзів, отримуй дохід та заряджай своє оточення на нові звершення!",
      photo: require("../../../assets/icons/3_onboarding.png"),
    },
  ];
  const handleEntryScreen = () => {
    navigation.navigate("Authorization", { screen: "EntryScreen" });
  };

  useEffect(() => {
    if (currentUser) {
      navigation.replace("MainContent", { screen: "MainScreen" });
    }
  }, [currentUser, navigation]);
  const getIsToken = async () => {
    const token = await getToken();
    const isTokens = await findFcmToken(token);
    return isTokens;
  };
  useEffect(() => {
    const initialize = async () => {
      const tokenExists = await getIsToken();
      if (tokenExists) {
        handleEntryScreen;
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (currentStep < onboarding.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleEntryScreen();
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: "#1C1C1C" }}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ImageBackground
          source={onboarding[currentStep].photo}
          resizeMode="cover"
          className="flex-1 w-full h-[90%] items-center pt-16"
        >
          <Image source={require("../../../assets/icons/LogoMyWay.png")} />
          <LinearGradient
            colors={[
              "rgba(44, 44, 44, 0.0)",
              "rgba(33, 33, 33, 1.0)",
              "rgba(28, 28, 28, 1.0)",
            ]}
            locations={[0, 0.5, 1]}
            className="absolute bottom-0 w-full p-6 pt-28"
          >
            <View className="flex-row justify-center mb-3">
              <Pagination currentStep={currentStep + 1} />
            </View>

            <Text className="text-white font-bold text-2xl text-center">
              {onboarding[currentStep].title}
            </Text>

            <Text className="text-white text-lg text-center mt-2 leading-5">
              {onboarding[currentStep].description}
            </Text>

            <LinearGradient
              colors={["#25C3B4", "#00A696"]}
              className="w-full py-2 rounded-full my-5"
            >
              <CustomButton
                title="Продовжити"
                onPress={() => handleEntryScreen()}
              />
            </LinearGradient>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};
