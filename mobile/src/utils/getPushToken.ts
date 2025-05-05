import '@react-native-firebase/app';
import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getAPNSToken,
  getMessaging,
  getToken,
  hasPermission,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export async function getPushToken() {
  try {
    const messaging = getMessaging(getApp());

    await registerDeviceForRemoteMessages(messaging);
    const permissionGranted = await checkNotificationPermission();

    if (!permissionGranted) {
      console.log('Notifications permission denied. No token generated.');
      return null;
    }

    if (Platform.OS === 'ios') {
      const apnsToken = await getAPNSToken(messaging);
      if (!apnsToken) {
        return null;
      }
    }

    const fcmToken = await getToken(messaging);
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export const checkNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    const hasPermission = await PermissionsAndroid.check(
      'android.permission.POST_NOTIFICATIONS',
    );

    if (!hasPermission) {
      const result = await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS',
        {
          title: 'Notification Permission',
          message: 'App needs access to your notifications to send updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  } else {
    const messaging = getMessaging(getApp());

    const authStatus = await hasPermission(messaging);

    if (authStatus === AuthorizationStatus.AUTHORIZED) {
      return true;
    }

    const requestStatus = await requestPermission(messaging);

    return requestStatus === AuthorizationStatus.AUTHORIZED;
  }
};