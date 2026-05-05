# 🚀 Guide complet — Création de l'App Quiz

> [!info]
> 

> Ce guide pas-à-pas couvre **toute la réalisation du projet fil rouge** App Quiz, de l'initialisation à la génération de l'APK Android. Il s'étale techniquement de **S4 (J2)** à **S8 (J4)** — il est placé ici sur la page J4 car c'est aussi le jour du rendu final.
> 

## 📌 Ce que tu vas construire

Une application mobile multi-plateforme (iOS & Android) de quiz multi-thèmes avec :

- 🔐 **Authentification** email/password (inscription, connexion, déconnexion)
- 🎨 **3 thèmes de quiz** : Michael Jackson, Films cultes, Chansons célèbres
- ❓ **Moteur QCM** avec 10 questions par thème, score en temps réel
- 📊 **Historique personnel** des parties stocké dans Firestore
- 👤 **Profil utilisateur** avec déconnexion
- 📦 **APK Android** généré via EAS Build

## 🛠 Stack technique (versions 2026)

| Outil | Version | Rôle |
| --- | --- | --- |
| Node.js | ≥ 20 | Runtime JS |
| Expo SDK | 54 | Framework RN simplifié |
| React Native | 0.81 | Cœur du framework |
| React Navigation | v7 | Navigation Stack + Tab |
| Firebase JS SDK | v10+ | Auth + Firestore |
| AsyncStorage | latest | Persistance locale |
| EAS CLI | latest | Build cloud Android |

## 📁 Structure de dossiers cible

```
AppQuiz/
├── App.js                      ← Point d'entrée
├── firebase.config.js          ← Configuration Firebase
├── .env                        ← Variables d'environnement
├── app.json                    ← Config Expo (nom, slug, icône)
├── eas.json                    ← Config EAS Build
│
├── navigation/
│   ├── AppNavigator.js         ← Orchestrateur Auth/App
│   ├── AuthStack.js            ← Stack Login + Register
│   └── AppStack.js             ← Tab Navigator (post-login)
│
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js           ← Liste des thèmes
│   ├── QuizScreen.js           ← Moteur du quiz
│   ├── ResultScreen.js         ← Score final + sauvegarde
│   ├── HistoryScreen.js        ← Historique des parties
│   └── ProfileScreen.js        ← Profil + déconnexion
│
├── components/
│   ├── Input.js                ← TextInput stylé réutilisable
│   ├── Button.js               ← Pressable stylé réutilisable
│   └── QuestionCard.js         ← Carte question + 4 options
│
└── data/
    └── seedData.js             ← Datasets pour seed Firestore
```

> [!warning]
> 

> **Pas de dossier `services/` ni `hooks/`** à ce niveau — on garde l'architecture simple et lisible pour débutant. La logique Firebase vit directement dans les écrans.
> 

## 🗄 Modèle de données Firestore

```
themes/{themeId}
  ├─ name: string          (ex: "Michael Jackson")
  ├─ icon: string          (emoji)
  └─ questionCount: number

questions/{questionId}
  ├─ themeId: string       (FK vers themes)
  ├─ question: string
  ├─ options: string[4]
  └─ correctAnswer: string

users/{uid}
  ├─ pseudo: string
  ├─ email: string
  └─ createdAt: timestamp

users/{uid}/history/{historyId}
  ├─ themeName: string
  ├─ score: number
  ├─ total: number
  └─ date: timestamp
```

## 📅 Planning de réalisation

| Étape | Séance | Livrable |
| --- | --- | --- |
| 1. Initialisation | S4 (J2) | Projet Expo + structure |
| 2. Architecture navigation | S4 (J2) | Flux complet placeholders |
| 3. UI Login & Register | fin S4 | Écrans auth stylés |
| 4. Configuration Firebase | S6 (J3) | Projet FB + connexion |
| 5. Auth Firebase | S6 (J3) | Inscription + connexion fonctionnelles |
| 6. Données Firestore | S6 (J3) | Thèmes + questions seed |
| 7. Moteur du Quiz | fin S6 | Quiz jouable + historique |
| 10. EAS Build | S8 (J4) | APK téléchargeable |

## ✅ Prérequis

- [ ]  Node.js ≥ 20 installé (`node -v`)
- [ ]  Compte Google actif (pour Firebase)
- [ ]  App **Expo Go** installée sur ton téléphone
- [ ]  Compte Expo créé sur [expo.dev](http://expo.dev)
- [ ]  VS Code avec extensions React Native

---

# 🟦 Étape 1 — Initialisation du projet

> 🎯 **Objectif** : avoir un projet Expo qui tourne sur ton téléphone via Expo Go.
> 

## 1.1 — Vérifier les prérequis

Ouvre un terminal et vérifie ta version de Node :

```bash
node -v
```

> [!warning]
> 

> Node.js doit être **≥ 20**. Si la version est plus ancienne, télécharge la dernière LTS sur [nodejs.org](http://nodejs.org) avant de continuer.
> 

## 1.2 — Créer le projet Expo

Dans le dossier où tu veux ranger ton projet :

```bash
npx create-expo-app AppQuiz --template blank
cd AppQuiz
```

> [!tip]
> 

> On utilise `--template blank` (et pas le template par défaut tabs+Expo Router) pour rester cohérent avec ce qu'on a appris en S3 sur React Navigation.
> 

## 1.3 — Installer les dépendances

Une seule commande à coller dans le terminal :

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @expo/vector-icons firebase
```

**Détail des paquets installés** :

| Paquet | Rôle |
| --- | --- |
| `@react-navigation/native` | Cœur de React Navigation v7 |
| `@react-navigation/native-stack` | Navigation Stack (empilement d'écrans) |
| `@react-navigation/bottom-tabs` | Navigation par onglets en bas |
| `react-native-screens` | Optimisation native obligatoire |
| `react-native-safe-area-context` | Gestion notch / status bar |
| `@react-native-async-storage/async-storage` | Persistance locale clé/valeur |
| `@expo/vector-icons` | Icônes (Ionicons, MaterialIcons…) |
| `firebase` | SDK Firebase (Auth + Firestore) |

## 1.4 — Créer la structure de dossiers

Depuis la racine du projet :

```bash
mkdir navigation screens components data
```

Tu dois maintenant avoir cette structure :

```
AppQuiz/
├── App.js
├── app.json
├── package.json
├── navigation/      ← vide pour l'instant
├── screens/         ← vide
├── components/      ← vide
└── data/            ← vide
```

## 1.5 — Premier lancement

```bash
npx expo start
```

Un QR code apparaît dans le terminal :

1. Ouvre **Expo Go** sur ton téléphone
2. Scan le QR code (Android : depuis Expo Go · iOS : depuis l'app Camera)
3. L'app se charge → tu vois "Open up App.js to start working on your app!"

> [!tip]
> 

> ✅ **Checkpoint Étape 1** : ton app tourne sur ton téléphone. Si ça plante, vérifie que ton ordi et ton téléphone sont sur le **même WiFi**.
> 

---

# 🟦 Étape 2 — Architecture de navigation Auth/App

> 🎯 **Objectif** : créer toute l'arborescence de navigation avec des écrans placeholders, et la commutation AuthStack ↔ AppStack via un booléen.
> 

## 2.1 — Créer les 7 écrans placeholders

On va créer chaque écran avec un contenu minimal pour tester la navigation. On les remplira pour de vrai dans les étapes suivantes.

### `screens/LoginScreen.js`

```jsx
// Importation des composants natifs et hooks de React
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Le composant reçoit `navigation` automatiquement de React Navigation
export default function LoginScreen({ navigation }) {
  return (
    // SafeAreaView évite que le contenu passe sous le notch ou la status bar
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔐 Connexion</Text>

      {/* Bouton qui amène à l'écran d'inscription */}
      <Button
        title="Pas encore de compte ? S'inscrire"
        onPress={() => navigation.navigate('Register')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});
```

### `screens/RegisterScreen.js`

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📝 Inscription</Text>

      {/* goBack revient à l'écran précédent (ici Login) */}
      <Button title="Déjà un compte ? Se connecter" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});
```

### `screens/HomeScreen.js`

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏠 Accueil — Choix du thème</Text>

      {/* On simule la sélection d'un thème pour tester la nav vers le quiz */}
      <Button
        title="Lancer un quiz (test)"
        onPress={() => navigation.navigate('Quiz', { themeName: 'Test' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});
```

### `screens/QuizScreen.js`

```jsx
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
```

### `screens/ResultScreen.js`

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen({ route, navigation }) {
  const { score, total, themeName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Résultats</Text>
      <Text style={styles.score}>{score} / {total}</Text>
      <Text style={styles.theme}>Thème : {themeName}</Text>

      {/* popToTop revient au tout premier écran de la stack (Home) */}
      <Button title="Retour à l'accueil" onPress={() => navigation.popToTop()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  score: { fontSize: 48, fontWeight: 'bold', color: '#1e40af', marginBottom: 12 },
  theme: { fontSize: 16, color: '#666', marginBottom: 32 },
});
```

### `screens/HistoryScreen.js`

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📊 Mon historique</Text>
      <Text>(Aucune partie pour l'instant)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});
```

### `screens/ProfileScreen.js`

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Mon profil</Text>
      <Text>(Infos utilisateur à venir)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});
```

## 2.2 — Créer l'AuthStack

C'est la pile de navigation visible **avant** la connexion.

### `navigation/AuthStack.js`

```jsx
import React from 'react';
// createNativeStackNavigator crée une fabrique de Stack Navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Stack contient deux propriétés : Navigator (le conteneur) et Screen (les routes)
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Le premier <Screen> est l'écran de démarrage par défaut */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
```

## 2.3 — Créer l'AppStack

C'est la navigation visible **après** la connexion. On utilise un **Tab Navigator** avec 3 onglets : Accueil, Historique, Profil. L'onglet Accueil contient lui-même un Stack (Home → Quiz → Result).

### `navigation/AppStack.js`

```jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// On crée deux navigateurs distincts
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Stack imbriqué dans l'onglet Accueil : permet d'aller Home → Quiz → Result
// SANS perdre la barre d'onglets (la Tab reste visible en bas)
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Quiz App' }} />
      <HomeStack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz en cours' }} />
      <HomeStack.Screen name="Result" component={ResultScreen} options={{ title: 'Résultats' }} />
    </HomeStack.Navigator>
  );
}

export default function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // headerShown: false car les écrans Home gèrent leur propre header via HomeStack
        headerShown: false,
        // Couleur active des onglets
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#888',
        // Choix dynamique de l'icône selon l'onglet
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'AccueilTab') iconName = 'home';
          else if (route.name === 'HistoryTab') iconName = 'stats-chart';
          else if (route.name === 'ProfileTab') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Onglet 1 : Accueil (avec Stack imbriqué) */}
      <Tab.Screen
        name="AccueilTab"
        component={HomeStackNavigator}
        options={{ title: 'Accueil' }}
      />
      {/* Onglet 2 : Historique */}
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{ title: 'Historique', headerShown: true }}
      />
      {/* Onglet 3 : Profil */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profil', headerShown: true }}
      />
    </Tab.Navigator>
  );
}
```

## 2.4 — Créer l'AppNavigator (orchestrateur)

C'est le composant qui décide **lequel des deux stacks** afficher selon que l'utilisateur est connecté ou non.

### `navigation/AppNavigator.js`

```jsx
import React, { useState } from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function AppNavigator() {
  // Pour l'instant on simule l'authentification avec un booléen statique.
  // À l'étape 5, on remplacera ça par un vrai listener Firebase Auth.
  const [isLogged, setIsLogged] = useState(false);

  // Si l'utilisateur est connecté → AppStack (Tabs)
  // Sinon → AuthStack (Login + Register)
  return isLogged ? <AppStack /> : <AuthStack />;
}
```

> [!warning]
> 

> **AppNavigator ≠ AppStack** — bien comprendre la différence :
> 

> - **AppNavigator** = le chef d'orchestre qui décide *quelle* pile afficher
> 

> - **AppStack** = la pile affichée *après* connexion (les onglets)
> 

> - **AuthStack** = la pile affichée *avant* connexion (Login + Register)
> 

## 2.5 — Brancher le tout dans `App.js`

Remplace le contenu de `App.js` par :

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    // SafeAreaProvider doit englober toute l'app pour que SafeAreaView fonctionne
    <SafeAreaProvider>
      {/* NavigationContainer est OBLIGATOIRE et doit être à la racine */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
```

## 2.6 — Tester le flux

Relance Expo (`npx expo start` si nécessaire). Tu devrais voir l'écran **Login**.

### Tester l'AuthStack

- Login → bouton "Pas encore de compte ?" → Register ✅
- Register → bouton "Déjà un compte ?" → retour à Login ✅

### Tester l'AppStack (en simulant la connexion)

Dans `AppNavigator.js`, change temporairement la ligne :

```jsx
const [isLogged, setIsLogged] = useState(true); // ← passer à true
```

Tu vois maintenant la barre d'onglets en bas. Teste :

- Onglet Accueil → bouton "Lancer un quiz" → QuizScreen ✅
- QuizScreen → bouton "Voir les résultats" → ResultScreen ✅
- ResultScreen → bouton "Retour à l'accueil" → HomeScreen ✅
- Onglets Historique et Profil ✅

> [!tip]
> 

> ✅ **Checkpoint Étape 2** : tout le flux de navigation fonctionne avec des écrans vides.
> 

> 🔁 N'oublie pas de remettre `useState(false)` avant de continuer.
> 

---

# 🟦 Étape 3 — UI Login & Register

> 🎯 **Objectif** : créer 2 composants réutilisables (Input + Button), puis une vraie UI pour Login et Register.
> 

## 3.1 — Composant `Input` réutilisable

### `components/Input.js`

```jsx
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
```

## 3.2 — Composant `Button` réutilisable

### `components/Button.js`

```jsx
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
```

## 3.3 — LoginScreen final

Remplace **complètement** le contenu de `screens/LoginScreen.js` :

```jsx
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
```

## 3.4 — RegisterScreen final

Remplace `screens/RegisterScreen.js` :

```jsx
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
```

## 3.5 — Tester

Relance l'app et teste :

- Saisie des champs Login (les caractères du mot de passe sont masqués) ✅
- Bouton "Se connecter" sans remplir les champs → message d'erreur rouge ✅
- Lien vers "Créer un compte" → écran Register ✅
- Sur Register : test des validations (champs vides, mot de passe court, email sans `@`) ✅
- Le clavier ne masque plus les champs (KeyboardAvoidingView) ✅

> [!tip]
> 

> ✅ **Checkpoint Palier 1 (J2)** : tu as une UI complète et fonctionnelle pour l'authentification, sans encore Firebase.
> 

> 🎯 **Prochain palier (J3)** : on connecte tout ça à Firebase Auth + Firestore.
> 

---

# 🟦 Étape 4 — Configuration Firebase

> 🎯 **Objectif** : créer un projet Firebase, activer Auth + Firestore, et connecter ton app au projet.
> 

## 4.1 — Créer le projet Firebase

1. Va sur [console.firebase.google.com](http://console.firebase.google.com)
2. Connecte-toi avec ton compte Google
3. Clique sur **« Ajouter un projet »** (ou « Add project »)
4. Nom du projet : `app-quiz-` + ton prénom (ex : `app-quiz-jackson`)
5. **Désactive Google Analytics** (inutile pour ce projet, simplifie la config)
6. Clique sur **« Créer le projet »** → attends ~30 secondes

## 4.2 — Activer Firebase Auth

1. Dans le menu latéral, va dans **Security → Authentication**
2. Clique sur **« Get started »**
3. Onglet **Sign-in method**
4. Active la méthode **Email/Password** (première ligne)
5. Coche **« Email/Password »** (laisse « Email link » désactivé)
6. Clique sur **Enregistrer**

## 4.3 — Activer Cloud Firestore

1. Dans le menu latéral, va dans **BDD → Firestore Database**
2. Clique sur **« Créer une base de données »**
3. Choisis l'emplacement : **eur3 (europe-west)** ou le plus proche
4. **Mode « Test »** — important pour pouvoir lire/écrire pendant le développement

> [!warning]
> 

> Le mode test expire au bout de 30 jours. On le remplacera par des vraies règles de sécurité à l'étape 6.
> 

## 4.4 — Récupérer la config Web

1. Page d'accueil du projet → icône `</>` (Web)
2. Pseudo de l'app : `AppQuiz`
3. **Ne coche PAS** « Firebase Hosting »
4. Clique sur **« Enregistrer l'app »**
5. Tu vois maintenant un objet `firebaseConfig` avec 6-7 clés. **Copie cet objet** — on en a besoin tout de suite.

Il ressemble à ça :

```jsx
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "app-quiz-jackson.firebaseapp.com",
  projectId: "app-quiz-jackson",
  storageBucket: "app-quiz-jackson.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## 4.5 — Créer `firebase.config.js` dans ton app

À la **racine** du projet AppQuiz, crée le fichier `firebase.config.js` :

```jsx
// Importation des fonctions nécessaires depuis le SDK Firebase v10+
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Colle ICI ta propre config (celle récupérée à l'étape 4.4)
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

// Initialisation de l'app Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Auth AVEC persistance via AsyncStorage
// = l'utilisateur reste connecté même s'il ferme l'app
// Sans ça, l'utilisateur serait déconnecté à chaque relance
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialisation de Firestore (la base de données)
export const db = getFirestore(app);
```

> [!warning]
> 

> **Ne commit JAMAIS la config Firebase telle quelle dans un repo public.** Pour un vrai projet, on passerait par des variables d'environnement (`.env` + `expo-constants`). Ici on simplifie pour l'apprentissage, mais on configure quand même le `.gitignore` ci-dessous.
> 

## 4.6 — Sécuriser le repo (.gitignore)

Ouvre `.gitignore` à la racine et ajoute en bas :

```
# Firebase config (ne pas push les clés en clair)
firebase.config.js
.env
```

> [!tip]
> 

> Crée un fichier `firebase.config.example.js` (sans clés) pour montrer la structure attendue à ceux qui clonent ton repo.
> 

## 4.7 — Test rapide de connexion

Dans `App.js`, ajoute temporairement (juste avant `export default function App`) :

```jsx
import { auth, db } from './firebase.config';

// Test : ces deux lignes ne doivent PAS afficher d'erreur dans la console Expo
console.log('Firebase Auth :', auth ? '✅ OK' : '❌ KO');
console.log('Firestore :', db ? '✅ OK' : '❌ KO');
```

Relance Expo. Dans les logs du terminal tu dois voir :

```
Firebase Auth : ✅ OK
Firestore : ✅ OK
```

> [!tip]
> 

> ✅ **Checkpoint Étape 4** : Firebase est connecté. Tu peux supprimer les `console.log` de test après vérification.
> 

---

# 🟦 Étape 5 — Authentification Firebase

> 🎯 **Objectif** : brancher Firebase Auth sur Login + Register, et basculer automatiquement entre AuthStack et AppStack via `onAuthStateChanged`.
> 

## 5.1 — Mapping des erreurs Firebase en français

Firebase renvoie des codes d'erreur en anglais peu lisibles. On va créer un petit utilitaire pour les traduire.

Crée `data/firebaseErrors.js` :

```jsx
// Dictionnaire de traduction des erreurs Firebase Auth les plus courantes
// Liste complète : https://firebase.google.com/docs/auth/admin/errors
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

  // Si le code n'est pas connu, on affiche un message générique
  return messages[code] || 'Une erreur est survenue. Réessaie.';
};
```

## 5.2 — LoginScreen avec Firebase

Remplace le contenu de `screens/LoginScreen.js` (on garde toute l'UI, on remplace juste `handleLogin`) :

```jsx
import React, { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import de la fonction Firebase pour se connecter
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase.config';
import { traduireErreurAuth } from '../data/firebaseErrors';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Nouvel état : pour désactiver le bouton et afficher un spinner pendant la requête
  const [loading, setLoading] = useState(false);

  // async/await car signInWithEmailAndPassword retourne une Promise
  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    setLoading(true);
    try {
      // Appel Firebase : vérifie email + mot de passe
      // Si OK, l'utilisateur est connecté et onAuthStateChanged se déclenche
      // automatiquement dans AppNavigator (voir 5.4)
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Pas besoin de naviguer manuellement : AppNavigator bascule tout seul
    } catch (err) {
      // err.code contient le code Firebase (ex: "auth/invalid-credential")
      setError(traduireErreurAuth(err.code));
    } finally {
      // finally s'exécute toujours, même en cas d'erreur
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connecte-toi pour accéder à tes quiz</Text>

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
            secureTextEntry
          />

          <Button title="Se connecter" onPress={handleLogin} loading={loading} />

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
```

## 5.3 — RegisterScreen avec Firebase + création profil Firestore

À l'inscription, on crée l'utilisateur dans **Firebase Auth** ET on crée son document profil dans **Firestore** (`users/{uid}`).

Remplace `screens/RegisterScreen.js` :

```jsx
import React, { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// setDoc écrit un document Firestore à un emplacement précis (ici users/{uid})
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../firebase.config';
import { traduireErreurAuth } from '../data/firebaseErrors';
import Input from '../components/Input';
import Button from '../components/Button';

export default function RegisterScreen({ navigation }) {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!pseudo || !email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!email.includes('@')) {
      setError('Email invalide.');
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Création du compte dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Création du document profil dans Firestore : users/{uid}
      // doc(db, 'users', uid) = référence vers le document users/{uid}
      // setDoc(...) = écrit/remplace le document
      await setDoc(doc(db, 'users', uid), {
        pseudo: pseudo.trim(),
        email: email.trim(),
        // serverTimestamp() = date du serveur Firebase, pas du client
        createdAt: serverTimestamp(),
      });

      // L'utilisateur est connecté automatiquement, AppNavigator basculera seul.
    } catch (err) {
      setError(traduireErreurAuth(err.code));
    } finally {
      setLoading(false);
    }
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

          <Button title="Créer mon compte" onPress={handleRegister} loading={loading} />

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
```

## 5.4 — AppNavigator avec `onAuthStateChanged`

Le gros changement : on remplace le booléen mock par un **vrai listener** Firebase qui détecte automatiquement l'état de connexion.

Remplace `navigation/AppNavigator.js` :

```jsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// onAuthStateChanged = listener qui se déclenche à chaque changement d'état auth
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase.config';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function AppNavigator() {
  // user = l'objet utilisateur Firebase, ou null si non connecté
  const [user, setUser] = useState(null);
  // initializing = true tant que Firebase n'a pas confirmé l'état initial
  // (au premier lancement, il faut un peu de temps pour vérifier AsyncStorage)
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // onAuthStateChanged retourne une fonction de nettoyage (unsubscribe)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Cette callback se déclenche au lancement et à chaque login/logout
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    // Cleanup : on se désabonne quand le composant est démonté
    return unsubscribe;
  }, []);

  // Pendant la vérification initiale, on affiche un splash de chargement
  if (initializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  // Une fois initialisé : si user existe → AppStack, sinon → AuthStack
  return user ? <AppStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
```

## 5.5 — Déconnexion depuis le Profil

Mets à jour `screens/ProfileScreen.js` :

```jsx
import React from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase.config';
import Button from '../components/Button';

export default function ProfileScreen() {
  // auth.currentUser = l'utilisateur actuellement connecté (objet Firebase User)
  const user = auth.currentUser;

  const handleLogout = () => {
    // Alert natif iOS/Android avec confirmation
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            // signOut déclenche onAuthStateChanged → AppNavigator bascule sur AuthStack
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
```

## 5.6 — Tester le flux complet

1. Relance l'app → tu vois le splash bleu, puis l'écran **Login**
2. Va sur **Créer un compte** → inscris-toi avec un vrai email + mot de passe ≥ 6 car.
3. ⚡ Tu bascules automatiquement sur **HomeScreen** (les onglets apparaissent)
4. Va sur **Profil** → tu vois ton email + UID
5. Clique sur **Se déconnecter** → tu reviens sur **Login**
6. Reconnecte-toi → retour sur Home ✅
7. Ferme totalement l'app puis ré-ouvre-la → tu es **toujours connecté** (grâce à AsyncStorage) ✅

Dans la console Firebase (onglet **Authentication → Users**), tu vois ton compte. Dans **Firestore Database**, tu vois la collection `users` avec ton document.

> [!tip]
> 

> ✅ **Checkpoint Étape 5** : authentification complète et fonctionnelle.
> 

---

# 🟦 Étape 6 — Données Firestore (thèmes & questions)

> 🎯 **Objectif** : remplir Firestore avec 3 thèmes × 10 questions, et récupérer les thèmes dans le HomeScreen.
> 

## 6.1 — Créer le fichier de seed

On réutilise les datasets MJ / Films / Chansons du TP. Crée `data/seedData.js` :

```jsx
// Dataset complet : 3 thèmes × 10 questions
// Sera écrit en base via le composant DevSeed (étape 6.2)

export const seedThemes = [
  { id: 'michael-jackson', name: 'Michael Jackson', icon: '🎤', questionCount: 10 },
  { id: 'films-cultes', name: 'Films cultes', icon: '🎬', questionCount: 10 },
  { id: 'chansons-celebres', name: 'Chansons célèbres', icon: '🎶', questionCount: 10 },
];

export const seedQuestions = [
  // ──────────────── MICHAEL JACKSON ────────────────
  { themeId: 'michael-jackson', question: 'En quelle année Michael Jackson est-il né ?',
    options: ['1958', '1960', '1955', '1965'], correctAnswer: '1958' },
  { themeId: 'michael-jackson', question: 'Quel est le titre de son premier album solo ?',
    options: ['Thriller', 'Off the Wall', 'Bad', 'Dangerous'], correctAnswer: 'Off the Wall' },
  { themeId: 'michael-jackson', question: 'Quelle chanson a été utilisée pour une campagne Pepsi ?',
    options: ['Billie Jean', 'Bad', 'Black or White', 'Beat It'], correctAnswer: 'Billie Jean' },
  { themeId: 'michael-jackson', question: 'Dans quel groupe Michael Jackson a-t-il commencé sa carrière ?',
    options: ['The Commodores', 'The Temptations', 'The Jackson 5', 'Boyz II Men'], correctAnswer: 'The Jackson 5' },
  { themeId: 'michael-jackson', question: 'Quel est le nom du ranch de Michael Jackson ?',
    options: ['Wonderland', 'Dreamland', 'Neverland', 'Fantasyland'], correctAnswer: 'Neverland' },
  { themeId: 'michael-jackson', question: 'Quel est le nom de son album le plus vendu ?',
    options: ['Bad', 'Off the Wall', 'Thriller', 'Dangerous'], correctAnswer: 'Thriller' },
  { themeId: 'michael-jackson', question: 'Quel est le nom de son chimpanzé de compagnie ?',
    options: ['George', 'Bubbles', 'Charlie', 'Max'], correctAnswer: 'Bubbles' },
  { themeId: 'michael-jackson', question: 'Dans quelle ville est né Michael Jackson ?',
    options: ['Los Angeles', 'Chicago', 'New York', 'Gary'], correctAnswer: 'Gary' },
  { themeId: 'michael-jackson', question: 'Quel est le nom de son dernier album studio ?',
    options: ['Invincible', 'HIStory', 'Bad', 'Dangerous'], correctAnswer: 'Invincible' },
  { themeId: 'michael-jackson', question: 'Quelle est la danse signature de Michael Jackson ?',
    options: ['Le Twist', 'Le Moonwalk', 'Le Macarena', 'Le Tango'], correctAnswer: 'Le Moonwalk' },

  // ──────────────── FILMS CULTES ────────────────
  { themeId: 'films-cultes', question: 'Quel film de 1994 met en vedette Forrest Gump ?',
    options: ['Pulp Fiction', 'Forrest Gump', 'Le Roi Lion', 'Speed'], correctAnswer: 'Forrest Gump' },
  { themeId: 'films-cultes', question: 'Quel film de 1980 est basé sur un livre de Stephen King ?',
    options: ['Shining', 'E.T.', 'Star Wars: L\'Empire contre-attaque', 'Scarface'], correctAnswer: 'Shining' },
  { themeId: 'films-cultes', question: 'Quel film de 1999 est connu pour "Je vois des gens morts" ?',
    options: ['Matrix', 'Sixième Sens', 'Fight Club', 'American Pie'], correctAnswer: 'Sixième Sens' },
  { themeId: 'films-cultes', question: 'Quel film de 1987 met en vedette Patrick Swayze et Jennifer Grey ?',
    options: ['Dirty Dancing', 'RoboCop', 'Predator', 'Full Metal Jacket'], correctAnswer: 'Dirty Dancing' },
  { themeId: 'films-cultes', question: 'Quel film de 1997 est centré autour du naufrage du Titanic ?',
    options: ['Le Cinquième Élément', 'Titanic', 'Men in Black', 'La Vie est belle'], correctAnswer: 'Titanic' },
  { themeId: 'films-cultes', question: 'Quel film de 1985 met en vedette une DeLorean ?',
    options: ['Retour vers le Futur', 'Rocky IV', 'Rambo II', 'Le Goonies'], correctAnswer: 'Retour vers le Futur' },
  { themeId: 'films-cultes', question: 'Quel film de 1991 est sous-titré "Le Jugement dernier" ?',
    options: ['Terminator 2', 'Robin des Bois', 'Le Silence des Agneaux', 'Thelma et Louise'], correctAnswer: 'Terminator 2' },
  { themeId: 'films-cultes', question: 'Quel film de 2000 met en vedette Russell Crowe en gladiateur ?',
    options: ['Gladiator', 'Memento', 'X-Men', 'American Psycho'], correctAnswer: 'Gladiator' },
  { themeId: 'films-cultes', question: 'Quel film de 1996 sur le golf met en vedette Adam Sandler ?',
    options: ['Fargo', 'Independence Day', 'Happy Gilmore', 'Trainspotting'], correctAnswer: 'Happy Gilmore' },
  { themeId: 'films-cultes', question: 'Quel film de 1988 met en vedette Eddie Murphy comme détective ?',
    options: ['Piège de cristal', 'Le Cercle des poètes disparus', 'Le Grand Bleu', 'Le Flic de Beverly Hills II'], correctAnswer: 'Le Flic de Beverly Hills II' },

  // ──────────────── CHANSONS CÉLÈBRES ────────────────
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Whitney Houston est une reprise de Dolly Parton ?',
    options: ['I Will Always Love You', 'Greatest Love of All', 'I\'m Every Woman', 'How Will I Know'], correctAnswer: 'I Will Always Love You' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Nirvana est devenue un hymne grunge ?',
    options: ['Come As You Are', 'Smells Like Teen Spirit', 'Lithium', 'In Bloom'], correctAnswer: 'Smells Like Teen Spirit' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Michael Jackson est sortie en 1982 ?',
    options: ['Billie Jean', 'Black or White', 'You Are Not Alone', 'Bad'], correctAnswer: 'Billie Jean' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Madonna est sortie en 1984 ?',
    options: ['Like a Virgin', 'Vogue', 'Material Girl', 'Hung Up'], correctAnswer: 'Like a Virgin' },
  { themeId: 'chansons-celebres', question: 'Quel grand succès de Britney Spears en 1998 ?',
    options: ['Toxic', 'Oops!... I Did It Again', '...Baby One More Time', 'Stronger'], correctAnswer: '...Baby One More Time' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Queen est devenue célèbre grâce à Wayne\'s World ?',
    options: ['We Will Rock You', 'Bohemian Rhapsody', 'Don\'t Stop Me Now', 'Radio Ga Ga'], correctAnswer: 'Bohemian Rhapsody' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de MC Hammer est sortie en 1990 ?',
    options: ['Gangnam Style', 'U Can\'t Touch This', 'Ice Ice Baby', 'Jump Around'], correctAnswer: 'U Can\'t Touch This' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Ricky Martin a été un succès en 1999 ?',
    options: ['Livin\' la Vida Loca', 'She Bangs', 'Shake Your Bon-Bon', 'The Cup of Life'], correctAnswer: 'Livin\' la Vida Loca' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson d\'Eminem est sortie en 2002 ?',
    options: ['Stan', 'Lose Yourself', 'The Real Slim Shady', 'Without Me'], correctAnswer: 'Lose Yourself' },
  { themeId: 'chansons-celebres', question: 'Quelle chanson de Beyoncé a été un succès en 2003 ?',
    options: ['Single Ladies', 'Crazy In Love', 'Halo', 'Irreplaceable'], correctAnswer: 'Crazy In Love' },
];
```

## 6.2 — Écrire le seed dans Firestore (UNE FOIS)

On crée un petit composant de développement avec un bouton « Seed Firestore ». **À utiliser une seule fois**, puis à supprimer.

Crée `components/DevSeed.js` :

```jsx
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
// writeBatch écrit plusieurs documents en une seule opération atomique (max 500)
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
      // 1️⃣ Écriture des thèmes : on contrôle l'ID (donc setDoc, pas addDoc)
      for (const theme of seedThemes) {
        await setDoc(doc(db, 'themes', theme.id), {
          name: theme.name,
          icon: theme.icon,
          questionCount: theme.questionCount,
        });
      }

      // 2️⃣ Écriture des questions en batch (plus rapide)
      const batch = writeBatch(db);
      for (const q of seedQuestions) {
        // doc(collection(...)) sans 2e arg → génère un ID aléatoire
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
```

## 6.3 — HomeScreen avec liste des thèmes

Maintenant on crée le vrai HomeScreen qui charge les thèmes depuis Firestore.

Remplace `screens/HomeScreen.js` :

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// collection() = référence vers une collection · getDocs() = lit tous les documents
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase.config';
import DevSeed from '../components/DevSeed'; // à supprimer après seed

export default function HomeScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect avec [] = s'exécute une fois au montage du composant
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'themes'));
        // snapshot.docs = tableau de QueryDocumentSnapshot
        // .map convertit chaque doc en objet { id, ...data }
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

  // État de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Chargement des thèmes…</Text>
      </SafeAreaView>
    );
  }

  // État d'erreur
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

      {/* Composant de seed — À SUPPRIMER après la 1ère exécution */}
      <DevSeed />

      {/* FlatList est optimisé pour les listes (virtualisation) */}
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
```

## 6.4 — Lancer le seed (1 fois)

1. Reconnecte-toi dans l'app → tu vois le HomeScreen avec une carte ambrée « Seed Firestore »
2. Clique sur **« Lancer le seed »** → alerte « Seed terminé »
3. Va dans la console Firebase → **Firestore** → tu vois maintenant 3 collections : `users`, `themes`, `questions`
4. **Recharge l'app** : les 3 thèmes apparaissent dans la liste 🎉

## 6.5 — Supprimer le composant DevSeed

Une fois le seed effectué :

1. Dans `screens/HomeScreen.js`, supprime l'import `import DevSeed from '../components/DevSeed';`
2. Supprime la ligne `<DevSeed />` dans le JSX
3. Supprime le fichier `components/DevSeed.js`

## 6.6 — Règles de sécurité Firestore

Dans la console Firebase → **Firestore Database** → onglet **Règles** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // themes : lecture publique pour tout utilisateur connecté
    match /themes/{themeId} {
      allow read: if request.auth != null;
      allow write: if false; // Seul l'admin peut modifier (via console)
    }

    // questions : idem
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // users : chacun ne peut lire/écrire que SON propre document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // history : sous-collection — même règle
      match /history/{historyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Clique sur **Publier**.

> [!warning]
> 

> Après ce changement, `write: if false` sur themes/questions empêche d'exécuter le seed depuis l'app. **Si tu dois re-seeder**, repasse temporairement en mode test ou modifie la règle.
> 

> [!tip]
> 

> ✅ **Checkpoint Palier 2 (J3)** : authentification complète + 3 thèmes dans Firestore + règles de sécurité en place. 🎯 **Prochain palier (J4)** : moteur du quiz + historique + EAS Build.
> 

---

# 🟦 Étape 7 — Moteur du Quiz

> 🎯 **Objectif** : rendre le quiz jouable, sauvegarder le score dans `users/{uid}/history`, et afficher l'historique.
> 

## 7.1 — Composant `QuestionCard`

Crée `components/QuestionCard.js` :

```jsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

// Carte qui affiche une question + 4 options cliquables
// Props :
// - question : texte de la question
// - options : tableau de 4 strings
// - onSelect : fonction appelée avec l'option choisie
// - questionNumber / totalQuestions : pour afficher "3 / 10"
export default function QuestionCard({ question, options, onSelect, questionNumber, totalQuestions }) {
  return (
    <View style={styles.card}>
      {/* Compteur en haut : Question 3 / 10 */}
      <Text style={styles.counter}>Question {questionNumber} / {totalQuestions}</Text>

      {/* Texte de la question */}
      <Text style={styles.question}>{question}</Text>

      {/* Liste des 4 options */}
      <View style={styles.options}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityLabel={`Option ${index + 1} : ${option}`}
          >
            {/* Lettre de l'option (A, B, C, D) */}
            <Text style={styles.letter}>{String.fromCharCode(65 + index)}</Text>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  counter: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 24,
    lineHeight: 28,
  },
  options: { gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    minHeight: 56, // Zone tactile confortable
  },
  optionPressed: { backgroundColor: '#dbeafe', borderColor: '#1e40af' },
  letter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e40af',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 12,
  },
  optionText: { flex: 1, fontSize: 15, color: '#0f172a' },
});
```

## 7.2 — QuizScreen complet

Remplace `screens/QuizScreen.js` :

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// query + where pour filtrer les questions par themeId
import { collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '../firebase.config';
import QuestionCard from '../components/QuestionCard';

export default function QuizScreen({ route, navigation }) {
  // Paramètres passés par HomeScreen
  const { themeId, themeName } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les questions du thème sélectionné au montage
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // query + where = SELECT * FROM questions WHERE themeId = ?
        const q = query(
          collection(db, 'questions'),
          where('themeId', '==', themeId)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setQuestions(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [themeId]);

  // Fonction appelée quand l'utilisateur sélectionne une option
  const handleSelect = (selectedOption) => {
    const currentQuestion = questions[currentIndex];
    // Vérification de la réponse
    const newScore = selectedOption === currentQuestion.correctAnswer ? score + 1 : score;
    setScore(newScore);

    // Passe à la question suivante OU termine le quiz
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Fin du quiz : navigation vers ResultScreen
      // replace = remplace QuizScreen dans la pile (l'utilisateur ne peut pas revenir en arrière sur les questions)
      navigation.replace('Result', {
        score: newScore,
        total: questions.length,
        themeName,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Chargement du quiz…</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Aucune question disponible pour ce thème.</Text>
      </SafeAreaView>
    );
  }

  // Calcul de la progression (largeur de la barre)
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Barre de progression en haut */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* En-tête avec thème + score */}
      <View style={styles.header}>
        <Text style={styles.themeLabel}>{themeName}</Text>
        <Text style={styles.scoreLabel}>Score : {score} / {questions.length}</Text>
      </View>

      {/* Carte question */}
      <View style={styles.cardContainer}>
        <QuestionCard
          question={questions[currentIndex].question}
          options={questions[currentIndex].options}
          onSelect={handleSelect}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b' },
  errorText: { color: '#dc2626', textAlign: 'center' },
  progressBar: { height: 4, backgroundColor: '#e2e8f0' },
  progressFill: { height: '100%', backgroundColor: '#059669' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  themeLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  scoreLabel: { fontSize: 14, color: '#0f172a', fontWeight: '600' },
  cardContainer: { flex: 1, padding: 16 },
});
```

## 7.3 — ResultScreen avec sauvegarde dans `users/{uid}/history`

Remplace `screens/ResultScreen.js` :

```jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// addDoc écrit un document avec un ID généré automatiquement
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../firebase.config';
import Button from '../components/Button';

export default function ResultScreen({ route, navigation }) {
  const { score, total, themeName } = route.params;
  const [saving, setSaving] = useState(true);

  // Calcul du pourcentage et choix du feedback adapté
  const percentage = Math.round((score / total) * 100);

  let feedback;
  let emoji;
  if (percentage === 100) { feedback = 'Parfait ! Score maximal 🏆'; emoji = '🏆'; }
  else if (percentage >= 80) { feedback = 'Excellent travail !'; emoji = '🎉'; }
  else if (percentage >= 60) { feedback = 'Bien joué !'; emoji = '👍'; }
  else if (percentage >= 40) { feedback = 'Pas mal, mais tu peux faire mieux.'; emoji = '💪'; }
  else { feedback = 'Il est temps de réviser !'; emoji = '📚'; }

  // Sauvegarde automatique du score dans Firestore au montage
  useEffect(() => {
    const saveScore = async () => {
      try {
        const uid = auth.currentUser.uid;
        // Chemin : users/{uid}/history/{idAuto}
        // collection(db, 'users', uid, 'history') = sous-collection
        await addDoc(collection(db, 'users', uid, 'history'), {
          themeName,
          score,
          total,
          percentage,
          date: serverTimestamp(),
        });
      } catch (err) {
        console.error('Erreur sauvegarde score :', err);
      } finally {
        setSaving(false);
      }
    };
    saveScore();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>Résultats</Text>

        {/* Score en gros */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{percentage}%</Text>
          <Text style={styles.scoreSub}>{score} / {total}</Text>
        </View>

        <Text style={styles.theme}>Thème : {themeName}</Text>
        <Text style={styles.feedback}>{feedback}</Text>

        {saving && <Text style={styles.saving}>💾 Sauvegarde…</Text>}
      </View>

      <View style={styles.actions}>
        <Button title="Voir mon historique" variant="secondary" onPress={() => navigation.navigate('HistoryTab')} />
        <Button title="Retour à l'accueil" onPress={() => navigation.popToTop()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginBottom: 32 },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  scoreSub: { fontSize: 18, color: '#dbeafe' },
  theme: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  feedback: { fontSize: 18, color: '#0f172a', textAlign: 'center', fontWeight: '600' },
  saving: { fontSize: 12, color: '#64748b', marginTop: 16 },
  actions: { gap: 12 },
});
```

## 7.4 — HistoryScreen avec liste des parties

Remplace `screens/HistoryScreen.js` :

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// useFocusEffect = se déclenche à chaque fois que l'écran devient visible
// (vs useEffect qui ne se déclenche qu'au premier mount)
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

import { auth, db } from '../firebase.config';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const uid = auth.currentUser.uid;
      // SELECT * FROM users/{uid}/history ORDER BY date DESC
      const q = query(
        collection(db, 'users', uid, 'history'),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHistory(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Recharge à chaque fois qu'on revient sur l'écran (après un quiz par ex.)
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  // Pull-to-refresh : tirer vers le bas pour recharger
  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </SafeAreaView>
    );
  }

  // État vide : aucune partie jouée
  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyEmoji}>🎮</Text>
        <Text style={styles.emptyTitle}>Aucune partie jouée</Text>
        <Text style={styles.emptyText}>Lance ton premier quiz depuis l'accueil !</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTheme}>{item.themeName}</Text>
              <Text style={[styles.itemPercent, getPercentColor(item.percentage)]}>
                {item.percentage}%
              </Text>
            </View>
            <Text style={styles.itemScore}>{item.score} / {item.total} bonnes réponses</Text>
            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Helper : couleur selon le pourcentage
function getPercentColor(pct) {
  if (pct >= 80) return { color: '#059669' }; // vert
  if (pct >= 60) return { color: '#d97706' }; // ambre
  return { color: '#dc2626' }; // rouge
}

// Helper : formate une Timestamp Firestore en date FR
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f8fafc' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  list: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTheme: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  itemPercent: { fontSize: 18, fontWeight: 'bold' },
  itemScore: { fontSize: 14, color: '#64748b', marginTop: 4 },
  itemDate: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
});
```

## 7.5 — Tester le flux complet

1. Lance l'app → connexion auto
2. Choisis un thème → réponds aux 10 questions
3. Écran de résultats avec score % → sauvegarde auto
4. Onglet **Historique** → ta partie apparaît en haut ✅
5. Joue un autre quiz → il apparaît aussi
6. Tire vers le bas sur l'historique → pull-to-refresh fonctionne ✅

> [!tip]
> 

> ✅ **Checkpoint Étape 7** : ton quiz est **entièrement fonctionnel**. C'est l'objectif principal du fil rouge atteint.
> 

---

# 🟦 Étape 8 — Polish UX & finitions

> 🎯 **Objectif** : améliorer la qualité générale de l'app : perséverer les préférences, soigner les états vides/erreur, accessibilité.
> 

## 8.1 — Persistance du dernier thème joué (AsyncStorage)

Objectif : quand l'utilisateur ouvre l'app, on lui propose en premier le **dernier thème joué**.

Mets à jour `screens/HomeScreen.js` (ajoute uniquement les parties surlignées) :

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
// ✨ Nouvel import
import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../firebase.config';

// Clé utilisée pour stocker le dernier thème joué
const LAST_THEME_KEY = '@AppQuiz:lastThemeId';

export default function HomeScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // ✨ Nouvel état : dernier thème joué (null si jamais joué)
  const [lastThemeId, setLastThemeId] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'themes'));
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setThemes(list);

        // ✨ Lire le dernier thème depuis AsyncStorage
        const saved = await AsyncStorage.getItem(LAST_THEME_KEY);
        if (saved) setLastThemeId(saved);
      } catch (err) {
        setError('Impossible de charger les thèmes.');
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  // ✨ Au clic sur un thème, on sauvegarde son ID en local
  const handleSelectTheme = async (theme) => {
    await AsyncStorage.setItem(LAST_THEME_KEY, theme.id);
    navigation.navigate('Quiz', { themeId: theme.id, themeName: theme.name });
  };

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

      <FlatList
        data={themes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isLast = item.id === lastThemeId;
          return (
            <Pressable
              style={({ pressed }) => [
                styles.themeCard,
                isLast && styles.themeCardHighlight, // ✨ surligné si dernier joué
                pressed && styles.pressed,
              ]}
              onPress={() => handleSelectTheme(item)}
              accessibilityRole="button"
              accessibilityLabel={`Lancer le quiz ${item.name}`}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.themeText}>
                <View style={styles.themeNameRow}>
                  <Text style={styles.themeName}>{item.name}</Text>
                  {isLast && <Text style={styles.lastBadge}>Dernier joué</Text>}
                </View>
                <Text style={styles.themeMeta}>{item.questionCount} questions</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          );
        }}
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
  themeCardHighlight: { borderColor: '#1e40af', borderWidth: 2 }, // ✨
  pressed: { opacity: 0.7 },
  icon: { fontSize: 32, marginRight: 16 },
  themeText: { flex: 1 },
  themeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  themeName: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  lastBadge: {
    fontSize: 10,
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
  },
  themeMeta: { fontSize: 13, color: '#64748b', marginTop: 2 },
  arrow: { fontSize: 24, color: '#cbd5e1' },
});
```

## 8.2 — Statistiques sur le ProfileScreen

Enrichissons le profil avec quelques stats calculées depuis l'historique.

Remplace `screens/ProfileScreen.js` :

```jsx
import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

import { auth, db } from '../firebase.config';
import Button from '../components/Button';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [pseudo, setPseudo] = useState('');
  const [stats, setStats] = useState({ totalParties: 0, scoreMoyen: 0, meilleurScore: 0 });

  // Recharge à chaque focus de l'écran
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // 1. Récupérer le pseudo depuis users/{uid}
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) setPseudo(userDoc.data().pseudo || '');

          // 2. Calculer les stats depuis users/{uid}/history
          const histSnap = await getDocs(collection(db, 'users', user.uid, 'history'));
          const partiesArr = histSnap.docs.map((d) => d.data());

          const total = partiesArr.length;
          const moyen = total === 0 ? 0 : Math.round(partiesArr.reduce((s, p) => s + p.percentage, 0) / total);
          const meilleur = total === 0 ? 0 : Math.max(...partiesArr.map((p) => p.percentage));

          setStats({ totalParties: total, scoreMoyen: moyen, meilleurScore: meilleur });
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }, [user.uid])
  );

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => signOut(auth) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{pseudo ? pseudo.charAt(0).toUpperCase() : '👤'}</Text>
        <Text style={styles.pseudo}>{pseudo || 'Utilisateur'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalParties}</Text>
          <Text style={styles.statLabel}>Parties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.scoreMoyen}%</Text>
          <Text style={styles.statLabel}>Moyenne</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.meilleurScore}%</Text>
          <Text style={styles.statLabel}>Meilleur</Text>
        </View>
      </View>

      <View style={styles.spacer} />

      <Button title="Se déconnecter" variant="secondary" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', marginVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e40af',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 80,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pseudo: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  email: { fontSize: 14, color: '#64748b', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginVertical: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, textTransform: 'uppercase' },
  spacer: { flex: 1 },
});
```

## 8.3 — Accessibilité et zones tactiles

Nos composants `Button` et `QuestionCard` ont déjà :

- `accessibilityRole="button"` → lu correctement par les lecteurs d'écran
- `accessibilityLabel` → description vocale
- `minHeight: 48` ou plus → zones tactiles ≥ 44pt (recommandation Apple/Google)

**À vérifier sur ton app** :

- Aucun bouton trop petit (toujours ≥ 48dp de hauteur) ✅
- Contrastes lisibles (texte foncé sur fond clair, blanc sur bleu) ✅
- Tous les Pressable ont un feedback visuel (`pressed`) ✅

> [!tip]
> 

> ✅ **Checkpoint Étape 8** : ton app a une vraie qualité produit. Prêt·e pour le build !
> 

---

# 🟦 Étape 9 — Configuration production

> 🎯 **Objectif** : préparer `app.json`, l'icône et le splash screen pour un vrai build de production.
> 

## 9.1 — Configurer `app.json`

Ouvre `app.json` à la racine et remplace son contenu par :

```json
{
  "expo": {
    "name": "App Quiz",
    "slug": "app-quiz",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1e40af"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.tonpseudo.appquiz"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1e40af"
      },
      "package": "com.tonpseudo.appquiz",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

> [!warning]
> 

> Remplace `tonpseudo` dans `bundleIdentifier` et `package` par un vrai identifiant unique (ex : `com.stam.appquiz`). C'est obligatoire pour le build et **doit être unique mondialement**.
> 

## 9.2 — Préparer les images

Expo fournit déjà des images par défaut dans `assets/`. Tu peux les remplacer plus tard, mais pour le premier build elles suffisent.

Dimensions recommandées si tu veux personnaliser :

| Fichier | Dimension | Rôle |
| --- | --- | --- |
| `icon.png` | 1024 × 1024 | Icône principale (iOS + générique) |
| `adaptive-icon.png` | 1024 × 1024 | Icône Android (zone safe au centre) |
| `splash.png` | 1284 × 2778 | Écran de chargement |
| `favicon.png` | 48 × 48 | Pour la version web (optionnel) |

> [!tip]
> 

> Pour générer rapidement une icône, utilise [icon.kitchen](http://icon.kitchen) (gratuit, en ligne).
> 

## 9.3 — Vérifier que tout tourne

```bash
npx expo start
```

Verifie une dernière fois que tout fonctionne dans Expo Go avant de builder.

> [!tip]
> 

> ✅ **Checkpoint Étape 9** : `app.json` configuré, icônes en place, app fonctionnelle.
> 

---

# 🟦 Étape 10 — EAS Build (APK Android)

> 🎯 **Objectif** : générer un APK Android via EAS Build et le tester sur device.
> 

## 10.1 — Installer EAS CLI

```bash
npm install -g eas-cli
```

Vérifie l'installation :

```bash
eas --version
```

## 10.2 — Se connecter à son compte Expo

```bash
eas login
```

Entre tes identifiants Expo (créés à l'étape 1.5).

## 10.3 — Configurer EAS pour le projet

Dans le dossier du projet :

```bash
eas build:configure
```

Là tu réponds :

- **Which platforms?** → Android
- L'outil crée automatiquement un fichier `eas.json` à la racine.

Ouvre `eas.json` et remplace son contenu par :

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

> [!info]
> 

> Deux profils sont définis :
> 

> - **preview** → génère un **APK** facile à installer directement sur un device. C'est ce qu'on veut pour le rendu.
> 

> - **production** → génère un **AAB** (App Bundle) requis pour le Play Store.
> 

## 10.4 — Lancer le build

```bash
eas build --platform android --profile preview
```

L'outil va :

1. Te demander de créer un keystore Android (laisse EAS le générer pour toi : **Yes**)
2. Uploader ton code sur les serveurs Expo
3. Lancer le build (compte ~10 à 25 minutes selon la file d'attente)
4. Te donner un lien vers la page du build

> [!warning]
> 

> **Sur le plan gratuit Expo**, les builds peuvent attendre dans une file d'attente. Si ça prend énormément de temps (>1h), il y a un fallback ci-dessous.
> 

## 10.5 — Récupérer et installer l'APK

Quand le build se termine :

1. Va sur [expo.dev](http://expo.dev) → Projects → ton projet → Builds
2. Télécharge l'APK
3. **Sur Android** : autorise l'installation depuis sources inconnues, puis ouvre l'APK → installé ✅

## 10.6 — Fallback : build local Android

Si EAS Build prend trop de temps (file gratuite), tu peux builder en local :

```bash
npx expo run:android --variant release
```

> [!warning]
> 

> Cette commande nécessite **Android Studio** installé + un device Android branché ou un émulateur. Plus complexe à mettre en place que EAS, mais 100% offline.
> 

## 10.7 — Tester l'APK installé

Après installation :

1. L'app apparaît dans le tiroir d'apps avec le nom **« App Quiz »**
2. Lance-la → splash screen bleu → Login
3. **Connecte-toi** avec ton compte (créé pendant le dev)
4. Joue un quiz, vérifie l'historique ✅

> [!tip]
> 

> ✅ **Checkpoint Étape 10** : tu as un APK installé et fonctionnel sur ton device. Félicitations 🎉
> 

---

# Pistes bonus

Pour aller plus loin (notation bonus +2 points) :

### ⏱ Timer par question

Ajoute un compteur 30s qui se déclenche sur chaque question. Si le temps expire → réponse fausse automatique. Utilise `setInterval` dans un `useEffect` du `QuizScreen`.

### 🌙 Dark mode

Utilise `useColorScheme()` de React Native pour détecter le thème système. Définis deux palettes (light/dark) et un Context React pour les distribuer aux composants.

### 🏆 Classement temps réel

Utilise `onSnapshot()` de Firestore pour écouter les modifications de la collection `users` en temps réel. Affiche un Top 10 par score moyen avec mise à jour automatique.

### ✨ Animations de transition

Utilise `react-native-reanimated` pour animer l'apparition des cartes (fade + translate). Bonus accessibilité : respecter `useReducedMotion` pour les utilisateurs sensibles aux animations.

### 📷 Avatar utilisateur

Ajoute Firebase Storage à l'étape 4. Permets à l'utilisateur d'uploader une photo de profil depuis sa galerie (`expo-image-picker`).