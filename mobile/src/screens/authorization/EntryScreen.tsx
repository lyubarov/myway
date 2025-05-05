import { RootStackParamList } from "@appTypes/navigationTypes";
import { CustomButton } from "@components/ui/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, Text, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EntryScreen"
>;

export const EntryScreen = () => {
  const { isDarkMode } = useAuth();
  const navigation = useNavigation<AuthNavigationProp>();

  const handleLoginScreen = () => {
    navigation.navigate("Authorization", { screen: "Login" });
  };

  const handleRegistrationScreen = () => {
    navigation.navigate("Authorization", { screen: "Registration" });
  };
  const handleHomeScreen = () => {
    navigation.navigate("MainContent", { screen: "HomeScreen" });
  };

  return (
    <View
      className={`flex-1 px-3 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="justify-center items-center ">
          <Image
            source={require("@assets/icons/OpeningScreenPhoto.png")}
            style={{
              marginTop: 60,
              width: "100%",
              resizeMode: "contain",
            }}
          />
          <Text
            allowFontScaling={false}
            className={`font-main text-2xl text-blackText font-bold pt-9 ${
              isDarkMode ? " text-white" : "text-black"
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
            <LinearGradient
              colors={["#25C3B4", "#00A696"]}
              className="py-2 rounded-full w-full font-bold"
            >
              <CustomButton
                title="Увійти"
                onPress={handleLoginScreen}
                textColor={isDarkMode ? "text-black" : "text-white"}
              />
            </LinearGradient>
            <CustomButton
              title="Створити профіль"
              onPress={handleRegistrationScreen}
              style={`py-4 rounded-full w-full text-black font-bold`}
              color={isDarkMode ? "#F4F4F4" : "#171717"}
              textColor={isDarkMode ? "text-black" : "text-white"}
            />
          </View>
          <View className="flex-row justify-center items-center gap-x-6 pt-6">
            <View className="flex-1 border border-borderGrey" />
            <Text
              allowFontScaling={false}
              onPress={handleHomeScreen}
              className={`font-main text-base font-medium  opacity-70 text-darkText 
                  
                `}
            >
              Або увійти без реєстрації
            </Text>
            <View className="flex-1 border border-borderGrey" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
