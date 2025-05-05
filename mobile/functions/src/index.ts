import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/scheduler";
import { getOrderStatus } from "./utils/novaPay";

admin.initializeApp();

interface NotificationData {
  userId?: string;
  title: string;
  body: string;
  screen?: string;
}

export const sendNotification = functions.https.onCall(async (request: functions.https.CallableRequest<NotificationData>) => {

  const { userId, title, body, screen } = request.data;

  if (!title || !body) {
    throw new functions.https.HttpsError("invalid-argument", "Відсутні необхідні параметри");
  }

  try {
    let fcmTokens: string[] = [];

    if (userId) {
      // ✅ Якщо передано userId, шукаємо лише цього користувача
      const userDoc = await admin.firestore().collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.fcmToken) {
          fcmTokens.push(userData.fcmToken);
        }
      }
    } else {
      // ✅ Якщо userId немає, надсилаємо всім користувачам
      const usersSnapshot = await admin.firestore().collection("users").get();
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.fcmToken) {
          fcmTokens.push(userData.fcmToken);
        }
      });
    }

    if (fcmTokens.length === 0) {
      console.warn("❗ Немає активних FCM-токенів для надсилання.");
      return { success: false, message: "Немає доступних FCM-токенів." };
    }

    // ✅ Надсилаємо сповіщення
    const messages = fcmTokens.map((token) => ({
      token,
      notification: { title, body },
      data: { screen: screen || "NotificationScreen" },
    }));

    const responses = await Promise.all(messages.map((msg) => admin.messaging().send(msg)));

    console.log(`✅ Сповіщення надіслано ${responses.length} користувачам`);

    return {
      success: true,
      sentCount: responses.length,
    };
  } catch (error) {
    console.error("❌ Помилка при надсиланні сповіщення:", error);
    throw new functions.https.HttpsError("internal", "Не вдалося надіслати сповіщення");
  }
});


export const resetWaterBalance = onSchedule(
  {
    schedule: "0 0 * * *", 
    timeZone: "Europe/Kyiv", 
  },
  async (event) => {
    try {
      // Get all users
      const usersSnapshot = await admin.firestore().collection("users").get();

      // Prepare a batch to update water balance for all users
      const batch = admin.firestore().batch();

      // Loop through each user and reset their water balance
      usersSnapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, { "waterBalance.drunk": 0,"historyIntakeWater":[]});
      });

      await batch.commit(); // Commit all updates in a single batch
      console.log("✅ Всі користувачі оновлені, рівень води обнулено");

    } catch (error) {
      console.error("❌ Помилка при обнуленні рівня води:", error);
    }
  }
);

export const sendScheduledNotifications = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Europe/Kyiv",
  },
  async () => {
    const now = admin.firestore.Timestamp.now();
    // const fiveMinutesBefore = new Date(now.toDate().getTime() - 5 * 60 * 1000);
    // const fiveMinutesAfter = new Date(now.toDate().getTime() + 5 * 60 * 1000);

    try {
      const snapshot = await admin
        .firestore()
        .collection("scheduled_notifications")
        //  .where("scheduledTime", ">=", fiveMinutesBefore) 
        // .where("scheduledTime", "<=", fiveMinutesAfter) 
        .where("scheduledTime", "<=", now) 
        .where("status", "==", "pending") 
        .get();

      if (snapshot.empty) {
        console.log("⏳ Немає запланованих сповіщень для відправки.");
        return;
      }

      const batch = admin.firestore().batch();
      const sendPromises: Promise<any>[] = [];

      const usersSnapshot = await admin.firestore().collection("users").get();
      const userTokensMap: { [key: string]: string } = {}; 

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.fcmToken) {
          userTokensMap[userDoc.id] = userData.fcmToken;
        }
      });

      snapshot.forEach((doc) => {
        const notification = doc.data();
        let tokens: string[] = [];

        if (notification.userId) {
          if (userTokensMap[notification.userId]) {
            tokens = [userTokensMap[notification.userId]];
          }
        } else {
          tokens = Object.values(userTokensMap);
        }

        if (tokens.length === 0) {
          console.warn(`❗ Немає токенів для сповіщення: ${notification.title}`);
          return;
        }

        if (notification.type === "push") {
          tokens.forEach((token) => {
            const message: admin.messaging.Message = {
              token,
              notification: {
                title: notification.title,
                body: notification.body,
              },
              android: {
    notification: {
      icon: "./img/icon.png"
    }
  },
              data: { screen: notification.screen || "NotificationScreen" },
            };

            sendPromises.push(
              admin.messaging().send(message).catch((error) => {
                  console.error(`❌ Помилка при відправці нагадування для токена ${token}:`, error);
              })
            );
          });
        }

          batch.update(doc.ref, { status: "sent" });
      });

      // Чекаємо на завершення всіх відправок повідомлень
      const responses = await Promise.all(sendPromises);
      console.log(`✅ Відправлено ${responses.length} сповіщень`);

      // Після того, як всі повідомлення відправлені, комітимо зміни статусу
      await batch.commit();
      console.log("✅ Статуси оновлено");

    } catch (error) {
      console.error("❌ Помилка при відправці запланованих сповіщень:", error);
    }
  }
);


export const sendDailyReminders = onSchedule(
  {
    schedule: "0 9 * * *", 
    timeZone: "Europe/Kyiv",
  },
  async () => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const sendPromises: Promise<any>[] = [];

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) return; 

        if (!userData.takingVitamins || userData.takingVitamins.length === 0) {
          const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
              title: "💊 Регулярність = результат!",
              body: "Відзначай прийоми вітамінів у трекері, щоб не пропустити жодного – твій ресурс цього вартий!",
            },
            data: { screen: "ResourceScreen" },
          };
          sendPromises.push(admin.messaging().send(message));
        }
      });

      await Promise.all(sendPromises);
      console.log(`✅ Сповіщення про вітаміни надіслано!`);

    } catch (error) {
      console.error("❌ Помилка при надсиланні сповіщень про вітаміни:", error);
    }
  }
);

export const sendReminderNotifications = onSchedule(
  {
    schedule: "0 10 * * *", // Виконується щодня о 10:00
    timeZone: "Europe/Kyiv",
  },
  async () => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const sendPromises: Promise<any>[] = [];

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) return; // Пропускаємо користувачів без FCM-токена

        if (!userData.reminder || userData.reminder.length === 0) {
          const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
              title: "🚰 Вода – твоя суперсила!",
              body: "Трекер допоможе слідкувати за водним балансом – активуй його і відчуй різницю!",
            },
            data: { screen: "ResourceScreen" },
          };
          sendPromises.push(admin.messaging().send(message));
        }
      });

      await Promise.all(sendPromises);
      console.log(`✅ Сповіщення про нагадування надіслано!`);

    } catch (error) {
      console.error("❌ Помилка при надсиланні сповіщень про нагадування:", error);
    }
  }
);

export const sendDailyReminder = onSchedule(
  {
    schedule: "every 10 minutes",
    timeZone: "Europe/Kyiv",
  },
  async () => {
    try {
      const now = admin.firestore.Timestamp.now();
      const usersSnapshot = await admin.firestore().collection("users").get();
      const sendPromises: Promise<any>[] = [];

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken || !userData.reminder || userData.reminder.length === 0) return;

        // Отримуємо нагадування користувача (з припущенням, що там масив)
        userData.reminder.forEach((reminder: any) => {
          const scheduledTime = reminder.time; // Час у форматі "HH:mm"

          // Отримуємо сьогоднішню дату і додаємо час нагадування
          const scheduledDateTime = new Date();

           const [time, period] = scheduledTime.split(" "); // розділяємо час і AM/PM
    const [hours, minutes] = time.split(":").map(Number); // розділяємо години та хвилини

    let hours24 = hours; // Перемінна для 24-годинного формату

    // Конвертуємо в 24-годинний формат
    if (period === "PM" && hours !== 12) {
      hours24 += 12; // Додаємо 12 годин, якщо PM і не 12
    } else if (period === "AM" && hours === 12) {
      hours24 = 0; // Якщо 12 AM, то це 00:00
    }

    scheduledDateTime.setHours(hours24, minutes, 0, 0);

          // Якщо зараз ±5 хв від потрібного часу, надсилаємо сповіщення
          const fiveMinutesBefore = new Date(scheduledDateTime.getTime() - 5 * 60 * 1000);
          const fiveMinutesAfter = new Date(scheduledDateTime.getTime() + 5 * 60 * 1000);

          if (now.toDate() >= fiveMinutesBefore && now.toDate() <= fiveMinutesAfter) {
            const message: admin.messaging.Message = {
              token: fcmToken,
              notification: {
                title: "⏰ Нагадування!",
                body: "Час виконати заплановану справу!",
              },
              data: { screen: "ReminderScreen" },
            };

            sendPromises.push(admin.messaging().send(message));
          }
        });
      });

      await Promise.all(sendPromises);
      console.log(`✅ Надіслано ${sendPromises.length} нагадувань`);

    } catch (error) {
      console.error("❌ Помилка при надсиланні нагадувань:", error);
    }
  }
);
export const resetWayWallet = onSchedule(
  {
    schedule: "0 0 1 */3 *",
    timeZone: "Europe/Kyiv", 
  },
  async () => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get();

      const batch = admin.firestore().batch();

      usersSnapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, { wayWallet: 0,medals:0, achievementList: [] });
      });

      await batch.commit(); 
      console.log("✅ Всі користувачі оновлені, wayWallet і achievementList очищено");
    } catch (error) {
      console.error("❌ Помилка при очищенні wayWallet та achievementList:", error);
    }
  }
);

export const trackOrdersStatuses = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "Europe/Kyiv",
  },
  async () => {
try {
    const ordersSnapshot = await admin.firestore().collection("orders").get();

    const updatePromises: Promise<any>[] = [];

    ordersSnapshot.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      const orderRef = orderDoc.ref;

      const ttn = orderData.ttn;

      if (!ttn) return;

      updatePromises.push(
        (async () => {
          const currentStatus = await getOrderStatus(ttn);

          if (!currentStatus) return;

          // Статус доставки можна змінити тут, в залежності від мови API
          const isDelivered =
            currentStatus.toLowerCase().includes("доставлено") ||
            currentStatus.toLowerCase().includes("delivered");

          if (isDelivered && orderData.status !== "delivered") {
            await orderRef.update({ status: "доставлено" });
            console.log(`✅ Оновлено замовлення ${ttn} як "delivered"`);
          }
        })()
      );
    });

    await Promise.all(updatePromises);
    console.log("🔄 Перевірка всіх замовлень завершена");
  } catch (error) {
    console.error("❌ Помилка при оновленні статусів замовлень:", error);
  }  }
);

interface CheckPhoneNumberExistsParams {
  phoneNumber: string; 
}

interface CheckPhoneNumberExistsResult {
  exists: boolean; 
  userRecord?: admin.auth.UserRecord; 
  error?: string;
}

export const checkPhoneNumberExists = functions.https.onCall(
  async (request: functions.https.CallableRequest<CheckPhoneNumberExistsParams>, context): Promise<CheckPhoneNumberExistsResult> => {
    const { phoneNumber } = request.data;

    if (!phoneNumber) {
      throw new functions.https.HttpsError('invalid-argument', 'Не передано номер телефону');
    }

    try {
      const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
      return { exists: true, userRecord };
    } catch (error: any) {
      return { exists: false, error: error.message };
    }
  }
);