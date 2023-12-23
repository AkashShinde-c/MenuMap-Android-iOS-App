import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons"; // Example: using FontAwesome icons
import * as ImagePicker from "expo-image-picker";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Navbar from "../components/Navbar";
import danger from "../assets/danger.svg";
import ok from "../assets/ok.svg";
// import scheduleNotification from "../utils/Notification";

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState("");
  const camera = useRef();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [is_menu_updated, setIs_menu_updated] = useState(false);

  const uploadImage = async (url) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.2,
        base64: true,
        exif: true,
      });
      if (!result.canceled) {
        const file = await fetch(result.assets[0].uri);

        // const imgSrc = URL.createObjectURL(blobData._data);
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);

        const response = await axios.put(url, result.assets[0].base64);
        //   console.log(response)
        Alert.alert("Image uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Something went wrong");
      console.log(error);
    }
  };

  const generateUploadUrl = async () => {
    try {
      const headers = {
        Authorization: await AsyncStorage.getItem("token"),
      };
      const response = await api.get("/get-upload-url", { headers });

      const uploadUrl = response.data.url;

      uploadImage(uploadUrl);
    } catch (error) {
      Alert.alert("Error", "error");
      console.log(error);
    }
  };

  /**Logout */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  /***UseEffect */
  useEffect(() => {
    /**Get camrea permission */
    (async () => {
      await requestPermission();
      // scheduleNotification();
    })();
    /**Get  token*/
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("Login");
      }
      const options = {
        headers: { Authorization: token },
      };
      try {
        const response = await api.get("/get-download-url", options);
        const downloadResponse = await axios.get(response.data.url);
        setImage(`data:image/jpeg;base64,${downloadResponse.data}`);
        setIs_menu_updated(response.data.is_menu_updated);
      } catch (error) {
        // Handle errors here
        Alert.alert(error.message)
      }
    })();

  }, []);
  return (
    <View style={styles.container}>
      <Navbar></Navbar>
      <View style={styles.topHalf}>
        <View style={styles.heading}>
          <Text style={styles.title}>Athavan</Text>
        </View>
        {is_menu_updated ? (
          <View style={styles.ok}>
            <Image source={ok} style={styles.mainImage} />
            <Text style={styles.subtitle2}>Menu updated. All set..!</Text>
          </View>
        ) : (
          <View style={styles.warning}>
            <Image source={danger} style={styles.mainImage} />
            <Text style={styles.subtitle}>Today's menu not updated</Text>
          </View>
        )}
        <View style={styles.mainImageContainer}>
          {is_menu_updated && image ? (
            <View style={styles.imageLoaded}>
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            </View>
          ) : (
            <View style={styles.imageNotLoaded}>
              <Image source={danger} style={styles.dangerImg} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <TouchableOpacity style={styles.button} onPress={generateUploadUrl}>
          <FontAwesome name="upload" size={24} color="white" />
          <Text style={styles.buttonText}>Upload Menu Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="keyboard-o" size={24} color="white" />
          <Text style={styles.buttonText}>Type Menu</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="white"/>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topHalf: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
    paddingTop: 10,
    gap: 10,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#F32121",
    textAlign: "center",
  },
  subtitle2: {
    fontSize: 16,
    color: "#2EA147",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4AB3FF",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
  },
  heading: {
    paddingTop: 10,
  },
  mainImage: {
    width: 30,
    height: 30,
  },
  warning: {
    backgroundColor: "#FFE3E3",
    flexDirection: "row",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  ok: {
    backgroundColor: "#E0FFE7",
    flexDirection: "row",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  mainImageContainer: {
    backgroundColor: "#DBDBDB",
    flex: 1,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
  },
  imageNotLoaded: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderColor: "#F32121",
    borderRadius: 10,
    borderWidth: 3,
  },
  imageLoaded: {
    borderColor: "#4AB3FF",
    borderRadius: 10,
    borderWidth: 3,
  },
  dangerImg: {
    height: "80%",
    width: "80%",
  },
});
