import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ExternalLink } from '@/components/ExternalLink';

interface Question {
  title: string;
  content: JSX.Element | JSX.Element[];
}

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  const questions: Question[] = [
    {
      title: 'File-based routing',
      content: (
        <>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            This app has two screens:{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              app/(tabs)/index.tsx
            </ThemedText>{' '}
            and{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              app/(tabs)/explore.tsx
            </ThemedText>.
          </ThemedText>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            The layout file in{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              app/(tabs)/_layout.tsx
            </ThemedText>{' '}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
    },
    {
      title: 'Android, iOS, and web support',
      content: (
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
            w
          </ThemedText>{' '}
          in the terminal running this project.
        </ThemedText>
      ),
    },
    {
      title: 'Images',
      content: (
        <>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            For static images, you can use the{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              @2x
            </ThemedText>{' '}
            and{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              @3x
            </ThemedText>{' '}
            suffixes to provide files for different screen densities.
          </ThemedText>
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
    },
    {
      title: 'Custom fonts',
      content: (
        <>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            Open{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              app/_layout.tsx
            </ThemedText>{' '}
            to see how to load{' '}
            <ThemedText style={[styles.collapsibleTextBase, { fontFamily: 'SpaceMono' }, styles.text]}>
              custom fonts such as this one.
            </ThemedText>
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
    },
    {
      title: 'Light and dark mode components',
      content: (
        <>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            This template has light/dark mode support. The{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              useColorScheme()
            </ThemedText>{' '}
            hook lets you inspect what the user's current color scheme is and adjust UI colors.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
    },
    {
      title: 'Animations',
      content: (
        <>
          <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
            This template includes an example of an animated component. The{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              components/HelloWave.tsx
            </ThemedText>{' '}
            component uses{' '}
            <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
              react-native-reanimated
            </ThemedText>{' '}
            for a waving-animation.
          </ThemedText>
          {Platform.select({
            ios: (
              <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
                The Parallax header is provided by{' '}
                <ThemedText type="defaultSemiBold" style={[styles.emphasisText, styles.text]}>
                  ParallaxScrollView
                </ThemedText>.
              </ThemedText>
            ),
          })}
        </>
      ),
    },
  ];

  const [expanded, setExpanded] = useState<boolean[]>(
    questions.map(() => false)
  );
  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/info-image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            ADHD 101
          </Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {questions.map((q, i) => (
          <View key={i} style={[styles.card, { backgroundColor: isDarkMode ? '#2b2b2b' : '#fff' }]}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggle(i)}>
              <Text style={[styles.cardHeaderText, { color: isDarkMode ? '#fff' : '#333' }]}>
                {q.title}
              </Text>
              <Text style={[styles.collapseIcon, { color: isDarkMode ? '#fff' : '#333' }]}>
                {expanded[i] ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {expanded[i] && <View style={styles.cardContent}>{q.content}</View>}
          </View>
        ))}
      </ScrollView>
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
      color: '#fff',
    },
    headerTitleDark: {
      color: '#f0f0f0',
    },
    scrollViewContent: {
      padding: 16,
      // constrain width on web
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    card: {
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      width: '100%',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    cardHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    collapseIcon: {
      fontSize: 18,
    },
    cardContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    collapsibleTextBase: {
      fontSize: 16,
      marginVertical: 8,
      lineHeight: 22,
    },
    emphasisText: {
      fontWeight: '600',
    },
    linkText: {
      fontSize: 16,
      color: '#FF3B30',
      marginVertical: 8,
    },
    text: {
      color: isDarkMode ? '#fff' : '#333',
    },
  });
