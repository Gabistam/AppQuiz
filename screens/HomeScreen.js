import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase.config';
import DevSeed from '../components/DevSeed';

export default function HomeScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'themes'));
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setThemes(list);
      } catch (err) {
        setError('Impossible de charger les thèmes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Chargement des thèmes…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎮 Choisis un thème</Text>

      {/* À SUPPRIMER après la 1ère exécution du seed */}
      <DevSeed />

      <FlatList
        data={themes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.themeCard, pressed && styles.pressed]}
            onPress={() =>
              navigation.navigate('Quiz', { themeId: item.id, themeName: item.name })
            }
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.themeText}>
              <Text style={styles.themeName}>{item.name}</Text>
              <Text style={styles.themeMeta}>{item.questionCount} questions</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b' },
  errorText: { color: '#dc2626', textAlign: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 24, paddingBottom: 12, color: '#0f172a' },
  list: { paddingHorizontal: 16 },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pressed: { opacity: 0.7 },
  icon: { fontSize: 32, marginRight: 16 },
  themeText: { flex: 1 },
  themeName: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  themeMeta: { fontSize: 13, color: '#64748b', marginTop: 2 },
  arrow: { fontSize: 24, color: '#cbd5e1' },
});