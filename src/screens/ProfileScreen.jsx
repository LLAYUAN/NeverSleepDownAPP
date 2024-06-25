import React, {useEffect, useState} from 'react';
import { Modal,Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ActionSheetAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";


const ProfileScreen = ({ navigation }) => {
  const [isUserInfoReady, setIsUserInfoReady] = useState(false);
  //todo:从后端获取用户信息进行初始化
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    console.log("ProfileScreen: name:");
    console.log(name);
  }, [name]);

  useEffect(() => {
    console.log("ProfileScreen: gender:");
    console.log(gender);
  }, [gender]);

  useEffect(() => {
    console.log("ProfileScreen: gender:");
    console.log(location);
  }, [location]);

  useEffect(() => {
      axios({
        method: 'get',
        url: 'http://192.168.116.144:8080/getUserInfo',
        // url: 'https://mock.apifox.com/m1/4226545-3867488-default/getUserInfo',
        // headers: {
        //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        // }
      }).then(response => {
        //console.log(JSON.stringify(response.data));
        console.log("run getuserinfo:")
        if (response.data.code && response.data.data) {
          setUserId(response.data.data.userID);
          setName(response.data.data.userName);
          setGender(response.data.data.userGender === true? '女' : '男');
          setLocation(response.data.data.userLocation);
          setIsUserInfoReady(true);
        } else {
          console.error("Error: code is 0!");
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

//todo：处理保存逻辑
  const handleFinish = () => {
    // Implement your login logic here
    axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/addUserInfo',
      // url: 'https://mock.apifox.com/m1/4226545-3867488-default/addUserInfo',
      // headers: {
      //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      // },
      data: {
        userName: name,
        userGender: gender==='男' ? false : true,
        userLocation: location,
        avatarURL: ''
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    console.log("ProfileScreen:finish:");
    console.log("send data:");
    console.log(name);
    console.log(gender);
    console.log(location);
    navigation.navigate('Home');
  };

//todo:处理更改头像逻辑
  const handleUploadImg=()=>{}

  if (!isUserInfoReady) {
    return <Text>Loading...</Text>;
  }

  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{fontSize:12,color:'white'}}>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backButton,{backgroundColor:'#F16326'}]} onPress={() => handleFinish()}>
            <Text style={{fontSize:12,color:'white'}}>完成</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleUploadImg} style={{justifyContent:'center',alignItems:'center',margin:30}}>
        <Image source={require('../image/tx.png')} style={{width:100,height:100,borderRadius:50}}/>
      </TouchableOpacity>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>用户名</Text>
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="地点"
        value={userId}
      />
    </View>

    <View style={{height:40}}/>
    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>昵称</Text>
      <TouchableOpacity style={styles.select}>
      <TextInput
          style={[styles.input,{width:120,marginRight:30,textAlign: 'right'}]}
        placeholder="昵称"
        onChangeText={setName}
        value={name}
      />
      {/*<Image source={require('../image/select.png')} style={styles.icon}/>*/}
      </TouchableOpacity>
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>性别</Text>
      <Picker
        selectedValue={gender}
        onValueChange={itemValue => setGender(itemValue)}
        style={{ width: 120 ,color:'black'}}
      >
        <Picker.Item label="女" value="女" />
        <Picker.Item label="男" value="男" />
      </Picker>
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>属地</Text>
      <TouchableOpacity style={styles.select}>
      <TextInput
          style={[styles.input,{width:120,marginRight:30,textAlign: 'right'}]}
        placeholder="属地"
        onChangeText={setLocation}
        value={location}
      />
      {/*<Image source={require('../image/select.png')} style={styles.icon}/>*/}
      </TouchableOpacity>
    </View>

    <View style={{height:70}}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangeSecret', {userID: userId})}>
            <Text style={styles.buttonText}>修改密码</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.reset({
          index: 1,
          routes: [{ name: 'Login' }],
        })
        }>
            <Text style={styles.buttonText}>退出登录</Text>
        </TouchableOpacity>
      </View>


    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F0F7',
    position: 'relative',
    padding:20,
  },
  header: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton:{
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: 50, // 按钮宽度
    height: 30, // 按钮高度
    borderRadius: 5, // 设置圆角
    justifyContent: 'center',
    alignItems: 'center',
    underlayColor: '#000F37',
  },
  title: {
    fontSize: 24,
    color: '#002FA7',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: '90%', // 按钮宽度
    height: 45, // 按钮高度
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
    selectContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // 按钮背景颜色
        width: '90%', // 按钮宽度
        height: 45, // 按钮高度
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 0,
        zIndex: 1, // 确保没有被其它视图覆盖
        marginTop: 10,
    },
    titleText:{
        fontSize: 16,
        color: '#002FA7',
        fontWeight: 'bold',
    },
    select:{
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         marginRight: 15,
         width: 130,
    },
    icon:{
        width: 15,
        height: 15,
    },
    colorText:{
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
    },
  input: {
    height: 45,
    marginVertical: 10,
    marginRight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: 'black',
  },
});

export default ProfileScreen;