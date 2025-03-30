import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TaskDistribution from "../screens/TaskDistribution";
import { showMessage } from "react-native-flash-message";

// Mock PieChart
jest.mock("react-native-chart-kit", () => ({
  PieChart: () => <></>,
}));

// Mock showMessage
jest.mock("react-native-flash-message", () => ({
  showMessage: jest.fn(),
}));

describe("TaskDistribution Screen", () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  const sampleTasks = [
    {
      id: "1",
      taskName: "Meeting",
      category: "Work",
      priority: "High",
      status: "pending",
      startTime: "2025-03-27T09:00:00Z",
      endTime: "2025-03-27T10:00:00Z",
    },
    {
      id: "2",
      taskName: "Yoga",
      category: "Personal",
      priority: "Medium",
      status: "completed",
      startTime: "2025-03-27T11:00:00Z",
      endTime: "2025-03-27T12:30:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the selected date", () => {
    const { getByText } = render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: [] } }}
        navigation={navigation}
      />
    );
    expect(getByText("2025-03-27")).toBeTruthy();
  });

  it("renders 'No tasks available' if no tasks", () => {
    const { getByText } = render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: [] } }}
        navigation={navigation}
      />
    );
    expect(getByText("No tasks available for this date.")).toBeTruthy();
  });

  it("renders pie chart and tasks if data is provided", () => {
    const { getByText } = render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: sampleTasks } }}
        navigation={navigation}
      />
    );

    expect(getByText("Meeting")).toBeTruthy();
    expect(getByText("Yoga")).toBeTruthy();
    expect(getByText("Priority: High")).toBeTruthy();
    expect(getByText("Priority: Medium")).toBeTruthy();
  });

  it("navigates to TaskDetails on task press", () => {
    const { getByText } = render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: sampleTasks } }}
        navigation={navigation}
      />
    );

    fireEvent.press(getByText("Yoga"));
    expect(mockNavigate).toHaveBeenCalledWith("TaskDetails", { task: sampleTasks[1] });
  });

  it("shows flash message for more Work time", () => {
    const workMoreTasks = [
      {
        id: "1",
        taskName: "Work Overload",
        category: "Work",
        priority: "High",
        startTime: "2025-03-27T09:00:00Z",
        endTime: "2025-03-27T13:00:00Z",
      },
      {
        id: "2",
        taskName: "Short Walk",
        category: "Personal",
        priority: "Low",
        startTime: "2025-03-27T13:30:00Z",
        endTime: "2025-03-27T14:00:00Z",
      },
    ];

    render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: workMoreTasks } }}
        navigation={navigation}
      />
    );

    expect(showMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Take Care of Yourself 💙",
      })
    );
  });

  it("shows flash message for more Personal time", () => {
    const personalMoreTasks = [
      {
        id: "1",
        taskName: "Meditation",
        category: "Personal",
        priority: "Medium",
        startTime: "2025-03-27T08:00:00Z",
        endTime: "2025-03-27T12:00:00Z",
      },
      {
        id: "2",
        taskName: "Quick Email",
        category: "Work",
        priority: "Low",
        startTime: "2025-03-27T13:00:00Z",
        endTime: "2025-03-27T13:30:00Z",
      },
    ];

    render(
      <TaskDistribution
        route={{ params: { selectedDate: "2025-03-27", tasks: personalMoreTasks } }}
        navigation={navigation}
      />
    );

    expect(showMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Great Job! 🎉",
      })
    );
  });
});