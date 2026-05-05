import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// route.params contient les paramètres passés via navigation.navigate('Quiz', {...})
export default function QuizScreen({ route, navigation }) {
  const { themeName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>❓ Quiz : {themeName}</Text>

      <Button
        title="Voir les résultats (test)"
        onPress={() => navigation.navigate('Result', { score: 7, total: 10, themeName })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});