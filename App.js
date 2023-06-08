import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Dashboard from './src/pages/Dashboard';
import HomeScreen from './src/pages/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entrada from './src/pages/Entrada';
import EntradaTab from './src/tabs/EntradaTab';
import DashboardTab from './src/tabs/DashboardTab';

const Stack = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Entrada'
          component={EntradaTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Dashboard'
          component={DashboardTab}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
