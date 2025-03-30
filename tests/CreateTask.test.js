import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateTask from "../screens/CreateTask";
import * as Notifications from 'expo-notifications';

// Mock addTask service
jest.mock("../services/taskService", () => ({
  addTask: jest.fn(),
}));

jest.mock("../firebase", () => ({
  storage: {},
}));

// Mock notifications
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

// Mock file picking
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

// Suppress time picker
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");

// Firebase Storage mocks (if needed)
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe("CreateTask Screen", () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields", async () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateTask navigation={navigation} route={{}} />
    );

    fireEvent.press(getByText("Work")); // set a default to trigger category buttons

    expect(getByPlaceholderText("Enter task name")).toBeTruthy();
    expect(getByPlaceholderText("Enter task notes")).toBeTruthy();
    expect(getByPlaceholderText("Enter location (optional)")).toBeTruthy();
    expect(getByText("Add Task")).toBeTruthy();
  });

  it("validates missing task name", () => {
    global.alert = jest.fn();
    const { getByText } = render(<CreateTask navigation={navigation} route={{}} />);
    fireEvent.press(getByText("Add Task"));
    expect(global.alert).toHaveBeenCalledWith("Please enter a task name.");
  });

  it("validates missing date", async () => {
    global.alert = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <CreateTask navigation={navigation} route={{}} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter task name"), "My Task");
    fireEvent.press(getByText("Add Task"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please select a date for the task.");
    });
  });

//   it("adds task successfully", async () => {
//     const { getByText, getByPlaceholderText, getByTestId } = render(
//       <CreateTask
//         navigation={navigation}
//         route={{}}
//       />
//     );

//     // Fill form
//     fireEvent.changeText(getByPlaceholderText("Enter task name"), "Demo Task");
//     fireEvent.press(getByText("Work"));
//     fireEvent.press(getByText("High"));

//     // Select date
//     fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));
//     await waitFor(() => getByText(/Selected Date:/));

//     // Submit
//     fireEvent.press(getByText("Add Task"));

//     await waitFor(() => {
//       expect(navigation.navigate).toHaveBeenCalledWith("Home", { refresh: true });
//     });
//   });

  it("toggles category and priority buttons", () => {
    const { getByText } = render(<CreateTask navigation={navigation} route={{}} />);

    fireEvent.press(getByText("Personal"));
    fireEvent.press(getByText("High"));

    expect(getByText("Personal")).toBeTruthy();
    expect(getByText("High")).toBeTruthy();
  });

  it("handles file upload (mocked)", async () => {
    const { getDocumentAsync } = require("expo-document-picker");
    const { getDownloadURL } = require("firebase/storage");

    getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "file://test.txt", name: "test.txt" }],
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve("blob") })
    );

    getDownloadURL.mockResolvedValueOnce("https://example.com/test.txt");

    const { getByText, queryByText } = render(<CreateTask navigation={navigation} route={{}} />);
    fireEvent.press(getByText("Attach File"));

    await waitFor(() => {
      expect(getDownloadURL).toHaveBeenCalled();
    });

    global.fetch.mockRestore();
  });

//     it("submits a task successfully", async () => {
//     const { getByPlaceholderText, getByText, queryByText, getByTestId } = render(
//       <CreateTask navigation={mockNavigate} route={{}} />
//     );

//     fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));
//     fireEvent.changeText(getByPlaceholderText("Enter task name"), "Test Task");
//     fireEvent.press(getByText("Add Task"));

//     await waitFor(() => {
//       expect(addTask).toHaveBeenCalledWith(
//         expect.objectContaining({ taskName: "Test Task" })
//       );
//       expect(mockNavigate.navigate).toHaveBeenCalledWith("Home", { refresh: true });
//       expect(queryByText("Please enter a task name.")).toBeNull();
//     });
//   });

//   it("schedules reminder when reminder time is set", async () => {
//     const { getByPlaceholderText, getByText, getByTestId } = render(
//       <CreateTask navigation={mockNavigate} route={{}} />
//     );

//     fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));
//     fireEvent.changeText(getByPlaceholderText("Enter task name"), "Reminder Task");
//     fireEvent.press(getByText("Add Task"));

//     await waitFor(() => {
//       expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
//     });
//   });

//   it("navigates to Home after successful task creation", async () => {
//     const { getByPlaceholderText, getByText, getByTestId } = render(
//       <CreateTask navigation={mockNavigate} route={{}} />
//     );

//     fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));
//     fireEvent.changeText(getByPlaceholderText("Enter task name"), "Nav Test");
//     fireEvent.press(getByText("Add Task"));

//     await waitFor(() => {
//       expect(mockNavigate.navigate).toHaveBeenCalledWith("Home", { refresh: true });
//     });
//   });

  it("prefills task details from route params", async () => {
    const prefilledTask = {
      taskName: "Prefilled Task",
      category: "Personal",
      priority: "High",
      startTime: "2025-03-27T09:00:00Z",
      endTime: "2025-03-27T10:00:00Z",
    };

    const { getByDisplayValue } = render(
      <CreateTask navigation={mockNavigate} route={{ params: { prefilledTask } }} />
    );

    expect(getByDisplayValue("Prefilled Task")).toBeTruthy();
  });
});
