import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import { CustomButton } from "./ui/CustomButton";
import { useAuth } from "src/firebase/context/authContext";

WebBrowser.maybeCompleteAuthSession();

const clientId = "aw03rti4q73lmwga"; // TikTok Client Key
const redirectUri = AuthSession.makeRedirectUri({
  native: "yourapp://redirect", // for bare workflow
  useProxy: true, // true for Expo Go
});

const discovery = {
  authorizationEndpoint: "https://www.tiktok.com/v2/auth/authorize/",
  tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/",
};

export const TikTokConnect = () => {
  const { userFromDB } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["user.info.basic"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        state: "state",
        client_key: clientId,
      },
    },
    discovery
  );

  useEffect(() => {
    const fetchTikTokUserInfo = async () => {
      if (response?.type === "success" && response.params?.code) {
        try {
          // 1. Exchange auth code for access token
          const tokenRes = await fetch(discovery.tokenEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_key: clientId,
              client_secret: "YOUR_CLIENT_SECRET", // 🔐 Replace securely
              code: response.params.code,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }).toString(),
          });

          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          if (!accessToken) {
            Alert.alert("Помилка", "Не вдалося отримати access token");
            return;
          }

          // 2. Fetch user info
          const userInfoRes = await fetch(
            "https://open.tiktokapis.com/v2/user/info/",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const userInfo = await userInfoRes.json();
          const id = userInfo.data?.user?.open_id;
          setUserId(id);
        } catch (error) {
          console.error("TikTok fetch error:", error);
        }
      }
    };

    fetchTikTokUserInfo();
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!userFromDB?.socialAuthOpenId?.["tiktok"] && (
        <LinearGradient
          colors={["#25C3B4", "#00A696"]}
          className="py-3 rounded-full w-full font-bold"
        >
          <CustomButton
            title="ПРИВ'ЯЗАТИ TikTok"
            style="w-full font-bold"
            onPress={() => promptAsync()}
            textColor={"text-white"}
          />
        </LinearGradient>
      )}
    </View>
  );
};
