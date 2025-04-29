// app/auth.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Adjust as needed

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    console.log('Auth button pressed. Mode:', isLogin ? 'Sign In' : 'Sign Up');
    console.log('Email:', email, 'Password:', password);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    
    try {
      if (isLogin) {
        console.log('Attempting to sign in...');
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign in successful!');
      } else {
        console.log('Attempting to sign up...');
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Sign up successful!');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      Alert.alert(isLogin ? 'Sign In Error' : 'Sign Up Error', error.message);
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
        onChangeText={(text) => {
          console.log('Email changed:', text);
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          console.log('Password changed:', text);
          setPassword(text);
        }}
      />
      <Button title={isLogin ? 'Log In' : 'Sign Up'} onPress={handleAuth} />
      <Button
        title={`Switch to ${isLogin ? 'Sign Up' : 'Log In'}`}
        onPress={() => {
          console.log('Switch mode button pressed.');
          setIsLogin(!isLogin);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});

