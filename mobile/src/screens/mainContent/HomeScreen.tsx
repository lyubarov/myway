import { Image, ScrollView, Text, View } from "react-native";
import ToggleTypeFood from "./components/ToggleTypeFood";
import NoveltyList from "./components/NoveltyList";
import PropositionList from "./components/PropositionList";
import { BottomTabModal } from "./components/BottomTabModal";
import ItemsInCart from "./components/ItemsInCart";
import HeaderAboutUser from "./components/HeaderAboutUser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useUsersProduct } from "@utils/infoContext";
import { useEffect, useState } from "react";
import CustomModal from "@screens/authorization/components/CustomModal";
import {
  getPopUpNotifications,
  getToken,
  requestUserPermission,
} from "src/firebase/notification";
import {
  addFcmTokenToFirestore,
  findFcmToken,
  saveFcmToken,
} from "src/firebase/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "src/firebase/context/authContext";
import DiscountScreen from "./DiscountScreen";
import { getPushToken } from "@utils/getPushToken";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

export const HomeScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isDarkMode, userFromDB } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [popUpNot, setPopUpNot] = useState([]);
  const [everyDayPopUp, setEveryDayPopUp] = useState(false);

  const saveToken = async () => {
    const token = await getToken();
    const isTokens = await findFcmToken(token);
    if (!isTokens) await saveFcmToken(token);
  };

  const getIsToken = async () => {
    const token = await getToken();

    if (token && userFromDB.fcmToken && token !== userFromDB.fcmToken) {
      await addFcmTokenToFirestore(userFromDB.uid, token);
    } else if (token && !userFromDB.fcmToken) {
      await addFcmTokenToFirestore(userFromDB.uid, token);
    }
    const isTokens = await findFcmToken(token);
    return isTokens;
  };
  const checkIfPopupWasShown = async (popupId: string) => {
    const shownPopups = await AsyncStorage.getItem("shownPopups");
    const parsedPopups = shownPopups ? JSON.parse(shownPopups) : [];
    return parsedPopups.includes(popupId);
  };

  const markPopupAsShown = async (popupId: string) => {
    const shownPopups = await AsyncStorage.getItem("shownPopups");
    const parsedPopups = shownPopups ? JSON.parse(shownPopups) : [];
    parsedPopups.push(popupId);
    await AsyncStorage.setItem("shownPopups", JSON.stringify(parsedPopups));
  };
  useEffect(() => {
    const initialize = async () => {
      const tokenExists = await getIsToken();
      // setVisibleWelcomeModal(tokenExists);
      if (!tokenExists) {
        setModalVisible(true);
        await saveToken();
      }
    };
    const fetchNot = async () => {
      ///////
      // await requestUserPermission(userFromDB.uid);
      await getPushToken();
      await requestUserPermission(userFromDB.uid);
      //////////

      const data = await getPopUpNotifications();
      setPopUpNot(data);
      if (data.length > 0) {
        const alreadyShown = await checkIfPopupWasShown(data[0].id);
        if (!alreadyShown) {
          setEveryDayPopUp(true);
          await markPopupAsShown(data[0].id);
        }
      }
    };
    fetchNot();
    initialize();
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (modalVisible) {
      timer = setTimeout(() => {
        setModalVisible(false);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [modalVisible]);
  const { blocks, modalBasketIsOpen, setModalBasketIsOpen, typeFood } =
    useUsersProduct();
  console.log(blocks);

  const toggleModal = () => {
    setModalVisible(false);
    setEveryDayPopUp(false);
  };
  const handleBasket = () => {
    navigation.navigate("MainContent", {
      screen: "BasketScreen",
    });
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <HeaderAboutUser />
        <View className="pl-3">
          <ToggleTypeFood isCatalog={false} />
          {[...blocks]
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <View className="mb-1" key={block.id}>
                {block.category === "Товари" &&
                  block.title.toLowerCase().trim() ===
                    typeFood?.toLowerCase().trim() && (
                    <View>
                      <Text
                        className={`font-bold text-[20px] mb-2 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {block.title}
                      </Text>
                      <NoveltyList blockId={block.id} />
                    </View>
                  )}

                {block.category === "Банери" && (
                  <View>
                    <Text
                      className={`font-bold text-[20px] mb-2 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {block.title}
                    </Text>
                    <PropositionList blockId={block.id} />
                  </View>
                )}

                {block.category !== "Товари" && block.category !== "Банери" && (
                  <View>
                    <Text
                      className={`font-bold text-[20px] mb-2                    ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {block.title}
                    </Text>
                    <DiscountScreen blockId={block.id} />
                  </View>
                )}
              </View>
            ))}
        </View>
      </ScrollView>
      <BottomTabModal
        isVisible={modalBasketIsOpen}
        onClose={() => {
          setModalBasketIsOpen(!modalBasketIsOpen);
        }}
        handleBasket={handleBasket}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 155 }}>
          <ItemsInCart />
        </ScrollView>
      </BottomTabModal>
      <CustomModal
        visible={modalVisible}
        onClose={toggleModal}
        title="Вітаємо в My Way!"
        img={<Image source={require("@assets/icons/WelcomeScreenPhoto.png")} />}
        message="Твій простір для здоров’я, енергії та крутих досягнень.
Бонус на перший крок  — 100 грн уже твоєму на рахунку!
Що обереш для старту?"
      />
      {!modalVisible && (
        <CustomModal
          visible={everyDayPopUp}
          onClose={toggleModal}
          title={popUpNot[0]?.title}
          img={
            <Image source={require("@assets/icons/WelcomeScreenPhoto.png")} />
          }
          message={popUpNot[0]?.body}
        />
      )}
    </View>
  );
};
