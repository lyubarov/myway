import { View } from "react-native";
import { useAuth } from "src/firebase/context/authContext";
export default function Progress({ status }: { status: string }) {
  const progressValue = eval(status);
  const { isDarkMode } = useAuth();

  return (
    <View
      className={`mb-9 w-full h-4 rounded-full border-2 ${
        isDarkMode ? "border-darkTheme" : "border-lightGreen"
      }`}
      style={{
        backgroundColor: "rgba(37, 195, 180, 0.2)",
      }}
    >
      <View
        style={{ width: `${progressValue * 100}%` }}
        className={` h-full bg-green rounded-full`}
      />
    </View>
  );
}
