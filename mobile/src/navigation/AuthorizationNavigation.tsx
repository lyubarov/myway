import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateProfileFirstScreen } from "@screens/authorization/CreateProfileFirstScreen";
import { CreateProfileSecondScreen } from "@screens/authorization/CreateProfileSecondScreen";
import { CreateProfileThirdScreen } from "@screens/authorization/CreateProfileThirdScreen";
import { EntryScreen } from "@screens/authorization/EntryScreen";
import { LoginByEmailScreen } from "@screens/authorization/LoginByEmailScreen";
import { LoginScreen } from "@screens/authorization/LoginScreen";
import { RegistrationScreen } from "@screens/authorization/RegistrationScreen";
import { ResetPasswordScreen } from "@screens/authorization/ResetPasswordScreen";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "src/firebase/context/authContext";

const Stack = createNativeStackNavigator();

export const AuthorizationNavigation = () => {
  const { isDarkMode } = useAuth();

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1  ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#171717" : "#F4F4F4"}
        translucent={true}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EntryScreen" component={EntryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginByEmail" component={LoginByEmailScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="CreateProfileFirstStep"
          component={CreateProfileFirstScreen}
        />
        <Stack.Screen
          name="CreateProfileSecondStep"
          component={CreateProfileSecondScreen}
        />
        <Stack.Screen
          name="CreateProfileThirdStep"
          component={CreateProfileThirdScreen}
        />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};
