// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DayCalendarScreen from './src/screens/DayCalendarScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MonthCalendarScreen from './src/screens/MonthCalendarScreen';
import WeekCalendarScreen from './src/screens/WeekCalendarScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={DayCalendarScreen} />
        <Stack.Screen name="Day" component={DayCalendarScreen} />
        <Stack.Screen name="Week" component={WeekCalendarScreen} />
        <Stack.Screen name="Month" component={MonthCalendarScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;