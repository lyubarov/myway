import { RootStackParamList } from "@appTypes/navigationTypes";
import AppleLogo from "@assets/svg/AppleLogo";
import GoogleLogo from "@assets/svg/GoogleLogo";
import MailLogo from "@assets/svg/MailLogo";
import { CustomButton } from "@components/ui/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithApple, signInWithGoogle } from "src/firebase/auth";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EntryScreen"
>;

export const RegistrationScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isDarkMode } = useAuth();

  const handleLoginScreen = () => {
    navigation.navigate("Authorization", { screen: "Login" });
  };
  const handleMail = () => {
    navigation.navigate("Authorization", { screen: "CreateProfileFirstStep" });
  };
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log(user);

      if (user) {
        navigation.navigate("MainContent", {
          screen: "MainScreen",
        });
      }
    } catch (error) {
      console.error("Помилка входу через Google:", error);
    }
  };
  const handleAppleSignIn = async () => {
    try {
      const user = await signInWithApple();
      console.log(user);

      if (user) {
        navigation.navigate("MainContent", {
          screen: "MainScreen",
        });
      }
    } catch (error) {
      console.error("Помилка входу через Google:", error);
    }
  };
  return (
    <View
      className={`flex-1 px-3 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}
    >
      <View className="justify-center items-center pt-5">
        <Image source={require("@assets/icons/OpeningScreenPhoto.png")} />
        <Text
          allowFontScaling={false}
          className={`font-main text-2xl  font-bold pt-9
            ${isDarkMode ? "text-white" : "text-blackText"}
}`}
        >
          Створюй свій шлях успіху
        </Text>
        <Text
          allowFontScaling={false}
          className="font-main text-lg text-darkText text-center leading-5 pt-3"
        >
          Відкривай нові можливості, отримуй бонуси та будь в ресурсі!
        </Text>
        <View className="w-full gap-y-3 pt-9">
          <CustomButton
            title="Продовжити з Email"
            onPress={handleMail}
            style="bg-darkBlack py-4 rounded-full w-full font-bold"
            icon={<MailLogo isDarkMode={isDarkMode} />}
            color={isDarkMode ? "white" : "black"}
            textColor={isDarkMode ? "text-black" : "text-white"}
          />
          <CustomButton
            title="Продовжити з Google"
            onPress={handleGoogleSignIn}
            style="bg-darkBlack py-4 rounded-full w-full font-bold"
            icon={<GoogleLogo />}
            color={isDarkMode ? "white" : "black"}
            textColor={isDarkMode ? "text-black" : "text-white"}
          />
          {Platform.OS === "ios" && (
            <CustomButton
              title="Продовжити з Apple"
              onPress={handleAppleSignIn}
              style={` py-4 rounded-full w-full font-bold ${
                isDarkMode ? "bg-darkBlack" : "bg-darkBlack"
              }`}
              color={isDarkMode ? "white" : "black"}
              icon={<AppleLogo isDarkMode={isDarkMode} />}
              textColor={isDarkMode ? "text-black" : "text-white"}
            />
          )}
        </View>
        <View className="flex-row justify-center items-center gap-x-6 pt-6">
          <View className="flex-1 border border-borderGrey" />
          <Text
            allowFontScaling={false}
            className={`font-main text-base font-medium text-black opacity-70             ${
              isDarkMode ? "text-white" : "text-blackText"
            }
`}
          >
            Ви вже маєте профіль?
            <Text
              allowFontScaling={false}
              onPress={handleLoginScreen}
              className="color-green"
            >
              {" "}
              Увійти
            </Text>
          </Text>
          <View className="flex-1 border border-borderGrey" />
        </View>
      </View>
    </View>
  );
};
