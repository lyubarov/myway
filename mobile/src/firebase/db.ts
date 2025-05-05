import {onSnapshot, arrayUnion,arrayRemove, query, where,collection, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc, addDoc, deleteField } from "firebase/firestore"; 
import { db } from "@utils/firebase";
import uuid from "react-native-uuid"; 


interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  subCategory: string;
  status: string;
  availability: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink?: string;
  images: string[];
}

export const getBlocks = async () => {
  try {
    const blocksCollection = collection(db, "блоки"); 
    const querySnapshot = await getDocs(blocksCollection);

    const blocks = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return blocks;
  } catch (error) {
    console.error("Помилка під час отримання блоку:", error);
    return [];
  }
};


export const getProductsFromBlockById = async (id:string) => {
  try {
     const blockDoc = doc(db, "блоки", id);

    const productsCollection = collection(blockDoc, "products");
    const querySnapshot = await getDocs(productsCollection);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error('Помилка під час отримання даних з блоку:', error);
  }
};

export const getProductsFromBlockByTitle = async (title:string) => {
  try {
    const blocksRef = collection(db, "блоки");
    const q = query(blocksRef, where("title", "==", title));

    const blockSnapshot = await getDocs(q);

    if (blockSnapshot.empty) {
      return [];
    }

    const blockDoc = blockSnapshot.docs[0]; 

    const productsRef = collection(blockDoc.ref, "products");
    const productsSnapshot = await getDocs(productsRef);

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("❌ Помилка отримання продуктів:", error);
    return [];
  }
};


export const updateProductQuantity = async (
  blockId: string,
  productId: string,
  newQuantity: number
) => {
  try {
    const productRef = doc(db, "блоки", blockId, "products", productId);

    await updateDoc(productRef, {
      quantity: newQuantity,
    });

    console.log(`Кількість продукту (${productId}) оновлено до ${newQuantity}`);
    return true;
  } catch (error) {
    console.error("Помилка під час оновлення кількості продукту:", error);
    return false;
  }
};

export const getBannersFromBlock = async (blockId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "блоки", blockId, "banners"));
    const data:Product[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }as Product);
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Помилка під час отримання даних з блоку:", error);
  }
};

export const addUserToFirestore = async (user: { 
  uid: string; 
  displayName: string; 
  email: string; 
  number: string | null; 
  dateOfBirthday?: { day: string, month: string, year: string } | null;
  photoUrl?: string;
}): Promise<void> => {
const referralCode = uuid.v4().slice(0, 8);
  try {
    const userRef = doc(db, "users", user.uid); 
    await setDoc(userRef, {
      uid:user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.number,
      photoUrl:user.photoUrl || null,
      waterBalance: { goal: 0, drunk: 0, waterIntake:0},
      historyIntakeWater: [],
      reminder: [],
      favorites: [],
      wallet:100,
      takingVitamins:[],
      createdAt: serverTimestamp(), 
      dateOfBirthday: user.dateOfBirthday||null,
      medals: 0,
      wayWallet: 0,
      referrals: [],
      referralStatus:0,
      myStatus: 0,
      myAchievement: 0,
      myReferralsAchievement: 0,
      uniqueReferralLink: referralCode,
      referralCode: null,
      achievementList: [],
      status: "",
      referralStatusName: "",
      notifications: [],
      socialAuthOpenId: {
        facebook: null,
        instagram: null,
        tiktok: null,
        youtube:null,
      }
    });

  } catch (error) {
    console.error("Помилка під час додавання користувача до Firestore:", error);
  }
};
export const updateSocialAuthOpenId = async (
  uid: string, 
  socialMedia: "facebook" | "instagram" | "tiktok" | "youtube", 
  userId: string | null 
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    
    await updateDoc(userRef, {
      [`socialAuthOpenId.${socialMedia}`]: userId 
    });

    console.log(`User ${socialMedia} ID updated successfully!`);

  } catch (error) {
    console.error("Error updating socialAuthOpenId:", error);
  }
};
export const getUserFromFirestore = async (uid: string): Promise<any> => {
  
  try {
    const userRef = doc(db, "users", uid);

    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } 
  } catch (error) {
    console.error("Помилка під час отримання користувача з Firestore:", error);
  }
};
export const findUserByPhone = async (phoneNumber: string): Promise<any | null> => {
  try {
    const usersRef = collection(db, "users"); 
    const querySnapshot = await getDocs(usersRef);

    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      
      if (userData.phoneNumber === phoneNumber) {
        console.log("✅ Користувач знайдений:", userDoc.id, userData);
        return { id: userDoc.id, ...userData };
      }
    }

    console.log("❌ Користувача не знайдено");
    return null;
  } catch (error) {
    console.error("❌ Помилка під час пошуку користувача за номером телефону:", error);
    return null;
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, "users"); 
    const usersSnapshot = await getDocs(usersRef); 
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })); 

    return usersList;
  } catch (error) {
    console.error("Помилка під час отримання користувачів з Firestore:", error);
    return [];
  }
};

export const updateUserInFirestore = async (uid: string, updatedData: any): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error("Помилка під час оновлення даних користувача в Firestore:", error);
  }
};

export const getCartItems = async (uid: string): Promise<Array<{ productId: string; quantity: number }> | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return null;
    }

    const userData = userSnap.data();
    const cart = userData.cart || [];

    return cart;
  } catch (error) {
    console.error("Помилка під час отримання товарів з кошика:", error);
    return null;
  }
};

export const addToCart = async (uid: string, product: Product, quantity: number = 1) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return;
    }

    const userData = userSnap.data();
    const cart: Array<{ product: Product; quantity: number }> = userData.cart || [];

    const isProductInCart = cart.some((item) => item.product.id === product.id);

    if (isProductInCart) {
      return;
    }

    const updatedCart = [...cart, { product, quantity }];

    await updateDoc(userRef, {
      cart: updatedCart,
    });

  } catch (error) {
    console.error("Помилка під час додавання товару в кошик:", error);
  }
};
export const getCartProducts = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return [];
    }

    const userData = userSnap.data();
    const cart = userData.cart || [];

    if (!Array.isArray(cart) || cart.length === 0) {
      return [];
    }

    return cart; 
  } catch (error) {
    console.error("Помилка під час отримання товарів з кошика:", error);
    return [];
  }
};
export const updateCartQuantity = async (uid:string, updatedCart) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      cart: JSON.parse(JSON.stringify(updatedCart)), 
    });
  } catch (error) {
    console.error("Помилка під час оновлення кількості товарів:", error);
  }
};

export const removeFromCart = async (uid, productId) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return;
    }

    const userData = userSnap.data();
    const cart = userData.cart || [];

    const updatedCart = cart.filter((item) => item.product.id !== productId);

    await updateDoc(userRef, { cart: updatedCart });
  } catch (error) {
    console.error("Помилка під час видалення товару з кошика:", error);
  }
};

export const clearCart = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      cart: [],
    });

  } catch (error) {
    console.error("Помилка під час очищення кошика:", error);
  }
};



export const toggleFavorite = async (uid: string, product: Product) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return;
    }

    const userData = userSnap.data();
    const favorites: Product[] = userData.favorites || [];

    const isProductInFavorites = favorites.some((item) => item.id === product.id);

    let updatedFavorites;
    if (isProductInFavorites) {
      updatedFavorites = favorites.filter((item) => item.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }

    await updateDoc(userRef, { favorites: updatedFavorites });
  } catch (error) {
    console.error("Помилка під час оновлення обраного:", error);
  }
};
export const getFavorites = async (uid: string): Promise<Product[]> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Користувач не знайдений!");
      return [];
    }

    const userData = userSnap.data();
    const favorites: Product[] = userData.favorites || [];

    return favorites;
  } catch (error) {
    console.error("❌ Помилка під час отримання обраного:", error);
    return [];
  }
};

export const updateWaterBalance = async (uid: string, newGoal?: number, newDrunk?: number, newWaterIntake?:number) => {
  try {
    const userRef = doc(db, "users", uid);
    
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.warn(`Користувач ${uid} не знайдений!`);
      return;
    }
    
    const currentWaterBalance = userSnap.data().waterBalance || { goal: 0, drunk: 0, newWaterIntake:0 };

    const updatedWaterBalance = {
      goal: newGoal !== undefined ? newGoal : currentWaterBalance.goal,
      drunk: newDrunk !== undefined ? newDrunk : currentWaterBalance.drunk,
      waterIntake: newWaterIntake !== undefined ? newWaterIntake : currentWaterBalance.newWaterIntake,
    };

    await updateDoc(userRef, {
      "waterBalance.goal": updatedWaterBalance.goal,
      "waterBalance.drunk": updatedWaterBalance.drunk,
      "waterBalance.waterIntake": updatedWaterBalance.waterIntake,
    });

  } catch (error) {
    console.error("Помилка при оновленні waterBalance:", error);
  }
};

export const addWaterIntakeRecord = async (uid: string, amount: number) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`Користувач ${uid} не знайдений!`);
      return;
    }

    const currentWaterBalance = userSnap.data().waterBalance || { goal: 0, drunk: 0, waterIntake: 0 };

    await updateDoc(userRef, {
      historyIntakeWater: arrayUnion({
        amount,
        timestamp: Timestamp.now(),
      }),
      "waterBalance.drunk": Number(currentWaterBalance.drunk) + Number(amount), 
    });

  } catch (error) {
    console.error("Помилка при додаванні запису про прийом води:", error);
  }
};

export const getWaterIntakeHistory = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`Користувач ${uid} не знайдений!`);
      return [];
    }

    const history = userSnap.data().historyIntakeWater || [];

    history.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    return history;
  } catch (error) {
    console.error("Помилка при отриманні історії прийому води:", error);
    return [];
  }
};

export const addReminder = async (uid: string, reminderTime: string) => {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      reminder: arrayUnion({
        time: reminderTime,
      }),
    });

  } catch (error) {
    console.error("Помилка при додаванні нагадування:", error);
  }
};

export const getReminders = async (uid: string): Promise<string[]> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`Користувач ${uid} не знайдений!`);
      return [];
    }

    const userData = userSnap.data();
    return userData.reminder ? userData.reminder : [];
  } catch (error) {
    console.error("Помилка при отриманні нагадувань:", error);
    return [];
  }
};


export const removeReminder = async (uid: string, time: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      reminder: arrayRemove({ time })
    });

  } catch (error) {
    console.error("Помилка при видаленні нагадування:", error);
  }
};

export const addVitaminRecord = async (
  uid: string,
  vitamin: Record<string, any>,
  time: string[],
  days: string[],
  status: boolean = true
) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: Відсутній `uid` користувача!");
      return;
    }
    const statusByDay = days.reduce((acc, day) => {
      acc[day] = true;
      return acc;
    }, {} as Record<string, boolean>);

    const userRef = doc(db, "users", uid);
    console.log("time",time);
    

    const vitaminRecords = time.map((singleTime) => ({
      id: uuid.v4().toString(), 
      vitamin,
      time: [singleTime], 
      days,
      statusByDay,
      status,
      addedAt: Timestamp.now(),
    }));

    await updateDoc(userRef, {
      takingVitamins: arrayUnion(...vitaminRecords), 
    });


  } catch (error) {
    console.error("❌ Помилка при додаванні вітаміну:", error);
  }
};

export const getVitaminRecords = async (uid: string) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: відсутній `uid` користувача!");
      return null;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.takingVitamins || []; 
    } else {
      console.warn("⚠️ Документ користувача не знайдено!");
      return [];
    }
  } catch (error) {
    console.error("❌ Помилка при отриманні вітамінів:", error);
    return null;
  }
};

export const updateVitaminStatus = async (uid: string, vitaminId: string, selectedDay: string, newStatus: boolean) => {
  try {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("⚠️ Документ користувача не знайдено!");
      return;
    }

    const userData = userSnap.data();
    const vitamins = userData.takingVitamins || [];

    const updatedVitamins = vitamins.map((vitamin) => {
      if (vitamin.id === vitaminId) {
        return {
          ...vitamin,
          statusByDay: {
            ...vitamin.statusByDay,
            [selectedDay]: newStatus, 
          },
        };
      }
      return vitamin;
    });

    await updateDoc(userRef, {
      takingVitamins: updatedVitamins,
    });

  } catch (error) {
    console.error("❌ Помилка при оновленні статусу вітаміну:", error);
  }
};


export const removeVitaminRecord = async (uid: string, vitaminId: string) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: відсутній `uid` користувача!");
      return;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("⚠️ Користувача не знайдено у Firestore!");
      return;
    }

    const userData = userSnap.data();
    const currentVitamins = userData.takingVitamins || [];

    const updatedVitamins = currentVitamins.filter(
    (vitamin) => vitamin.id !== vitaminId    );

    await updateDoc(userRef, {
      takingVitamins: updatedVitamins,
    });

  } catch (error) {
    console.error("❌ Помилка при видаленні вітаміну:", error);
  }
};

export const updateVitaminTime = async (uid: string, vitaminId: string, newTime: string[]) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: відсутній `uid` користувача!");
      return;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("⚠️ Користувача не знайдено у Firestore!");
      return;
    }

    const userData = userSnap.data();
    const currentVitamins = userData.takingVitamins || [];

    const updatedVitamins = currentVitamins.map((vitamin) =>
      vitamin.id === vitaminId ? { ...vitamin, time: newTime } : vitamin
    );

    await updateDoc(userRef, {
      takingVitamins: updatedVitamins,
    });


  } catch (error) {
    console.error("❌ Помилка при оновленні часу прийому вітаміну:", error);
  }
};
      
export const addOrderData = async (
  uid: string,
  orderData: Record<string, any>
) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: Відсутній `uid` користувача!");
      return;
    }

    const userRef = doc(db, "users", uid);

    const newOrder = {
      id: uuid.v4().toString(),
      ...orderData,
      createdAt: Timestamp.now(),
    };

    await updateDoc(userRef, {
      DateForOrder: arrayUnion(newOrder), 
    });

  } catch (error) {
    console.error("❌ Помилка при додаванні замовлення:", error);
  }
};

export const createOrderForUsers = async (uid: string, orderData: Record<string, any>) => {
  try {
    const orderId = uuid.v4().toString();
    const orderRef = doc(collection(db, "orders"), orderId);
    const counterRef = doc(db, "metadata", "ordersCounter"); 

    const counterSnap = await getDoc(counterRef);
    let newOrderNumber = 1; 

    if (counterSnap.exists()) {
      newOrderNumber = counterSnap.data().lastOrderNumber + 1;
    }

    const newOrder = {
      id: orderId,
      orderNumber: newOrderNumber, 
      userId: uid,
      createdAt: Timestamp.now(),
      ...orderData,
    };

    await setDoc(orderRef, newOrder);

    await setDoc(counterRef, { lastOrderNumber: newOrderNumber });


  } catch (error) {
    console.error("❌ Помилка при створенні замовлення:", error);
  }
};

export const getOrdersForUser = async (uid: string) => {
  try {
    if (!uid) {
      console.error("❌ Помилка: Відсутній `uid` користувача!");
      return [];
    }

    const ordersRef = collection(db, "orders"); 
    const q = query(ordersRef, where("userId", "==", uid)); 

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return orders; 
  } catch (error) {
    console.error("❌ Помилка при отриманні замовлень:", error);
    return [];
  }
};
export const updateUserWallet = async (uid: string, newWalletValue: number, newOrderSum:number): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid); 

    await updateDoc(userRef, {
      wallet: newWalletValue, 
      myStatus:newOrderSum,
    });

    console.log(`Wallet оновлено: ${newWalletValue} грн`);
  } catch (error) {
    console.error("Помилка при оновленні wallet:", error);
  }
};
export const updateUserAchievement = async (uid: string, newAchievement: number,newStatus:string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid); 

    await updateDoc(userRef, {
      myAchievement: newAchievement, 
      status:newStatus
    });

  } catch (error) {
    console.error("Помилка при оновленні wallet:", error);
  }
};
export const updateUsersReferralAchievement = async (uid: string, newAchievement: number, status:string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid); 

    await updateDoc(userRef, {
      myReferralsAchievement: newAchievement, 
      referralStatusName:status
    });

  } catch (error) {
    console.error("Помилка при оновленні wallet:", error);
  }
};
export const updateOnlyWallet = async (uid: string, newWalletValue: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid); 

    await updateDoc(userRef, {
      wallet: newWalletValue, 
    });

    console.log(`Wallet оновлено: ${newWalletValue} грн`);
  } catch (error) {
    console.error("Помилка при оновленні wallet:", error);
  }
};
export const updateWallet = async (uid: string, newWalletValue: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid); 

    await updateDoc(userRef, {
      wallet: newWalletValue, 
      wayWallet:0
    });

    console.log(`Wallet оновлено: ${newWalletValue} грн`);
  } catch (error) {
    console.error("Помилка при оновленні wallet:", error);
  }
};

export const addAchievement = async (userUid: string, updatedAchievements: string[],newWayWallet: number,newMedals:number) => {
  try {
    const userRef = doc(db, "users", userUid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
      await updateDoc(userRef, {
        achievementList: updatedAchievements,
        wayWallet: newWayWallet,
        medals: newMedals,
      });
    
  } catch (error) {
    console.error("Помилка під час оновлення досягнень:", error);
  }
};

export const getAllAchievements = async () => {
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


// сповіщення

export const addUserNotification = async (
  uid: string,
  title: string,
  content: string,
  type: "achievement" | "info" | "referral" | "warning" | "recommendation" 
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);

    const newNotification = {
      id: `notif_${Date.now()}`, 
      title,
      content,
      type,
      isRead: false,
      createdAt: Timestamp.now(),
    };

    await updateDoc(userRef, {
      notifications: arrayUnion(newNotification),
    });

    console.log(`Сповіщення додано користувачу ${uid}`);
  } catch (error) {
    console.error("Помилка при додаванні сповіщення:", error);
  }
};


export const getUserNotifications = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("Користувача не знайдено.");
      return [];
    }

    const userData = userSnap.data();
    const data = userData.notifications || []

    return data;
  } catch (error) {
    console.error("Помилка при отриманні сповіщень:", error);
    throw error;
  }
};
export const listenForNotifications = (uid: string, callback: (notifications: any[]) => void) => {
  const userRef = doc(db, "users", uid);

  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback(data.notifications || []);
    }
  });
};
export const markNotificationAsRead = async (uid: string, notificationId: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const notifications = userSnap.data().notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );

    await updateDoc(userRef, { notifications });

    console.log(`Сповіщення ${notificationId} позначено як прочитане.`);
  } catch (error) {
    console.error("Помилка при оновленні статусу сповіщення:", error);
  }
};

export const listenForUnreadNotifications = (
  uid: string,
  callback: (hasUnread: boolean) => void
) => {
  const userRef = doc(db, "users", uid);

  return onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(false);
      return;
    }

    const notifications = docSnap.data().notifications || [];
    const hasUnread = notifications.some((notif) => !notif.isRead); 

    callback(hasUnread);
  });
};



export const listenForOrderStatusChanges = (orderId: string, userId: string) => {
  const orderRef = doc(db, "orders", orderId);
  const userRef = doc(db, "users", userId);

  return onSnapshot(orderRef, async (docSnap) => {
    if (!docSnap.exists()) return;

    const orderData = docSnap.data();
    const newStatus = orderData.status;

    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : null;

    if (!userData || userData.lastOrderStatus?.[orderId] === newStatus) return;

    console.log(`📦 Статус замовлення ${orderId} змінився на: ${newStatus}`);

    await addUserNotification(
      userId,
      "Оновлення замовлення",
      `Ваше замовлення тепер має статус: ${newStatus}`,
      "info"
    );

    // if (userData.fcmToken) {
    //   await sendPushNotification(
    //     userData.fcmToken,
    //     "Оновлення замовлення",
    //     `Ваше замовлення тепер має статус: ${newStatus}`
    //   );
    // }

    await updateDoc(userRef, {
      lastOrderStatus: {
        ...userData.lastOrderStatus,
        [orderId]: newStatus,
      },
    });
  });
};

export const getAllUsefulTips = async () => {
  try {
    const tipsRef = collection(db, "usefulTips");

    const querySnapshot = await getDocs(tipsRef);

    const tips = querySnapshot.docs.map((doc) => ({
      ...doc.data(), 
    }));

    return tips; 
  } catch (error) {
    console.error("Помилка при отриманні tips:", error);
    throw error; 
  }
};


export const saveFcmToken = async (fcmToken: string) => {
  try {
    const tokensCollectionRef = collection(db, "fcmTokens"); // Посилання на колекцію
    await addDoc(tokensCollectionRef, {
      fcmToken,
      updatedAt: new Date().toISOString(),
    });
    console.log("FCM-токен успішно збережено:", fcmToken);
  } catch (error) {
    console.error("Помилка під час збереження FCM-токена:", error);
    throw error;
  }
};
export const getAllFcmTokens = async (): Promise<string[]> => {
  try {
    const tokensCollectionRef = collection(db, "fcmTokens"); // Посилання на колекцію
    const querySnapshot = await getDocs(tokensCollectionRef); // Отримуємо всі документи

    // Витягуємо fcmToken з кожного документа
    const tokens: string[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.fcmToken as string;
    });

    console.log("Усі FCM-токени отримано:", tokens);
    return tokens;
  } catch (error) {
    console.error("Помилка під час отримання FCM-токенів:", error);
    throw error;
  }
};

export const findFcmToken = async (
  fcmToken: string
): Promise<{ id: string; fcmToken: string; updatedAt: string } | null> => {
  try {
    const tokensCollectionRef = collection(db, "fcmTokens");
    const q = query(tokensCollectionRef, where("fcmToken", "==", fcmToken));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`FCM-токен ${fcmToken} не знайдено`);
      return null; // Повертаємо null, якщо токен не знайдено
    }

    // Беремо перший знайдений документ (зазвичай буде лише один, якщо fcmToken унікальний)
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    console.log(`FCM-токен ${fcmToken} знайдено, документ:`, data);

    return {
      id: doc.id,
      fcmToken: data.fcmToken as string,
      updatedAt: data.updatedAt as string,
    };
  } catch (error) {
    console.error("Помилка під час пошуку FCM-токена:", error);
    throw error;
  }
};

export const updateReferralCode = async (uid: string, newReferralCode: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    
    await updateDoc(userRef, {
      referralCode: newReferralCode,
    });

    console.log("Referral code успішно оновлено!");
  } catch (error) {
    console.error("Помилка при оновленні referralCode:", error);
  }
};
export const updateReferrals = async (uid: string, currId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    
    await updateDoc(userRef, {
      referrals: arrayUnion({ id: currId, spent:0,reviewMonue:0, status:true }), 
    });

    console.log("Referral code успішно оновлено!");
  } catch (error) {
    console.error("Помилка при оновленні referralCode:", error);
  }
};

export const updateReferralSpent = async (uid: string, currId: string, newSpent: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("Користувач не знайдений!");
      return;
    }

    const userData = userSnap.data();
    const referrals = userData.referrals || [];

const updatedReferrals = referrals.map((referral: { id: string; spent: number; reviewMonue?: number; status?: boolean }) => 
  referral.id === currId
    ? {
        ...referral, 
        spent: referral.spent + newSpent,  
        reviewMonue: referral.status === false 
          ? (referral.reviewMonue || 0) + newSpent  
          : newSpent,  
        status: referral.status === true ? false : referral.status
      }
    : referral
);

if (!updatedReferrals.some(referral => referral.id === currId)) {
  updatedReferrals.push({
    id: currId, 
    spent: newSpent,  
    reviewMonue: newSpent,  
    status: false,  
  });
}

    await updateDoc(userRef, { referrals: updatedReferrals });

    console.log("Поле spent успішно оновлено!");
  } catch (error) {
    console.error("Помилка при оновленні spent:", error);
  }
};
export const updateReferralStatus = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("Користувач не знайдений!");
      return;
    }

    const userData = userSnap.data();
    const referrals = userData.referrals || [];

    // Оновлюємо статус для всіх рефералів з status === false
    const updatedReferrals = referrals.map((referral: { id: string; status: boolean; reviewMonue?: number }) =>
      referral.status === false
        ? {
            ...referral,
            status: true,  // Змінюємо статус на true
          }
        : referral
    );

    await updateDoc(userRef, { referrals: updatedReferrals });

    console.log("Статус успішно оновлено для всіх рефералів!");

  } catch (error) {
    console.error("Помилка при оновленні статусу:", error);
  }
};


export const getClubOfLeaders = async () => {
  try {
    const clubRef = doc(db, "clubOfLeaders", "leaderInfo");

    const docSnapshot = await getDoc(clubRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("No such document in the 'clubOfLeaders' collection.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching club of leaders data:", error);
    throw error;
  }
};
export const addFcmTokenToFirestore = async (uid: string, fcmToken: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      fcmToken: fcmToken, 
    });
    console.log(`FCM Token успішно додано для користувача: ${uid}`);
  } catch (error) {
    console.error("Помилка під час додавання FCM токену:", error);
  }
};
export const removeFcmTokenFromFirestore = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      fcmToken: deleteField(), 
    });
    console.log(`FCM Token успішно видалено для користувача: ${uid}`);
  } catch (error) {
    console.error("Помилка під час видалення FCM токену:", error);
  }
};