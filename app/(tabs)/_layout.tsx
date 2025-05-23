import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        // home (dashboard) screen navigator 
        name="dashboard"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        // Task manager screen navigator
        name="task"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
        }}
      />
      <Tabs.Screen
        // Focus Session screen navigator
        name="session"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="alarm" color={color} />,
        }}
      />
      <Tabs.Screen
        // Mindfulness screen navigator
        name="mindful"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="hands-pray" color={color} />,
        }}
      />
      <Tabs.Screen
        // ADHD 101 (FAQa) about ADHD screen navigator
        name="info"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info" color={color} />,
        }}
      />
    </Tabs>
  );
}
