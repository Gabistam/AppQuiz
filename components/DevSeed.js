import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { collection, doc, writeBatch, setDoc } from 'firebase/firestore';

import { db } from '../firebase.config';
import { seedThemes, seedQuestions } from '../data/seedData';
import Button from './Button';

export default function DevSeed() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      for (const theme of seedThemes) {
        await setDoc(doc(db, 'themes', theme.id), {
          name: theme.name,
          icon: theme.icon,
          questionCount: theme.questionCount,
        });
      }

      const batch = writeBatch(db);
      for (const q of seedQuestions) {
        const ref = doc(collection(db, 'questions'));
        batch.set(ref, q);
      }
      await batch.commit();

      setDone(true);
      Alert.alert('✅ Seed terminé', `${seedThemes.length} thèmes + ${seedQuestions.length} questions écrits.`);
    } catch (err) {
      Alert.alert('❌ Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>🌱 Seed Firestore (DEV)</Text>
      <Text style={styles.warn}>⚠️ À utiliser une seule fois, puis supprimer ce composant.</Text>
      <Button
        title={done ? '✅ Déjà exécuté' : 'Lancer le seed'}
        onPress={handleSeed}
        loading={loading}
        disabled={done}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d97706',
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#78350f' },
  warn: { fontSize: 12, color: '#92400e', marginBottom: 12 },
});
