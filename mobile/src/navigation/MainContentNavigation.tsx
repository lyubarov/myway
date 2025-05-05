import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AchievementDetailScreen from "@screens/mainContent/AchievementDetailScreen";
import AchievementInfoScreen from "@screens/mainContent/AchievementInfoScreen";
import AchievementScreen from "@screens/mainContent/AchievementScreen";
import BannerInfoScreen from "@screens/mainContent/BannerInfoScreen";
import { BasketScreen } from "@screens/mainContent/BasketScreen";
import CalendarScreen from "@screens/mainContent/CalendarScreen";
import CatalogDetailScreen from "@screens/mainContent/CatalogDetailScreen";
import ClubOfLidersInfoScreen from "@screens/mainContent/ClubOfLidersInfoScreen";
import ClubOfLidersScreen from "@screens/mainContent/ClubOfLidersScreen";
import ConfidentialityScreen from "@screens/mainContent/ConfidentialityScreen";
import FavoritesScreen from "@screens/mainContent/FavoritesScreen";
import HistoryOrdersScreen from "@screens/mainContent/HistoryOrdersScreen";
import { InfoScreen } from "@screens/mainContent/InfoScreen";
import { MainScreen } from "@screens/mainContent/MainScreen";
import MyStatusScreen from "@screens/mainContent/MyStatusScreen";
import NotificationDetails from "@screens/mainContent/NotificationDetails";
import NotificationScreen from "@screens/mainContent/NotificationScreen";
import PlacingOrderFinalScreen from "@screens/mainContent/PlacingOrderFinalScreen";
import { PlacingOrderFirstScreen } from "@screens/mainContent/PlacingOrderFirstScreen";
import { PlacingOrderSecondScreen } from "@screens/mainContent/PlacingOrderSecondScreen";
import { PlacingOrderThirdScreen } from "@screens/mainContent/PlacingOrderThirdScreen";
import ReferralProgramDetailScreen from "@screens/mainContent/ReferralProgramDetailScreen";
import ReferralProgramScreen from "@screens/mainContent/ReferralProgramScreen";
import SettingsScreen from "@screens/mainContent/SettingsScreen";
import MainScreenSteps from "@screens/mainContent/steps/MainScreenSteps";
import UsefulTipsScreen from "@screens/mainContent/UsefulTipsScreen";
import UsefulTipsScreenDetail from "@screens/mainContent/UsefulTipsScreenDetail";
import WaterBalanceScreen from "@screens/mainContent/WaterBalanceScreen";
import { WebViewScreen } from "@screens/mainContent/WebViewScreen";
import WeylCoinScreen from "@screens/mainContent/WeylCoinScreen";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "src/firebase/context/authContext";

const Stack = createNativeStackNavigator();

export const MainContentNavigation = () => {
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
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="BasketScreen" component={BasketScreen} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
        <Stack.Screen
          name="PlacingOrderFirstScreen"
          component={PlacingOrderFirstScreen}
        />
        <Stack.Screen
          name="HistoryOrdersScreen"
          component={HistoryOrdersScreen}
        />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="NotificationDetails"
          component={NotificationDetails}
        />
        <Stack.Screen name="MainScreenSteps" component={MainScreenSteps} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen
          name="CatalogDetailScreen"
          component={CatalogDetailScreen}
        />
        <Stack.Screen name="UsefulTipsScreen" component={UsefulTipsScreen} />
        <Stack.Screen
          name="UsefulTipsScreenDetail"
          component={UsefulTipsScreenDetail}
        />
        <Stack.Screen
          name="ReferralProgramScreen"
          component={ReferralProgramScreen}
        />
        <Stack.Screen name="MyStatusScreen" component={MyStatusScreen} />
        <Stack.Screen name="AchievementScreen" component={AchievementScreen} />
        <Stack.Screen
          name="AchievementDetailScreen"
          component={AchievementDetailScreen}
        />
        <Stack.Screen
          name="ReferralProgramDetailScreen"
          component={ReferralProgramDetailScreen}
        />
        <Stack.Screen
          name="AchievementInfoScreen"
          component={AchievementInfoScreen}
        />
        <Stack.Screen
          name="ClubOfLidersScreen"
          component={ClubOfLidersScreen}
        />
        <Stack.Screen
          name="ClubOfLidersInfoScreen"
          component={ClubOfLidersInfoScreen}
        />
        <Stack.Screen
          name="PlacingOrderSecondScreen"
          component={PlacingOrderSecondScreen}
        />
        <Stack.Screen
          name="PlacingOrderThirdScreen"
          component={PlacingOrderThirdScreen}
        />
        <Stack.Screen
          name="PlacingOrderFinalScreen"
          component={PlacingOrderFinalScreen}
        />
        <Stack.Screen
          name="WaterBalanceScreen"
          component={WaterBalanceScreen}
        />
        <Stack.Screen name="BannerInfoScreen" component={BannerInfoScreen} />
        <Stack.Screen
          name="ConfidentialityScreen"
          component={ConfidentialityScreen}
        />
        <Stack.Screen name="WeylCoinScreen" component={WeylCoinScreen} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};
