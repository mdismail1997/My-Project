import notifee from '@notifee/react-native';

export const channelId = notifee.createChannel({
  id: 'fallback',
  name: 'fallback Channel',
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
  data?: Record<string, string>;
}) => {
  await notifee.displayNotification({
    title,
    subtitle,
    body,
    android: {
      channelId: await channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    },
    data,
  });
};
