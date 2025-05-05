import React, { useState, useRef } from "react";
import { View } from "react-native";
import InstagramLogin from "react-native-instagram-login";
import { useAuth } from "src/firebase/context/authContext";
import { updateSocialAuthOpenId } from "src/firebase/db";
import { CustomButton } from "./ui/CustomButton";
import { LinearGradient } from "expo-linear-gradient";

export const InstagramConnect = () => {
  const insRef = useRef<InstagramLogin>(null);
  const { userFromDB, refreshUserData } = useAuth();
  const [token, setToken] = useState<{ user_id: string } | null>(null);

  const handleLoginSuccess = async (token: { user_id: string }) => {
    setToken(token);
    console.log("Login successful, token:", token);
    await updateSocialAuthOpenId(userFromDB.uid, "instagram", token.user_id);
    await refreshUserData(userFromDB?.uid);
  };

  const handleLoginFailure = (data: { error: string }) => {
    console.log("Login failed:", data);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!userFromDB?.socialAuthOpenId?.["instagram"] && (
        <LinearGradient
          colors={["#25C3B4", "#00A696"]}
          className="py-3 rounded-full w-full font-bold"
        >
          <CustomButton
            title="ПРИВ'ЯЗАТИ INSTAGRAM"
            style=" w-full font-bold"
            onPress={() => insRef.current.show()}
            textColor={"text-white"}
          />
        </LinearGradient>
      )}
      <InstagramLogin
        ref={insRef}
        appId="624357770427277"
        appSecret="ee2858571c0478e1e6f81def0b9a2db5"
        redirectUrl="https://myway767.page.link/"
        scopes={[
          "instagram_business_basic",
          "instagram_business_content_publish",
          "instagram_business_manage_messages",
          "instagram_business_manage_comments",
        ]}
        onLoginSuccess={handleLoginSuccess}
        onLoginFailure={handleLoginFailure}
      />
    </View>
  );
};
