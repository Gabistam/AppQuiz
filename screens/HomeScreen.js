import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏠 Accueil — Choix du thème</Text>

      {/* On simule la sélection d'un thème pour tester la nav vers le quiz */}
      <Button
        title="Lancer un quiz (test)"
        onPress={() => navigation.navigate('Quiz', { themeName: 'Test' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});