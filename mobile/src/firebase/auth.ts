import auth from "@react-native-firebase/auth"
import { addUserToFirestore, findUserByPhone, getUserFromFirestore } from "./db";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { doc, setDoc} from "firebase/firestore"; 
import { db,functions } from "@utils/firebase";
// import * as AppleAuthentication from 'expo-apple-authentication';
// import AppleAuthentication from 'react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Alert } from "react-native";
import { httpsCallable } from "firebase/functions";


// react-native-apple-authentication


export const signUp = async (data: {
  email: string;
  password: string;
  displayName: string;
  number: string;
  dateOfBirthday: { day: string; month: string; year: string };
}): Promise<any> => {
  try {
    const response = await auth().createUserWithEmailAndPassword(data.email, data.password);
    const user = response.user;

    await user.updateProfile({ displayName: data.displayName });
    await user.reload();

    console.log("✅ Користувач створений:", user);

    const userData = {
      uid: user.uid,
      displayName: data.displayName,
      email: data.email,
      number: data.number,
      dateOfBirthday: data.dateOfBirthday,
    };

    await addUserToFirestore(userData);
    console.log("✅ Користувача додано в Firestore");

    return user; 
  } catch (error: any) {
    console.error("❌ Помилка під час реєстрації:", error.message);
    throw error;
  }
};
export const confirmAndLinkPhone = async (confirmation: any, code: string, registrationData: any) => {
  try {
    const phoneCredential = auth.PhoneAuthProvider.credential(
      confirmation.verificationId,
      code
    );

    console.log("🔄 Виконується реєстрація користувача...");
    const user = await signUp(registrationData);

    console.log("🔄 Прив’язка номера до акаунта...");
    await user.linkWithCredential(phoneCredential);
    await user.reload();

    console.log("✅ Номер телефону прив’язано до акаунта:");

    return user;
  } catch (error: any) {
    console.error("❌ Помилка підтвердження OTP:", error.message);
    throw error;
  }
};


const checkIfPhoneExists = async (phoneNumber: string) => {
  try {
    
     const result = await httpsCallable(functions, 'checkPhoneNumberExists');
    
    // Отримуємо відповідь від функції
    const response = await result({
      phoneNumber
    });
    
    if (response.data.exists) {
      console.log("✔️ Користувач існує");
      return response.data.exists;
    } else {
      console.log("❌ Користувач не знайдений");
      return response.data.exists;
    }
  } catch (error) {
    console.error("❌ Сталася помилка при перевірці номера телефону:", error.message);
  }
};

export const signIn = async (emailOrPhone: string, password?: string) => {
  console.log("📩 Отримано email або телефон:", emailOrPhone);
  
  try {
    let user;

    if (emailOrPhone.includes("@")) {
      if (!password) {
        throw new Error("❌ Пароль обов’язковий для входу через email.");
      }

      console.log("🔄 Вхід через Email...");
      const response = await auth().signInWithEmailAndPassword(emailOrPhone, password);
      user = response.user;
      console.log("✅ Вхід успішний:", user);
    return user;
    } else {
      
      const isAcc = await checkIfPhoneExists(emailOrPhone)
      if (isAcc) {
        console.log("🔄 Відправка OTP...");
         Alert.alert(`📩 Код відправлено на ${emailOrPhone}!`);

        const confirmation = await auth().signInWithPhoneNumber(emailOrPhone);
        return confirmation;
      } else {
        Alert.alert("Профіль не знайдено. Будь ласка, зареєструйтесь, щоб продовжити.")
        return;
      }
    }
  } catch (error: any) {
    console.error("❌ Помилка входу:", error.message);
    throw error;
  }
};
export const resetPassword = async (email: string): Promise<void> => {
  try {
    console.log("📩 Надсилання запиту на відновлення паролю для:", email);
    
    await auth().sendPasswordResetEmail(email);
    
    console.log("✅ Лист із відновленням паролю надіслано!");
  } catch (error: any) {
    console.error("❌ Помилка при відновленні паролю:", error.message);
    throw error;
  }
};
export const confirmOTP = async (confirmation: any, code: string,number:string) => {
  try {
 const userExist = await findUserByPhone(number);
    if (!userExist) {
      console.log("❌ Користувача не знайдено у Firestore. Вхід заборонено.");
      return null;
    }
    const userCredential = await confirmation.confirm(code);

    console.log("✅ Вхід успішний! Користувач:", userCredential.user);

    return userCredential.user; 
  } catch (error) {
    console.error("❌ Помилка підтвердження OTP:", error);
    throw error;
  }
};



export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut()
    await auth().signOut(); 
  } catch (error: any) {
    console.error("Error during sign out:", error.message);
  }
};


export const signInWithGoogle = async () => {
  try {
    
     console.log("🚀 Перевірка Play Services...");
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    console.log("🔑 Авторизація через Google...");
    
    const data = await GoogleSignin.signIn({ forceConsentPrompt: true });
    console.log("✅ Google Sign-In дані:", data);

    const idToken = data.data?.idToken
    

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const response = await auth().signInWithCredential(googleCredential);
    const user = response.user._user;

    const userInBD = await getUserFromFirestore(user.uid)
    if (!userInBD) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        number: user.phoneNumber || null,
        photoUrl: user.photoURL,
      };

      await addUserToFirestore(userData);
    }
    return user;
  } catch (error: any) {
    console.log("error ====>>", error);
    
    console.error("Помилка під час входу через Google:", error.message);
  }
};

export const signInWithGoogleYouTube = async () => {
  try {
    console.log("🚀 Перевірка Play Services...");
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    console.log("🔑 Авторизація через Google...");
    
    // Оновлення запиту на авторизацію
    const data = await GoogleSignin.signIn();
    console.log("✅ Google Sign-In дані:", data);

    // Отримання access token
    const { accessToken } = await GoogleSignin.getTokens();
    console.log("Google Access Token:", accessToken);

    // Повертаємо лише access token
    return accessToken;
  } catch (error: any) {
    console.error("Помилка під час входу через Google:", error.message);
    throw error;
  }
};




// export const signInWithApple = async () => {

//   try {
//         console.log("first===>>>");

//    const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
//       requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
//     });

//         console.log("appleAuthRequestResponse===>>>");

//     if (!appleAuthRequestResponse.identityToken) {
//       throw new Error("Apple Sign-In failed - No identity token returned.");
//     }
//     console.log("appleAuthRequestResponse===>>>",appleAuthRequestResponse);

//     const { identityToken, nonce } = appleAuthRequestResponse;
//     const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

//     const response = await auth().signInWithCredential(appleCredential);
//     const user = response.user;
//     console.log("userApple",user);
    

//     console.log("Успішний вхід через Apple:", user);

//     const userInDB = await getUserFromFirestore(user.uid);
//     if (!userInDB) {
//       const userData = {
//         uid: user.uid,
//         displayName: user.displayName || appleAuthRequestResponse.fullName?.givenName,
//         email: user.email || "",
//         number: user.phoneNumber || null,
//         photoUrl: user.photoURL || "", 
//       };

//       await addUserToFirestore(userData);
//       console.log("✅ Користувача додано в Firestore");
//     } else {
//       console.log("ℹ️ Користувач вже існує у Firestore, оновлення не потрібне.");
//     }

//     return user;
//   } catch (error: any) {
//     console.error("Помилка під час входу через Apple:", error.message);
//   }
// };


export const signInWithApple = async () => {
  try {
    // const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
    //   requestedScopes: [
    //     AppleAuthentication.AppleAuthenticationScope.EMAIL,
    //     AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //   ],
    // });
    const appleAuthRequestResponse = await appleAuth.performRequest({
  requestedOperation: appleAuth.Operation.LOGIN,
  requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
console.log(credentialState);


    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In failed - No identity token returned.");
    }

    const { identityToken, nonce, email, fullName } = appleAuthRequestResponse;

    if (!email || !fullName) {
      console.warn("Email або Full Name не були повернуті з Apple Sign-In.");
    }

    // Створюємо Apple AuthCredential
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Входимо через Firebase з AppleCredential
    const response = await auth().signInWithCredential(appleCredential);
    const user = response.user;

    console.log("userApple", user);

    // Перевіряємо, чи є користувач у Firestore
    const userInDB = await getUserFromFirestore(user.uid);
    if (!userInDB) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName || fullName?.givenName,
        email: email || "",
        number: user.phoneNumber || null,
        photoUrl: user.photoURL || "", 
      };

      // Додаємо користувача до Firestore
      await addUserToFirestore(userData);
      console.log("✅ Користувача додано в Firestore");
    } else {
      console.log("ℹ️ Користувач вже існує у Firestore, оновлення не потрібне.");
    }

    return user;
  } catch (error: any) {
    console.error("Помилка під час входу через Apple:", error.message);
  }
};




export const signInWithPhoneNumber = async (phoneNumber: string) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log("📲 Код надіслано, підтвердження збережено:", confirmation);
    return confirmation; 
  } catch (error) {
    console.error("❌ Помилка відправки коду:", error);
    throw error;
  }
};



export const confirmPhoneLink = async (confirmation: any, code: string): Promise<any> => {
  try {
    const phoneCredential = auth.PhoneAuthProvider.credential(
      confirmation.verificationId,
      code
    );

    const user = auth().currentUser;

    if (!user) {
      throw new Error("❌ Користувач не знайдений!");
    }

    await user.linkWithCredential(phoneCredential);
    await user.reload();
    const updatedUser = auth().currentUser;

    if (!updatedUser || !updatedUser.phoneNumber) {
      throw new Error("❌ Не вдалося оновити номер телефону.");
    }

    const userRef = doc(db, "users", updatedUser.uid);
    await setDoc(userRef, { phoneNumber: updatedUser.phoneNumber }, { merge: true });

    console.log("✅ Номер телефону прив’язано!", updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error("❌ Помилка підтвердження OTP:", error.message);
    throw error;
  }
};



