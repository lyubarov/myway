import React, { useRef, useState } from "react";
import { Button, View } from "react-native";
import { WebView } from "react-native-webview";
// import { useAuth } from "src/firebase/context/authContext";
// import { updateSocialAuthOpenId } from "src/firebase/db";

export const WebViewScreen = ({ route, navigation }) => {
  const { url } = route.params;
  // const { userFromDB } = useAuth();
  // const webviewRef = useRef<WebView | null>(null);

  // const socialMediaPlatforms = ["facebook", "instagram", "tiktok", "youtube"];

  // let socialMedia: string | null = null;

  // const handleRedirect = async (event) => {
  //   const currentUrl = event.url;
  //   socialMediaPlatforms.forEach((platform) => {
  //     if (currentUrl.includes(platform)) {
  //       socialMedia = platform;
  //     }
  //   });
  //   console.log("currentUrl", currentUrl);

  //   // if (socialMedia && !userFromDB.socialAuthOpenId[socialMedia]) {
  //   //   console.log("dskfmdsklfmkdsl");

  //   const match = currentUrl.match(/[?&]id=([0-9]+)/);

  //   // if (match && match[1] !== "61570530044759") {
  //   //   const userId = match[1];

  //   //   switch (socialMedia) {
  //   //     case "facebook":
  //   //       console.log("userId", userId);

  //   //       if (
  //   //         (!userFromDB.socialAuthOpenId ||
  //   //           !userFromDB.socialAuthOpenId["facebook"]) &&
  //   //         userId
  //   //       ) {
  //   //         await updateSocialAuthOpenId(userFromDB.uid, "facebook", userId);
  //   //       }
  //   //       console.log("User ID:", userId);
  //   //       if (userId && webviewRef.current) {
  //   //         webviewRef.current.injectJavaScript(`
  //   //       window.location = 'https://www.facebook.com/profile.php?id=61570530044759&locale=uk_UA';
  //   //     `);
  //   //       }
  //   //       return;
  //   //     case "instagram":
  //   //       if (!userFromDB.socialAuthOpenId["instagram"] && userId) {
  //   //         await updateSocialAuthOpenId(userFromDB.uid, "instagram", userId);
  //   //       }
  //   //       return;
  //   //     case "tiktok":
  //   //       if (!userFromDB.socialAuthOpenId["tiktok"] && userId) {
  //   //         await updateSocialAuthOpenId(userFromDB.uid, "tiktok", userId);
  //   //       }
  //   //       return;
  //   //     case "youtube":
  //   //       if (!userFromDB.socialAuthOpenId["youtube"] && userId) {
  //   //         await updateSocialAuthOpenId(userFromDB.uid, "youtube", userId);
  //   //       }
  //   //       return;
  //   //     default:
  //   //       console.log("Не знайдено підтримувану соціальну мережу");
  //   //       return;
  //   //   }
  //   // } else {
  //   // }
  //   // } else {
  //   //   console.log("Redirecting to user profile:");
  //   //   const redirectUrl =
  //   //     "https://www.facebook.com/profile.php?id=61570530044759&locale=uk_UA";
  //   //   if (webviewRef.current) {
  //   //     webviewRef.current.injectJavaScript(`
  //   //     window.location = '${redirectUrl}';
  //   //   `);
  //   //   }
  //   // }
  // };

  return (
    <View className="flex-1">
      <Button
        title={"Повернутися"}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <WebView
        // ref={webviewRef}
        source={{ uri: url }}
        startInLoadingState={true}
      />
    </View>
  );
};
