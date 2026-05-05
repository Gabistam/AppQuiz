// Importation des composants natifs et hooks de React
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Le composant reçoit `navigation` automatiquement de React Navigation
export default function LoginScreen({ navigation }) {
  return (
    // SafeAreaView évite que le contenu passe sous le notch ou la status bar
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔐 Connexion</Text>

      {/* Bouton qui amène à l'écran d'inscription */}
      <Button
        title="Pas encore de compte ? S'inscrire"
        onPress={() => navigation.navigate('Register')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});