import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import {response} from "../../.yarn/releases/yarn-1.22.22";


const ChangeSecretScreen = ({ route, navigation }) => {
  const {userID} = route.params;
  const[userId, setUserId] = useState(userID); // 用户id
  const [oldPassword, setOldPassword] = useState(''); // 旧密码
  useEffect(() => {
    console.log("ChangeSecretScreen: oldPassword:");
    console.log(oldPassword);
  }, [oldPassword]);
  const [newPassword, setNewPassword] = useState(''); // 新密码
  const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码

//todo: 点击完成按钮后逻辑：比对两遍密码是否一样
  const handleFinish = () => {
    if (newPassword === confirmPassword && oldPassword && newPassword && newPassword.match(/\s/) === null) {
      axios({
        method: 'post',
        url: 'http://192.168.116.144:8080/modifyPassword',
        // url: 'https://mock.apifox.com/m1/4226545-3867488-default/modifyPassword',
        //
        // headers: {
        //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        // },
        data: {
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      }).then(response => {
        if (response.data.code && response.data.data) {
          console.log("ChangeSecretScreen:modifyStatus:");
          console.log(response.data.data.modifyStatus);
          if (response.data.data.modifyStatus === 0) {
            Alert.alert(
                '修改失败', // 标题
                '原密码错误', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {
                      // 用户点击确定后执行的操作
                      setOldPassword('');
                    }
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
          else if (response.data.data.modifyStatus === 1) {
            Alert.alert(
                '修改失败', // 标题
                '新密码与原密码重复', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {
                      // 用户点击确定后执行的操作
                      setNewPassword('');
                      setConfirmPassword('');
                    }
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
          else if (response.data.data.modifyStatus === 2) {
            Alert.alert(
                '修改成功', // 标题
                '请重新登录', // 内容
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
          }
          else {
            Alert.alert(
                '未知错误', // 标题
                '请与后端联系(', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {

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
    else if (!oldPassword) {
      Alert.alert(
          '注册失败', // 标题
          '未输入原密码', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setOldPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (!newPassword) {
      Alert.alert(
          '注册失败', // 标题
          '未输入新密码', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setNewPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (newPassword.match(/\s/) !== null) {
      Alert.alert(
          '注册失败', // 标题
          '密码中不能包含空格', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setNewPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (newPassword !== confirmPassword) {
      Alert.alert(
          '注册失败', // 标题
          '两次输入的密码不同', // 内容
          [
            {
              text: '确定', // 按钮文本
              onPress: () => {
                // 用户点击确定后执行的操作
                setNewPassword('');
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
                setNewPassword('');
                setConfirmPassword('');
              }
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
  };

  return (
  <LinearGradient colors={['#72C4FF90', '#FF9E9E90']} style={styles.container}>
    <View style={styles.block}>
      <Text style={styles.title}>修改密码</Text>
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={userId}
        //onChangeText={setUserId}
        editable={false}
      />

        <TextInput
            style={styles.input}
            placeholder="旧密码"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
        />
        <TextInput
            style={styles.input}
            placeholder="新密码"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
        />
        <TextInput
            style={styles.input}
            placeholder="确认密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
        />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>完 成</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LowContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.footerText}>返回</Text>
              </TouchableOpacity>
      </View>

      </View>
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
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
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
  buttonText: {
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
      backgroundColor: '#F0F0F7',
      position: 'relative',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    checkboxContainer: {
      justifyContent: 'center',
      //alignItems: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
    },

    LowContainer:{
      width: '90%',
      flexDirection: 'row',
      marginVertical: 10,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default ChangeSecretScreen;