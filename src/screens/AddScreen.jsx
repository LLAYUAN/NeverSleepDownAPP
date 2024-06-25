import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  ActionSheetAndroid,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import EventEdit from '../component/EventEdit';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";

const AddScreen = ({ navigation}) => {
  const [coursetoSend, setCoursetoSend] = useState(null);
  const[isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("EventEdit挂载挂载挂载");
    const getCourseAI = async () => {
      await AsyncStorage.getItem('course',(error, result) => {
        if (error) {
          // 处理读取错误
          console.error('读取错误:', error);
        } else {
          console.log('AddScreen:getCourseAI:读取的数据:', result);
          const parsedData = JSON.parse(result);
          console.log("AddScreen:getCourseAI:parsedData");
          console.log(parsedData);
          if (result !== "false") {
            const tmpcourse = {
              courseCode: parsedData.courseCode,
              dayRepeat: parsedData.dayRepeat,
              dayRepeatNum: parsedData.dayRepeatNum,
              endTime: parsedData.endTime,
              eventDate: parsedData.eventDate,
              eventID: parsedData.eventID,
              eventLocation: parsedData.eventLocation,
              eventName: parsedData.eventName,
              isImportant: parsedData.isImportant,
              startTime: parsedData.startTime,
              timeNum: parsedData.timeNum,
              type: parsedData.type,
              weekRepeat: parsedData.weekRepeat
            }
            setCoursetoSend(tmpcourse);
            console.log("AddScreen:coursetoSend:");
            console.log(coursetoSend);
          }
        }
      });
      setIsLoading(false);
    }
    getCourseAI();
  }, []);

  const handleback = () => {
    AsyncStorage.setItem('course',JSON.stringify(false));
    navigation.navigate('Day');
  }

  const handleFinish = () => {
    // Implement your login logic here
    AsyncStorage.getItem('eventtoSave', (error, result) => {
      if (error) {
        // 处理错误
        console.error('Error reading from AsyncStorage:', error);
      } else {
        // 将字符串转换回对象
        const eventtoSave = JSON.parse(result);
        console.log('AddScreen:Event loaded from AsyncStorage:', eventtoSave);
        let isOK = true;
        if (!eventtoSave.eventName) {
          isOK = false;
          Alert.alert(
              '新建失败', // 标题
              '请输入事件标题', // 内容
              [
                {
                  text: '确定', // 按钮文本
                },
              ],
              { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
          );
        }
        else if (!eventtoSave.weekRepeat) {
          isOK = false;
          Alert.alert(
              '新建失败', // 标题
              '请选择事件重复情况', // 内容
              [
                {
                  text: '确定', // 按钮文本
                },
              ],
              { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
          );
        }

        //对课程信息填写是否完整进行判断
        if (eventtoSave.type === false && isOK === true) {
          if (eventtoSave.dayRepeat[0].endTimeNumber === 0) {
            isOK = false;
            Alert.alert(
                '新建失败', // 标题
                '请选择上课时间', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
          else if (!eventtoSave.courseCode) {
            isOK = false;
            Alert.alert(
                '新建失败', // 标题
                '请填写课程代码', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
        }
        //对日程信息进行判断。
        if (eventtoSave.type === true && isOK === true) {
          if (!eventtoSave.dayRepeat[0].endTime || !eventtoSave.dayRepeat[0].startTime) {
            isOK = false;
            Alert.alert(
                '新建失败', // 标题
                '请选择日程时间', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
          else if (eventtoSave.dayRepeat[0].endTime <= eventtoSave.dayRepeat[0].startTime) {
            isOK = false;
            Alert.alert(
                '新建失败', // 标题
                '日程开始时间晚于或等于结束时间', // 内容
                [
                  {
                    text: '确定', // 按钮文本
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
        }

        if(isOK) {
          axios({
            method: 'post',
            url: 'http://192.168.116.144:8080/changeEventInfo',
            // url: 'https://mock.apifox.com/m1/4226545-3867488-default/changeEventInfo',
            // headers: {
            //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
            // },
            data:
            eventtoSave

          }).then(
              response => {
                if(response.data.isRepeat === false) {
                  Alert.alert(
                      '新建成功', // 标题
                      '',
                      [
                        {
                          text: '确定', // 按钮文本
                          onPress: () => {
                            navigation.reset({
                              index: 1,
                              routes: [{ name: 'Home' }, { name: 'Day' }],
                            });
                            AsyncStorage.setItem('course',JSON.stringify(false));
                          }
                        },
                      ],
                      { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                  );
                  getAndscheduleNotifications();
                } else {
                  Alert.alert(
                      '新建失败', // 标题
                      response.data.message, // 内容
                      [
                        {
                          text: '确定', // 按钮文本
                          /*******onPress开始**********/
                          onPress: async () => {
                            eventtoSave.isDirectlySave = true;
                            console.log("AddScreen:afterPress eventtoSave:",eventtoSave);
                            await axios({
                              method: 'post',
                              url: 'http://192.168.116.144:8080/changeEventInfo',
                              data: eventtoSave
                            }).then(response => {
                              Alert.alert(
                                  '新建成功', // 标题
                                  '',
                                  [
                                    {
                                      text: '确定', // 按钮文本
                                      onPress: () => {
                                        AsyncStorage.setItem('course',JSON.stringify(false));
                                        navigation.reset({
                                          index: 1,
                                          routes: [{ name: 'Home' }, { name: 'Day' }],
                                        });
                                      }
                                    },
                                  ],
                                  { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                              );
                            }).catch(error => {
                              console.error('Error fetching data:', error);
                            });
                            getAndscheduleNotifications();
                          }
                          /*******onPress结束**********/
                        },
                        {
                          text: '取消',
                        }
                      ],
                      { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                  );
                }
              }
          ).catch(error => {
            console.error('Error fetching data:', error);
          });
        }
        // 使用 eventtoSave 对象
      }
    });
  };

  if(isLoading) return <Text>Loading...</Text>
  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleback}>
            <Text style={{fontSize:12,color:'white'}}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>新建事项</Text>
        <View style={{ width: 48 }} />
      </View>

      <EventEdit navigation={navigation} isEdit={true} course={coursetoSend}/>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>完成</Text>
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

});

export default AddScreen;