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
import AddScreen from './src/screens/AddScreen';
import DetailScreen from './src/screens/DetailScreen';
import AddTableScreen from './src/screens/AddTableScreen';
import ExchangeScreen from './src/screens/ExchangeScreen';
import SettingScreen from './src/screens/SettingScreen';
import TimeSettingScreen from './src/screens/TimeSettingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChangeSecretScreen from './src/screens/ChangeSecretScreen';
import ForgetSecretScreen from './src/screens/ForgetSecretScreen';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";

const Stack = createNativeStackNavigator();

function App() {

  axios.interceptors.request.use(async (config) => {
    const cookie = await AsyncStorage.getItem('cookie');
    if (cookie) {
      config.headers.Cookie = cookie;
    }
    return config;
  }, (error) => {
    // 处理请求错误
    return Promise.reject(error);
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={DayCalendarScreen} />
        <Stack.Screen name="Day" component={DayCalendarScreen} />
        <Stack.Screen name="Week" component={WeekCalendarScreen} />
        <Stack.Screen name="Month" component={MonthCalendarScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Detail" component={DetailScreen}/>
        <Stack.Screen name="AddTable" component={AddTableScreen}/>
        <Stack.Screen name="Tiaoxiu" component={ExchangeScreen}/>
        <Stack.Screen name="Setting" component={SettingScreen}/>
        <Stack.Screen name="TimeSetting" component={TimeSettingScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="ChangeSecret" component={ChangeSecretScreen}/>
        <Stack.Screen name="ForgetSecret" component={ForgetSecretScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;