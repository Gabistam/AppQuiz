import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginScreen({ navigation }) {
  // États contrôlés pour les deux champs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // État pour stocker un message d'erreur global
  const [error, setError] = useState('');

  // Fonction appelée au clic sur le bouton Connexion
  // Pour l'instant elle ne fait que valider les champs (Firebase viendra à l'étape 5)
  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    // TODO étape 5 : appeler signInWithEmailAndPassword
    console.log('Connexion :', email);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* KeyboardAvoidingView remonte le contenu quand le clavier s'ouvre */}
      <KeyboardAvoidingView
        style={styles.flex}
        // iOS et Android ont besoin d'un comportement différent
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connecte-toi pour accéder à tes quiz</Text>

          {/* Affichage de l'erreur globale si présente */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

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
            placeholder="••••••••"
            // Cache les caractères saisis
            secureTextEntry
          />

          <Button title="Se connecter" onPress={handleLogin} />

          {/* Petit espace puis lien vers l'inscription */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <Button
              title="Créer un compte"
              variant="secondary"
              onPress={() => navigation.navigate('Register')}
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