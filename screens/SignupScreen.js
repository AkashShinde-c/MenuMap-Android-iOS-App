import React, { useRef, useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SignupScreen({ navigation }) {
  const messNameRef = useRef(null);
  const ownerNameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const locationRef = useRef(null);

  /***Get current location of the user */
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleGetLocation = async () => {
    try {
      const lo = await Location.requestForegroundPermissionsAsync();
      console.log(lo)

      if (lo.status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location access needed",
          text2: "Location permission is required!",
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      locationRef.current &&
        locationRef.current.setNativeProps({
          text: `${location.coords.latitude}, ${location.coords.longitude}`,
        });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Couldn't get loation !",
        text2: error,
      });
    }
  };

  //***Handle Signup */

  const handleSignup = async () => {
    try {
      
      const data = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        location: currentLocation,
        mess_name: messNameRef.current.value,
        owner_name: ownerNameRef.current.value,
      };

      const response = await api.post("/create-account", data);
      console.log(response.data);
      await AsyncStorage.setItem("token", response.data.token);
      Toast.show({
        type:"success",
        text1:"Congratulations!",
        text2:"Your account has been created !"
      })
      navigation.replace("Home");
    } catch (error) {
      Toast.show({
        type:"error",
        text1:"Error !",
        text2:"Something went wrong",
      })
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>Create account</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mess</Text>
                <View style={styles.inputField}>
                  <FontAwesome name="cutlery" size={20} color="skyblue" />
                  <TextInput
                    placeholder="Enter mess name"
                    style={styles.textInput}
                    ref={messNameRef}
                    onChangeText={(e) => (messNameRef.current.value = e)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Owner</Text>
                <View style={styles.inputField}>
                  <FontAwesome name="user" size={20} color="skyblue" />
                  <TextInput
                    placeholder="Enter owner name"
                    style={styles.textInput}
                    ref={ownerNameRef}
                    onChangeText={(e) => (ownerNameRef.current.value = e)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputField}>
                  <FontAwesome name="user-circle" size={20} color="skyblue" />
                  <TextInput
                    placeholder="Choose a username"
                    style={styles.textInput}
                    ref={usernameRef}
                    onChangeText={(e) => (usernameRef.current.value = e)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputField}>
                  <FontAwesome name="lock" size={20} color="skyblue" />
                  <TextInput
                    placeholder="Choose a password"
                    secureTextEntry
                    style={styles.textInput}
                    ref={passwordRef}
                    onChangeText={(e) => (passwordRef.current.value = e)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <View style={styles.inputField}>
                  <FontAwesome name="map-marker" size={20} color="skyblue" />
                  <TextInput
                    placeholder="Select Location"
                    style={styles.textInput}
                    ref={locationRef}
                    onChangeText={(e) => locationRef.current.value}
                  />
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleGetLocation}
                  >
                    <FontAwesome name="map-marker" size={20} color="red" />

                    <Text style={styles.locationButtonText}>Get Location</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.createAccountContainer}>
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleSignup}
              >
                <Text style={styles.createAccountButtonText}>
                  Create Account
                </Text>
              </TouchableOpacity>
              <View style={styles.center}>
                <Text>OR</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={() => navigation.replace("Login")}
                >
                  <Text style={styles.createAccountButtonText}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  headingContainer: {
    marginBottom: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "skyblue",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "skyblue",
    marginBottom: 5,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "skyblue",
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: "skyblue",
  },
  createAccountContainer: {},
  createAccountButton: {
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  locationButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  locationButtonText: {
    color: "red",
    fontWeight: "regular",
  },
  center: {
    margin: 20,
    alignItems: "center",
  },
});
