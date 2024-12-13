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
} from 'react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

export default function TaskManagerScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

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

  const filteredTasks = tasks.filter((task) => task.category === selectedCategory);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetTasks();
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (): void => {
    if (newTask.title.trim() === '') {
      setValidationError('Task title is required!');
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        completed: false
      },
    ]);

    setIsModalVisible(false);
    setNewTask({ id: '', title: '', description: '', category: 'Daily', completed: false});
    setValidationError(null);
  };

  const handleDeleteTask = (taskId: string): void => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const resetTasks = (): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: false }))
    );
  };


  return (
    <SafeAreaView style={styles.container}>
       <ImageBackground
        source={require('@/assets/images/partial-react-logo.png')} //background image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Task Manager</Text>
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
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text style={item.completed ? styles.checkboxChecked : styles.checkboxUnchecked}>
                ✓
              </Text>
            </TouchableOpacity>
            <View>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.taskTitleCompleted,
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  item.completed && styles.taskDescriptionCompleted,
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks available</Text>}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>Add New Task</Text>

            {validationError && (
              <Text style={styles.validationError}>{validationError}</Text>
            )}

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
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
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

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
    },
    backgroundImage: {
      width: '100%',
      height: 200, // Adjust to make it as "huge" as you want
      justifyContent: 'flex-end', // Position the overlay at the bottom
    },
    headerOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
      padding: 20,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
      backgroundColor: '#6c63ff',
      borderColor: '#6c63ff',
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
      backgroundColor: '#6c63ff',
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
