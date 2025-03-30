// START import necessary dependencies
import React from "react";
import { Image, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import CreateTask from "./CreateTask";
import TemplateListScreen from "./TemplateListScreen";
import SettingsScreen from "./SettingsScreen";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Bottom navigation bar
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    // START styling
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: ColourScheme.white,
          borderRadius: 15,
          height: 80,
          shadowColor: ColourScheme.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
      }}
      // END styling
    >
      {/* Settings Screen */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="settings" size={30} color={focused ? ColourScheme.blue2 : ColourScheme.mediumgrey} />
          ),
          headerStyle: {backgroundColor: ColourScheme.blue5},
        }}
      />

      {/* Home Screen */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={30} color={focused ? ColourScheme.blue2 : ColourScheme.mediumgrey} />
          ),
          header: () => (
            <View style={styles.customHeader}>
              <Image
                source={require('../assets/logo-taskey.png')}
                testID="home-logo"
                style={{ width: 120, height: 60 }} 
              />
            </View>
          ),
        }}
      />

      {/* Template List Screen */}
      <Tab.Screen
        name="Template List"
        component={TemplateListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="reorder-four" size={30} color={focused ? ColourScheme.blue2 : ColourScheme.mediumgrey} />
          ),
          headerStyle: {backgroundColor: ColourScheme.blue4},
        }}
      />

      {/* Create Task Screen */}
      <Tab.Screen
        name="Create Task"
        component={CreateTask}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add-circle-outline" size={30} color={focused ? ColourScheme.blue2 : ColourScheme.mediumgrey} />
          ),
          headerStyle: {backgroundColor: ColourScheme.blue4},
        }}
      />
    </Tab.Navigator>
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
// END Bottom navigation bar
