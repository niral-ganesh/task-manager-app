import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import { Alert } from "react-native";

// Mock Firebase
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn(), // we'll override this per test
  },
}));

// Mock vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

describe("LoginScreen", () => {
  const mockNavigate = jest.fn();
  const mockReplace = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    replace: mockReplace,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows ActivityIndicator when loading is true", async () => {
        auth.onAuthStateChanged.mockImplementationOnce(() => {});

        const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByTestId("activity-indicator")).toBeTruthy();
        });
    });


  it("renders inputs and login button after auth check", async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb(null));

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByPlaceholderText("Email")).toBeTruthy();
      expect(getByPlaceholderText("Password")).toBeTruthy();
      expect(getByText("Login")).toBeTruthy();
    });
  });

  it("logs in and navigates on success", async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb(null));
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "123456"
      );
      expect(mockReplace).toHaveBeenCalledWith("Main");
    });
  });

  it("shows alert on login failure", async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb(null));
    const alertSpy = jest.spyOn(Alert, "alert");
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Login Error", "Invalid credentials");
    });

    alertSpy.mockRestore();
  });

    it("toggles password visibility when eye icon is pressed", async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb(null));

    const { getByPlaceholderText, getByTestId } = render(
        <LoginScreen navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText("Password");
    const toggleIcon = getByTestId("toggle-password-visibility");

    // Should start with secure text
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleIcon);

    // Should now be visible (not secure)
    expect(passwordInput.props.secureTextEntry).toBe(false);
    });

    it("navigates to Signup screen when Sign Up text is pressed", async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb(null));

    const { getByText } = render(
        <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Sign Up"));

    expect(mockNavigate).toHaveBeenCalledWith("Signup");
    });

});