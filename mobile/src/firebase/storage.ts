import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@utils/firebase";

export const uploadUserPhoto = async (uid: string): Promise<string | null> => {
  try {
    // Запит дозволу на доступ до галереї
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.warn("Дозвіл на доступ до галереї відхилено");
      return null;
    }

    // Вибір зображення
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      console.log("Користувач скасував вибір фото");
      return null;
    }

    const imageUri = result.assets?.[0]?.uri;
    if (!imageUri) {
      console.error("Помилка: зображення не вибрано");
      return null;
    }

    const fileName = `users/${uid}/profile_${Date.now()}.jpg`;
    const reference = storage().ref(fileName);

    await reference.putFile(imageUri);
    const photoUrl = await reference.getDownloadURL();

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { photoUrl });

    await auth().currentUser?.updateProfile({ photoURL: photoUrl });

    console.log("Фото успішно завантажено:", photoUrl);
    return photoUrl;
  } catch (error) {
    console.error("Помилка під час завантаження фото:", error);
    return null;
  }
};
