import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
  OnboardingOne: undefined;
  OnboardingTwo: { screen: string };
  OnboardingThree: { screen: string };
  Authorization: { screen: string };
  EntryScreen: { screen: string };
  MainContent: { 
    screen: string;
    params?: {
      product?: any;
      notification?: {
        id: string;
        title: string;
        content: string;
        type: "achievement" | "info" | "motivation" | "warning" | "recommendation";
        isRead: boolean;
        createdAt: Timestamp;
      };
      totalAmount?: number;
      userInfo?: {
        firstName: string;
        lastName: string;
        number: string;
        [key: string]: any;
      };
      address?: any[];
    };
  };
  LiqPayWebView: { amount: number; orderId: string; description: string };
  WebViewScreen: { url: string }; 
};
