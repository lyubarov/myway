import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../HomeScreen";
import { CatalogScreen } from "../CatalogScreen";
import { ResourceScreen } from "../ResourceScreen";
import { OfficeScreen } from "../OfficeScreen";
import { PayScreen } from "../PayScreen";
import { Text, View } from "react-native";
import {
  CatalogIcon,
  HomeIcon,
  OfficeIcon,
  ResourceIcon,
} from "@assets/svg/TabsIcons";
import { useAuth } from "src/firebase/context/authContext";

const Tab = createBottomTabNavigator();
const MyTabs = () => {
  const { isDarkMode } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 75,
          backgroundColor: isDarkMode ? "black" : "white",
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Головна"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="justify-center items-center top-6">
              <HomeIcon focused={focused} />
              <Text
                allowFontScaling={false}
                className={` w-full  mt-1 font-semibold text-[12px] ${
                  focused ? "text-green" : "text-greyGrey"
                }`}
              >
                Головна
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Каталог"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="justify-center items-center top-6">
              <CatalogIcon focused={focused} />
              <Text
                allowFontScaling={false}
                className={`w-[100%]  mt-1 text-center font-semibold text-[12px] ${
                  focused ? "text-green" : "text-greyGrey"
                }`}
              >
                Каталог
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Pay"
        component={PayScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className="justify-center items-center top-[-6] w-[60px] h-[60px] rounded-full bg-green"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text
                allowFontScaling={false}
                className={`font-semibold text-[28px] ${
                  isDarkMode ? "text-black" : "text-white"
                } `}
              >
                ₴
              </Text>
              <Text
                allowFontScaling={false}
                className={`w-[100%] text-center top-[-6] font-semibold text-[14px] ${
                  isDarkMode ? "text-black" : "text-white"
                }
`}
              >
                грн
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Ресурси"
        component={ResourceScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className=" justify-center items-center top-6">
              <ResourceIcon focused={focused} />
              <Text
                allowFontScaling={false}
                className={`w-[100%]  mt-1 text-center font-semibold text-[12px] ${
                  focused ? "text-green" : "text-greyGrey"
                }`}
              >
                Ресурси
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Кабінет"
        component={OfficeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="justify-center items-center top-6">
              <OfficeIcon focused={focused} />
              <Text
                allowFontScaling={false}
                className={`w-[100%]  mt-1 text-center font-semibold text-[12px] ${
                  focused ? "text-green" : "text-greyGrey"
                }`}
              >
                Кабінет
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default MyTabs;
