import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen({ route, navigation }) {
  const { score, total, themeName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Résultats</Text>
      <Text style={styles.score}>{score} / {total}</Text>
      <Text style={styles.theme}>Thème : {themeName}</Text>

      {/* popToTop revient au tout premier écran de la stack (Home) */}
      <Button title="Retour à l'accueil" onPress={() => navigation.popToTop()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  score: { fontSize: 48, fontWeight: 'bold', color: '#1e40af', marginBottom: 12 },
  theme: { fontSize: 16, color: '#666', marginBottom: 32 },
});