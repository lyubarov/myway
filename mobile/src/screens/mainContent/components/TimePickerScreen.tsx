import React, { useState } from "react";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";

export default function TimePickerScreen({
  visible,
  onClose,
  selectedTime,
  onSelectTime,
}: {
  visible: boolean;
  onClose: () => void;
  selectedTime: string;
  onSelectTime: (newTime: string) => void;
}) {
  const [selectedHour, setSelectedHour] = useState(
    selectedTime ? selectedTime.split(":")[0] : "10"
  );
  const [selectedMinute, setSelectedMinute] = useState(
    selectedTime?.split(":")[1] || "00"
  );

  // Створюємо список годин для 24-годинної системи
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleConfirm = () => {
    // Формуємо новий час у форматі 24-годинної системи
    const newTime = `${selectedHour}:${selectedMinute}`;
    onSelectTime(newTime);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback
        onPress={() => {
          handleConfirm();
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white p-6 rounded-2xl shadow-lg">
              <View className="flex-row justify-center space-x-4">
                <WheelPickerExpo
                  items={hours.map((h) => ({ label: h, value: h }))}
                  selectedValue={selectedHour}
                  initialSelectedIndex={hours.indexOf(selectedHour)}
                  onChange={(item) => setSelectedHour(item.item.value)}
                  height={200}
                  width={70}
                />

                <WheelPickerExpo
                  items={minutes.map((m) => ({ label: m, value: m }))}
                  initialSelectedIndex={minutes.indexOf(selectedMinute)}
                  selectedValue={selectedMinute}
                  onChange={(item) => setSelectedMinute(item.item.value)}
                  height={200}
                  width={70}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
