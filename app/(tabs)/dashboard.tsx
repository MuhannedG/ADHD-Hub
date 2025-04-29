import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Alert, ImageBackground } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const DashboardScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [focusSessions, setFocusSessions] = useState<number>(0); // Placeholder for future features

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const statsRef = doc(db, 'userStats', auth.currentUser.uid);

    const unsubscribe = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const stats = docSnap.data();
        setCompletedTasks(stats.completedTasksCount || 0);
        setPoints(stats.points || 0);
        setFocusSessions(stats.focusSessions || 0);
      } else {
        // If userStats doesn't exist yet, show 0s
        setCompletedTasks(0);
        setPoints(0);
        setFocusSessions(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header with ImageBackground */}
      <ImageBackground
        source={require('@/assets/images/fox.webp')}
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

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

// --- Styles ---
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
