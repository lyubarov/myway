import React, { useState } from "react";
import { View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "src/firebase/context/authContext";
import { CustomButton } from "./ui/CustomButton";
import { updateSocialAuthOpenId } from "src/firebase/db";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithGoogleYouTube } from "src/firebase/auth";

GoogleSignin.configure({
  scopes: ["profile", "https://www.googleapis.com/auth/youtube.readonly"], // Необхідні scopes
  webClientId:
    "646053508010-sagihr8eeencqgju3nrrohmailo8uv1f.apps.googleusercontent.com",
  offlineAccess: true, // Для доступу до даних навіть без підключення
});

export const GoogleConnect = () => {
  const { userFromDB, refreshUserData } = useAuth();

  const fetchUserInfo = async (accessToken) => {
    console.log("Access Token:", accessToken); // Перевіряємо, чи є токен

    try {
      // Отримуємо дані користувача з Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      const userInfo = await userInfoResponse.json();
      console.log("User Info:", userInfo);

      // Отримуємо ID користувача Google (це є ID Google акаунта)
      const googleUserId = userInfo.id;
      console.log("Google User ID:", googleUserId);
      await updateSocialAuthOpenId(userFromDB.uid, "youtube", googleUserId);
      await refreshUserData(userFromDB?.uid);

      // Якщо вам потрібен саме ID користувача YouTube:
      // Запит до YouTube API для отримання ID користувача YouTube
      //   const youtubeResponse = await fetch(
      //     `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${userInfo.email}&access_token=${accessToken}`
      //   );
      //   const youtubeData = await youtubeResponse.json();
      //   console.log("YouTube Data:", youtubeData);

      //   // Перевірка, якщо у користувача є канал YouTube
      //   if (youtubeData.items && youtubeData.items[0]) {
      //     const youtubeUserId = youtubeData.items[0].id;
      //     console.log("YouTube User ID:", youtubeUserId);

      //     // Зберігаємо YouTube ID в Firestore
      //     await updateSocialAuthOpenId(userFromDB.uid, "youtube", youtubeUserId);
      //   } else {
      //     console.log("Користувач не має каналу YouTube або канал недоступний");
      //   }
    } catch (error) {
      console.error("Error fetching user data:", error); // Лог помилок
    }
  };

  const handleLogin = async () => {
    const accessToken = await signInWithGoogleYouTube();

    try {
      await fetchUserInfo(accessToken);
    } catch (error) {
      console.log("Google Sign-In Error", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!userFromDB?.socialAuthOpenId?.["youtube"] && (
        <LinearGradient
          colors={["#25C3B4", "#00A696"]}
          className="py-3 rounded-full w-full font-bold"
        >
          <CustomButton
            title="ПРИВ'ЯЗАТИ YOUTUBE"
            style="w-full font-bold"
            onPress={handleLogin} // Авторизація через Google
            textColor={"text-white"}
          />
        </LinearGradient>
      )}
    </View>
  );
};

// import React, { useState, useEffect } from "react";
// import { View } from "react-native";
// import * as Google from "expo-auth-session/providers/google";
// import { useAuth } from "src/firebase/context/authContext";
// import { CustomButton } from "./ui/CustomButton";
// import { updateSocialAuthOpenId } from "src/firebase/db";
// import { LinearGradient } from "expo-linear-gradient";
// import * as WebBrowser from "expo-web-browser";

// export const GoogleConnect = () => {
//   const { userFromDB } = useAuth();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const androidClientId =
//     "646053508010-fq0bn0d1th43g61summ2j7dbo40mqn79.apps.googleusercontent.com";
//   const iosClientId =
//     "646053508010-3bo6grhgk13i88p64bd69quqvm24qggh.apps.googleusercontent.com";
//   const webClientId =
//     "646053508010-sagihr8eeencqgju3nrrohmailo8uv1f.apps.googleusercontent.com";
//   const redirect_uri = "https://myway767.page.link/qh74";
//   const config = {
//     webClientId,
//     androidClientId,
//     iosClientId,
//     redirect_uri,
//   };
//   // Set up Google Auth request
//   const [request, response, promptAsync] = Google.useAuthRequest(config);

//   const handleToken = () => {
//     if (response?.type === "success") {
//       const { authentication } = response;
//       const token = authentication?.accessToken;
//       console.log("access_token", token);
//     }
//   };
//   useEffect(() => {
//     handleToken();
//   }, [response]);
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       {!userFromDB?.socialAuthOpenId?.["youtube"] && (
//         <LinearGradient
//           colors={["#25C3B4", "#00A696"]}
//           className="py-3 rounded-full w-full font-bold"
//         >
//           <CustomButton
//             title="ПРИВ'ЯЗАТИ YOUTUBE"
//             style="w-full font-bold"
//             onPress={() => promptAsync()}
//             textColor={"text-white"}
//           />
//         </LinearGradient>
//       )}
//     </View>
//   );
// };
