import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Pressable est recommandé en 2026 (plus moderne et flexible que TouchableOpacity)
// Props :
// - title : texte du bouton
// - onPress : fonction à appeler au clic
// - variant : 'primary' (par défaut) ou 'secondary'
// - loading : affiche un spinner et désactive le clic
// - disabled : désactive le bouton
export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      // style peut être une fonction qui reçoit { pressed } pour le feedback visuel
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        // Effet d'opacité quand le bouton est pressé
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      // Accessibilité : indique que c'est un bouton aux lecteurs d'écran
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        // Spinner pendant le chargement
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1e40af'} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Zone tactile minimale recommandée (≥ 44pt)
  },
  primary: { backgroundColor: '#1e40af' },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1e40af' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  textSecondary: { color: '#1e40af' },
});