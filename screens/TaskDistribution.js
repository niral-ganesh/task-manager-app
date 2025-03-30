// START import necessary dependencies
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { showMessage } from "react-native-flash-message";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Task Distribution screen
export default function TaskDistribution({ route, navigation }) {
  // Get selected date and tasks for that date
  const { selectedDate, tasks } = route.params;

  // START Function to calculate total duration
  const calculateTotalDuration = (category) => {
    return tasks
      .filter(task => task.category === category)   // filter task
      .reduce((total, task) => {
        const start = new Date(task.startTime);     // start time
        const end = new Date(task.endTime);         // end time
        return total + (end - start) / (1000 * 60); // duration
      }, 0);
  };
  // END Function to calculate total duration

  // Get Work tasks
  const workTasks = tasks.filter(task => task.category === "Work");

  // Get Personal tasks
  const personalTasks = tasks.filter(task => task.category === "Personal");

  // Calculate total duration of Work tasks
  const workDuration = calculateTotalDuration("Work");

  // Calculate total duration of Personal tasks
  const personalDuration = calculateTotalDuration("Personal");

  // Total duration
  const totalDuration = workDuration + personalDuration;

  // START in-app Notification to maintain work-life balance
  useEffect(() => {
    if (totalDuration === 0) return;
    // If duration of Work tasks is more than Personal tasks,
    if (workDuration > personalDuration) {
      // Encourage users to prioritise Personal tasks
      showMessage({
        message: "Take Care of Yourself 💙",
        description: "You've spent more time on work today. Don’t forget to prioritise yourself!",
        type: "warning",
        icon: "auto",
        duration: 5000,
      });
      // If duration of Personal tasks is more than Work tasks,
    } else if (personalDuration > workDuration) {
      // Appreciate users for prioritising Personal tasks
      showMessage({
        message: "Great Job! 🎉",
        description: "Well done! You've prioritised your personal time today. Keep up the great balance!",
        type: "success",
        icon: "auto",
        duration: 5000,
      });
    }
  }, []);
  // END in-app Notification to maintain work-life balance

  // Data for pie chart
  const data = [
    // Work tasks
    {
      name: "Work",
      duration: workDuration,
      color: ColourScheme.blue2,
    },
    // Personal tasks
    {
      name: "Personal",
      duration: personalDuration,
      color: ColourScheme.blue3,
    },
  ].filter(item => item.duration > 0);

  // START Function to render tasks for the selected date
  const renderTask = ({ item }) => (
    // Navigate to Task Details page
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => navigation.navigate("TaskDetails", { task: item })}
    >
      {/* START Task details */}
      <View style={styles.taskDetails}>
        {/* Task name */}
        <Text style={[styles.taskText, item.status === "completed" && styles.completedText]}>
          {item.taskName}
        </Text>

        {/* Priority */}
        <Text style={styles.taskNotes}>Priority: {item.priority}</Text>

        {/* Duration */}
        <Text style={styles.taskDuration}>
          {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
        </Text>
      </View>
      {/* END Task details */}
    </TouchableOpacity>
  );
  // END Function to render tasks for the selected date
  
  // START Function to render the section title
  const renderSectionTitle = (title, color) => (
    <View style={styles.sectionTitleRow}>
      {/* Colour box as legend */}
      <View style={[styles.colorBox, { backgroundColor: color }]} />

      {/* Title */}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
  // END Function to render the section title

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{selectedDate}</Text>
      {totalDuration > 0 ? (
        <>
          {/* START Pie chart */}
          <PieChart
            data={data}
            width={Dimensions.get("window").width * 0.9}
            height={220}
            chartConfig={{
              backgroundColor: ColourScheme.white,
              color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
            }}
            accessor={"duration"}
            backgroundColor={"transparent"}
            paddingLeft={Dimensions.get("window").width * 0.25}
            absolute
            hasLegend={false} 
          />
          {/* END Pie chart */}

          {/* Work Tasks */}
          {workTasks.length > 0 ? (
            <>
              {renderSectionTitle("Work Tasks", ColourScheme.blue2)}
              <FlatList
                data={workTasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
              />
            </>
          ) : (
            <Text style={styles.noDataText}>No Work Tasks</Text>
          )}

          {/* Personal Tasks */}
          {personalTasks.length > 0 ? (
            <>
              {renderSectionTitle("Personal Tasks", ColourScheme.blue3)}
              <FlatList
                data={personalTasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
              />
            </>
          ) : (
            <Text style={styles.noDataText}>No Personal Tasks</Text>
          )}
        </>
      ) : (
        <Text style={styles.noDataText}>No tasks available for this date.</Text>
      )}
    </SafeAreaView>
  );
}

// START Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ColourScheme.white,
    // alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf: "center",
    color: ColourScheme.blue1,
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 5,
    padding: 10,
    backgroundColor: ColourScheme.blue5,
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
  },
  taskDetails: {
    marginLeft: 10,
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
});
// END Styling
// END Task Distribution screen