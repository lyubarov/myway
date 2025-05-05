import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "src/firebase/context/authContext";
import { updateSocialAuthOpenId } from "src/firebase/db";
import { CustomButton } from "./ui/CustomButton";
import * as Facebook from "expo-auth-session/providers/facebook";
import { LinearGradient } from "expo-linear-gradient";

WebBrowser.maybeCompleteAuthSession();
export const FacebookConnect = () => {
  const { userFromDB } = useAuth();
  const [user, setUser] = useState(null);
  console.log(user);

  // Використовуємо Facebook auth session через expo-auth-session
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "2226248151106494", // Ваш clientId для Facebook
    redirectUri: "https://myway767.page.link/", // Ваше редірект URL
    scopes: ["public_profile", "email"], // Дозволи для отримання даних
  });
  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.authentication?.accessToken}&fields=id,name`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      };
    }
  }, [response]);
  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== "success") {
      alert("Упс... Щось пішло не так!");
      return;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!userFromDB?.socialAuthOpenId?.["facebook"] && (
        <LinearGradient
          colors={["#25C3B4", "#00A696"]}
          className="py-3 rounded-full w-full font-bold"
        >
          <CustomButton
            title="ПРИВ'ЯЗАТИ FACEBOOK"
            style="w-full font-bold"
            onPress={handlePressAsync}
            textColor={"text-white"}
          />
        </LinearGradient>
      )}
    </View>
  );
};
