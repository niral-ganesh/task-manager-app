import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SettingsScreen from "../screens/SettingsScreen";
import { Alert } from "react-native";

// Mocks
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: "test-user" },
  })),
  updatePassword: jest.fn(),
  signOut: jest.fn(),
}));

import { getAuth, updatePassword, signOut } from "firebase/auth";

describe("SettingsScreen", () => {
  const mockNavigate = jest.fn();
  const mockNavigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders inputs and buttons", () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    expect(getByPlaceholderText("New Password")).toBeTruthy();
    expect(getByText("Change Password")).toBeTruthy();
    expect(getByTestId("logout-button")).toBeTruthy();
  });

  it("toggles password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    const input = getByPlaceholderText("New Password");
    const toggle = getByTestId("toggle-password-visibility");

    expect(input.props.secureTextEntry).toBe(true);
    fireEvent.press(toggle);
    expect(input.props.secureTextEntry).toBe(false);
  });

  it("shows alert if password is too short", () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByPlaceholderText, getByText } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("New Password"), "123");
    fireEvent.press(getByText("Change Password"));

    expect(alertSpy).toHaveBeenCalledWith("Error", "Password must be at least 6 characters long.");
    alertSpy.mockRestore();
  });

  it("updates password and shows success alert", async () => {
    updatePassword.mockResolvedValueOnce();
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("New Password"), "newpassword");
    fireEvent.press(getByText("Change Password"));

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith("Success", "Password changed successfully.");
    });

    alertSpy.mockRestore();
  });

  it("shows error alert when updatePassword fails", async () => {
    updatePassword.mockRejectedValueOnce(new Error("Update failed"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("New Password"), "valid123");
    fireEvent.press(getByText("Change Password"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Update failed");
    });

    alertSpy.mockRestore();
  });

  it("signs out and navigates to Login", async () => {
    signOut.mockResolvedValueOnce();
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByTestId } = render(<SettingsScreen navigation={mockNavigation} />);
    fireEvent.press(getByTestId("logout-button"));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith("Logged out", "You have been logged out.");
      expect(mockNavigate).toHaveBeenCalledWith("Login");
    });

    alertSpy.mockRestore();
  });

  it("shows error alert if signOut fails", async () => {
    signOut.mockRejectedValueOnce(new Error("Logout failed"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByTestId } = render(<SettingsScreen navigation={mockNavigation} />);
    fireEvent.press(getByTestId("logout-button"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Logout failed");
    });

    alertSpy.mockRestore();
  });
});