import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Alert, Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

import axios from 'axios';
import AsyncStorage from "@react-native-community/async-storage";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSelected, setSelection] = useState(false);


  const handleLogin = async () => {
    console.log("handle login111");
    console.log(username);
    console.log(password);
    // Implement your login logic here
    //axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/isPasswordCorrect',
      data: {
        userID: username,
        password: password,
        isAutoLogin: isSelected
      }
    }).then(response => {
      console.log("response.data:");
      console.log(response.data);
      //console.log(JSON.stringify(response.data));
      if (response.data.code && response.data.data) {
        if (response.data.data.isLogin) {
          console.log("cookies:");
          console.log(response.data.data.cookie);
          AsyncStorage.setItem('cookie', response.data.data.cookie);
          console.log("tabledata:");
          console.log(response.data.data);
          AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
          AsyncStorage.setItem('isFirstLogin', JSON.stringify(response.data.data.isFirstLogin));
          AsyncStorage.setItem('course',JSON.stringify(false));
          navigation.navigate('Home');
        } else {
          console.log("isLogin = false!!!");
          Alert.alert(
              '登录失败', // 标题
              '用户名或密码错误，请重试', // 内容
              [
                {
                  text: '确定', // 按钮文本
                  onPress: () => {
                    // 用户点击确定后执行的操作
                    setUsername(''); // 重置用户名输入框
                    setPassword(''); // 重置密码输入框
                  }
                },
              ],
              { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
          );
        }
      } else {
        console.error("Error: code is 0!");
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });

    getAndscheduleNotifications();

   console.log("handle login222");

    //console.log('Username:', username, 'Password:', password, 'AutoLogin:', isSelected);
    //navigation.navigate('Home');
  };

  const handleJacLogin = () => {
    const clientId = 'ov3SLrO4HyZSELxcHiqS';
    const redirectUri = encodeURIComponent('myapp://callback');
    const responseType = 'code';
    const state = 'xyz';
    const authUrl = `https://jaccount.sjtu.edu.cn/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    console.log('Navigating to WebViewScreen with URL:', authUrl); // 添加日志
    navigation.navigate('WebViewScreen', { url: authUrl });
  }

  return (
  <LinearGradient colors={['#72C4FF', '#FF9E9E']} style={styles.container}>
    <View style={styles.block}>
      <Text style={styles.title}>NSD 课表小助手</Text>
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelected}
                onValueChange={setSelection}
                style={styles.checkbox}
                tintColors={{ true: '#002FA7', false: '#b0c4de' }}
              />
              <Text style={styles.label}>自动登录</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttontext}>登 录</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LowContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerText}>立即注册</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgetSecret')}>
                  <Text style={styles.footerText}>忘记密码</Text>
             </TouchableOpacity>
      </View>

      </View>
        <TouchableOpacity onPress={handleJacLogin} style={styles.jaccontaner}>
           <Text style={styles.footerText}>Jaccount 登录</Text>
        </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F7',
    position: 'relative',
    padding: 20
  },
  block: {
    position: 'absolute',
    top: '25%',
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    opacity: 0.8,

  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#002FA7',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '90%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: '90%', // 按钮宽度
    height: 40, // 按钮高度
    borderRadius: 10, // 设置圆角
    justifyContent: 'center',
    alignItems: 'center',
    underlayColor: '#000F37',
  },
  buttontext: {
    color: '#FFFFFF', // 文本颜色
    fontSize: 16, // 文本大小
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    color: '#000F37',
  },
  /*container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },*/
    checkboxContainer: {
      justifyContent: 'center',
      /*alignItems: 'center',*/
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      marginRight: 8,
    },
    label: {
      fontSize: 14,
    },

    LowContainer:{
      width: '90%',
      flexDirection: 'row',
      marginVertical: 10,
      borderRadius: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jaccontaner:{
        position: 'absolute',
        bottom: '10%',
    }
});

export default LoginScreen;