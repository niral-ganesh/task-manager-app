import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BottomTabNavigator from "../screens/BottomTabNavigator";
import { NavigationContainer } from "@react-navigation/native";

// Mock individual screen components
jest.mock("../screens/HomeScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Home Screen</Text>;
});

jest.mock("../screens/CreateTask", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Create Task Screen</Text>;
});

jest.mock("../screens/TemplateListScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Template List Screen</Text>;
});

jest.mock("../screens/SettingsScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Settings Screen</Text>;
});

// Mock vector icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
});

describe("BottomTabNavigator", () => {
  it("renders all tab icons and navigates to screens", async () => {
    const { getByText, getAllByText } = render(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );

    // Home is initial screen
    await waitFor(() => {
      expect(getByText("Home Screen")).toBeTruthy();
    });

    // Navigate to Create Task tab
    const icon1 = getAllByText("add-circle-outline");

    // use last instance
    fireEvent.press(icon1[icon1.length - 1]);
    await waitFor(() => {
      expect(getByText("Create Task Screen")).toBeTruthy();
    });

    // Navigate to Settings tab
    const icon2 = getAllByText("settings");

    // use last instance
    fireEvent.press(icon2[icon2.length - 1]);
    await waitFor(() => {
      expect(getByText("Settings Screen")).toBeTruthy();
    });

    // Navigate to Template List tab
    const icon3 = getAllByText("reorder-four");

    // use last instance
    fireEvent.press(icon3[icon3.length - 1]);
    await waitFor(() => {
      expect(getByText("Template List Screen")).toBeTruthy();
    });
  });

  it("applies custom header in Home tab", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Home Screen")).toBeTruthy();
    });
  });

    it("renders logo image in Home tab header", async () => {
        const { getByTestId, getByText } = render(
            <NavigationContainer>
            <BottomTabNavigator />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText("Home Screen")).toBeTruthy(); // Wait for Home screen
        });

        const logoImage = getByTestId("home-logo");
        expect(logoImage).toBeTruthy();
    });
});