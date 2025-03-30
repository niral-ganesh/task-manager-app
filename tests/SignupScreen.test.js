jest.mock("@expo/vector-icons");
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignupScreen from "../screens/SignupScreen";
import { Alert } from "react-native";

// Mock Firebase
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock auth object
jest.mock("../firebase", () => ({
  auth: { currentUser: null },
}));

// Bring in the mock directly
import { createUserWithEmailAndPassword } from "firebase/auth";

describe("SignupScreen", () => {
  const mockNavigate = jest.fn();
  const mockReplace = jest.fn();

  const mockNavigation = {
    navigate: mockNavigate,
    replace: mockReplace,
  };

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input fields and sign-up button", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={mockNavigation} />
    );

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("calls createUserWithEmailAndPassword and navigates to Home on success", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // the auth object
        "test@example.com",
        "password123"
      );

      expect(mockReplace).toHaveBeenCalledWith("Main");
    });
  });

  it("shows alert on signup error", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    createUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Signup failed")
    );

    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Signup Error", "Signup failed");
    });

    alertSpy.mockRestore();
  });

  it("toggles password visibility when eye icon is pressed", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SignupScreen navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText("Password");
    const toggleButton = getByTestId("toggle-password-visibility");

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it("navigates to Login screen when text is pressed", () => {
    const { getByText } = render(<SignupScreen navigation={mockNavigation} />);

    fireEvent.press(getByText("Login"));

    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });
});