import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Alert, ImageBackground } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

// Main class and variables declarations
const DashboardScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [focusSessions, setFocusSessions] = useState<number>(0);
  const [weeklyFocusSessions, setWeeklyFocusSessions] = useState<number>(0);
  const [monthlyTasksCompleted, setMonthlyTasksCompleted] = useState<number>(0);

  // logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  // Weekly/Monthly resets functions using dayjs library
  const getLastSunday = () => dayjs().day(0).format('YYYY-MM-DD');
  const getFirstOfMonth = () => dayjs().startOf('month').format('YYYY-MM-DD');

  // Useeffect hook that reads the user's stats in real time from the Firestore Database and updates it
  useEffect(() => {
    if (!auth.currentUser) return;

    const statsRef = doc(db, 'userStats', auth.currentUser.uid);

    const unsubscribe = onSnapshot(statsRef, async (docSnap) => {
      if (!docSnap.exists()) return;

      const stats = docSnap.data();
      setCompletedTasks(stats.completedTasksCount || 0);
      setPoints(stats.points || 0);
      setFocusSessions(stats.focusSessions || 0);

      setWeeklyFocusSessions(stats.weeklyFocusSessions || 0);
      setMonthlyTasksCompleted(stats.monthlyTasksCompleted || 0);

      // Weekly/Monthly reset logic for the challenges
      const weeklyReset = stats.weeklyReset || '';
      const monthlyReset = stats.monthlyReset || '';

      const currentSunday = getLastSunday();
      const currentMonthStart = getFirstOfMonth();

      const updates: any = {};

      if (weeklyReset !== currentSunday) {
        updates.weeklyFocusSessions = 0;
        updates.weeklyReset = currentSunday;
      }

      if (monthlyReset !== currentMonthStart) {
        updates.monthlyTasksCompleted = 0;
        updates.monthlyReset = currentMonthStart;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(statsRef, updates);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/*Header*/}
      <ImageBackground
        source={require('@/assets/images/dashboard-image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            Dashboard
          </Text>
        </View>
      </ImageBackground>

      {/* Stats Section */}
      <View style={[styles.statsContainer, isDarkMode && styles.darkCard]}>
        <Text style={[styles.statsTitle, isDarkMode && styles.darkText]}>Your Stats</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Points:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{points}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Tasks Completed:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{completedTasks}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>Focus Sessions:</Text>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{focusSessions}</Text>
        </View>
      </View>

      {/* Challenges Section */}
      <View style={[styles.challengesContainer, isDarkMode && styles.darkCard]}>
        <Text style={[styles.statsTitle, isDarkMode && styles.darkText]}>Challenges</Text>

        <View style={styles.challengeBox}>
          <Text style={[styles.challengeTitle, isDarkMode && styles.darkText]}>
            🏆 Weekly Challenge
          </Text>
          <Text style={[styles.challengeDescription, isDarkMode && styles.darkText]}>
            Complete 5 focus sessions this week!
          </Text>
          <Text style={[styles.progressText, isDarkMode && styles.darkText]}>
            Progress: {weeklyFocusSessions} / 5
          </Text>
        </View>

        <View style={styles.challengeBox}>
          <Text style={[styles.challengeTitle, isDarkMode && styles.darkText]}>
            🏅 Monthly Challenge
          </Text>
          <Text style={[styles.challengeDescription, isDarkMode && styles.darkText]}>
            Finish 20 tasks before the month ends!
          </Text>
          <Text style={[styles.progressText, isDarkMode && styles.darkText]}>
            Progress: {monthlyTasksCompleted} / 20
          </Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
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
  statsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  darkCard: {
    backgroundColor: '#2b2b2b',
  },
  darkText: {
    color: '#fff',
  },
  challengesContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  challengeBox: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#555',
  },
  progressText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
