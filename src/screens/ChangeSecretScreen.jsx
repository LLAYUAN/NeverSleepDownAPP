import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ChangeSecretScreen = ({ navigation }) => {
  const[userId, setUserId] = useState(''); // 用户id
  const [oldPassword, setOldPassword] = useState(''); // 旧密码
  const [newPassword, setNewPassword] = useState(''); // 新密码
  const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码

//todo: 点击完成按钮后逻辑：比对两遍密码是否一样
  const handleFinish = () => {
    navigation.navigate('Home');
  };

  return (
  <LinearGradient colors={['#72C4FF90', '#FF9E9E90']} style={styles.container}>
    <View style={styles.block}>
      <Text style={styles.title}>修改密码</Text>
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={userId}
        onChangeText={setUserId}
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
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F7',
    position: 'relative'
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
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    checkboxContainer: {
      justifyContent: 'center',
      alignItems: 'center',
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