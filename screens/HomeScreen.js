import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Example: using FontAwesome icons
import * as ImagePicker from "expo-image-picker";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCameraPermissions } from "expo-image-picker";

export default function HomeScreen({navigation}) {
  const [image, setImage] = useState("");
  const camera = useRef();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

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
  const handleLogout = async()=>{
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  }

  /***UseEffect */
  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.title}>Update today's menu</Text>
        <Text style={styles.subtitle}>
          Tell students what's cooking today!{" "}
        </Text>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
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
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="white"/>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
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
    color: "grey",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#87CEEB", // Sky-blue color
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
});
