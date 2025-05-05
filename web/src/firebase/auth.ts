import { auth,db,auth2 } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User as FirebaseUser, updatePassword, getAuth } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";


export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  role: string = "admin"
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName,
    });

    await setDoc(doc(db, "usersAdmin", user.uid), {
      email,
      displayName,
      role,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const signUpWithRole = async (
  email: string,
  password: string,
  displayName: string,
  role: string = "admin"
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth2, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName,
    });

    await setDoc(doc(db, "usersAdmin", user.uid), {
      uid: user.uid,
      email,
      displayName,
      role,
      createdAt: new Date(),
    });

    await firebaseSignOut(auth2);

  } catch (error) {
    console.error("Error during registration:", error);
    throw error; 
  }
};

export const signIn = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Отримуємо дані користувача з Firestore
    const userDocRef = doc(db, "usersAdmin", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      throw new Error("User data not found in Firestore.");
    }

    const userData = userSnapshot.data();

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: userData.role,
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth); 
  } catch (error) {
    console.error("Error during sign out:");
    throw error;
  }
};
export const updatePasswordFunc = async (newPassword: string) => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
      console.log("Пароль успішно оновлено");
    } else {
      console.error("Користувач не знайдений");
    }
  } catch (error) {
    console.error("Помилка при оновленні пароля", error);
  }
};



