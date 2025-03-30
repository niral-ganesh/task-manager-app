// START import necessary dependencies
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Settings screen
const SettingsScreen = ({ navigation }) => {
  // New password and secure text
  const [newPassword, setNewPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const auth = getAuth();

  // START Function to change password
  const handleChangePassword = async () => {
    // Ensure the password length
    if (newPassword.length < 6) {
      // Alert user
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        // Update password
        await updatePassword(user, newPassword);
        Alert.alert("Success", "Password changed successfully.");
        setNewPassword("");
      } else {
        // If user does not exist, alert user
        Alert.alert("Error", "User not found. Please log in again.");
      }
    } catch (error) {
      // Error handling
      Alert.alert("Error", error.message);
    }
  };
  // END Function to change password

  // START Function to log out
  const handleLogout = async () => {
    try {
      // Logout
      await signOut(auth);
      Alert.alert("Logged out", "You have been logged out.");

      // Navigate to login page
      navigation.navigate("Login");
    } catch (error) {
      // Error handling
      Alert.alert("Error", error.message);
    }
  };
  // END Function to log out

  return (
    <SafeAreaView style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Change password</Text>
      
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={ColourScheme.darkgrey} style={styles.icon} />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={secureText}
          style={styles.input}
        />
        {/* Secure text */}
        <TouchableOpacity
          testID="toggle-password-visibility"
          onPress={() => setSecureText(!secureText)}
        >
          <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color={ColourScheme.darkgrey} />
        </TouchableOpacity>
      </View>

      {/* Change Password Button */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Logout</Text>

      {/* Logout Button */}
      <TouchableOpacity
        testID="logout-button"
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;

// START Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColourScheme.blue5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ColourScheme.white,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    width: "70%",
    marginBottom: 15,
    shadowColor: ColourScheme.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: ColourScheme.blue3,
    paddingVertical: 12,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: ColourScheme.red,
  },
  buttonText: {
    color: ColourScheme.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
// END Styling
// END Settings screen