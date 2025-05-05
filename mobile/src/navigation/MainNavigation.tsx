import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { AuthorizationNavigation } from "./AuthorizationNavigation";
import { MainContentNavigation } from "./MainContentNavigation";
import LiqPayWebView from "src/LiqPay/generateLiqPayPayment";

const Stack = createNativeStackNavigator();

export const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingNavigation} />
      <Stack.Screen name="Authorization" component={AuthorizationNavigation} />
      <Stack.Screen name="MainContent" component={MainContentNavigation} />
      <Stack.Screen name="LiqPayWebView" component={LiqPayWebView} />
    </Stack.Navigator>
  );
};
