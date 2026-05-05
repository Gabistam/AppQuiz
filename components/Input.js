import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Composant qui encapsule label + TextInput stylé
// Les props non listées sont propagées au TextInput natif (...props)
export default function Input({ label, value, onChangeText, error, ...props }) {
  return (
    <View style={styles.container}>
      {/* Label au-dessus du champ */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* TextInput principal — reçoit toutes les props supplémentaires */}
      <TextInput
        style={[
          styles.input,
          // Bordure rouge si erreur
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        // Améliore l'UX : auto-désactive la majuscule sur les emails par défaut
        autoCapitalize="none"
        // Passe toutes les props supplémentaires (placeholder, keyboardType, secureTextEntry…)
        {...props}
      />

      {/* Message d'erreur sous le champ si présent */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#0f172a' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
});