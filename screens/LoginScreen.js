// screens/LoginScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import api from "../api/api";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Token is present, user is logged in, navigate to Home screen
        navigation.replace("Home");
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        username,
        password,
      });

      const token = response.data.token;

      await AsyncStorage.setItem("token", token);

      Alert.alert("Login Successful", "JWT token stored successfully!");

      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username</Text>
        <View style={styles.inputField}>
          <FontAwesome name="user-circle" size={20} color="skyblue" />
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Enter your username"
            />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputField}>
        <FontAwesome name="lock" size={20} color="skyblue" />
        <TextInput
          style={styles.textInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Enter your password"
          secureTextEntry
          />
          </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleLogin}
        >
          <Text style={styles.createAccountButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <Text>OR</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.createAccountButton} onPress={()=>navigation.replace('Signup')}>
          <Text style={styles.createAccountButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
          </TouchableWithoutFeedback>
  );
};

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

export default LoginScreen;
