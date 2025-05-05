import messaging from "@react-native-firebase/messaging";
import { updateDoc, doc, query, collection, orderBy, getDocs, where, Timestamp, addDoc, limit } from "firebase/firestore";
import { db, functions } from "@utils/firebase";
import { Alert } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { httpsCallable } from "firebase/functions";

export const requestUserPermission = async (uid: string) => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("✅ Дозвіл на сповіщення отримано");
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }
    await getFCMToken(uid);
  }
};


const getFCMToken = async (uid: string) => {
      if (!uid) return; 

  try {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();
    console.log("🔥 Отримано FCM-токен:", token);

      if (token) {
        console.log("uid",uid);
        
      await updateDoc(doc(db, "users", uid), { fcmToken: token });
    }
  } catch (error) {
    console.error("❌ Помилка отримання FCM-токену", error);
  }
};
export const getToken = async () => {

  try {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();
    console.log("🔥 Отримано FCM-токен:", token);

    return token;
  } catch (error) {
    console.error("❌ Помилка отримання FCM-токену", error);
  }
};


export const listenToForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
  });
};


export const listenToBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Повідомлення отримано у фоні!', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Користувач натиснув на повідомлення у фоні', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Користувач відкрив додаток через пуш-сповіщення', remoteMessage);
      }
    });
};

const sendNotification = httpsCallable(functions,'sendNotification');

export const sendNotificationToUsers = async (userId: string | null, title: string, body: string, screen: string) => {
  try {
    const response = await sendNotification({
      userId,   
      title,    
      body,    
      screen,    
    });

    if (response.data.success) {
      console.log(`✅ Сповіщення надіслано: ${response.data.sentCount} користувачам`);
    } else {
      console.error('❌ Помилка при надсиланні сповіщення:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Помилка виклику функції:', error);
  }
};



export const getNotifications = async () => {
  try {
    // ✅ Отримуємо всі сповіщення, відсортовані за датою створення (найновіші першими)
const q = query(
      collection(db, "scheduled_notifications"),
      where("status", "==", "sent"), // Фільтруємо за статусом "send"
      orderBy("createdAt", "desc")  // Сортуємо по полю "createdAt" у порядку спадання
    );    const querySnapshot = await getDocs(q);

    // ✅ Перетворюємо дані у масив
    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📩 Отримано сповіщення:", notifications);
    return notifications;
  } catch (error) {
    console.error("❌ Помилка отримання сповіщень:", error);
    return [];
  }
};


export type NotificationType = "system" | "push" | "popup";
export interface NotificationData {
  userId: string;
  id?: string; 
  title: string;
  description: string;
  category: string;
  date: string; 
  time: string; 
  type: NotificationType; 
  screen?: string;
  createdAt?: Timestamp;
  calendar?: boolean;
}

export const addNotification = async (notification: NotificationData): Promise<void> => {
  const {userId, title, description, category, date, time, type, screen, calendar } = notification;

  if (!title || !description || !category || !date || !time || !type) {
    alert("Будь ласка, заповніть всі обов’язкові поля!");
    return;
  }

  try {
 
    // 🔹 Створюємо `Date` об'єкт
    const scheduledDateTime = new Date(`${date}T${time}:00`);

    if (isNaN(scheduledDateTime.getTime())) {
      throw new Error("❌ Неправильний формат дати або часу");
    }

    const scheduledTimestamp = Timestamp.fromDate(scheduledDateTime);

    const notificationRef = await addDoc(collection(db, "scheduled_notifications"), {
      userId,
      title,
      body: description,
      screen,
      scheduledTime: scheduledTimestamp, 
      status: "pending",
      calendar: calendar ? calendar : false,
      type: type,
      createdAt: Timestamp.now(),
    });
    await updateDoc(doc(db, "scheduled_notifications", notificationRef.id), {
      id: notificationRef.id,
    });

    console.log("✅ Сповіщення заплановано!", notificationRef.id);
  } catch (error) {
    console.error("❌ Помилка при додаванні сповіщення:", error);
  }
};
export const getPopUpNotifications = async () => {
  try {
const q = query(
  collection(db, "scheduled_notifications"),
  where("type", "==", "popup"),
  where("scheduledTime", "<=", Timestamp.now()), 
  orderBy("createdAt", "desc"),
  limit(1) 
);
    const querySnapshot = await getDocs(q);

    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📩 Отримано сповіщення:", notifications);
    return notifications;
  } catch (error) {
    console.error("❌ Помилка отримання сповіщень:", error);
    return [];
  }
};