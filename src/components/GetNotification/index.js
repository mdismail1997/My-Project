import React from 'react';
import { View, Button } from 'react-native';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

async function onCreateTriggerNotification() {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  const date = new Date(Date.now());

  date.setMinutes(20);
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 20000,

    //  repeatFrequency: RepeatFrequency.WEEKLY,
  };
  console.log('time----', Date.now() + 20000);
  await notifee.createTriggerNotification(
    {
      id: '123',
      title: 'Meeting with Jane',
      body: 'Today at 11:20am',
      android: {
        channelId: channelId,
      },
      sound: 'hollow',
    },
    trigger
  );
}

export { onCreateTriggerNotification };
