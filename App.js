// App.js

import React, { useEffect, useState, useRef } from "react";
import Toast from 'react-native-toast-message';
import Navigation from "./navigation/Navigation";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    try {
      // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    } catch (error) {}

    (async () => scheduleDailyNotifications())();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return(
    <>
    <Navigation />
     <Toast />
    </>
    );
}

async function scheduleDailyNotifications() {
  // Schedule the notification at 11 am
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning!",
      body: "It's time to update your menu..!",
    },
    trigger: { hour: 11, minute: 0, repeats: true },
  });

  // Schedule the notification at 6:30 pm
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Evening!",
      body: "Don't forget to update the menu..!",
    },
    trigger: { hour: 18, minute: 30, repeats: true },
  });
}
