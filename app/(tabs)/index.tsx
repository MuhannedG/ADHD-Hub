import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

const DashboardScreen: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [focusSessions, setFocusSessions] = useState(0);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Simulated actions that earn points
  const completeTask = () => {
    setTasksCompleted(prev => prev + 1);
    setPoints(prev => prev + 10); // Earn 10 points for completing a task
  };

  const startFocusSession = () => {
    setFocusSessions(prev => prev + 1);
    setPoints(prev => prev + 20); // Earn 20 points for using the focus session
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.header, isDarkMode && styles.darkText]}>Dashboard</Text>
      
      {/* Stats Section */}
      <View style={[styles.statsContainer, isDarkMode && styles.darkCard]}>
        <Text style={[styles.statsTitle, isDarkMode && styles.darkText]}>Your Stats</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Points:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{points}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Tasks Completed:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{tasksCompleted}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Focus Sessions:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{focusSessions}</Text>
        </View>
      </View>
      
      {/* Gamification Actions */}
      <View style={[styles.gamificationContainer, isDarkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Earn Points</Text>
        <TouchableOpacity style={styles.gamificationButton} onPress={completeTask}>
          <Text style={styles.buttonText}>Complete a Task (+10 pts)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gamificationButton} onPress={startFocusSession}>
          <Text style={styles.buttonText}>Start Focus Session (+20 pts)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  darkContainer: {
    backgroundColor: '#121212'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  darkText: {
    color: '#fff'
  },
  statsContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  statLabel: {
    fontSize: 16,
    color: '#333'
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  gamificationContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  gamificationButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  },
  darkCard: {
    backgroundColor: '#2b2b2b'
  }
});
