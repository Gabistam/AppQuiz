import React from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase.config';
import Button from '../components/Button';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Mon profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>UID</Text>
        <Text style={[styles.value, styles.uid]} numberOfLines={1}>{user?.uid}</Text>
      </View>

      <Button title="Se déconnecter" variant="secondary" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#0f172a' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', marginTop: 8 },
  value: { fontSize: 16, color: '#0f172a', marginTop: 4 },
  uid: { fontSize: 12, fontFamily: 'monospace' },
});