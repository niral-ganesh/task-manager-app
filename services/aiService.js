import axios from "axios";

// API Key
const OPENAI_API_KEY = ""; 

export const getPrefilledTask = async (templateName) => {
  // START Get AI response
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that generates task details for a productivity app.",
          },
          {
            role: "user",
            content: `Generate the following details for the task: ${templateName}.
            - Start time (ISO 8601 format)
            - End time (ISO 8601 format)
            - Priority (High, Medium, Low)
            - Category (either 'Work' or 'Personal')
            
            Respond with the exact format below:
            - Start time: ...
            - End time: ...
            - Priority: ...
            - Category: ...`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    // END Get AI response
    
    // Exrtract AI response
    const aiText = response.data.choices[0].message.content;
    console.log("AI response:", aiText);

    // START Extract values from AI response, using regex
    const prefilledTask = {
      taskName: templateName,
      startTime: aiText.match(/Start time: (.*?)(,|\n|$)/)?.[1]?.trim(),
      endTime: aiText.match(/End time: (.*?)(,|\n|$)/)?.[1]?.trim(),
      priority: aiText.match(/Priority: (.*?)(,|\n|$)/)?.[1]?.trim(),
      category: aiText.match(/Category: (.*?)(,|\n|$)/)?.[1]?.trim(),
    };
    // END Extract values from AI response, using regex

    console.log(prefilledTask);

    
    // START If the category is not provided by the AI, infer based on the task name
    const workTemplates = ["Homework", "Meeting", "Project Work", "Study Session"];
    const personalTemplates = ["Exercise", "Yoga", "Doctor Appointment", "Shopping"];

    if (!prefilledTask.category) {
      if (workTemplates.includes(templateName)) {
        prefilledTask.category = "Work";
      } else if (personalTemplates.includes(templateName)) {
        prefilledTask.category = "Personal";
      } else {
        prefilledTask.category = "Personal"; // fallback
      }
    }
    // END If the category is not provided by the AI, infer based on the task name
    
    // Return the task details based on the tempalte name
    return prefilledTask;
    
  } catch (error) {
    // Error handling
    console.error("AI Task Prefill Error:", error);

    // Return standard values
    return {
      taskName: templateName,
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      priority: "Medium",
      category: "Personal",
    };
  }
};
