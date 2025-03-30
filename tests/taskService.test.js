// tests/taskService.test.js
jest.mock("../firebase"); // This will auto-use __mocks__/firebase.js

import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";

import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "../firebase"; // These are now the mocked versions

describe("taskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addTask adds a task with correct data", async () => {
    const task = {
      taskName: "Test Task",
      notes: "Some notes",
      category: "work",
      startTime: "10:00",
      endTime: "11:00",
    };

    await addTask(task);

    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection", // collection(db, "tasks")
      expect.objectContaining({
        userId: "test-user-id",
        taskName: "Test Task",
        notes: "Some notes",
        category: "work",
        startTime: "10:00",
        endTime: "11:00",
        status: "pending",
        priority: "Medium",
        reminderTime: null,
        location: null,
        attachmentUrl: null,
      })
    );
  });

  test("getTasks returns tasks for the logged-in user", async () => {
    const fakeDocs = [
      { id: "1", data: () => ({ userId: "test-user-id", taskName: "Task 1" }) },
      { id: "2", data: () => ({ userId: "other-user", taskName: "Task 2" }) },
    ];
    getDocs.mockResolvedValue({ docs: fakeDocs });

    const result = await getTasks();

    expect(result).toEqual([{ id: "1", userId: "test-user-id", taskName: "Task 1" }]);
  });

  test("updateTask calls updateDoc with correct arguments", async () => {
    const updatedData = { taskName: "Updated Task" };
    const taskId = "123";

    await updateTask(taskId, updatedData);

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), updatedData);
  });

  test("deleteTask calls deleteDoc with correct arguments", async () => {
    const taskId = "123";

    await deleteTask(taskId);

    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
  });
});