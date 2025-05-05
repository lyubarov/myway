import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { DownIcon } from "@assets/svg/DownIcon";
import { getCities, getStreets, getWarehouses } from "@utils/novaPay";
import { Footer } from "./components/FooterForOrder";
import Progress from "./components/ProgressForOrder";
import Header from "./components/HeaderForOrder";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "src/firebase/context/authContext";
type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

const deliveryOptions = [
  {
    id: 1,
    name: "Нова Пошта",
    description: "Самовивіз з відділення або поштомату",
    icon: require("@assets/icons/NovaPoshta.png"),
  },
  {
    id: 2,
    name: "Нова Пошта",
    description: "Кур'єрська доставка",
    icon: require("@assets/icons/NovaPoshta.png"),
  },
  // {
  //   id: 3,
  //   name: "Укрпошта",
  //   description: "Самовивіз з відділення",
  //   icon: require("@assets/icons/Ukrposhta.png"),
  // },
  // {
  //   id: 4,
  //   name: "Укрпошта",
  //   description: "Кур'єрська доставка",
  //   icon: require("@assets/icons/Ukrposhta.png"),
  // },
];

export const PlacingOrderFirstScreen = () => {
  const { isDarkMode } = useAuth();
  const route = useRoute();
  const { totalAmount } = route.params as { totalAmount: number };
  const navigation = useNavigation<AuthNavigationProp>();
  const [selectedId, setSelectedId] = useState<number>(1);
  const [loader, setLoader] = useState(false);

  const [city, setCity] = useState("");
  const [branch, setBranch] = useState("");

  const [addressForCourier, setAddressForCourier] = useState({
    street: "",
    houseNumber: "",
    apartment: "",
  });

  const address = {
    city,

    deliveryType: {
      name: deliveryOptions[selectedId - 1].name,
      description: deliveryOptions[selectedId - 1].description,
    },

    ...(branch
      ? { branch }
      : addressForCourier.street && addressForCourier.houseNumber
      ? { ...addressForCourier }
      : {}),
  };

  //для автозаповнення від нової пошти
  const [cityList, setCityList] = useState([]);
  const [cityRef, setCityRef] = useState(null);
  const [branchRef, setBranchRef] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [showDropdown, setShowDropdown] = useState({
    showCityDropdown: false,
    showBranchDropdown: false,
    showStreetDropdown: false,
  });
  /////////////////////////////////////

  const isActive = !!(
    (city !== "" && branch) ||
    (city !== "" && addressForCourier.street && addressForCourier.houseNumber)
  );

  const handleClose = () => {
    navigation.navigate("MainContent", {
      screen: "BasketScreen",
    });
  };

  const handleContinue = () => {
    navigation.navigate("MainContent", {
      screen: "PlacingOrderSecondScreen",
      params: { totalAmount, address, cityRef, branchRef },
    });
  };

  const fetchCities = async (query: string) => {
    if (query.length > 1) {
      const cities = await getCities(query);
      setCityList(cities);
      setShowDropdown((prev) => ({
        ...prev,
        showCityDropdown: true,
      }));
    } else {
      setCityList([]);
    }
  };

  const fetchWarehouses = async () => {
    setLoader(true);

    if (cityRef) {
      try {
        const warehouses = await getWarehouses(cityRef);
        setBranchList(warehouses);
        setShowDropdown((prev) => ({
          ...prev,
          showBranchDropdown: true,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };
  const handleOpenDropdown = async () => {
    setLoader(true);
    setShowDropdown((prev) => ({
      ...prev,
      showBranchDropdown: true,
    }));
    await fetchWarehouses();
  };

  const fetchStreets = async (search: string) => {
    if (search.length >= 1) {
      console.log(search);
      setLoader(true);

      try {
        const streets = await getStreets(cityRef, search);
        setStreetList(streets);

        setShowDropdown((prev) => ({
          ...prev,
          showStreetDropdown: true,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    } else {
      setStreetList([]);
    }
  };

  const cityInput = () => {
    return (
      <View className="relative">
        <TextInput
          placeholder="Оберіть місто"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            fetchCities(text);
          }}
          className={`${
            isDarkMode
              ? "bg-secondary border border-darkCardBorder text-white"
              : "bg-lightLightGray text-black"
          } p-5 pr-12 flex-row items-center ${
            showDropdown.showCityDropdown && cityList.length > 0
              ? "rounded-t-[30px]"
              : "rounded-full"
          }`}
          placeholderTextColor="gray"
        />
        <TouchableOpacity
          onPress={() =>
            setShowDropdown((prev) => ({
              ...prev,
              showCityDropdown: !showDropdown.showCityDropdown,
            }))
          }
          className="absolute right-5 top-7"
          style={{
            transform: [
              {
                rotate: showDropdown.showCityDropdown ? "180deg" : "0deg",
              },
            ],
          }}
        >
          <DownIcon />
        </TouchableOpacity>
        {showDropdown.showCityDropdown && cityList.length > 0 && (
          <View
            className={`absolute top-12 left-0 right-0 ${
              isDarkMode ? "bg-darkCard" : "bg-lightLightGray"
            } shadow-md  z-10 max-h-60 rounded-b-[30px]`}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {cityList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    console.log(item);
                    setCityRef(item.Ref);
                    setCity(item.Description);
                    setShowDropdown((prev) => ({
                      ...prev,
                      showCityDropdown: false,
                    }));
                    Keyboard.dismiss();
                  }}
                  className="px-5"
                >
                  <Text
                    allowFontScaling={false}
                    className="text-base py-5 border-b border-white"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    {item.Description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-155}
            style={{ flex: 1 }}
          >
            <Header navigation={navigation} handleClose={handleClose} />
            <View className="px-3 py-5">
              <Progress status={"1/4"} />

              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 340 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View>
                  <Text
                    allowFontScaling={false}
                    className="font-bold text-xl mb-5"
                    style={{ color: isDarkMode ? "white" : "black" }}
                  >
                    Обрати спосіб доставки
                  </Text>

                  <View className="gap-3">
                    {deliveryOptions.map((option) => (
                      <View key={option.id}>
                        <TouchableOpacity
                          onPress={() => setSelectedId(option.id)}
                          className="py-3 border-b border-lightGrey flex-row justify-between items-center"
                        >
                          <View className="flex-row gap-3 items-center">
                            <Image source={option.icon} />
                            <View className="max-w-[236px]">
                              <Text
                                allowFontScaling={false}
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                {option.name}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  color: isDarkMode ? "white" : "black",
                                }}
                              >
                                {option.description}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => setSelectedId(option.id)}
                            className="w-6 h-6 rounded-full"
                            style={{
                              backgroundColor:
                                selectedId === option.id
                                  ? "#25C3B4"
                                  : "#AAE2DD",
                              borderColor: "#CBEAE7",
                              borderWidth: 3,
                            }}
                          />
                        </TouchableOpacity>

                        {/* Форма для самовивозу */}
                        {selectedId === option.id &&
                          option.description.includes("Самовивіз") && (
                            <View className="mt-3 ">
                              {cityInput()}
                              <View className="relative mt-2">
                                <TextInput
                                  multiline
                                  placeholder="Оберіть відділення або поштомат"
                                  value={branch}
                                  onChangeText={async (text) => {
                                    setBranch(text);
                                    await fetchWarehouses();
                                  }}
                                  className={`${
                                    isDarkMode
                                      ? "bg-secondary border border-darkCardBorder text-white"
                                      : "bg-lightLightGray text-black"
                                  } p-5 pr-12 flex-row items-center ${
                                    showDropdown.showBranchDropdown &&
                                    branchList.length > 0
                                      ? "rounded-t-[30px]"
                                      : "rounded-full"
                                  }`}
                                  placeholderTextColor="gray"
                                />
                                <TouchableOpacity
                                  onPress={handleOpenDropdown}
                                  className="absolute right-5 top-7"
                                  style={{
                                    transform: [
                                      {
                                        rotate: showDropdown.showBranchDropdown
                                          ? "180deg"
                                          : "0deg",
                                      },
                                    ],
                                  }}
                                >
                                  <DownIcon />
                                </TouchableOpacity>
                                {showDropdown.showBranchDropdown &&
                                  branchList.length > 0 && (
                                    <View
                                      className={`absolute top-12 left-0 right-0 ${
                                        isDarkMode
                                          ? "bg-darkCard"
                                          : "bg-lightLightGray"
                                      } shadow-md  z-10 max-h-60 rounded-b-[30px]`}
                                    >
                                      {loader ? (
                                        <Text
                                          allowFontScaling={false}
                                          className="ml-5 mt-2 mb-4"
                                        >
                                          Loading...
                                        </Text>
                                      ) : (
                                        <ScrollView
                                          contentContainerStyle={{
                                            flexGrow: 1,
                                          }}
                                          showsVerticalScrollIndicator={false}
                                          keyboardShouldPersistTaps="handled"
                                          nestedScrollEnabled={true}
                                        >
                                          {branchList
                                            .filter((b) =>
                                              b.Description.toLowerCase().includes(
                                                branch.toLowerCase()
                                              )
                                            )
                                            .map((item, index) => (
                                              <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                  setBranch(item.Description);
                                                  setBranchRef(item.Ref);
                                                  setShowDropdown((prev) => ({
                                                    ...prev,
                                                    showBranchDropdown: false,
                                                  }));
                                                  Keyboard.dismiss();
                                                }}
                                                className="px-5"
                                              >
                                                <Text
                                                  allowFontScaling={false}
                                                  className="text-base py-5 border-b border-white"
                                                  style={{
                                                    color: isDarkMode
                                                      ? "white"
                                                      : "black",
                                                  }}
                                                >
                                                  {item.Description}
                                                </Text>
                                              </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                      )}
                                    </View>
                                  )}
                              </View>
                            </View>
                          )}

                        {selectedId === option.id &&
                          option.description.includes(
                            "Кур'єрська доставка"
                          ) && (
                            <View className="mt-3">
                              {cityInput()}

                              <View className="relative mt-2">
                                <TextInput
                                  placeholder="Введіть назву вулиці"
                                  value={addressForCourier.street}
                                  onChangeText={(text) => {
                                    fetchStreets(text);
                                    setAddressForCourier((prev) => ({
                                      ...prev,
                                      street: text,
                                    }));
                                  }}
                                  className={`${
                                    isDarkMode
                                      ? "bg-secondary border border-darkCardBorder text-white"
                                      : "bg-lightLightGray text-black"
                                  } p-5 pr-12  mb-2 flex-row items-center ${
                                    showDropdown.showStreetDropdown &&
                                    streetList.length > 0
                                      ? "rounded-t-[30px]"
                                      : "rounded-full"
                                  }`}
                                  placeholderTextColor="gray"
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    setShowDropdown((prev) => ({
                                      ...prev,
                                      showStreetDropdown:
                                        !showDropdown.showStreetDropdown,
                                    }))
                                  }
                                  className="absolute right-5 top-6"
                                  style={{
                                    transform: [
                                      {
                                        rotate: showDropdown.showStreetDropdown
                                          ? "180deg"
                                          : "0deg",
                                      },
                                    ],
                                  }}
                                >
                                  <DownIcon />
                                </TouchableOpacity>
                                {showDropdown.showStreetDropdown && (
                                  <View
                                    className={`absolute top-12 left-0 right-0 ${
                                      isDarkMode
                                        ? "bg-secondary"
                                        : "bg-lightLightGray"
                                    } shadow-md  z-10 max-h-60 rounded-b-[30px]`}
                                  >
                                    {loader ? (
                                      <Text allowFontScaling={false}>
                                        Loading...
                                      </Text>
                                    ) : (
                                      <ScrollView
                                        contentContainerStyle={{
                                          flexGrow: 1,
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled={true}
                                      >
                                        {streetList.length > 0 ? (
                                          streetList.map((item, index) => (
                                            <TouchableOpacity
                                              key={index}
                                              onPress={() => {
                                                setAddressForCourier(
                                                  (prev) => ({
                                                    ...prev,
                                                    street: item.Description,
                                                  })
                                                );
                                                setShowDropdown((prev) => ({
                                                  ...prev,
                                                  showStreetDropdown: false,
                                                }));
                                                Keyboard.dismiss();
                                              }}
                                              className="px-5"
                                            >
                                              <Text
                                                allowFontScaling={false}
                                                className="text-base py-5 border-b border-white"
                                                style={{
                                                  color: isDarkMode
                                                    ? "white"
                                                    : "black",
                                                }}
                                              >
                                                {item.Description}
                                              </Text>
                                            </TouchableOpacity>
                                          ))
                                        ) : (
                                          <Text className="text-base py-5 px-3">
                                            Список порожній
                                          </Text>
                                        )}
                                      </ScrollView>
                                    )}
                                  </View>
                                )}
                              </View>

                              <View className="flex-row gap-2">
                                <View className="relative flex-1">
                                  <TextInput
                                    placeholder={
                                      addressForCourier.houseNumber ||
                                      "Номер будинку"
                                    }
                                    onChangeText={(text) =>
                                      setAddressForCourier((prev) => ({
                                        ...prev,
                                        houseNumber: text,
                                      }))
                                    }
                                    className={`${
                                      isDarkMode
                                        ? "bg-secondary border border-darkCardBorder text-white"
                                        : "bg-lightLightGray text-black"
                                    } p-5 rounded-full mb-2 flex-row items-center`}
                                    placeholderTextColor="gray"
                                  />
                                </View>
                                <View className="relative flex-1">
                                  <TextInput
                                    placeholder={
                                      addressForCourier.apartment ||
                                      "Квартира / Офіс"
                                    }
                                    onChangeText={(text) =>
                                      setAddressForCourier((prev) => ({
                                        ...prev,
                                        apartment: text,
                                      }))
                                    }
                                    className={`${
                                      isDarkMode
                                        ? "bg-secondary border border-darkCardBorder text-white"
                                        : "bg-lightLightGray text-black"
                                    } p-5 rounded-full mb-2 flex-row items-center`}
                                    placeholderTextColor="gray"
                                  />
                                </View>
                              </View>
                            </View>
                          )}
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>

            <Footer
              navigation={navigation}
              handleContinue={handleContinue}
              totalAmount={totalAmount}
              isActive={isActive}
              first={true}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
