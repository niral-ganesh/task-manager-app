// START import necessary dependencies
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import { getPrefilledTask } from "../services/aiService";
import ColourScheme from "../config/ColourScheme";
// END import necessary dependencies

// START Template list screen
export default function TemplateListScreen({ navigation }) {
  // Standard templates
  const [templates, setTemplates] = useState([
    { id: "1", name: "Homework" },
    { id: "2", name: "Meeting" },
    { id: "3", name: "Exercise" },
    { id: "4", name: "Study Session" },
    { id: "5", name: "Shopping" },
    { id: "6", name: "Yoga" },
    { id: "7", name: "Project Work" },
    { id: "8", name: "Doctor Appointment" },
  ]);
  
  // Modal and new template name
  const [showModal, setShowModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  
  // START Function to add template
  const handleAddTemplate = () => {
    // Ensure that user enters a template name
    if (!newTemplateName.trim()) {
      Alert.alert("Please enter a template name.");
      return;
    }
    
    // Change the first letter of the template to upper case
    const formattedName = newTemplateName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    
    // START Check if template name already exists
    const isDuplicate = templates.some(
      (template) => template.name.toLowerCase() === formattedName.toLowerCase()
    );
    
    // If the the template name already exists, 
    if (isDuplicate) {
      // Display alert
      Alert.alert("Template already exists.");
      return;
    }
    // END Check if template name already exists
    
    // New template
    const newTemplate = {
      id: Date.now().toString(),
      name: formattedName,
    };
    
    // Create new template and close modal
    setTemplates((prev) => [...prev, newTemplate]);
    setNewTemplateName("");
    setShowModal(false);
  };
  // END Function to add template
  
  // START Function to handle template selection
  const handleTemplateSelection = async (templateName) => {
    // Get AI response for prefilled task details
    const prefilledTask = await getPrefilledTask(templateName);

    // Navigate to create task page
    navigation.navigate("CreateTask", { prefilledTask });
  };
  // END Function to handle template selection
  
  // START Function to delete a template
  const confirmDelete = (id, name) => {
    // Alert to confirm deletion
    Alert.alert(
      "Delete Template",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Delete template
            setTemplates((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };
  // END Function to delete a template

  return (
    <SafeAreaView style={styles.container}>
      {/* START Heading */}
      <View style={styles.headerRow}>
        {/* Select template */}
        <Text style={styles.title}>Select a Template or </Text>
        {/* Add Template Button */}
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addTemplateBtn}>
          <Text style={styles.addTemplateText}>Add Template</Text>
        </TouchableOpacity>
      </View>
      
      {/* Information for user */}
      <Text style={styles.subText}>
        Templates can generate a task with AI assistance.
      </Text>
      {/* END Heading */}

      {templates.length === 0 ? (
        <Text style={styles.emptyText}>No templates available.</Text>
      ) : (
        // START Templates
        <SwipeListView
          data={templates}
          keyExtractor={(item) => item.id}
          closeOnRowPress={true}
          renderItem={({ item }) => (
            // Template container
            <TouchableOpacity
              style={styles.templateContainer}
              onPress={() => handleTemplateSelection(item.name)}
              activeOpacity={1}
            >
              {/* Template details */}
              <View style={styles.templateDetails}>
                {/* Template name */}
                <Text testID={`template-text-${item.id}`} style={styles.taskText}>
                  {item.name}
                </Text>
              </View>
              <AntDesign name="rightcircle" size={20} color={ColourScheme.blue2} />
            </TouchableOpacity>
          )}
          // Delete template
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenRow}>
              <TouchableOpacity
                testID={`delete-btn-${item.id}`}
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id, item.name)}
              >
                {/* Delete button */}
                <Feather name="trash-2" size={24} color={ColourScheme.white} />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-80}
          disableRightSwipe
        />
        // END Templates
      )}
      
      {/* START Modal to add template */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Heading */}
            <Text style={styles.modalTitle}>New Template</Text>

            {/* Input template name */}
            <TextInput
              style={styles.modalInput}
              placeholder="Enter template name"
              value={newTemplateName}
              onChangeText={setNewTemplateName}
            />

            {/* Add template button */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddTemplate}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => {
                  setShowModal(false);
                  setNewTemplateName("");
                }}
              >
                <Text style={[styles.modalBtnText, { color: "#333" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* END Modal to add template */}
    </SafeAreaView>
  );
}

// START Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ColourScheme.white,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
  },
  addTemplateBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: ColourScheme.blue3,
    borderRadius: 6,
  },
  addTemplateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    width: "90%",
    alignSelf: "center",
  },
  templateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: ColourScheme.blue5,
    borderRadius: 5,
    width: "80%",
    alignSelf: "center",
    zIndex: 1,
  },
  templateDetails: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: ColourScheme.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteText: {
    color: ColourScheme.white,
    fontSize: 12,
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 50,
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: ColourScheme.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: ColourScheme.blue2,
    borderRadius: 5,
    alignItems: "center",
  },
  modalBtnText: {
    color: ColourScheme.white,
    fontWeight: "bold",
  },
  hiddenRow: {
    alignItems: "center",
    backgroundColor: ColourScheme.red,
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    borderRadius: 5,
    marginVertical: 10,
    paddingRight: 5,
    width: "80%",
    alignSelf: "center",
  },
});
// END Styling
// END Template list screen