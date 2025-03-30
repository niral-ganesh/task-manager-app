// START import necessary dependencies
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Sign up screen
const SignupScreen = ({ navigation }) => {
  // Email, password and secure text
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  // START Function to handle sign up
  const handleSignup = async () => {
    try {
      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);

      // Redirect to Home Page after signup
      navigation.replace("Main"); 
    } catch (error) {
      // Erro handling
      Alert.alert("Signup Error", error.message);
    }
  };
  // END Function to handle sign up

  return (
    <SafeAreaView style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Input email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color={ColourScheme.darkgrey} style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Input password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={ColourScheme.darkgrey} style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
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

      {/* Sign up button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* If the user has an account, redirect to login screen */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.switchText}>Already have an account? <Text style={styles.switchTextHighlight}>Login</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
    shadowOffset: { width: 0, height: 8 },
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
  },
  buttonText: {
    color: ColourScheme.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 15,
    fontSize: 14,
    color: ColourScheme.darkgrey,
  },
  switchTextHighlight: {
    color: ColourScheme.blue1,
    fontWeight: "bold",
  },
});
// END Styling
// END Sign up screen