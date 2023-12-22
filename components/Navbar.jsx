import React from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import profileImg from "../assets/profile.svg";
import { Image } from "expo-image";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    navbar: {
      backgroundColor: "#4AB3FF",
      height: insets.top + "50",
      // marginTop:insets.top,
      width: "100%",
      flex: 0.15,
      flexDirection: "row",
      padding: 10,
      color: "white",
      textDecorationColor: "white",
    },
    leftBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    rightBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    logoImage: {
      width: 33,
      height: 33,
      padding: 20,
    },
    logoText: {},
    imgContainer: {
      padding: 10,
    },
    logoContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    heading: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.navbar}>
      <StatusBar backgroundColor="#4AB3FF" barStyle="light-content" />
      <View style={styles.leftBar}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage} />
          <Text style={styles.heading}>MenuMap</Text>
        </View>
      </View>
      <View style={styles.rightBar}>
        <View style={styles.imgContainer}>
          <Image source={profileImg} style={styles.logoImage} />
        </View>
      </View>
    </View>
  );
}
