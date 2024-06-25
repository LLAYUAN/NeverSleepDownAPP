import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ForgetSecretScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

//todo:处理完成忘记逻辑
  const handleFinish = () => {

    navigation.navigate('Home');
  };

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
        <TextInput
            style={styles.input}
            placeholder="确认密码"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
        />



      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttontext}>注 册</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LowContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerText}>登录</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerText}>注册</Text>
             </TouchableOpacity>
      </View>
      </View>

      <View style={{height:600}}/>
        <TouchableOpacity onPress={() => navigation.navigate('jaccount')} >
           <Text style={styles.footerText}>Jaccount 登录</Text>
        </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   height: '100%',
  //   width: '100%',
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F0F0F7',
  //   position: 'relative'
  // },
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
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F7',
    position: 'relative',
      //flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      padding: 20,
    },
    checkboxContainer: {
      justifyContent: 'center',
      //alignItems: 'center',
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

});

export default ForgetSecretScreen;