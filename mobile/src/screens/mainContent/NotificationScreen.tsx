import { useNavigation } from "@react-navigation/native";
import { AuthHeader } from "@screens/authorization/components/AuthHeader";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@appTypes/navigationTypes";
import { NextIcon } from "@assets/svg/NextIcon";
import {
  AchievementIcon,
  ReferralIcon,
  VitaminsIcon,
  WarningIcon,
  InfoIcon,
} from "@assets/svg/TypeFoodIcons";
import { useEffect, useState } from "react";
import {
  listenForNotifications,
  markNotificationAsRead,
} from "src/firebase/db";
import { useAuth } from "src/firebase/context/authContext";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { getNotifications } from "src/firebase/notification";

type AuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainContent"
>;

interface Notification {
  id: string;
  title: string;
  content: string;
  type: "achievement" | "info" | "motivation" | "warning" | "recommendation";
  isRead: boolean;
  createdAt: Timestamp;
}

interface GroupedNotifications {
  [key: string]: Notification[];
}

export default function NotificationScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { userFromDB, isDarkMode } = useAuth();
  const [notification, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  // const [allNotifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userFromDB) return;

    let unsubscribe: (() => void) | null = null;

    const fetchAndListenNotifications = async () => {
      try {
        setLoading(true);

        // 1️⃣ Отримуємо існуючі сповіщення
        const existingNotifications =
          (await getNotifications()) as Notification[];
        console.log("📥 Завантажені сповіщення:", existingNotifications);

        // 2️⃣ Фільтруємо сповіщення за датою реєстрації користувача
        const userRegistrationDate = userFromDB.createdAt;
        const filteredNotifications = existingNotifications.filter(
          (notification) =>
            notification.createdAt.toMillis() >= userRegistrationDate.toMillis()
        );

        // 3️⃣ Встановлюємо відфільтровані сповіщення в стан
        setNotifications(
          filteredNotifications.sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
          )
        );

        // 4️⃣ Запускаємо слухача для нових сповіщень
        unsubscribe = listenForNotifications(
          userFromDB.uid,
          (newNotifications: Notification[]) => {
            console.log("🔄 Нові сповіщення:", newNotifications);

            setNotifications((prev) => {
              const mergedNotifications = [...prev, ...newNotifications].reduce(
                (acc, notif) => {
                  acc.set(notif.id, notif);
                  return acc;
                },
                new Map<string, Notification>()
              );

              return Array.from(mergedNotifications.values())
                .filter(
                  (notification) =>
                    notification.createdAt.toMillis() >=
                    userRegistrationDate.toMillis()
                )
                .sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
                );
            });
          }
        );
      } catch (error) {
        console.error("❌ Помилка отримання сповіщень:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndListenNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userFromDB]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(userFromDB.uid, notificationId);
  };
  const handleClickOnDetails = (item: Notification) => {
    handleMarkAsRead(item.id);
    navigation.navigate("MainContent", {
      screen: "NotificationDetails",
      params: { notification: item },
    });
  };

  const notificationIcons = (type: string) => {
    switch (type) {
      case "achievement":
        return <AchievementIcon />;
      case "info":
        return <InfoIcon />;
      case "referral":
        return <ReferralIcon />;
      case "warning":
        return <WarningIcon />;
      case "recommendation":
        return <VitaminsIcon stroke="#25C3B4" />;
      default:
        return <InfoIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const notificationDate = moment(dateString, "DD MMMM YYYY").startOf("day");

    if (notificationDate.isSame(today, "day")) {
      return "Сьогодні";
    } else if (notificationDate.isSame(yesterday, "day")) {
      return "Вчора";
    } else {
      return moment(dateString, "DD MMMM YYYY").format("DD.MM.YYYY");
    }
  };
  const groupNotificationsByDate = (
    notifications: Notification[]
  ): GroupedNotifications => {
    return notifications.reduce((acc, item) => {
      const date =
        item.createdAt instanceof Timestamp
          ? moment(item.createdAt.toDate()).format("DD MMMM YYYY")
          : "Невідома дата";

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as GroupedNotifications);
  };
  const groupedNotifications = groupNotificationsByDate(notification);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-darkTheme" : "bg-lightBack"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}>
        <AuthHeader title="Сповіщення" />
        <View className="flex-1 px-3 pt-5 bg-custom-gradient">
          {loading ? (
            <ActivityIndicator />
          ) : notification.length > 0 ? (
            Object.entries(groupedNotifications).map(([date, items]) => (
              <View key={date} className="mb-5">
                <Text
                  allowFontScaling={false}
                  className="text-[14px] text-darkStroke mb-2"
                  style={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.6)"
                      : "darkStroke",
                  }}
                >
                  {formatDate(date)}
                </Text>

                {items.map((item: Notification, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="p-3 rounded-[24px] mb-[10px] pr-5 flex-row justify-between items-center"
                    style={{
                      backgroundColor: isDarkMode ? "#272727" : "white",
                      borderWidth: 1,
                      borderColor: isDarkMode ? "#434343" : "#deeceb",
                    }}
                    onPress={() => handleClickOnDetails(item)}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`p-[9px] rounded-full border-0.5 ${
                          isDarkMode
                            ? "bg-darkCard border-darkCardBorder"
                            : "bg-lightBack border-white"
                        } `}
                      >
                        {notificationIcons(item.type)}
                      </View>
                      <View className="ml-3">
                        <Text
                          allowFontScaling={false}
                          className="text-[14px] font-bold"
                          style={{
                            color: isDarkMode ? "white" : "black",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          className="text-darkStroke text-[14px]"
                        >
                          {item.createdAt instanceof Timestamp
                            ? item.createdAt
                                .toDate()
                                .toLocaleTimeString("uk-UA", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                            : "Час невідомий"}
                        </Text>
                      </View>
                    </View>
                    <NextIcon />
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text
                allowFontScaling={false}
                className="font-bold text-[28px] text-center mb-2"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Порожньо!
              </Text>
              <Text
                allowFontScaling={false}
                className="text-base text-center text-darkStroke pb-24"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Ви поки не маєте сповіщень.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
