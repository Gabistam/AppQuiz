export const traduireErreurAuth = (code) => {
  const messages = {
    'auth/invalid-email': 'Email invalide.',
    'auth/user-disabled': 'Ce compte a été désactivé.',
    'auth/user-not-found': 'Aucun compte avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/weak-password': 'Mot de passe trop faible (min. 6 caractères).',
    'auth/network-request-failed': 'Problème de connexion internet.',
    'auth/too-many-requests': 'Trop de tentatives. Réessaie plus tard.',
  };

  return messages[code] || 'Une erreur est survenue. Réessaie.';
};
