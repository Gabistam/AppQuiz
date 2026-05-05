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