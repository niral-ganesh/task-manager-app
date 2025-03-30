// Mock Authentication
export const auth = {
  currentUser: { uid: "test-user-id" },
  onAuthStateChanged: jest.fn(),
};

// Mock Firestore Database
export const db = {};

// Mock Modules
export const collection = jest.fn(() => "mock-collection");
export const doc = jest.fn(() => "mock-doc");
export const addDoc = jest.fn();
export const getDocs = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();

// Mock Firebase Storage
export const storage = {}; 

// Mock methods
export const ref = jest.fn(() => "mock-ref");
export const uploadBytes = jest.fn(() => Promise.resolve());
export const getDownloadURL = jest.fn(() => Promise.resolve("https://example.com/mock-file.pdf"));
