// START import necessary dependencies
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { addTask } from "../services/taskService"; 
import DateTimePicker from "@react-native-community/datetimepicker";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Calendar } from "react-native-calendars";
import * as Notifications from 'expo-notifications';
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Create task screen
export default function CreateTask({ route, navigation }) {
  // Get the selected date from the Home screen 
  const [currentDate, setCurrentDate] = useState(null);

  // START Task details
  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(null); 
  const [attachment, setAttachment] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  // END Task details

  const parseUtcToLocal = (isoString) => {
    const parts = isoString.split(/[-T:Z]/); // [YYYY, MM, DD, HH, mm, ss]
    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      Number(parts[3]),
      Number(parts[4])
    );
  };


  // START Get the prefilled values from AI (if necessary)
  useEffect(() => {
    const prefilledTask = route.params?.prefilledTask;
    if (prefilledTask) {
      if (prefilledTask.taskName) setTaskName(prefilledTask.taskName);
      if (prefilledTask.category) setCategory(prefilledTask.category);
      if (prefilledTask.priority) setPriority(prefilledTask.priority);
      if (prefilledTask.startTime) {
        setStartTime(parseUtcToLocal(prefilledTask.startTime));
      }
      if (prefilledTask.endTime) {
        setEndTime(parseUtcToLocal(prefilledTask.endTime));
      }
    }
  }, []);
  // END Get the prefilled values from AI (if necessary)

  // START Handle day press to set the selected date
  const handleDayPress = (day) => {
    // Update the current date when a day is selected
    setCurrentDate(day.dateString); 
  };
  // END Handle day press to set the selected date

  // START Handle file picking and upload to Firebase Storage
  const handleFilePick = async () => {
    try {
      // Select file
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Extract the first selected file
        const file = result.assets[0]; 
        
        // File name and uri
        const fileUri = file.uri;
        const fileName = file.name || fileUri.split("/").pop();

        // Show loading indicator
        setUploading(true); 

        // Convert file to blob
        const response = await fetch(fileUri);
        const blob = await response.blob();

        // Upload file to Firebase Storage
        const storageRef = ref(storage, `taskAttachments/${fileName}`);
        await uploadBytes(storageRef, blob);

        // Get file URL
        const fileUrl = await getDownloadURL(storageRef);
        setAttachment({ url: fileUrl, name: fileName }); // store name too

        setUploading(false); // hide loading indicator
      }
    } catch (error) {
      // Error handling
      console.error("File upload failed:", error);
    }
  };
  // END Handle file picking and upload to Firebase Storage

  // START useEffect to log updated attachment URL
  useEffect(() => {
    if (attachment) {
      // Update attachment URL
      console.log("Updated attachment URL:", attachment);
    }
  }, [attachment]);
  // END useEffect to log updated attachment URL

  // START Handle add task to create new task
  const handleAddTask = async () => {
    // Check if task name has been entered
    if (!taskName.trim()) {
      alert("Please enter a task name.");
      return;
    }

    // Check if date has been selected
    if (!currentDate) {
      alert("Please select a date for the task.");
      return;
    }

    // Check if start time has been selected
    if (!startTime) {
      alert("Please select a start time.");
      return;
    }

    // Check if end time has been selected
    if (!endTime) {
      alert("Please select an end time.");
      return;
    }

    // Ensure end time is after start time
    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return;
    }

    // START Merge currentDate with chosen time
    const formatDateTime = (dateObj, currentDate) => {
      const datePart = currentDate + "T"; 

      // Extracts time
      const timePart = dateObj.toISOString().split("T")[1]; 

      // Combines selected date with time
      return new Date(datePart + timePart); 
    };
    // END Merge currentDate with chosen time

    // Format start time, end time and reminder time
    const formattedStartTime = formatDateTime(startTime, currentDate);
    const formattedEndTime = formatDateTime(endTime, currentDate);
    const formattedReminderTime = reminderTime ? formatDateTime(reminderTime, currentDate) : null;

    // New task
    const newTask = {
      taskName,
      notes,
      category,
      startTime: formattedStartTime.toISOString(),
      endTime: formattedEndTime.toISOString(),
      status: "pending",
      priority,
      reminderTime: formattedReminderTime ? formattedReminderTime.toISOString() : null,
      location,
      attachment: attachment?.url || "", // Save file URL
    };

    // Create reminder
    if (formattedReminderTime) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Task Reminder",
          body: `${taskName} starts soon.`,
          sound: "default",
        },
        trigger: new Date(formattedReminderTime),
      });
    }
    
    try {
      // Add the task
      await addTask(newTask); 

      // Navigate to Home and pass a refresh flag
      navigation.navigate("Main", { refresh: true }); 
    } catch (error) {
      // Error handling
      console.error("Error adding task:", error);
    }
  };
  // END Handle add task to create new task

  // START Function to render a time picker inside a modal
  const renderTimePicker = (value, setValue, showPicker, setShowPicker) => (
    <Modal transparent={true} visible={showPicker} animationType="slide">
      {/* Modal */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* Time picker */}
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                if (selectedTime) setValue(selectedTime);
              }}
            />

            {/* Done button */}
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <Text style={styles.closeModalText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    // END Function to render a time picker inside a modal
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={styles.container}>
            {/* If selectedDate is undefined, display the calendar */}
            {!currentDate ? (
              <>
                <Calendar
                  onDayPress={handleDayPress}  // Set the selected date when a day is pressed
                  markedDates={{
                    [currentDate]: { selected: true, selectedColor: ColourScheme.blue2 }, // Mark the selected date
                  }}
                  style={styles.calendar}
                />
              </>
            ) : (
              <Text style={styles.dateLabel}>Selected Date: {currentDate}</Text>
            )}

          {/* Input Task name */}
            <Text style={styles.label}>Task Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task name"
              value={taskName}
              onChangeText={setTaskName}
            />

            {/* Input Notes */}
            <Text style={styles.label}>Notes:</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Enter task notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Task Category Selection */}
            <Text style={styles.label}>Category:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.categoryButton, category === "Work" && styles.selectedCategory]}
                onPress={() => setCategory("Work")}
              >
                <Text>Work</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, category === "Personal" && styles.selectedCategory]}
                onPress={() => setCategory("Personal")}
              >
                <Text>Personal</Text>
              </TouchableOpacity>
            </View>

            {/* Task Priority Selection */}
            <Text style={styles.label}>Priority:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.categoryButton, priority === "Low" && styles.selectedCategory]}
                onPress={() => setPriority("Low")}
              >
                <Text>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, priority === "Medium" && styles.selectedCategory]}
                onPress={() => setPriority("Medium")}
              >
                <Text>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, priority === "High" && styles.selectedCategory]}
                onPress={() => setPriority("High")}
              >
                <Text>High</Text>
              </TouchableOpacity>
            </View>

            {/* Input Location */}
            <Text style={styles.label}>Location:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location (optional)"
              value={location}
              onChangeText={setLocation}
            />

            {/* Start Time Picker */}
            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartPicker(true)}>
              <Text>{startTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {renderTimePicker(startTime, setStartTime, showStartPicker, setShowStartPicker)}

            {/* End Time Picker */}
            <Text style={styles.label}>End Time:</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndPicker(true)}>
              <Text>{endTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {renderTimePicker(endTime, setEndTime, showEndPicker, setShowEndPicker)}

            {/* Reminder Time Picker */}
            <Text style={styles.label}>Reminder Time:</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowReminderPicker(true)}>
              <Text>{reminderTime ? reminderTime.toLocaleTimeString() : "Set Reminder"}</Text>
            </TouchableOpacity>
            {renderTimePicker(reminderTime || new Date(), setReminderTime, showReminderPicker, setShowReminderPicker)}

            <View style={styles.bottomContainer}>
              {/* Attach File */}
              {!attachment?.url && (
                <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
                  <Text style={styles.fileButtonText}>Attach File</Text>
                </TouchableOpacity>
              )}

              {/* Show File Name if attached */}
              {uploading ? (
                <Text style={{ marginTop: 10, color: ColourScheme.blue1 }}>Uploading attachment...</Text>
              ) : (
                attachment?.url && (
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{attachment.name}</Text>
                    <TouchableOpacity onPress={() => setAttachment("")}>
                      {/* Remove file */}
                      <Text style={styles.removeFileText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}


              {/* Add Task Button */}
              <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
                <Text style={styles.addTaskButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// START Styling
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
    backgroundColor: ColourScheme.white,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: ColourScheme.blue3,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: ColourScheme.lightgrey,
    borderRadius: 5,
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: ColourScheme.blue3,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: ColourScheme.blue3,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  colorContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: ColourScheme.black,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: ColourScheme.white,
    padding: 20,
    borderRadius: 10,
  },
  closeModalText: {
    color: ColourScheme.red,
    textAlign: "center",
    marginTop: 10,
  },
  bottomContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  fileButton: {
    backgroundColor: ColourScheme.blue5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "40%",
  },
  fileButtonText: {
    color: ColourScheme.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: ColourScheme.blue5,
    padding: 8,
    borderRadius: 5,
    width: "80%",
    justifyContent: "space-between",
  },
  fileName: {
    color: ColourScheme.blue1,
    fontSize: 14,
    fontWeight: "bold",
  },
  removeFileText: {
    color: ColourScheme.red,
    fontSize: 14,
    fontWeight: "bold",
  },
  addTaskButton: {
    backgroundColor: ColourScheme.blue2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "70%",
    marginVertical: 20,
  },
  addTaskButtonText: {
    color: ColourScheme.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
// END Styling
// END Create task screen