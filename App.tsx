// In App.js in a new project
import * as React from 'react';
import {View, Text, Platform, LogBox} from 'react-native';
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
import NoteDetailScreen from "./src/screens/NoteDetailScreen";
import NotesScreen from "./src/screens/NotesScreen";

import PushNotification from 'react-native-push-notification';
import { useEffect } from 'react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import WebViewScreen from "./src/screens/WebViewScreen";

const Stack = createNativeStackNavigator();

function App() {
  LogBox.ignoreLogs([
    'Warning: Internal React error: Attempted to capture a commit phase error inside a detached tree.'
  ]);

  useEffect(() => {

    const checkNotificationPermission = async () => {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (requestResult !== RESULTS.GRANTED) {
          console.log('Notification permission denied');
        }
      }
      if (Platform.Version >= 31) { // Android 12及以上
        const exactAlarmResult = await check(PERMISSIONS.ANDROID.SCHEDULE_EXACT_ALARM);
        if (exactAlarmResult !== RESULTS.GRANTED) {
          const requestExactAlarmResult = await request(PERMISSIONS.ANDROID.SCHEDULE_EXACT_ALARM);
          if (requestExactAlarmResult !== RESULTS.GRANTED) {
            console.log('Exact alarm permission denied');
            return;
          }
        }
      }

    };

    checkNotificationPermission();
    // 初始化通知
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      // 请求权限（仅适用于iOS）
      requestPermissions: Platform.OS === 'ios'
    });

    // 创建通知频道
    PushNotification.createChannel(
        {
          channelId: "default-channel-id", // 唯一的频道ID
          channelName: "Default Channel", // 显示在设置中的频道名称
          channelDescription: "A default channel", // 频道描述
          playSound: true,
          soundName: "default",
          importance: 4, // 通知重要性（4=高, 3=中, 2=低, 1=最小）
          vibrate: true, // 是否振动
        },
        (created) => console.log(`createChannel returned '${created}'`) // 回调函数，日志记录创建结果
    );
  }, []);

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
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false, // 这会隐藏所有屏幕的导航栏
      }}>
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
        {/*update*/}
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;