import React, { useState } from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function AppNavigator() {
  // Pour l'instant on simule l'authentification avec un booléen statique.
  // À l'étape 5, on remplacera ça par un vrai listener Firebase Auth.
  const [isLogged, setIsLogged] = useState(true);

  // Si l'utilisateur est connecté → AppStack (Tabs)
  // Sinon → AuthStack (Login + Register)
  return isLogged ? <AppStack /> : <AuthStack />;
}