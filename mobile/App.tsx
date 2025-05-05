import { AuthProvider } from "src/firebase/context/authContext";
import "./global.css";
import { MainNavigation } from "@navigation/MainNavigation";
import { InfoProvider } from "@utils/infoContext";
import { StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const linking = {
  prefixes: ["https://yourapp.page.link", "myapp://"],
  config: {
    screens: {
      Home: "home",
      Product: "product/:productId",
    },
  },
};

const App = () => {
  return (
    <AuthProvider>
      <InfoProvider>
        <NavigationContainer
          linking={linking}
          fallback={<Text>Loading...</Text>}
        >
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />
          <SafeAreaView
            edges={["top"]}
            className="flex-1 bg-lightBack mb-0 pb-0"
          >
            <MainNavigation />
          </SafeAreaView>
        </NavigationContainer>
      </InfoProvider>
    </AuthProvider>
  );
};

export default App;
