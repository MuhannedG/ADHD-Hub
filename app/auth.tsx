// app/auth.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Adjust as needed

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true); // Toggles between "Log In" and "Sign Up"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // The root layout's onAuthStateChanged will detect the user and show (tabs)
    } catch (error: any) {
      Alert.alert(isLogin ? 'Login Error' : 'Sign Up Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isLogin ? 'Log In' : 'Sign Up'} onPress={handleAuth} />
      <Button
        title={`Switch to ${isLogin ? 'Sign Up' : 'Log In'}`}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
