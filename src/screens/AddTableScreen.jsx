import React, {useEffect, useState} from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";


const AddTableScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  useEffect(() => {
    console.log("AddTableScreen:name:");
    console.log(name);
  }, [name]);

  //这个是否复制时间暂时不做
  const [isSelected, setSelection] = useState(false);

//todo: 新建工作表完成逻辑
  const handleFinish = async () => {
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/switchTable',
      // url: 'https://mock.apifox.com/m1/4226545-3867488-default/switchTable',
      // headers: {
      //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      // },
      data: {
        tableID: 0,
        tableName: name
      }
    }).then(response => {
      if (response.data.code && response.data.data) {
        console.log("back cookie:");
        console.log(response.data.data.cookie);
        AsyncStorage.setItem('cookie', response.data.data.cookie);
        AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
        console.log("修改cookie和tabledata");
        navigation.navigate('Home');
      } else {
        console.error("Error: code is 0!");
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });

    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Day' }],
    });

  };

  return (
  <LinearGradient colors={['#72C4FF90', '#FF9E9E90']} style={styles.container}>
    <View style={styles.block}>
      <Text style={styles.title}>新建工作表</Text>
      <TextInput
        style={styles.input}
        placeholder="名称"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelected}
                onValueChange={setSelection}
                style={styles.checkbox}
                tintColors={{ true: '#002FA7', false: '#b0c4de' }}
              />
              <Text style={styles.label}>复制当前工作表的上课时间</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>完 成</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LowContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Day')}>
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
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default AddTableScreen;