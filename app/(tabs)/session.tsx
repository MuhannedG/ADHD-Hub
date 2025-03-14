import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  useColorScheme,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FocusSessionScreen: React.FC = () => {
  const [sessionType, setSessionType] = useState<'Single' | 'Loop'>('Single');
  const [sessionTime, setSessionTime] = useState('90'); // Default session time in minutes
  const [breakTime, setBreakTime] = useState('10');     // Default break time in minutes
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (isRunning) {
      if (remainingTime > 0) {
        timerRef.current = setTimeout(() => {
          setRemainingTime((prev) => prev - 1);
        }, 1000);
      } else {
        // If we're looping, alternate between sessionTime and breakTime
        if (sessionType === 'Loop') {
          setRemainingTime((prev) =>
            prev === 0 ? parseInt(breakTime, 10) * 60 : parseInt(sessionTime, 10) * 60
          );
        } else {
          // If single session, just stop
          setIsRunning(false);
        }
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, remainingTime, sessionType, sessionTime, breakTime]);

  const startSession = () => {
    setRemainingTime(parseInt(sessionTime, 10) * 60);
    setIsRunning(true);
  };

  const stopSession = () => {
    setIsRunning(false);
    setRemainingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Top Section / Header */}
      <LinearGradient
        colors={isDarkMode ? ['#2b2b2b', '#1b1b1b'] : ['#fbc2eb', '#a18cd1']}
        style={styles.header}
      >
        {/* If you have a cute illustration, place it here */}
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Replace with your local or remote image
          style={styles.headerImage}
        />
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          Focus Session
        </Text>
      </LinearGradient>

      {/* Tabs Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            sessionType === 'Single' && styles.tabButtonActive,
            isDarkMode && styles.darkTabButton
          ]}
          onPress={() => setSessionType('Single')}
        >
          <Text
            style={[
              styles.tabButtonText,
              sessionType === 'Single' && styles.tabButtonTextActive
            ]}
          >
            Single
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            sessionType === 'Loop' && styles.tabButtonActive,
            isDarkMode && styles.darkTabButton
          ]}
          onPress={() => setSessionType('Loop')}
        >
          <Text
            style={[
              styles.tabButtonText,
              sessionType === 'Loop' && styles.tabButtonTextActive
            ]}
          >
            Loop
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Scroll (Inputs + Timer + Start/Stop) */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          {/* Session Time */}
          <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
            Session Time (minutes):
          </Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            keyboardType="numeric"
            value={sessionTime}
            onChangeText={setSessionTime}
          />

          {/* Break Time (Loop only) */}
          {sessionType === 'Loop' && (
            <>
              <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
                Break Time In-between (minutes):
              </Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                keyboardType="numeric"
                value={breakTime}
                onChangeText={setBreakTime}
              />
            </>
          )}
        </View>

        {/* Timer Display */}
        <View style={[styles.card, styles.timerCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.timer, isDarkMode && styles.darkTimer]}>
            {formatTime(remainingTime)}
          </Text>
        </View>

        {/* Start/Stop Button */}
        <View style={styles.buttonRow}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.startButton, isDarkMode && styles.darkStartButton]}
              onPress={startSession}
            >
              <Text style={styles.startButtonText}>Start Session!</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.stopButton, isDarkMode && styles.darkStopButton]}
              onPress={stopSession}
            >
              <Text style={styles.startButtonText}>Stop Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FocusSessionScreen;

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  darkContainer: {
    backgroundColor: '#121212'
  },

  // Header (Gradient + Image + Title)
  header: {
    width: '100%',
    height: 140,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerImage: {
    width: 60,
    height: 60,
    marginBottom: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  headerTitleDark: {
    color: '#f0f0f0'
  },

  // Tabs (Single / Loop)
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    overflow: 'hidden'
  },
  darkTabButton: {
    backgroundColor: '#2a2a2a'
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  tabButtonActive: {
    backgroundColor: '#4CAF50'
  },
  tabButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  tabButtonTextActive: {
    color: '#fff'
  },

  // Content Scroll
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center'
  },

  // Card styling
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  darkCard: {
    backgroundColor: '#2b2b2b',
    shadowColor: '#fff'
  },

  // Labels + Inputs
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6
  },
  darkLabel: {
    color: '#ffffff'
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#555',
    color: '#fff'
  },

  // Timer card & text
  timerCard: {
    alignItems: 'center'
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333'
  },
  darkTimer: {
    color: '#fff'
  },

  // Button row + start/stop
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  darkStartButton: {
    backgroundColor: '#1B5E20'
  },
  stopButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  darkStopButton: {
    backgroundColor: '#B71C1C'
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
