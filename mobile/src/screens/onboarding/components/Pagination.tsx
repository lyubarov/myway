import { View, Text } from "react-native";

interface PaginationProps {
  currentStep: number;
}

export const Pagination: React.FC<PaginationProps> = ({ currentStep }) => {
  return (
    <View className="flex-row justify-center gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full ${
            currentStep === index + 1 ? "bg-green" : "bg-green opacity-20"
          }`}
        />
      ))}
    </View>
  );
};
