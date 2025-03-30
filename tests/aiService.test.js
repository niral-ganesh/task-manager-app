import axios from "axios";
import { getPrefilledTask } from "../services/aiService"; // adjust the path as needed

jest.mock("axios");

describe("getPrefilledTask", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns extracted AI task fields when response is successful", async () => {
    const mockAIResponse = {
      data: {
        choices: [
          {
            message: {
              content: `Start time: 2025-04-01T09:00:00Z
End time: 2025-04-01T10:00:00Z
Priority: High
Category: Work`
            }
          }
        ]
      }
    };

    axios.post.mockResolvedValueOnce(mockAIResponse);

    const result = await getPrefilledTask("Project Work");

    expect(result).toEqual({
      taskName: "Project Work",
      startTime: "2025-04-01T09:00:00Z",
      endTime: "2025-04-01T10:00:00Z",
      priority: "High",
      category: "Work",
    });
  });

  it("infers category if not present in response", async () => {
    const mockAIResponse = {
      data: {
        choices: [
          {
            message: {
              content: `Start time: 2025-04-01T09:00:00Z
End time: 2025-04-01T10:00:00Z
Priority: Medium`
            }
          }
        ]
      }
    };

    axios.post.mockResolvedValueOnce(mockAIResponse);

    const result = await getPrefilledTask("Yoga");

    expect(result).toEqual({
      taskName: "Yoga",
      startTime: "2025-04-01T09:00:00Z",
      endTime: "2025-04-01T10:00:00Z",
      priority: "Medium",
      category: "Personal", // inferred
    });
  });

  it("defaults to standard values on API error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    const taskName = "Some Unknown Task";
    const beforeCall = new Date();
    const result = await getPrefilledTask(taskName);
    const afterCall = new Date();

    expect(result.taskName).toBe(taskName);
    expect(result.priority).toBe("Medium");
    expect(result.category).toBe("Personal");

    // Ensure time range is valid
    const startTime = new Date(result.startTime).getTime();
    const endTime = new Date(result.endTime).getTime();

    expect(startTime).toBeGreaterThanOrEqual(beforeCall.getTime());
    expect(endTime - startTime).toBe(60 * 60 * 1000); // 1 hour
  });
});
