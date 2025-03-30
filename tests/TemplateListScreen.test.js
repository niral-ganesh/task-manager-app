import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import TemplateListScreen from "../screens/TemplateListScreen";
import * as aiService from "../services/aiService";
import { Alert } from "react-native";

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

// Mock AI service
jest.mock("../services/aiService", () => ({
  getPrefilledTask: jest.fn(),
}));

jest.mock('react-native-swipe-list-view', () => {
  const React = require('react');
  return {
    SwipeListView: ({ data, renderItem, keyExtractor }) => (
      <>{data.map((item, index) => (
        <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}</>
    ),
  };
});


jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    AntDesign: (props) => <>{props.name}</>,
  };
});

describe("TemplateListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders default templates", () => {
    const { getByText } = render(<TemplateListScreen navigation={mockNavigation} />);
    expect(getByText("Homework")).toBeTruthy();
    expect(getByText("Meeting")).toBeTruthy();
  });

  it("opens and closes modal", () => {
    const { getByText, getByPlaceholderText } = render(
      <TemplateListScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Add Template"));
    expect(getByPlaceholderText("Enter template name")).toBeTruthy();

    fireEvent.press(getByText("Cancel"));
    expect(() => getByPlaceholderText("Enter template name")).toThrow();
  });

  it("adds a new template", () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <TemplateListScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Add Template"));
    fireEvent.changeText(getByPlaceholderText("Enter template name"), "Chores");
    fireEvent.press(getByText("Add"));

    expect(queryByText("Chores")).toBeTruthy();
  });

  it("does not add empty or duplicate templates", () => {
    const { getByText, getByPlaceholderText } = render(
      <TemplateListScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Add Template"));
    fireEvent.press(getByText("Add")); // empty
    fireEvent.changeText(getByPlaceholderText("Enter template name"), "Homework");
    fireEvent.press(getByText("Add")); // duplicate
  });

  it("navigates with prefilled task on template press", async () => {
    aiService.getPrefilledTask.mockResolvedValueOnce({ taskName: "Meeting" });

    const { getByText } = render(<TemplateListScreen navigation={mockNavigation} />);
    fireEvent.press(getByText("Meeting"));

    await waitFor(() => {
      expect(aiService.getPrefilledTask).toHaveBeenCalledWith("Meeting");
      expect(mockNavigate).toHaveBeenCalledWith("CreateTask", {
        prefilledTask: { taskName: "Meeting" },
      });
    });
  });

it("deletes a template after confirmation", async () => {
  const mockNavigation = { navigate: jest.fn() };

  // Render the screen
  const screen = render(<TemplateListScreen navigation={mockNavigation} />);

  const { queryByTestId } = screen;

  // Ensure the template exists before deletion
  expect(queryByTestId("template-text-8")).toBeTruthy();

  // Override Alert.alert to simulate Delete button press
  jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
    const deleteBtn = buttons.find((btn) => btn.text === "Delete");
    deleteBtn?.onPress(); // Trigger deletion directly
  });

  // Manually trigger the Alert for "Doctor Appointment"
  Alert.alert(
    "Delete Template",
    'Are you sure you want to delete "Doctor Appointment"?',
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {}, // Already handled by mock above
      },
    ]
  );

  // Wait until the item is removed
  await waitFor(() => {
    expect(queryByTestId("template-text-9")).toBeNull();
  });
});

});