import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import * as taskService from "../services/taskService";
import { Linking } from "react-native";

jest.mock("../services/taskService", () => ({
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  AntDesign: () => "AntDesignIcon",
}));

describe("TaskDetailsScreen", () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  const mockTask = {
    id: "1",
    taskName: "Demo Task",
    category: "Work",
    priority: "High",
    status: "pending",
    location: "Office",
    notes: "Bring documents",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    reminderTime: new Date().toISOString(),
    attachmentUrl: "https://example.com/file.pdf",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all task details", () => {
    const { getByText } = render(
      <TaskDetailsScreen route={{ params: { task: mockTask } }} navigation={navigation} />
    );

    expect(getByText("Demo Task")).toBeTruthy();
    expect(getByText("Category:")).toBeTruthy();
    expect(getByText("Work")).toBeTruthy();
    expect(getByText("High")).toBeTruthy();
    expect(getByText("pending")).toBeTruthy();
    expect(getByText("Bring documents")).toBeTruthy();
    expect(getByText("View Attachment")).toBeTruthy();
  });

  it("opens attachment when 'View Attachment' is pressed", () => {
    const openURLSpy = jest.spyOn(Linking, "openURL");

    const { getByText } = render(
      <TaskDetailsScreen route={{ params: { task: mockTask } }} navigation={navigation} />
    );

    fireEvent.press(getByText("View Attachment"));

    expect(openURLSpy).toHaveBeenCalledWith(mockTask.attachmentUrl);
  });

  it("marks task as completed", async () => {
    const { getByText } = render(
      <TaskDetailsScreen route={{ params: { task: mockTask } }} navigation={navigation} />
    );

    fireEvent.press(getByText("Mark as Completed"));

    expect(taskService.updateTask).toHaveBeenCalledWith("1", { status: "completed" });
  });

  it("deletes task", async () => {
    const { getByText } = render(
      <TaskDetailsScreen route={{ params: { task: mockTask } }} navigation={navigation} />
    );

    fireEvent.press(getByText("Delete Task"));

    expect(taskService.deleteTask).toHaveBeenCalledWith("1");
  });

  it("hides 'Mark as Completed' if task is already completed", () => {
    const completedTask = { ...mockTask, status: "completed" };

    const { queryByText } = render(
      <TaskDetailsScreen route={{ params: { task: completedTask } }} navigation={navigation} />
    );

    expect(queryByText("Mark as Completed")).toBeNull();
  });

  it("does not render attachment button if attachmentUrl is not present", () => {
    const taskWithoutAttachment = { ...mockTask, attachmentUrl: null };

    const { queryByText } = render(
      <TaskDetailsScreen route={{ params: { task: taskWithoutAttachment } }} navigation={navigation} />
    );

    expect(queryByText("View Attachment")).toBeNull();
  });
});