import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from './navigation/AppNavigator';

// Test : ces deux lignes ne doivent PAS afficher d'erreur dans la console Expo
console.log('Firebase Auth :', auth ? '✅ OK' : '❌ KO');
console.log('Firestore :', db ? '✅ OK' : '❌ KO');

export default function App() {
  return (
    // SafeAreaProvider doit englober toute l'app pour que SafeAreaView fonctionne
    <SafeAreaProvider>
      {/* NavigationContainer est OBLIGATOIRE et doit être à la racine */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}