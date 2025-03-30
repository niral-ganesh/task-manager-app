import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../screens/HomeScreen";
import * as taskService from "../services/taskService";

jest.mock("../services/taskService", () => ({
  getTasks: jest.fn(() => Promise.resolve([
    {
      id: "1",
      taskName: "Buy groceries",
      priority: "High",
      status: "pending",
      startTime: "2025-03-27T09:00:00Z",
      endTime: "2025-03-27T10:00:00Z",
    },
  ])),
  updateTask: jest.fn(() => Promise.resolve()),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockTasks = [
  {
    id: "1",
    taskName: "Buy groceries",
    priority: "High",
    status: "pending",
    startTime: "2025-03-27T09:00:00Z",
    endTime: "2025-03-27T10:00:00Z",
  },
];

describe("Home Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders calendar and prompt text", () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    expect(getByText("Select a date to view tasks")).toBeTruthy();
  });

  it("updates selected date and fetches tasks", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);

    const { getByText, getByTestId, queryByText } = render(<Home navigation={mockNavigation} />);

    fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));

    await waitFor(() => {
      expect(getByText("2025-03-27:")).toBeTruthy();
      expect(getByText("Buy groceries")).toBeTruthy();
      expect(queryByText("No tasks for this day")).toBeNull();
    });
  });

  it("shows 'No tasks' if no task matches selected date", async () => {
    taskService.getTasks.mockResolvedValueOnce([]);

    const { getByText, getByTestId } = render(<Home navigation={mockNavigation} />);

    fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));

    await waitFor(() => {
      expect(getByText("No tasks for this day")).toBeTruthy();
    });
  });

  it("calls updateTask when checkbox is pressed", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);
    taskService.updateTask.mockResolvedValueOnce({});

    const { getByText, getByRole, getByTestId } = render(<Home navigation={mockNavigation} />);
    fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));


    await waitFor(() => {
      expect(getByText("Buy groceries")).toBeTruthy();
    });

    const checkbox = getByTestId("checkbox-1"); // replace with the actual ID
    fireEvent.press(checkbox);


    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith("1", { status: "completed" });
    });
  });

  it("navigates to TaskDetails on task press", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);

    const { getByText, getByTestId } = render(<Home navigation={mockNavigation} />);
    fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));

    await waitFor(() => {
      expect(getByText("Buy groceries")).toBeTruthy();
    });

    fireEvent.press(getByText("Buy groceries"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("TaskDetails", { task: mockTasks[0] });
  });

  it("navigates to TaskDistribution when button is pressed", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);

    const { getByText, getByTestId } = render(<Home navigation={mockNavigation} />);
    fireEvent.press(getByTestId("native.calendar.SELECT_DATE_SLOT-2025-03-27"));

    await waitFor(() => {
      expect(getByText("Task Distribution")).toBeTruthy();
    });

    fireEvent.press(getByText("Task Distribution"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("TaskDistribution", {
      selectedDate: "2025-03-27",
      tasks: mockTasks,
    });
  });
});