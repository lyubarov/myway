import { RootStackParamList } from "@appTypes/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
import { getBannersFromBlock } from "src/firebase/db";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

const PropositionList = ({ blockId }) => {
  const { isDarkMode } = useAuth();
  const [banners, setBanners] = useState([]);
  const navigation = useNavigation<AuthNavigationProp>();

  const handleDetail = (item: object) => {
    navigation.navigate("MainContent", {
      screen: "BannerInfoScreen",
      params: { banner: item },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannersFromBlock = await getBannersFromBlock(blockId);
        console.log(bannersFromBlock);

        setBanners(bannersFromBlock || []);
      } catch (error) {
        console.error("Помилка під час завантаження продуктів:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      {banners.length > 0 && (
        <View>
          <FlatList
            data={banners}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleDetail(item)}
                className="max-w-[320px] mr-[12px] items-center"
              >
                <Image
                  source={{ uri: item.images }}
                  className="rounded-[36px] border-8 border-white w-[320px] h-[180px]"
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
export default PropositionList;
