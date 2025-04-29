import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
  useColorScheme,
  ScrollView
} from 'react-native';

const FocusSessionScreen: React.FC = () => {
  const [sessionType, setSessionType] = useState<'Single' | 'Loop'>('Single');
  const [sessionTime, setSessionTime] = useState('90'); // Default session time in minutes
  const [breakTime, setBreakTime] = useState('10');     // Default break time in minutes
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false); // Tracks if currently in break mode
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (isRunning) {
      if (remainingTime > 0) {
        timerRef.current = setTimeout(() => {
          setRemainingTime((prev) => prev - 1);
        }, 1000);
      } else {
        // In Loop mode, alternate between session and break times using isBreak state
        if (sessionType === 'Loop') {
          if (isBreak) {
            // Break ended, start a new session
            setRemainingTime(parseInt(sessionTime, 10) * 60);
            setIsBreak(false);
          } else {
            // Session ended, start break
            setRemainingTime(parseInt(breakTime, 10) * 60);
            setIsBreak(true);
          }
        } else {
          // For a single session, stop the timer when time is up
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
  }, [isRunning, remainingTime, sessionType, sessionTime, breakTime, isBreak]);

  const startSession = () => {
    setRemainingTime(parseInt(sessionTime, 10) * 60);
    setIsBreak(false);
    setIsRunning(true);
  };

  const stopSession = () => {
    setIsRunning(false);
    setRemainingTime(0);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header Section with ImageBackground */}
      <ImageBackground
        source={require('@/assets/images/fox.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            Focus Session
          </Text>
        </View>
      </ImageBackground>

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

      {/* Content Section */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
            Session Time (minutes):
          </Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            keyboardType="numeric"
            value={sessionTime}
            onChangeText={setSessionTime}
          />

          {/* Show break time input only in Loop mode */}
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

// Define reusable constants for colors and spacing
const COLORS = {
  lightBackground: '#f5f5f5',
  darkBackground: '#121212',
  lightCard: '#fff',
  darkCard: '#2b2b2b',
  lightText: '#333',
  darkText: '#fff',
  headerText: '#ffffff',
  headerTextDark: '#f0f0f0',
  tabActive: '#4CAF50',
  darkTab: '#2a2a2a',
  startButton: '#4CAF50',
  darkStartButton: '#1B5E20',
  stopButton: '#E53935',
  darkStopButton: '#B71C1C'
};

const SPACING = {
  containerPadding: 16,
  cardPadding: 16,
  cardMarginBottom: 16,
  headerHeight: 140,
  headerBorderRadius: 20,
  headerImageSize: 60,
  tabPaddingVertical: 8,
  tabPaddingHorizontal: 16,
  buttonPaddingVertical: 12,
  buttonPaddingHorizontal: 24,
};

const commonCardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  backgroundImage: {
    width: '100%',
    height: SPACING.headerHeight,
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
    color: COLORS.headerText,
  },
  headerTitleDark: {
    color: COLORS.headerTextDark,
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.lightCard,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabButton: {
    paddingVertical: SPACING.tabPaddingVertical,
    paddingHorizontal: SPACING.tabPaddingHorizontal,
  },
  tabButtonActive: {
    backgroundColor: COLORS.tabActive,
  },
  tabButtonText: {
    fontWeight: '600',
    color: COLORS.lightText,
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  darkTabButton: {
    backgroundColor: COLORS.darkTab,
  },
  scrollContent: {
    padding: SPACING.containerPadding,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.cardMarginBottom,
    ...commonCardShadow,
  },
  darkCard: {
    backgroundColor: COLORS.darkCard,
    shadowColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: COLORS.lightText,
    marginBottom: 6,
  },
  darkLabel: {
    color: COLORS.darkText,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: COLORS.lightCard,
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#555',
    color: COLORS.darkText,
  },
  timerCard: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.lightText,
  },
  darkTimer: {
    color: COLORS.darkText,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: COLORS.startButton,
    paddingVertical: SPACING.buttonPaddingVertical,
    paddingHorizontal: SPACING.buttonPaddingHorizontal,
    borderRadius: 8,
  },
  darkStartButton: {
    backgroundColor: COLORS.darkStartButton,
  },
  stopButton: {
    backgroundColor: COLORS.stopButton,
    paddingVertical: SPACING.buttonPaddingVertical,
    paddingHorizontal: SPACING.buttonPaddingHorizontal,
    borderRadius: 8,
  },
  darkStopButton: {
    backgroundColor: COLORS.darkStopButton,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
