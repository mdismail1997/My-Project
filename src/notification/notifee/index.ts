import notifee, { AndroidImportance } from '@notifee/react-native';
import NotificationSounds, {
  playSampleSound,
} from 'react-native-notification-sounds';
//const soundsList = await NotificationSounds.getNotifications('notification');

export const channelId = notifee.createChannel({
  id: 'fallback',
  name: 'fallback Channel',
  //importance: AndroidImportance.HIGH,
  sound: 'default',
  // soundURI: 'hollow',
});

export const sendLocalNotification = async ({
  title,
  body,
  subtitle,
  data,
}: {
  title?: string;
  body?: string;
  subtitle?: string;
  //sound?: string;
  data?: Record<string, string>;
}) => {
  // await notifee.requestPermission({
  //   //...,
  //   criticalAlert: true,
  // });
  // await notifee.requestPermission({
  //   sound: true,
  //   announcement: true,
  //   // ... other permission settings
  // });
  await notifee.displayNotification({
    title,
    subtitle,
    body,
    android: {
      //  loopSound: true,
      channelId: await channelId,
      sound: 'default',
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    },
    data,
  });
};
