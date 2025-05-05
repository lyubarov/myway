import React, { useState, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useAuth } from "src/firebase/context/authContext";

const { width, height } = Dimensions.get("window");

export default function ProductSlider({
  productImages,
}: {
  productImages: string[];
}) {
  const { isDarkMode } = useAuth();
  if (!productImages || productImages.length === 0) return null;

  const scrollViewRef = useRef<ScrollView | null>(null);
  const fullScreenScrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const goToNextSlide = () => {
    if (activeIndex < productImages.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * (width - 24),
        animated: true,
      });
    }
  };

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex - 1) * (width - 24),
        animated: true,
      });
    }
  };

  const openFullScreen = (index: number) => {
    setActiveIndex(index);
    setIsFullScreen(true);
    setTimeout(() => {
      fullScreenScrollRef.current?.scrollTo({
        x: index * width,
        animated: false,
      });
    }, 100);
  };
  const goToNextSlideFullScreen = () => {
    if (activeIndex < productImages.length - 1) {
      setActiveIndex(activeIndex + 1);
      fullScreenScrollRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
    }
  };

  const goToPrevSlideFullScreen = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      fullScreenScrollRef.current?.scrollTo({
        x: (activeIndex - 1) * width,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {productImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openFullScreen(index)}
            style={[
              styles.imageWrapper,
              activeIndex === index ? styles.active : styles.inactive,
            ]}
          >
            <Image
              source={{ uri: image }}
              alt="img"
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.arrowLeft}
        onPress={goToPrevSlide}
        className={`${
          isDarkMode
            ? "bg-secondary border border-darkCardBorder"
            : "bg-lightBack"
        }`}
      >
        <ChevronLeft size={24} color={isDarkMode ? "#fff" : "#555"} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.arrowRight}
        onPress={goToNextSlide}
        className={`${
          isDarkMode
            ? "bg-secondary border border-darkCardBorder"
            : "bg-lightBack"
        }`}
      >
        <ChevronRight size={24} color={isDarkMode ? "#fff" : "#555"} />
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        {productImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>

      {/* Модальне вікно для повноекранного перегляду */}
      <Modal visible={isFullScreen} transparent={true} animationType="fade">
        <View
          className={`flex-1 ${
            isDarkMode ? "bg-darkTheme" : "bg-lightBack"
          } justify-center items-center relatives`}
        >
          <TouchableOpacity
            className={`absolute top-4 right-4 p-2 z-50`}
            onPress={() => {
              setIsFullScreen(false);
            }}
          >
            <X size={32} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>

          <ScrollView
            ref={fullScreenScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            {productImages.map((image, index) => (
              <View key={index} style={styles.fullScreenWrapper}>
                <Image
                  source={{ uri: image }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.arrowLeft}
            onPress={goToPrevSlideFullScreen}
            className={`${
              isDarkMode
                ? "bg-secondary border border-darkCardBorder"
                : "bg-lightBack"
            }`}
          >
            <ChevronLeft size={24} color={isDarkMode ? "#fff" : "#555"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.arrowRight}
            onPress={goToNextSlideFullScreen}
            className={`${
              isDarkMode
                ? "bg-secondary border border-darkCardBorder"
                : "bg-lightBack"
            }`}
          >
            <ChevronRight size={24} color={isDarkMode ? "#fff" : "#555"} />
          </TouchableOpacity>
          <View style={styles.indicatorContainerFullScreen}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeIndex === index
                    ? styles.activeIndicator
                    : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  imageWrapper: {
    width: width - 24,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.5,
  },
  image: {
    width: 200,
    height: 300,
  },
  arrowLeft: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  arrowRight: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  indicatorContainerFullScreen: {
    position: "absolute",
    flexDirection: "row",

    bottom: 200,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: "100%",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#28a745",
  },
  inactiveIndicator: {
    backgroundColor: "rgba(37, 195, 180, 0.2)",
  },

  fullScreenWrapper: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width * 0.7,
    height: height * 0.6,
  },
});
