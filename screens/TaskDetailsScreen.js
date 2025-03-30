// START import necessary dependencies
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { updateTask, deleteTask } from "../services/taskService";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Task details screen
export default function TaskDetailsScreen({ route, navigation }) {
  // Get task details
  const { task } = route.params;

  // START Function to open attachment link
  const openAttachment = () => {
    if (task.attachmentUrl) {
      // Open attachment link
      Linking.openURL(task.attachmentUrl);
    }
  };
  // END Function to open attachment link

  // START Function to mark task as completed
  const handleCompleteTask = async () => {
    // Update task status to completd
    await updateTask(task.id, { status: "completed" });

    // Navigate back to Home and refresh
    navigation.navigate("Main", { refresh: true }); 
  };
  // END Function to mark task as completed

  // START Function to Delete task from Firestore
  const handleDeleteTask = async () => {
    // Delete task
    await deleteTask(task.id);

    // Navigate back to Home and refresh
    navigation.navigate("Main", { refresh: true }); 
  };
  // END Function to Delete task from Firestore

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Task name */}
        <Text style={styles.title}>{task.taskName}</Text>

        {/* Category */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{task.category}</Text>
        </View>

        {/* Priority */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Priority:</Text>
          <Text style={[styles.value, task.priority === "High" ? styles.highPriority : task.priority === "Medium" ? styles.mediumPriority : styles.lowPriority]}>
            {task.priority}
          </Text>
        </View>

        {/* Status */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, task.status === "completed" ? styles.completedStatus : styles.pendingStatus]}>
            {task.status}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{task.location || "Not specified"}</Text>
        </View>

        {/* Start time */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>{new Date(task.startTime).toLocaleString()}</Text>
        </View>

        {/* End time */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.value}>{new Date(task.endTime).toLocaleString()}</Text>
        </View>

        {/* Reminder time */}
        {task.reminderTime && (
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Reminder Time:</Text>
            <Text style={styles.value}>{new Date(task.reminderTime).toLocaleString()}</Text>
          </View>
        )}

        {/* Task Notes */}
        <Text style={styles.sectionTitle}>Notes:</Text>
        <Text style={styles.notes}>{task.notes || "No additional notes"}</Text>

        {/* Task Attachment */}
        {task.attachmentUrl ? (
          <View style={styles.attachmentContainer}>
            <Text style={styles.sectionTitle}>Attachment:</Text>
            <TouchableOpacity style={styles.attachmentButton} onPress={openAttachment}>
              <Text style={styles.attachmentText}>View Attachment</Text>
              <AntDesign name="paperclip" size={18} color={ColourScheme.blue2} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          {/* Mark Task as Completed Button */}
          {task.status === "pending" ? ( 
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTask}>
              <Text style={styles.buttonText}>Mark as Completed</Text>
            </TouchableOpacity>
          ) : null}

          {/* Delete Task Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTask}>
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// START Styling
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ColourScheme.white,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: ColourScheme.blue1,
    alignSelf: "center",
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: ColourScheme.black,
  },
  value: {
    fontSize: 16,
    color: ColourScheme.blue2,
  },
  highPriority: {
    color: "#d9534f",
  },
  mediumPriority: {
    color: "#f0ad4e",
  },
  lowPriority: {
    color: "#5bc0de",
  },
  completedStatus: {
    color: "#28a745",
  },
  pendingStatus: {
    color: ColourScheme.red,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    color: ColourScheme.blue2,
  },
  notes: {
    fontSize: 14,
    color: ColourScheme.black,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  attachmentContainer: {
    marginTop: 15,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ColourScheme.blue5,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    alignSelf: "center",
    width: "60%",
  },
  attachmentText: {
    color: ColourScheme.blue2,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
  },
  completeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#28a745", 
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    padding: 12,
    backgroundColor: ColourScheme.red, 
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: ColourScheme.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
// END Styling
// END Task details screen