import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';

export default function MindfulnessScreen(): JSX.Element {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  const [breathingExpanded, setBreathingExpanded] = useState(false);
  const [groundingExpanded, setGroundingExpanded] = useState(false);
  const [journalingExpanded, setJournalingExpanded] = useState(false);
  const [creativeExpanded, setCreativeExpanded] = useState(false);

  const inhale = 4000;
  const hold = 4000;
  const exhale = 4000;
  const hold2 = 4000;

  const dotSize = 12;

  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const [breathingPhase, setBreathingPhase] = useState('');

  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  useEffect(() => {
    if (boxWidth === 0 || boxHeight === 0) return; // Wait for layout

    const maxX = boxWidth - dotSize;
    const maxY = boxHeight - dotSize;

    const phases = [
      { x: maxX, y: 0, duration: inhale, label: 'Breathe In' },  // Move right
      { x: maxX, y: maxY, duration: hold, label: 'Hold' },       // Move down
      { x: 0, y: maxY, duration: exhale, label: 'Breathe Out' }, // Move left
      { x: 0, y: 0, duration: hold2, label: 'Hold' },            // Move up
    ];

    let index = 0;

    function animate() {
      const { x: toX, y: toY, duration, label } = phases[index];
      setBreathingPhase(label);
      Animated.parallel([
        Animated.timing(x, {
          toValue: toX,
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(y, {
          toValue: toY,
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(() => {
        index = (index + 1) % phases.length;
        animate();
      });
    }

    animate();
  }, [boxWidth, boxHeight, x, y]);

  const [gratitudeText, setGratitudeText] = useState('');
  const [savedEntries, setSavedEntries] = useState<string[]>([]);

  const handleSaveGratitude = () => {
    if (gratitudeText.trim() === '') {
      Alert.alert('Empty Entry', 'Please enter something you are grateful for.');
      return;
    }
    setSavedEntries([...savedEntries, gratitudeText]);
    setGratitudeText('');
    Alert.alert('Saved', 'Your gratitude entry has been saved.');
  };

  const onBoxLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBoxWidth(width);
    setBoxHeight(height);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/fox.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
            Mindfulness
          </Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Mindful Breathing Section */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setBreathingExpanded(!breathingExpanded)}
          >
            <Text style={styles.cardHeaderText}>Mindful Breathing (Box Breathing)</Text>
            <Text style={styles.collapseIcon}>{breathingExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {breathingExpanded && (
            <View style={styles.cardContent}>
              <Text style={styles.boxLabel}>{breathingPhase}</Text>
              <View style={styles.boxContainer} onLayout={onBoxLayout}>
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: isDarkMode ? '#fff' : '#333',
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}
                />
              </View>
              <Text style={styles.cardContentText}>
                Follow the dot around the box: inhale, hold, exhale, hold.
              </Text>
            </View>
          )}
        </View>

        {/* Grounding Techniques Section */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setGroundingExpanded(!groundingExpanded)}
          >
            <Text style={styles.cardHeaderText}>Grounding Techniques</Text>
            <Text style={styles.collapseIcon}>{groundingExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {groundingExpanded && (
            <View style={styles.cardContent}>
              <Text style={styles.cardContentText}>Use your senses to ground yourself in the present moment:</Text>
              <Text style={styles.cardContentText}>• 5 things you can see</Text>
              <Text style={styles.cardContentText}>• 4 things you can touch</Text>
              <Text style={styles.cardContentText}>• 3 things you can hear</Text>
              <Text style={styles.cardContentText}>• 2 things you can smell</Text>
              <Text style={styles.cardContentText}>• 1 thing you can taste</Text>
            </View>
          )}
        </View>

        {/* Journaling Section */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setJournalingExpanded(!journalingExpanded)}
          >
            <Text style={styles.cardHeaderText}>Journaling</Text>
            <Text style={styles.collapseIcon}>{journalingExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {journalingExpanded && (
            <View style={styles.cardContent}>
              <Text style={styles.cardContentText}>List something you're grateful for today to cultivate positivity.</Text>
              <TextInput
                style={styles.input}
                placeholder="What are you grateful for?"
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                value={gratitudeText}
                onChangeText={setGratitudeText}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveGratitude}>
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </TouchableOpacity>
              {savedEntries.length > 0 && (
                <View style={styles.entryContainer}>
                  <Text style={styles.subtitle}>Your Entries:</Text>
                  {savedEntries.map((entry, index) => (
                    <Text key={index} style={styles.entryText}>• {entry}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Creative Expression Section */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setCreativeExpanded(!creativeExpanded)}
          >
            <Text style={styles.cardHeaderText}>Creative Expression</Text>
            <Text style={styles.collapseIcon}>{creativeExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {creativeExpanded && (
            <View style={styles.cardContent}>
              <Text style={styles.cardContentText}>Take 5-10 minutes to doodle, draw, or write something to release tension.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(dark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#f9f9f9',
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
    card: {
      backgroundColor: dark ? '#2b2b2b' : '#fff',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
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
      color: dark ? '#fff' : '#333',
    },
    collapseIcon: {
      fontSize: 18,
      color: dark ? '#fff' : '#333',
    },
    cardContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      alignItems: 'center',
    },
    cardContentText: {
      fontSize: 14,
      color: dark ? '#fff' : '#333',
      marginBottom: 8,
      textAlign: 'center',
    },
    boxContainer: {
      width: 250,
      height: 250,
      borderWidth: 4,
      borderColor: '#333',
      position: 'relative',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    dot: {
      position: 'absolute',
    },
    boxLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: dark ? '#fff' : '#333',
      marginBottom: 12,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: dark ? '#444' : '#ccc',
      borderRadius: 8,
      padding: 8,
      color: dark ? '#fff' : '#000',
      marginTop: 12,
    },
    saveButton: {
      marginTop: 12,
      backgroundColor: '#4caf50',
      padding: 12,
      borderRadius: 8,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    entryContainer: {
      width: '100%',
      marginTop: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: dark ? '#fff' : '#333',
      marginBottom: 8,
    },
    entryText: {
      fontSize: 14,
      color: dark ? '#ddd' : '#555',
      marginBottom: 4,
    },
  });
}
