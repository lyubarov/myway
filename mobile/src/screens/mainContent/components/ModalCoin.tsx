import CloseIcon from "@assets/svg/CloseIcon";
import { TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export const ModalCoin = ({ isVisible, onClose, children }: any) => {
  return (
    <Modal
      testID={"modal"}
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      scrollOffsetMax={400 - 300}
      propagateSwipe={true}
      className="relative"
    >
      <View
        className={` bg-white py-5 px-[11px] rounded-[32px] shadow-lg h-auto w-[292px] ml-auto mr-auto`}
      >
        <TouchableOpacity
          onPress={onClose}
          className="absolute -top-3 -right-3 p-[9px] border border-white bg-black rounded-full"
        >
          <CloseIcon color={"white"} />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};
