// START import necessary dependencies
import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "../firebase";
import { auth } from "../firebase";
// END import necessary dependencies

// START Function to add a new task
export const addTask = async (task) => {
  try {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Handle optional fields by setting default values if missing
    const newTask = {
      userId: user.uid,
      taskName: task.taskName,
      notes: task.notes,
      category: task.category,
      startTime: task.startTime,
      endTime: task.endTime,
      status: task.status || "pending", // Default: pending
      priority: task.priority || "Medium", // Default: empty string if not provided
      reminderTime: task.reminderTime || null, // Default: null if not set
      location: task.location || null, // Default: empty string
      attachmentUrl: task.attachment || null, // Default: empty string
    };

    // Add task
    await addDoc(collection(db, "tasks"), newTask);
  } catch (error) {
    // Error handling
    console.error("Error adding task:", error);
  }
};
// END Function to add a new task

// START Function to get all tasks for the logged-in user
export const getTasks = async () => {
  try {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Get tasks
    const querySnapshot = await getDocs(collection(db, "tasks"));
    return querySnapshot.docs
      .filter((doc) => doc.data().userId === user.uid) // Ensure only user’s tasks are fetched
      .map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Error handling
    console.error("Error getting tasks:", error);
    return [];
  }
};
// END Function to get all tasks for the logged-in user

// START Function to update a task
export const updateTask = async (taskId, updatedData) => {
  try {
    // Update task
    await updateDoc(doc(db, "tasks", taskId), updatedData);
  } catch (error) {
    // Error handling
    console.error("Error updating task:", error);
  }
};
// END Function to update a task

// START Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    // Delete task
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    // Error handling
    console.error("Error deleting task:", error);
  }
};
// END Function to delete a task