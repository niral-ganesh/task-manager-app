// START import necessary dependencies
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Platform, StyleSheet, Image } from "react-native";
import FlashMessage from "react-native-flash-message";
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./firebase";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CreateTask from "./screens/CreateTask";
import TemplateListScreen from "./screens/TemplateListScreen";
import TaskDistribution from "./screens/TaskDistribution";
import TaskDetailsScreen from "./screens/TaskDetailsScreen";
import BottomTabNavigator from "./screens/BottomTabNavigator";
import ColourScheme from "./config/ColourScheme";
// END import necessary dependencies

// Stack navigator
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    
    // START Request user to send notifications
    const requestNotificationPermission = async () => {
      // Status of request
      const { status } = await Notifications.requestPermissionsAsync();

      // iOS device
      if (status !== "granted") {
        alert("Enable notifications to receive task reminders!");
      }
      
      // Android device
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#0077b6",
        });
      }
    };
    // END Request user to send notifications
    
    // Request user to send notifications
    requestNotificationPermission();
    
    // Cleanup function
    return unsubscribe;
  }, []);
  
  // Loading status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Bottom Tab Navigator */}
          <Stack.Screen name="Main" component={BottomTabNavigator} 
            options={{ title: "Back", headerShown: false }} 
          />
          
          {/* Login screen */}
          <Stack.Screen name="Login" component={LoginScreen} 
            options={{ header: () => (
                        <View style={styles.customHeader}>
                          <Image
                            source={require('./assets/logo-taskey.png')}
                            testID="home-logo"
                            style={{ width: 120, height: 60 }} 
                          />
                        </View>
                      ), }} 
          />

          {/* Sign up screen */}
          <Stack.Screen name="Signup" component={SignupScreen} 
            options={{ header: () => (
                        <View style={styles.customHeader}>
                          <Image
                            source={require('./assets/logo-taskey.png')}
                            testID="home-logo"
                            style={{ width: 120, height: 60 }} 
                          />
                        </View>
                      ), }} 
          />

          {/* Home screen */}
          <Stack.Screen name="Home" component={HomeScreen} 
            options={{ headerShown: false }} 
          />

          {/* Create task screen */}
          <Stack.Screen name="CreateTask" component={CreateTask} 
            options={{ title: "Create Task", headerStyle: {backgroundColor: ColourScheme.blue4} }} 
          /> 

          {/* Template list screen */}
          <Stack.Screen name="TemplateListScreen" component={TemplateListScreen} 
            options={{ title: "Template List", headerStyle: {backgroundColor: ColourScheme.blue4} }} 
          /> 

          {/* Task distribution screen */}
          <Stack.Screen name="TaskDistribution" component={TaskDistribution} 
            options={{ title: "Task Distribution", headerStyle: {backgroundColor: ColourScheme.blue4}, }} 
          />

          {/* Task details screen */}
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} 
            options={{ title: "Task Details", headerStyle: {backgroundColor: ColourScheme.blue4}, }} 
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* This enables in-app top banner notifications */}
      <FlashMessage position="top" />
    </>
  );
}

// START styling
const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: ColourScheme.blue4,
    height: 120,
  },
});
// END styling