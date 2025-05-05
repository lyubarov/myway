import { useEffect, useRef, useState } from "react";
import crypto from "react-native-quick-crypto";
import { WebView } from "react-native-webview";
import { ActivityIndicator, Button, View } from "react-native";
import { Buffer } from "buffer";

const LIQPAY_PUBLIC_KEY = "sandbox_i93249032337";
const LIQPAY_PRIVATE_KEY = "sandbox_FuiCWsCicf0hjntqYMIsZVb0XxSofOcTeeU1ZhqM";

export const generateLiqPayData = (
  amount: number,
  orderId: string,
  description: string
) => {
  const paymentData = {
    version: 3,
    public_key: LIQPAY_PUBLIC_KEY,
    action: "pay",
    amount: amount,
    currency: "UAH",
    description: description,
    order_id: orderId,
    result_url: "myway://payment-success",
    server_url:
      "https://us-central1-myway-71fc9.cloudfunctions.net/liqpayWebhook",
    sandbox: 1,
  };

  const jsonData = Buffer.from(JSON.stringify(paymentData)).toString("base64");

  const signature = crypto
    .createHash("sha1")
    .update(LIQPAY_PRIVATE_KEY + jsonData + LIQPAY_PRIVATE_KEY)
    .digest("base64");

  return `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(
    jsonData
  )}&signature=${encodeURIComponent(signature)}&language=uk`;
};

const LiqPayWebView = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const webViewRef = useRef(null);
  const {
    myCash,
    amount,
    totalSum,
    userData,
    orderId,
    description,
    cityRef,
    branchRef,
  } = route.params;
  console.log("cityRef", cityRef);
  console.log("branchRef", branchRef);
  const liqpayUrl = generateLiqPayData(amount, orderId, description);
  const [status, setStatus] = useState("");

  // const handleContinue = () => {
  //   if (status === "success") {
  //     navigation.navigate("MainContent", {
  //       screen: "PlacingOrderFinalScreen",
  //       params: {
  //         myCash,
  //         totalAmount: amount,
  //         data: userData,
  //         cityRef,
  //         branchRef,
  //       },
  //     });
  //   } else {
  //     navigation.goBack();
  //   }
  // };
  useEffect(() => {
    if (status === "success") {
      navigation.navigate("MainContent", {
        screen: "PlacingOrderFinalScreen",
        params: {
          myCash,
          totalAmount: amount,
          totalSum,
          data: userData,
          cityRef,
          branchRef,
        },
      });
    } else if (status === "failure") {
      navigation.goBack();
    }
  }, [status]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: liqpayUrl }}
        startInLoadingState
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={`
  (function() {
    let hasSentMessage = false; // Флаг для відстеження відправки
    let intervalId = null; // Змінна для збереження ID інтервалу

    function checkPaymentStatus() {
      if (hasSentMessage) return; // Якщо повідомлення вже відправлено, виходимо

      const pageText = document.body.innerText.toLowerCase();
      const currentUrl = window.location.href.toLowerCase();
      
      if (
        pageText.includes("the payment is successfully") ||
        pageText.includes("платіж успішний") ||
        pageText.includes("оплата успішна") ||
        currentUrl.includes("myway://payment-success") ||
        currentUrl.includes("/success/")
      ) {
        window.ReactNativeWebView.postMessage("success");
        hasSentMessage = true; // Встановлюємо флаг
        clearInterval(intervalId); // Зупиняємо інтервал
      } else if (
        pageText.includes("оплата не пройшла") ||
        pageText.includes("помилка оплати") ||
        pageText.includes("платіж скасовано") ||
        pageText.includes("відмова в оплаті") ||
        pageText.includes("payment has failed") ||
        pageText.includes("error") ||
        currentUrl.includes("myway://payment-failure")
      ) {
        window.ReactNativeWebView.postMessage("failure");
        hasSentMessage = true; // Встановлюємо флаг
        clearInterval(intervalId); // Зупиняємо інтервал
      }
    }

    checkPaymentStatus(); // Перевіряємо одразу при завантаженні
    document.addEventListener("DOMContentLoaded", checkPaymentStatus);
    intervalId = setInterval(checkPaymentStatus, 500); // Зберігаємо ID інтервалу
  })();
`}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;
          console.log("🚀 Should Start Load URL:", url);
          if (url.includes("myway://payment-success")) {
            setStatus("success");
            return false;
          } else if (url.includes("myway://payment-failure")) {
            setStatus("failure");
            return false;
          }
          return true;
        }}
        onMessage={(event) => {
          const message = event.nativeEvent.data;
          console.log("📩 Отримано повідомлення:", message);
          if (typeof message === "string" && status === "") {
            // Обробляємо, тільки якщо статус ще не встановлено
            const lowerMessage = message.toLowerCase();
            if (
              lowerMessage === "success" ||
              lowerMessage.includes("платіж успішний") ||
              lowerMessage.includes("оплата успішна") ||
              lowerMessage.includes("the payment is successfully")
            ) {
              setStatus("success");
            } else if (
              lowerMessage === "failure" ||
              lowerMessage.includes("помилка оплати") ||
              lowerMessage.includes("оплата не пройшла") ||
              lowerMessage.includes("платіж скасовано") ||
              lowerMessage.includes("payment has failed") ||
              lowerMessage.includes("error")
            ) {
              setStatus("failure");
            }
          }
        }}
        onNavigationStateChange={(navState) => {
          const { url } = navState;
          console.log("🌐 Nav State URL:", url);
          if (url.includes("myway://payment-success")) {
            setStatus("success");
          } else if (url.includes("myway://payment-failure")) {
            setStatus("failure");
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error:", nativeEvent);
          setStatus("failure");
        }}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
      />
      <Button
        title={"Повернутися"}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default LiqPayWebView;
