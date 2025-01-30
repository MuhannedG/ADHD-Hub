import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

// Focus Session Screen
const FocusSessionScreen: React.FC = () => {
  const [sessionType, setSessionType] = useState<'Single' | 'Loop'>('Single');
  const [sessionTime, setSessionTime] = useState('90'); // Default session time in minutes
  const [breakTime, setBreakTime] = useState('10'); // Default break time in minutes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Type:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, sessionType === 'Single' && styles.selectedButton]}
          onPress={() => setSessionType('Single')}
        >
          <Text style={styles.buttonText}>Single</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, sessionType === 'Loop' && styles.selectedButton]}
          onPress={() => setSessionType('Loop')}
        >
          <Text style={styles.buttonText}>Loop</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Session Time (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={sessionTime}
        onChangeText={setSessionTime}
      />

      {sessionType === 'Loop' && (
        <>
          <Text style={styles.label}>Break Time In-between (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={breakTime}
            onChangeText={setBreakTime}
          />
        </>
      )}

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Session!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FocusSessionScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
