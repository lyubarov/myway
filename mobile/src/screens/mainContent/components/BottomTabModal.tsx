import { useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";
import { useUsersProduct } from "@utils/infoContext";
import { useAuth } from "src/firebase/context/authContext";

export const BottomTabModal = ({
  isVisible,
  onClose,
  handleBasket,
  children,
}: any) => {
  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { totalAmount, cartProducts } = useUsersProduct();
  const screenWidth = Dimensions.get("window").width;
  const { isDarkMode } = useAuth();

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  return (
    <Modal
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      testID={"modal"}
      isVisible={cartProducts.length > 0 && isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={400 - 300}
      propagateSwipe={true}
      className="flex-1 justify-end m-0 relative"
    >
      <View
        className={`h-[60%] ${
          isDarkMode ? "bg-darkTheme" : "bg-lightBack"
        } pt-4 px-3 rounded-l-[32px] rounded-r-[32px] shadow-lg`}
      >
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {cartProducts.length > 0 && (
          <View
            className={`absolute bottom-0 left-0 right-0 h-[155px] ${
              isDarkMode ? "bg-black" : "bg-white"
            } pt-5 px-3`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                allowFontScaling={false}
                className="text-lg font-bold"
                style={{
                  color: isDarkMode ? "white" : "black",
                }}
              >
                До сплати:
              </Text>
              <Text
                allowFontScaling={false}
                className="text-2xl font-bold"
                style={{
                  color: isDarkMode ? "white" : "black",
                }}
              >
                {parseFloat(totalAmount.toFixed(1))}₴
              </Text>
            </View>
            <View className="flex-row gap-2 items-center">
              <TouchableOpacity
                onPress={onClose}
                className={`${
                  isDarkMode ? "bg-white" : "bg-black"
                } rounded-full py-5`}
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <Text
                  allowFontScaling={false}
                  className="text-white font-bold text-sm text-center"
                  style={{
                    color: isDarkMode ? "black" : "white",
                  }}
                >
                  Продовжити покупки
                </Text>
              </TouchableOpacity>
              <LinearGradient
                colors={["#25C3B4", "#00A696"]}
                className=" bg-green rounded-full py-5"
                style={{ width: screenWidth * 0.5 - 16 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleBasket();
                    onClose();
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    className=" font-bold text-sm text-center"
                    style={{
                      color: isDarkMode ? "black" : "white",
                    }}
                  >
                    Перейти до кошика
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};
