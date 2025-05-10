import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  useColorScheme,
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  writeBatch,
  getDoc,
  setDoc,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig'; // adjust if needed

// interface declaration and its compenents variables
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  createdAt?: any;
  userId?: string;
}

// main funciton and theme handling
export default function TaskManagerScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  // Daily tasks variables and layout
  const [selectedCategory, setSelectedCategory] = useState<string>('Daily');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    category: 'Daily',
    completed: false,
  });

  // useEffect to fetch stored data form the firestore database
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksFromFirestore = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Task;
          const { id: _, ...rest } = data;
          return {
            id: docSnap.id,
            ...rest,
          };
        });
        setTasks(tasksFromFirestore);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetTasks();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Task addition logic (including valdiating input, saving to database, and updating UI)
  const handleAddTask = async (): Promise<void> => {
    if (newTask.title.trim() === '') {
      setValidationError('Task title is required!');
      return;
    }
    if (newTask.title.length > 100) {
      setValidationError('Task title should be under 100 characters.');
      return;
    }
    if (newTask.description.length > 500) {
      setValidationError('Task description should be under 500 characters.');
      return;
    }
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        category: newTask.category,
        completed: false,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
      });
      setIsModalVisible(false);
      setNewTask({ id: '', title: '', description: '', category: 'Daily', completed: false });
      setValidationError(null);
      Alert.alert('Success', 'Task added to Firestore!');
    } catch (error: any) {
      Alert.alert('Error adding task', error.message);
    }
  };

  // Task deletion logic 
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      Alert.alert('Deleted', 'Task has been removed.');
    } catch (error: any) {
      Alert.alert('Error deleting task', error.message);
    }
  };

  // Updating tasks' score/points logic 
  const updateUserStatsOnComplete = async (userId: string) => {
    const statsRef = doc(db, 'userStats', userId);

    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      await updateDoc(statsRef, {
        completedTasksCount: increment(1),
        points: increment(10), // 10 points for each task
      });
    } else {
      await setDoc(statsRef, {
        completedTasksCount: 1,
        points: 10,
        focusSessions: 0,
      });
    }
  };

  // task completed logic and updated UI to reflect the compeletion
  const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed: !completed });

      if (!completed && auth.currentUser) {
        await updateUserStatsOnComplete(auth.currentUser.uid);
      }
    } catch (error: any) {
      Alert.alert('Error updating task', error.message);
    }
  };

  // resets tasks to uncolmpleted state
  const resetTasks = async (): Promise<void> => {
    try {
      const batch = writeBatch(db);
      tasks.forEach((task) => {
        const taskRef = doc(db, 'tasks', task.id);
        batch.update(taskRef, { completed: false });
      });
      await batch.commit();
      console.log('Tasks reset successfully!');
    } catch (error: any) {
      Alert.alert('Error resetting tasks', error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => task.category === selectedCategory);

  // Returns the full UI design of the tasks tab to the user (includes, task list, catogeroy selector, modal form, and interactions)
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/Task-image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            Task Manager
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.categoryContainer}>
        {['Daily', 'Weekly', 'Monthly'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View>
              <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                {item.title}
              </Text>
              <Text style={[styles.taskDescription, item.completed && styles.taskDescriptionCompleted]}>
                {item.description}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleTaskCompletion(item.id, item.completed)}
            >
              <Text style={item.completed ? styles.checkboxChecked : styles.checkboxUnchecked}>
                [✔]
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks available</Text>}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>Add New Task</Text>
            {validationError && <Text style={styles.validationError}>{validationError}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Task Description"
              placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              multiline={true}
            />
            <Text style={styles.modalSubtitle}>Select Category</Text>
            <View style={styles.modalCategoryContainer}>
              {['Daily', 'Weekly', 'Monthly'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newTask.category === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setNewTask({ ...newTask, category })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      newTask.category === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
                <Text style={styles.saveButtonText}>Save Task</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setValidationError(null);
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// Style sheet
const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
    },
    backgroundImage: {
      width: '100%',
      height: 140, // Header height 
    },
    headerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    headerTitleDark: {
      color: '#f0f0f0',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    categoryButton: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ddd',
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    categoryButtonActive: {
      backgroundColor: 'rgba(90, 90, 57, 0.5)',
    },
    categoryText: {
      color: isDarkMode ? '#aaa' : '#000',
    },
    categoryTextActive: {
      color: '#fff',
    },
    modalCategoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    taskItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 10,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
      marginBottom: 10,
    },
    checkbox: {
      marginRight: 10,
    },
    checkboxChecked: {
      color: '#6c63ff',
      fontWeight: 'bold',
    },
    checkboxUnchecked: {
      color: isDarkMode ? '#aaa' : '#ddd',
    },
    taskTitle: {
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
    },
    taskTitleCompleted: {
      textDecorationLine: 'line-through',
      color: isDarkMode ? '#888' : '#aaa',
    },
    taskDescription: {
      color: isDarkMode ? '#ccc' : '#666',
    },
    taskDescriptionCompleted: {
      textDecorationLine: 'line-through',
      color: isDarkMode ? '#888' : '#aaa',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      padding: 8,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: '#fff',
    },
    emptyText: {
      textAlign: 'center',
      color: isDarkMode ? '#aaa' : '#999',
    },
    addButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: 'rgba(90, 90, 57, 0.5)',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      padding: 20,
      backgroundColor: isDarkMode ? '#222' : '#fff',
      borderRadius: 10,
    },
    modalSubtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    saveButton: {
      padding: 10,
      backgroundColor: '#6c63ff',
      borderRadius: 10,
    },
    saveButtonText: {
      color: '#fff',
    },
    cancelButton: {
      padding: 10,
      backgroundColor: isDarkMode ? '#555' : '#ddd',
      borderRadius: 10,
    },
    cancelButtonText: {
      color: isDarkMode ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderColor: isDarkMode ? '#555' : '#ddd',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 10,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    validationError: {
      color: '#e74c3c',
      fontSize: 14,
      marginBottom: 10,
      textAlign: 'center',
    },
  });
