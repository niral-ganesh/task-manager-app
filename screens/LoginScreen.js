// START import necessary dependencies
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from "react-native";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Login screen
const LoginScreen = ({ navigation }) => {
  // Email, password, secure text and loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(true); 
  
  // START Check if the user has logged in
  useEffect(() => {
    // Login status of user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is already logged in, navigate to the HomeScreen (Main screen)
        navigation.replace("Main");
      } else {
        // If no user, stop loading and show the login screen
        setLoading(false);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [navigation]);
  // END Check if the user has logged in

  // START Function to handle login
  const handleLogin = async () => {
    setLoading(true); 
    try {
      // Sign in
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to the home screen after successful login
      navigation.replace("Main");
    } catch (error) {
      // Error handling
      Alert.alert("Login Error", error.message);
    } finally {
      // Stop loading after login attempt
      setLoading(false); 
    }
  };
  // END Function to handle login
  
  // START Show loading spinner while checking auth state or logging in
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color={ColourScheme.blue2}
        />
      </View>
    );
  }
  // END Show loading spinner while checking auth state or logging in

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>

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

        {/* Secure text toggle */}
        <TouchableOpacity
          testID="toggle-password-visibility"
          onPress={() => setSecureText(!secureText)}
        >
          <Ionicons
            name={secureText ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={ColourScheme.darkgrey}
          />
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Redirect to Signup */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchTextHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

// START Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColourScheme.blue5,
    backfaceVisibility: 0.1,
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
// END Login screen