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
      title: 'What is ADHD?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          ADHD is a neurodevelopmental disorder characterized by symptoms such as inattention, hyperactivity, and impulsivity. These symptoms can interfere with daily functioning and development.
        </ThemedText>
        <ExternalLink href="https://www.health.com/adhd-overview-7187317">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
  },
    {
      title: 'How is ADHD Diagnosed?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          Diagnosis involves a comprehensive evaluation by a qualified healthcare professional, considering behavioral symptoms, medical history, and input from multiple sources like parents or teachers. Symptoms must be present in multiple settings and have appeared before the age of 12.
        </ThemedText>
        <ExternalLink href="https://adhdireland.ie/general-information/diagnosis/">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
  },
    {
      title: 'What Are The Common Symptoms of ADHD?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          Common symptoms include difficulty sustaining attention, forgetfulness, fidgeting, impulsivity, and difficulty organizing tasks. Symptoms can vary between individuals and may change over time.
        </ThemedText>
        <ExternalLink href="https://www.verywellhealth.com/what-is-inattentive-adhd-5203366">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
  },
  {
    title: 'What Causes ADHD?',
    content: (
      <>
      <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
        The exact cause of ADHD is unknown, but research suggests a combination of genetic, environmental, and neurological factors contribute to its development.
      </ThemedText>
      <ExternalLink href="https://www.verywellmind.com/what-causes-adhd-20465">
          <ThemedText type="link" style={styles.linkText}>
            Learn more
          </ThemedText>
        </ExternalLink>
      </>
    ),
  },
    {
      title: 'Can Lifestyle Changes Help Manage ADHD Symptoms?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          Yes, regular exercise, a healthy diet, structured routines, and adequate sleep can help manage symptoms. Mindfulness and organizational strategies may also be beneficial.
        </ThemedText>
        <ExternalLink href="https://www.verywellhealth.com/what-is-inattentive-adhd-5203366">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
  },
    {
      title: 'Can adults be diagnosed with ADHD?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          Yes, adults can be diagnosed with ADHD. Symptoms may have been present in childhood but went unrecognized. Adult diagnosis involves evaluating current symptoms and their impact on daily life.
        </ThemedText>
        <ExternalLink href="https://adhdireland.ie/for-adults/adhd-in-adults/">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
        </>
      ),
  },
    {
      title: 'How is ADHD Treated?',
      content: (
        <>
        <ThemedText style={[styles.collapsibleTextBase, styles.text]}>
          Treatment often includes a combination of medication, behavioral therapy, counseling, and educational support. The approach depends on the individual's age, symptoms, and specific needs.
        </ThemedText>
        <ExternalLink href="https://adhdireland.ie/general-information/treatment/">
            <ThemedText type="link" style={styles.linkText}>
              Learn more
            </ThemedText>
          </ExternalLink>
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
