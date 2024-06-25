import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import {response} from "../../.yarn/releases/yarn-1.22.22";


const RegisterScreen = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    console.log("RegisterScreen: userID:");
    console.log(userID);
  }, [userID]);

  useEffect(() => {
    console.log("RegisterScreen: password:");
    console.log(password);
  }, [password]);

  useEffect(() => {
    console.log("RegisterScreen: confirmPassword:");
    console.log(confirmPassword);
  }, [confirmPassword]);

//todo:处理完成注册逻辑，两遍密码是否一样
  const handleRegister = () => {
    if (password === confirmPassword && userID && password && userID.match(/\s/) === null && password.match(/\s/) === null) {
      axios({
        method: 'post',
        url: 'http://192.168.116.144:8080/addUsertoDatabase',
        // url: 'https://mock.apifox.com/m1/4226545-3867488-default/addUsertoDatabase',
        // headers: {
        //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        // },
        data: {
          userID: userID,
          password: password,
        }
      }).then(response => {
        if (response.data.code && response.data.data) {
          if (response.data.data.isSuccess) {
            console.log("注册成功");
            Alert.alert(
                '注册成功', // 标题
                '', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {
                      navigation.navigate('Login');
                    }
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          } else {
            console.log("注册失败");
            Alert.alert(
                '注册失败', // 标题
                '已存在该用户名', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {
                      // 用户点击确定后执行的操作
                      setUserID('');
                    }
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
        } else {
          console.log("Error: code is 0!");
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }
    else if (!userID) {
      Alert.alert(
          '注册失败', // 标题
          '未输入用户名', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setUserID('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (userID.match(/\s/) !== null) {
      Alert.alert(
          '注册失败', // 标题
          '用户名中不能包含空格', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setUserID('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (!password) {
      Alert.alert(
          '注册失败', // 标题
          '未输入密码', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (password.match(/\s/) !== null) {
      Alert.alert(
          '注册失败', // 标题
          '密码中不能包含空格', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (password !== confirmPassword) {
      Alert.alert(
          '注册失败', // 标题
          '两次输入的密码不同', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else {
      Alert.alert(
          '注册失败', // 标题
          '未知问题', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
  };

  return (
  <LinearGradient colors={['#72C4FF', '#FF9E9E']} style={styles.container}>
    <View style={styles.block}>
      <Text style={styles.title}>NSD 课表小助手</Text>
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={userID}
        onChangeText={setUserID}
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttontext}>注 册</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LowContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerText}>登录</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgetSecret')}>
                  <Text style={styles.footerText}>忘记密码</Text>
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
      padding: 20,
    backgroundColor: '#F0F0F7',
    position: 'relative'
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

export default RegisterScreen;