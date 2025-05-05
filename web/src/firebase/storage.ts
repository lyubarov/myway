import { ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";
import {storage} from './config'

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path); 

    await uploadBytes(storageRef, file);
    console.log("Фото успішно завантажено!");

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Помилка під час завантаження зображення:", error);
    throw error;
  }
};

export const getImageURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path); 

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Помилка під час отримання посилання на зображення:", error);
    throw error;
  }
};


export const deleteImageFromStorage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
    console.log("Зображення успішно видалено!");
  } catch (error) {
    console.error("Помилка під час видалення зображення:", error);
    throw error; 
  }
};



export const addBannerToStorage = async (file: File): Promise<string> => {
  const path = `banners/${Date.now()}_${file.name}`;

  try {
    const storageRef = ref(storage, path); 

    await uploadBytes(storageRef, file);
    console.log("Фото успішно завантажено!");

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Помилка під час завантаження зображення:", error);
    throw error;
  }
};
export const deleteBannerFromStorage = async (bannerUrl: string): Promise<void> => {
  try {
    const path = decodeURIComponent(bannerUrl.split("/o/")[1].split("?")[0]);

    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
    console.log("Банер успішно видалено!");
  } catch (error) {
    console.error("Помилка під час видалення банера:", error);
    throw error; 
  }
};