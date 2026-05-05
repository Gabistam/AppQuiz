import React, { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '../components/Input';
import Button from '../components/Button';

export default function RegisterScreen({ navigation }) {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Validation simple côté client avant l'appel Firebase (étape 5)
  const handleRegister = () => {
    setError('');

    if (!pseudo || !email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    // Vérification basique du mot de passe (Firebase exige ≥ 6 caractères)
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    // Vérification simple du format email
    if (!email.includes('@')) {
      setError('Email invalide.');
      return;
    }

    // TODO étape 5 : appeler createUserWithEmailAndPassword
    console.log('Inscription :', pseudo, email);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Crée ton compte pour commencer</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input
            label="Pseudo"
            value={pseudo}
            onChangeText={setPseudo}
            placeholder="Ton pseudo"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="toi@exemple.com"
            keyboardType="email-address"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="6 caractères minimum"
            secureTextEntry
          />

          <Button title="Créer mon compte" onPress={handleRegister} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <Button
              title="Se connecter"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  flex: { flex: 1 },
  container: { padding: 24, paddingTop: 40 },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#0f172a' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#64748b', marginBottom: 32 },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: { marginTop: 24, alignItems: 'center', gap: 12 },
  footerText: { color: '#64748b', fontSize: 14 },
});