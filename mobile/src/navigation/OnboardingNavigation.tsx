import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingOne } from "@screens/onboarding/OnboardingOne";
import { useAuth } from "src/firebase/context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();
export const OnboardingNavigation = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
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
        <Stack.Screen name="OnboardingOne">
          {(props) => (
            <OnboardingOne
              {...props}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </SafeAreaView>
  );
};
