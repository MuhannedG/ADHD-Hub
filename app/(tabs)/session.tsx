import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  useColorScheme,
} from 'react-native';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';

export default function FocusSessionScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  const [sessionType, setSessionType] = useState<'Single' | 'Loop'>('Single');
  const [sessionTime, setSessionTime] = useState('90');
  const [breakTime, setBreakTime] = useState('10');
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logFocusSession = async () => {
    if (!auth.currentUser) return;
    const statsRef = doc(db, 'userStats', auth.currentUser.uid);
    try {
      await updateDoc(statsRef, {
        focusSessions: increment(1),
        weeklyFocusSessions: increment(1),
        points: increment(10),
      });
    } catch (error) {
      console.error('Error logging session:', error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (remainingTime > 0) {
        timerRef.current = setTimeout(() => {
          setRemainingTime((prev) => prev - 1);
        }, 1000);
      } else {
        if (sessionType === 'Loop') {
          if (isBreak) {
            setRemainingTime(parseInt(sessionTime) * 60);
            setIsBreak(false);
          } else {
            logFocusSession();
            setRemainingTime(parseInt(breakTime) * 60);
            setIsBreak(true);
          }
        } else {
          setIsRunning(false);
          logFocusSession();
        }
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, remainingTime, sessionType, sessionTime, breakTime, isBreak]);

  const startSession = () => {
    setRemainingTime(parseInt(sessionTime) * 60);
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
    <View style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require('@/assets/images/Foucs-image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            Focus Session
          </Text>
        </View>
      </ImageBackground>

      {/* Single / Loop Buttons */}
      <View style={styles.categoryContainer}>
        {['Single', 'Loop'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.categoryButton,
              sessionType === type && styles.categoryButtonActive,
            ]}
            onPress={() => setSessionType(type as 'Single' | 'Loop')}
          >
            <Text
              style={[
                styles.categoryText,
                sessionType === type && styles.categoryTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Session Time Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Session Time (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={sessionTime}
            onChangeText={setSessionTime}
          />

          {sessionType === 'Loop' && (
            <>
              <Text style={styles.label}>Break Time (minutes):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={breakTime}
                onChangeText={setBreakTime}
              />
            </>
          )}
        </View>

        {/* Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timer}>{formatTime(remainingTime)}</Text>
          {isBreak && isRunning && (
            <Text style={styles.breakText}>Break Time</Text>
          )}
        </View>
      </ScrollView>

      {/* Start / Stop Button at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={isRunning ? styles.stopButton : styles.startButton}
          onPress={isRunning ? stopSession : startSession}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Stop Session' : 'Start Session!'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    backgroundImage: {
      width: '100%',
      height: 140,
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
      backgroundColor: isDarkMode ? 'rgba(51,51,51,0.6)' : 'rgba(221,221,221,0.6)',
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
    scrollContent: {
      padding: 16,
      alignItems: 'center',
    },
    card: {
      width: '100%',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? 'rgba(43, 43, 43, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    },
    label: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#333',
      marginBottom: 6,
    },
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ccc',
      borderRadius: 8,
      backgroundColor: isDarkMode ? 'rgba(68, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 10,
    },
    timerCard: {
      width: '100%',
      borderRadius: 12,
      paddingVertical: 50, // More space above and below the timer
      paddingHorizontal: 16,
      marginBottom: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? 'rgba(43, 43, 43, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    },
    timer: {
      fontSize: 60,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
      textAlign: 'center',
    },
    breakText: {
      fontSize: 18,
      color: 'orange',
      marginTop: 4,
    },
    bottomButtonContainer: {
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    startButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
    stopButton: {
      backgroundColor: '#E53935',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    },
  });
