// app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

// main fucntion declaration
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed. Current user:', currentUser);
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // When auth state is resolved, redirect using router.replace
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        console.log('User exists, redirecting to tabs');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('No user, redirecting to auth');
        router.replace('/auth');
      }
    }
  }, [user, authLoading, router]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Instead of conditionally returning a loading indicator,
  // always return the navigator. You can conditionally render
  // a loading UI inside a screen if needed.
  if (!fontsLoaded || authLoading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Render a fallback loading UI as a screen */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </ThemeProvider>
    );
  }

  // Once ready, render the navigator using <Slot />
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
