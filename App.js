// App.js

import React, { useEffect,useState,useRef } from 'react';
import Navigation from './navigation/Navigation';
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true, 
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    try {
      // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
    } catch (error) {
      
    }
   

    (async()=>scheduleDailyNotifications())();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [ ])
  


  return <Navigation />;
};

 

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }

async function scheduleDailyNotifications(){
  // Schedule the notification at 11 am
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning!",
      body: 'It\'s time to check your app.',
      data: { data: 'goes here' },
    },
    trigger: { seconds:1000, repeats: false },
  });

  // Schedule the notification at 6:30 pm
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Evening!",
      body: 'Don\'t forget to use your app in the evening.',
      data: { data: 'goes here' },
    },
    trigger: { hour: 12, minute: 43, repeats: true },
  });
};