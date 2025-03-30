// START import necessary dependencies
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import { getTasks, updateTask } from "../services/taskService"; 
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Home screen
export default function Home({ navigation }) {
  // Selected date on the calendar
  const [selectedDate, setSelectedDate] = useState("");

  // Tasks for the selected date
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchTasks();
    }
  }, [selectedDate]);

  // START Function to fetch tasks using getTasks
  const fetchTasks = async () => {
    setLoading(true);

    // Get all tasks for the logged-in user
    const allTasks = await getTasks();

    // Filter tasks based on the selected date
    const filteredTasks = allTasks.filter(
      (task) => task.startTime.split("T")[0] === selectedDate
    );
    setTasks(filteredTasks);
    console.log(filteredTasks);
    setLoading(false);
  };
  // END Function to fetch tasks using getTasks

  // START Handle task completion
  const toggleTaskCompletion = async (taskId, isCompleted) => {
    // Update task
    await updateTask(taskId, { status: isCompleted ? "pending" : "completed" });
    
    // Fetch tasks
    fetchTasks();
  };
  // END Handle task completion

  // START Handle day press
  const handleDayPress = (day) => {
    // Set the selected date on the calendar
    setSelectedDate(day.dateString);
  };
  // END Handle day press

  // START Function to render tasks for the selected date
  const renderTask = ({ item }) => (
    // Navigate to Task Details page
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => navigation.navigate("TaskDetails", { task: item })}
    >
      {/* Custom checkbox to handle task completion */}
      <TouchableOpacity
        testID={`checkbox-${item.id}`}
        style={[styles.checkbox, item.status === "completed" && styles.checkboxChecked]}
        onPress={() => toggleTaskCompletion(item.id, item.status === "completed")}
      >
        {item.status === "completed" && <AntDesign name="check" size={18} color={ColourScheme.white} />}
      </TouchableOpacity>

      {/* START Task details */}
      <View style={styles.taskDetails}>
        {/* Task name */}
        <Text style={[styles.taskText, item.status === "completed" && styles.completedText]}>
          {item.taskName}
        </Text>
        {/* Priority */}
        <Text style={styles.taskNotes}>Priority: {item.priority}</Text>
        {/* Start and end time */}
        <Text style={styles.taskDuration}>
          {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
        </Text>
      </View>
      {/* END Task details */}
    </TouchableOpacity>
  );
  // END Function to render tasks for the selected date

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* START Calendar */}
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: ColourScheme.blue2 },
          }}
          style={styles.calendar}
        />
        {/* END Calendar */}

        {selectedDate ? (
          <>
            {/* Selected Date */}
            <View style={styles.dateRow}>
              <Text style={styles.selectedDate}>{selectedDate}:</Text>

              {/* Task Distribution Button */}
              <TouchableOpacity
                style={styles.distributionButton}
                onPress={() => navigation.navigate("TaskDistribution", { selectedDate, tasks })}
              >
                <Text style={styles.distributionButtonText}>Task Distribution</Text>
              </TouchableOpacity>
            </View>

            {/* Load tasks for the selected date */}
            {loading ? (
              <ActivityIndicator size="large" color={ColourScheme.blue2} />
            ) : tasks.length > 0 ? (
              <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
              />
            ) : (
              <Text style={styles.noTaskText}>No tasks for this day</Text>
            )}
          </>
        ) : (
          <Text style={styles.prompt}>Select a date to view tasks</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// START Styling
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: ColourScheme.white,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    backgroundColor: ColourScheme.blue2,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ColourScheme.white,
  },
  calendar: {
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: "bold",
  },
  distributionButton: {
    backgroundColor: ColourScheme.blue2,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  distributionButtonText: {
    color: ColourScheme.white,
    fontWeight: "bold",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    backgroundColor: ColourScheme.blue5,
    borderRadius: 5,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: ColourScheme.black,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: ColourScheme.blue2,
    borderColor: ColourScheme.black,
  },
  taskDetails: {
    marginLeft: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  taskNotes: {
    fontSize: 14,
    color: "#555",
  },
  taskDuration: {
    fontSize: 14,
    color: "#555",
  },
  noTaskText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
    color: "#777",
  },
  prompt: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
});
// END Styling
// END Home screen