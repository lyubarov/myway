import * as Notifications from "expo-notifications";

export const sendLocalNotification = async (title: string, body: string) => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    console.log("❌ Дозвіл на сповіщення не надано");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });

  console.log("✅ Локальне сповіщення відправлено");
};
