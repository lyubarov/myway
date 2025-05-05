import CloseIcon from "@assets/svg/CloseIcon";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const CustomModal = ({ visible, onClose, title, img, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (visible) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View className="w-[292px] p-5 bg-white rounded-[36px] items-center justify-center relative">
          <View className="items-center">
            {img && img}
            <Text
              allowFontScaling={false}
              className="text-lg font-bold text-center mb-[10px] mt-[10px]"
            >
              {title}
            </Text>
            <Text
              allowFontScaling={false}
              className="font-normal text-base text-darkText text-center"
            >
              {message}
            </Text>
            <TouchableOpacity
              className="absolute top-[-30] right-[-10] p-2 rounded-full bg-black border border-wight"
              onPress={onClose}
            >
              <CloseIcon color={"white"} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default CustomModal;
