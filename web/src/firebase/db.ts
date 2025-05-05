import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, deleteField, addDoc, Timestamp, QuerySnapshot, query, where, writeBatch  } from "firebase/firestore";
import { db } from "./config";
import { v4 as uuidv4 } from "uuid";
import { getAuth, updateProfile } from "firebase/auth";
import { isValid, parseISO } from "date-fns";


interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  subCategory: string;
  status: string;
  availability: string;
  blockId?: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink: string;
  images: string[];
}
interface UpdatedFields {
  title?: string;
  category?: string;
}
interface Banners {
  description: string;
  id: string;
   images: string;
  title: string;
}


export const addBannerToBlock = async (blockId: string | null, formData: object) => {
  if(blockId)
  try {
    const productRef = doc(collection(db, "блоки", blockId, "banners"));
    const uniqueId = productRef.id;

    const productData = {
      ...formData,
      id: uniqueId, 
    };

    await setDoc(productRef, productData);

    console.log("Продукт успішно створено в блоці з ID:", uniqueId);
  } catch (error) {
    console.error("Помилка під час створення продукту в блоці:", error);
  }
};
export const getBannersFromBlock = async (blockId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "блоки", blockId, "banners"));
    const data:Banners[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }as Banners);
    });
    return data;
  } catch (error) {
    console.error("Помилка під час отримання даних з блоку:", error);
  }
};
export const deleteBannerFromBlock = async (blockId: string, bannerId: string) => {
  try {
    const bannerRef = doc(db, "блоки", blockId, "banners", bannerId);
    
    // Видалення банера з колекції
    await deleteDoc(bannerRef);
    
    console.log(`Банер з ID ${bannerId} успішно видалено з блоку з ID ${blockId}`);
  } catch (error) {
    console.error("Помилка під час видалення банера:", error);
  }
};
export const addProductToCatalog = async (blockId: string | null, formData: object) => {
  if(blockId)
  try {
    const productRef = doc(collection(db, "блоки", blockId, "products"));
    const uniqueId = productRef.id;

    const productData = {
      ...formData,
      id: uniqueId, 
    };

    await setDoc(productRef, productData);

    console.log("Продукт успішно створено в блоці з ID:", uniqueId);
  } catch (error) {
    console.error("Помилка під час створення продукту в блоці:", error);
  }
};

export const getProductsFromBlock = async (blockId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "блоки", blockId, "products"));
    const data:Product[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }as Product);
    });
    return data
  } catch (error) {
    console.error("Помилка під час отримання даних з блоку:", error);
  }
};
export const getAllProductsFromBlocks = async ()=> {
  try {
    // Отримуємо всі блоки
    const blocksSnapshot = await getDocs(collection(db, "блоки"));
    const allProducts: Product[] = [];

    // Перебираємо всі блоки
    for (const blockDoc of blocksSnapshot.docs) {
      // Якщо блок має підколекцію "products", отримуємо продукти
      const productsSnapshot = await getDocs(
        collection(db, "блоки", blockDoc.id, "products")
      );

      // Додаємо продукти до масиву та додаємо id блока до кожного продукту
      productsSnapshot.forEach((productDoc) => {
        allProducts.push({
          id: productDoc.id,
          blockId: blockDoc.id,
          ...productDoc.data(),
        }as Product);
      });
    }
    return allProducts;
  } catch (error) {
    console.error("Помилка під час отримання всіх продуктів з блоків:", error);
  }
};


export const updateDataInCatalog = async (blockId: string| null, productId: string|null, updatedData: object) => {
  if (blockId && productId) {
    const productRef = doc(db, "блоки", blockId, "products", productId);

    try {
      await updateDoc(productRef, updatedData);
      console.log("Продукт у блоці оновлено!");
      alert("Товар успішно оновлено!");
    } catch (error) {
      console.error("Помилка під час оновлення продукту в блоці:", error);
      alert("Не вдалося оновити товар. Спробуйте ще раз.");
    }
  }
};

export const updateProductAvailability = async (productId: string, quantityToSubtract: number) => {
  if (productId && quantityToSubtract > 0) {
    try {
      // Отримуємо всі блоки
      const blocksSnapshot = await getDocs(collection(db, "блоки"));
      
      let productFound = false; // Флаг для перевірки, чи знайдено продукт

      // Перевіряємо кожен блок
      for (const blockDoc of blocksSnapshot.docs) {
        const blockId = blockDoc.id;
        const productRefInBlock = doc(db, "блоки", blockId, "products", productId);
        
        // Отримуємо документ продукту
        const productDoc = await getDoc(productRefInBlock);
        
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const currentAvailability = productData?.availability || 0;

          // Якщо поточна кількість більша або рівна тому, що потрібно відняти
          if (currentAvailability >= quantityToSubtract) {
            const updatedAvailability = currentAvailability - quantityToSubtract;

            // Оновлюємо availability в базі даних
            await updateDoc(productRefInBlock, { availability: updatedAvailability });

            console.log("Кількість товару на складі оновлено в блоці:", blockId);
            alert("Кількість товару успішно оновлено!");
            productFound = true;  // Продукт знайдений і оновлено
            break; // Зупиняємо пошук, оскільки продукт знайдений
          } else {
            alert("Недостатньо товару на складі.");
            productFound = true; // Продукт знайдений, але недостатньо товару
            break;
          }
        }
      }

      // Якщо продукт не знайдений в жодному блоці
      if (!productFound) {
        alert("Не вдалося знайти товар.");
        console.error("Продукт не знайдений.");
      }

    } catch (error) {
      console.error("Помилка під час оновлення кількості товару:", error);
      alert("Не вдалося оновити кількість товару. Спробуйте ще раз.");
    }
  } else {
    console.error("Невірні параметри. Переконайтесь, що productId і quantityToSubtract є правильними.");
    alert("Будь ласка, перевірте параметри.");
  }
};


export const deleteProductFromBlock = async (blockId: string, productId: string) => {
  const productRef = doc(db, "блоки", blockId, "products", productId);

  try {
    await deleteDoc(productRef);
    console.log("Продукт у блоці видалено!");
    alert("Товар успішно видалено!");
  } catch (error) {
    console.error("Помилка під час видалення продукту з блоку:", error);
    alert("Не вдалося видалити товар. Спробуйте ще раз.");
  }
};

export const getProductById = async (blockId: string | null, productId: string| null) => {
  if(blockId&&productId)
  try {
    const productRef = doc(db, "блоки", blockId, "products", productId);

    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    } else {
      console.error("Продукт із таким ID у блоці не знайдено.");
      return null;
    }
  } catch (error) {
    console.error("Помилка при отриманні продукту з блоку:", error);
    throw error; 
  }
};

// export const createBlock = async () => {
//   try {

//     const blockId = uuidv4();

//     const newBlock = {
//       id: blockId, 
//       title: "",
//       category: "Товари",
//     };

//     const blockRef = doc(collection(db, "блоки"), blockId);

//     await setDoc(blockRef, newBlock);

//     console.log("Новий блок створено з ID:", blockRef.id);
//     alert("Блок успішно створено!");
//   } catch (error) {
//     console.error("Помилка під час створення блоку:", error);
//     alert("Не вдалося створити блок. Спробуйте ще раз.");
//   }
// };

export const createBlock = async () => {
  try {
    const blockId = uuidv4();
    const blockCount = await getBlockCount(); // Отримуємо кількість блоків, щоб встановити порядковий номер

    const newBlock = {
      id: blockId,
      title: "",
      category: "Товари",
      order: blockCount + 1, // Новий блок отримає порядковий номер на основі кількості існуючих блоків
    };

    const blockRef = doc(collection(db, "блоки"), blockId);
    await setDoc(blockRef, newBlock);

    console.log("Новий блок створено з ID:", blockRef.id);
    alert("Блок успішно створено!");
  } catch (error) {
    console.error("Помилка під час створення блоку:", error);
    alert("Не вдалося створити блок. Спробуйте ще раз.");
  }
};

// Функція для отримання кількості блоків у базі даних
const getBlockCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, "блоки"));
    return snapshot.size; // Кількість документів у колекції
  } catch (error) {
    console.error("Помилка при отриманні кількості блоків:", error);
    return 0; // Якщо сталася помилка, повертаємо 0
  }
};
export const updateBlockOrder = async (updatedBlocks) => {
  const batch = writeBatch(db);

  updatedBlocks.forEach((block, index) => {
    const blockRef = doc(db, "блоки", block.id);
    batch.update(blockRef, { order: index + 1 }); // Оновлюємо порядковий номер
  });

  try {
    await batch.commit(); // Оновлюємо всі блоки в одній транзакції
    console.log("Порядок блоків успішно оновлено.");
  } catch (error) {
    console.error("Помилка при оновленні порядку блоків:", error);
  }
};
export const deleteBlock = async (blockId: string) => {
  try {
    const blockRef = doc(db, "блоки", blockId);

    const subCollectionRef = collection(db, "товари");
    const q = query(subCollectionRef, where("blockId", "==", blockId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
    await Promise.all(deletePromises);

    await deleteDoc(blockRef);

    console.log(`Блок ${blockId} та всі його вкладені елементи видалено!`);
    alert("Блок успішно видалено!");
  } catch (error) {
    console.error("Помилка при видаленні блоку:", error);
    alert("Не вдалося видалити блок. Спробуйте ще раз.");
  }
};
export const getBlocksFromCatalog = async () => {
  try {
    const blocksCollectionRef = collection(db, "блоки");

    const querySnapshot = await getDocs(blocksCollectionRef);

    const blocks = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(), 
    }));

    return blocks; 
  } catch (error) {
    console.error("Помилка при отриманні блоків:", error);
    throw error; 
  }
};



export const updateBlockFields = async (
  blockId: string,
  updatedFields: UpdatedFields
) => {
  try {
    const blockRef = doc(db, "блоки", blockId);

    const fieldsToUpdate = Object.entries(updatedFields).reduce(
      (acc, [key, value]) => {
        acc[key] = value === null ? deleteField() : value;
        return acc;
      },
      {} as Record<string, any>
    );

    await updateDoc(blockRef, fieldsToUpdate);

    console.log("Блок успішно оновлено з ID:", blockId);
    alert("Поля блоку успішно оновлено!");
  } catch (error) {
    console.error("Помилка під час оновлення блоку:", error);
    alert("Не вдалося оновити блок. Спробуйте ще раз.");
  }
};


export const getBlockDataFromFirebase = async (blockId: string) => {
  try {
    const docRef = doc(db, "блоки", blockId); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("Документ не знайдено!");
      return null;
    }
  } catch (error) {
    console.error("Помилка при отриманні даних з Firebase:", error);
    throw error;
  }
};

interface Orders {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
  city: string;
  branch: string;
  number: string;
  createdAt: Timestamp;
  products: { product: Product; quantity: number }[];
}

export const getOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");

    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(), 
   })) as Orders[]; 

    return orders; 
  } catch (error) {
    console.error("Помилка при отриманні orders:", error);
    throw error; 
  }
};
export const getUsers= async () => {
  try {
    const ordersRef = collection(db, "users");

    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs.map((doc) => ({
      ...doc.data(), 
    }));

    return orders; 
  } catch (error) {
    console.error("Помилка при отриманні користувачів:", error);
    throw error; 
  }
};
export const createAchievement = async (name: string, waylMoney: number, imageUrl: string, description:string) => {
  try {
    const newAchiev = {
      name,
      waylMoney,
      description,
      img: imageUrl
    };

    const docRef = await addDoc(collection(db, "achievements"), newAchiev);
    
    await updateDoc(doc(db, "achievements", docRef.id), { id: docRef.id });
    
    return { id: docRef.id, ...newAchiev };
  } catch (error) {
    console.error("Помилка під час створення досягнення:", error);
    throw error;
  }
};

export const getAchievements= async () => {
  try {
    const achievementsRef = collection(db, "achievements");

    const querySnapshot = await getDocs(achievementsRef);

    const achievements = querySnapshot.docs.map((doc) => ({
      ...doc.data(), 
    }));

    return achievements; 
  } catch (error) {
    console.error("Помилка при отриманні achievements:", error);
    throw error; 
  }
};

export const deleteAchievementById = async (achievementId: string) => {
  const productRef = doc(db, "achievements", achievementId);

  try {
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      console.log(`Документ з ID ${achievementId} не існує.`);
      return;
    }

    await deleteDoc(productRef);
    console.log(`Досягнення з ID ${achievementId} успішно видалено.`);
  } catch (error) {
    console.error("Помилка при видаленні досягнення:", error);
  }
};

export const updateAchievement = async (id: string, name: string, imageUrl: string, waylMoney: number,description:string) => {
  try {
    const achievementRef = doc(db, "achievements", id);

    await updateDoc(achievementRef, {
      name,
      waylMoney,
      description,
      img: imageUrl
    });

    console.log(`Досягнення з ID ${id} оновлено успішно`);
  } catch (error) {
    console.error("Помилка під час оновлення досягнення:", error);
    throw error;
  }
};

export interface Tip {
  id: string;
  title: string;
  imageUrl: string;
  description: string
}

export const createTip = async (title: string, imageUrl: string, description: string) => {
  try {
    const newTip = {
      title,
      imageUrl,
      description,
    };

    const docRef = await addDoc(collection(db, "usefulTips"), newTip);
    
    await updateDoc(doc(db, "usefulTips", docRef.id), { id: docRef.id });
    
    return { id: docRef.id, ...newTip };
  } catch (error) {
    console.error("Помилка під час створення поради:", error);
    throw error;
  }
};

export const getAllTips = async (): Promise<Tip[]> => {
  try {
    const tipsRef = collection(db, "usefulTips");
    const snapshot = await getDocs(tipsRef);
    const tips = snapshot.docs.map((doc) => ({
      ...doc.data(), 
    }));
    console.log(tips)

    return tips as Tip[]
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateTip = async (id: string, title: string, imageUrl: string, description: string) => {
  try {
    const achievementRef = doc(db, "usefulTips", id);

    await updateDoc(achievementRef, {
      title,
      imageUrl,
      description
    });

    console.log(`Порада з ID ${id} оновлено успішно`);
  } catch (error) {
    console.error("Помилка під час оновлення поради:", error);
    throw error;
  }
}


export const deleteTip = async (tipId: string) => {
  const productRef = doc(db, "usefulTips", tipId);

  try {
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      console.log(`Документ з ID ${tipId} не існує.`);
      return;
    }

    await deleteDoc(productRef);
    console.log(`Порада з ID ${tipId} успішно видалено.`);
  } catch (error) {
    console.error("Помилка при видаленні поради:", error);
  }
};

////////////////////////////////////////////////////////




export type NotificationType = "system" | "push" | "popup";
export interface NotificationData {
  id?: string; 
  title: string;
  description: string;
  category: string;
  date: string; 
  time: string; 
  type: NotificationType; 
  screen?: string;
  createdAt?: Timestamp;
}



export const deleteNotification = async (notificationId: string): Promise<void> => {
  if (!notificationId) {
    alert("❌ Некоректний ID сповіщення!");
    return;
  }

  try {
    await deleteDoc(doc(db, "scheduled_notifications", notificationId));
    alert("🗑 Сповіщення видалено!");
  } catch (error) {
    console.error("❌ Помилка при видаленні сповіщення:", error);
  }
};


export const updateNotification = async (
  notificationId: string,
  updatedData: Partial<NotificationData>
): Promise<void> => {
  if (!notificationId || !updatedData) {
    alert("❌ Некоректні дані для оновлення!");
    return;
  }

  try {
    await updateDoc(doc(db, "scheduled_notifications", notificationId), updatedData);
    alert("✅ Сповіщення оновлено!");
  } catch (error) {
    console.error("❌ Помилка при оновленні сповіщення:", error);
  }
};

export const getAllNotifications = async (): Promise<NotificationData[]> => {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "scheduled_notifications"));

    const notifications: NotificationData[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationData[];

    return notifications;
  } catch (error) {
    console.error("❌ Помилка отримання сповіщень:", error);
    return [];
  }
};



export const addNotification = async (notification: NotificationData): Promise<void> => {
  const { title, description, category, date, time, type, screen } = notification;

  if (!title || !description || !category || !date || !time || !type) {
    alert("Будь ласка, заповніть всі обов'язкові поля!");
    return;
  }

  try {
 
const isoString = `${date}T${time}:00`; // формат типу '2025-04-11T12:30:00'
    const scheduledDateTime = parseISO(isoString);

  
  if (!isValid(scheduledDateTime)) {
    throw new Error("❌ Неправильний формат дати або часу");
  }

    const scheduledTimestamp = Timestamp.fromDate(scheduledDateTime);
    if (type === "system") {
      const notificationRef = await addDoc(collection(db, "scheduled_notifications"), {
        title,
        body: description,
        screen,
        scheduledTime: scheduledTimestamp, // Час для відправлення сповіщення
        status: "sent",
        category:category,
        type: type,
        createdAt: Timestamp.now(),
      });
      await updateDoc(doc(db, "scheduled_notifications", notificationRef.id), {
        id: notificationRef.id,
      });
    } else {
      const notificationRef = await addDoc(collection(db, "scheduled_notifications"), {
        title,
        body: description,
        screen,
        scheduledTime: scheduledTimestamp, // Час для відправлення сповіщення
        status: "pending",
        type: type,
        createdAt: Timestamp.now(),
      });
      await updateDoc(doc(db, "scheduled_notifications", notificationRef.id), {
        id: notificationRef.id,
      });
    }

    console.log("✅ Сповіщення заплановано!", notificationRef.id);
  } catch (error) {
    console.error("❌ Помилка при додаванні сповіщення:", error);
  }
};


// const sendPushNotification = async (
//     title: string,
//     body: string,
//    date: string,
//    time: string, 
//     screen?: string
//   ) => {
//     const functions = getFunctions();
//     const sendNotification = httpsCallable<
//     { title: string; body: string; date: string; time: string; screen?: string },
//       { success: boolean; sentCount: number }
//     >(functions, "sendNotification");

//     try {
//       const response = await sendNotification({ title, body, date, time, screen });
//       console.log("✅ Відповідь від сервера:", response.data);
//     } catch (error) {
//       console.error("❌ Помилка виклику функції:", error);
//     }
//   };

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus
    });
  } catch (error) {
    console.error("Помилка при оновленні статусу замовлення:", error);
    throw error;
  }
};

// export const updateProductsOrder = async (blockId: string, productIds: string[]) => {
//   try {
//     const blockRef = doc(db, "blocks", blockId);
//     await updateDoc(blockRef, {
//       productsOrder: productIds
//     });
//   } catch (error) {
//     console.error("Помилка при оновленні порядку продуктів:", error);
//     throw error;
//   }
// };
export const updateUserFields = async (
  currentUser, 
  updatedFields
) => {
  try {
    const id = currentUser.uid? currentUser.uid : currentUser.id;
    const userRef = doc(db, "usersAdmin", id);

    const updatedData = {};

    if (updatedFields.name) updatedData.displayName = updatedFields.name;
    if (updatedFields.role) updatedData.role = updatedFields.role;
    if (updatedFields.email) updatedData.email = updatedFields.email;

    await updateDoc(userRef, updatedData);

    console.log("Користувача успішно оновлено в Firestore");

    if (currentUser.uid) {
      const auth = getAuth();
      if (auth.currentUser && updatedFields.name) {
        await updateProfile(auth.currentUser, {
          displayName: updatedFields.name,
        });
        console.log("displayName оновлено в Firebase Auth");
      } else {
        console.error("Невірний користувач або відсутнє значення displayName");
      }
    }

  } catch (error) {
    console.error("Помилка при оновленні користувача:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, "usersAdmin");
    
    const querySnapshot = await getDocs(usersCollectionRef);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data(),
    }));

    console.log("Users fetched successfully:", users);
    return users;

  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const addOrUpdateClubOfLeaders = async (clubData) => {
  try {
    // Вказуємо колекцію "clubOfLeaders" і документ "leaderInfo"
    const clubRef = doc(db, "clubOfLeaders", "leaderInfo");

    // Отримуємо поточні дані з Firestore
    const docSnapshot = await getDoc(clubRef);

    if (!docSnapshot.exists()) {
      console.error("Документ не знайдено!");
      return;
    }

    // Отримуємо наявні дані з Firestore
    const existingData = docSnapshot.data();

    // Функція для перевірки та обробки дат
   const parseDate = (date) => {
      if (!date) return null; // Якщо дата не передана, повертаємо null

      // Якщо дата вже є об'єктом Timestamp, повертаємо її як є
      if (date instanceof Timestamp) {
        return date;
      }

      // Якщо це рядок чи звичайний об'єкт Date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date value:", date);
        return null; // Якщо дата не валідна, повертаємо null
      }
      return Timestamp.fromDate(parsedDate); // Повертаємо Timestamp
    };

    // Формуємо дані для додавання/оновлення
    const clubDataToSave = {
      title: clubData.title || existingData.title,
      датаПочатку: parseDate(clubData.startDate) || existingData.датаПочатку,
      зображення: clubData.image || existingData.зображення,
      description: clubData.description || existingData.description,
    };

    // Зберігаємо або оновлюємо дані в документі
    await setDoc(clubRef, clubDataToSave, { merge: true });

    console.log("Club of Leaders data added/updated successfully:", clubDataToSave);
  } catch (error) {
    console.error("Error adding/updating club of leaders data:", error);
    throw error;
  }
};

export const getClubOfLeaders = async () => {
  try {
    // Вказуємо колекцію "clubOfLeaders" та документ "leaderInfo"
    const clubRef = doc(db, "clubOfLeaders", "leaderInfo");

    // Отримуємо документ
    const docSnapshot = await getDoc(clubRef);

    if (docSnapshot.exists()) {
      // Якщо документ існує, повертаємо дані
      console.log("Club of Leaders data fetched successfully:", docSnapshot.data());
      return docSnapshot.data();
    } else {
      // Якщо документа не існує
      console.log("No such document in the 'clubOfLeaders' collection.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching club of leaders data:", error);
    throw error;
  }
};