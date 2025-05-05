import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { useAuth } from "src/firebase/context/authContext";

export const ModalSortOptions = ({
  isVisible,
  onClose,
  children,
  height,
}: any) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const { isDarkMode } = useAuth();

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
      isVisible={isVisible}
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
        style={{ height: `${height}%` }}
        className={`pt-[23px] pb-5 px-3 rounded-t-[32px] shadow-lg ${
          isDarkMode ? "bg-darkCard" : "bg-lightBack"
        }`}
      >
        {children}
      </View>
    </Modal>
  );
};
