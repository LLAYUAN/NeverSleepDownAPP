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
import axios from "axios";
import {response} from "../../.yarn/releases/yarn-1.22.22";
import AsyncStorage from "@react-native-community/async-storage";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";

const DetailScreen = ({ route,navigation/*添加了eventID*/}) => {

//todo: 这里course是再次硬编码的，course是从TimeLine通过路由传进来的，在TimeLine硬编码的格式和这边不太一样
//按理说应该直接用下面这句
//const course = route.params?.course;
  const { eventID, eventDate } = route.params;
  useEffect(() => {
    console.log("detailpage:eventID:");
    console.log(eventID);
  }, [eventID]);
  useEffect(() => {
    console.log("detailpage:eventDate:");
    console.log(eventDate);
  }, [eventDate]);

  //将startTimeNumber和endTimeNumber转化为从startTimeNumber到endTimeNumber的string
  const convertTimeNumbertoString = (startTimeNumber, endTimeNumber) => {
    let result = startTimeNumber.toString();
    for (let i = startTimeNumber + 1; i <= endTimeNumber; i++) {
      result = result +','+ i.toString();
    }
    return result;
  }

  //const [course, setCourse] = useState(null);
  const [course, setCourse] = useState(null);
  const [isCourseReady, setIsCourseReady] = useState(false);
  useEffect(() => {
    axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/loadEventInfo',
      // url: 'https://mock.apifox.com/m1/4226545-3867488-default/loadEventInfo',
      // headers: {
      //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      // },
      data: {
        eventID: eventID
      }
    }).then(response => {
      if (response.data.code && response.data.event) {
        console.log("detail:getResponseData:");
        console.log(response.data.event);
        console.log("detail:dayRepeat:");
        console.log(response.data.event.dayRepeat[0]);
        const tmpres = convertTimeNumbertoString(response.data.event.dayRepeat[0].startTimeNumber,response.data.event.dayRepeat[0].endTimeNumber);
        console.log("ke cheng suo zhan jie shu:");
        console.log(tmpres);
        const tmpcourse = {
          eventName: response.data.event.eventName,
          eventLocation: response.data.event.eventLocation,
          courseCode: response.data.event.courseCode,
          isImportant: response.data.event.isImportant,
          type: response.data.event.type,
          eventID: eventID,
          eventDate: eventDate,
          startTime: response.data.event.dayRepeat[0].startTime /*+ ':00'*/,//传到eventedit的时候加个秒，这样统一，好看点
          endTime: response.data.event.dayRepeat[0].endTime /*+ ':00'*/,
          timeNum: tmpres,
          weekRepeat: response.data.event.weekRepeat,
          dayRepeatNum: response.data.event.dayRepeat.length,
          dayRepeat: response.data.event.dayRepeat
        }
        setCourse(tmpcourse);
        setIsCourseReady(true);
      } else {
        console.error("Error: code is 0!");
      }
    })
  }, [eventID]);

//const course={eventName: '软件工程', eventLocation: '教学楼A101', courseCode:'SE12321',isImportant:true,type:0};

const[isEdit,setIsEdit] = useState(false);
const[myEventtoSave, setMyEventtoSave] = useState({});
  const handleFinish = async () => {
    // Implement your login logic here
    const result = await AsyncStorage.getItem('eventtoSave');
    if (result) {
      const eventtoSave = JSON.parse(result);
      console.log('DetailScreen:Event loaded from AsyncStorage:', eventtoSave);
      let isOK = true;
      if (!eventtoSave.eventName) {
        isOK = false;
        Alert.alert(
            '编辑失败', // 标题
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
            '编辑失败', // 标题
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
              '编辑失败', // 标题
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
              '编辑失败', // 标题
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
              '编辑失败', // 标题
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
              '编辑失败', // 标题
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
      // 使用 eventtoSave 对象
      if (isOK) {
        //先删除
        console.log("before eventtoSave:");
        console.log(eventtoSave);
        setMyEventtoSave(eventtoSave);
        await axios({
          method: 'post',
          url: 'http://192.168.116.144:8080/deleteEvent',
          data: {
            eventID: eventtoSave.eventID
          }
        }).then(response => {
          console.log("handleDelete: response status:");
          console.log(response.status);
        }).catch(error => {
          console.error('Error fetching data:', error);
        });

        console.log("add : eventtoSave:");
        console.log(eventtoSave);
        //后端eventID为0才是新建
        eventtoSave.eventID = 0;
        await axios({
          method: 'post',
          url: 'http://192.168.116.144:8080/changeEventInfo',
          data:
          eventtoSave
        }).then(response => {
          if(response.data.isRepeat === false) {
            Alert.alert(
                '编辑成功', // 标题
                '',
                [
                  {
                    text: '确定', // 按钮文本
                  },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          } else {
            Alert.alert(
                '编辑失败', // 标题
                response.data.message, // 内容
                [
                  {
                    text: '确定', // 按钮文本
                    onPress: () => {
                      eventtoSave.isDirectlySave = true;
                      axios({
                        method: 'post',
                        url: 'http://192.168.116.144:8080/changeEventInfo',
                        data: eventtoSave
                      }).then(response => {
                        Alert.alert(
                            '编辑成功', // 标题
                            '',
                            [
                              {
                                text: '确定', // 按钮文本
                              },
                            ],
                            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                        );
                      }).catch(error => {
                        console.error('Error fetching data:', error);
                      });
                    }
                  },
                  {
                    text: '取消',
                  }
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
          }
        }).catch(error => {
          console.error('Error fetching data:', error);
        });
        getAndscheduleNotifications();
      }

    }


    /*await AsyncStorage.getItem('eventtoSave', (error, result) => {
      if (error) {
        // 处理错误
        console.error('Error reading from AsyncStorage:', error);
      } else {
        // 将字符串转换回对象
        const eventtoSave = JSON.parse(result);
        console.log('DetailScreen:Event loaded from AsyncStorage:', eventtoSave);
        let isOK = true;
        if (!eventtoSave.eventName) {
          isOK = false;
          Alert.alert(
              '编辑失败', // 标题
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
              '编辑失败', // 标题
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
                '编辑失败', // 标题
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
                '编辑失败', // 标题
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
        // 使用 eventtoSave 对象
        if (isOK) {
          //先删除
          console.log("before eventtoSave:");
          console.log(eventtoSave);
          setMyEventtoSave(eventtoSave);
          axios({
            method: 'post',
            url: 'http://192.168.116.144:8080/deleteEvent',
            // url: 'https://mock.apifox.com/m1/4226545-3867488-default/deleteEvent',
            // headers: {
            //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
            // },
            data: {
              eventID: eventtoSave.eventID
            }
          }).then(response => {
            console.log("handleDelete: response status:");
            console.log(response.status);
          }).catch(error => {
            console.error('Error fetching data:', error);
          });
        }
      }
    });*/

    /*useEffect(() => {
      //再添加
      console.log("myEventtoSave");
      console.log(myEventtoSave);
      axios({
        method: 'post',
        url: 'http://192.168.116.144:8080/changeEventInfo',
        // url: 'https://mock.apifox.com/m1/4226545-3867488-default/changeEventInfo',
        // headers: {
        //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        // },
        data:
        myEventtoSave
      }).then(response => {
        if(response.data.isRepeat === false) {
          Alert.alert(
              '编辑成功', // 标题
              '',
              [
                {
                  text: '确定', // 按钮文本
                },
              ],
              { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
          );
        } else {
          Alert.alert(
              '编辑失败', // 标题
              response.data.message, // 内容
              [
                {
                  text: '确定', // 按钮文本
                  onPress: () => {
                    myEventtoSave.isDirectlySave = true;
                    axios({
                      method: 'post',
                      url: 'http://192.168.116.144:8080/changeEventInfo',
                      data: myEventtoSave
                    }).then(response => {
                      Alert.alert(
                          '编辑成功', // 标题
                          '',
                          [
                            {
                              text: '确定', // 按钮文本
                            },
                          ],
                          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                      );
                    }).catch(error => {
                      console.error('Error fetching data:', error);
                    });
                  }

                },
                {
                  text: '取消',
                }
              ],
              { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
          );
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }, [myEventtoSave]);*/

    setIsEdit(false);
  };

//todo：处理删除事件
  const handleDelete = () => {
    // Implement your login logic here
    console.log("run handleDelete");
    axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/deleteEvent',
      data: {
        eventID: eventID
      }
    }).then(response => {
      console.log("handleDelete: response status:");
      console.log(response.status);
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Day' }],
      });
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'Day' }],
        })}>
            <Text style={{fontSize:12,color:'white'}}>{'返 回'}</Text>
        </TouchableOpacity>

        {isEdit === false ? (
            <TouchableOpacity style={styles.backButton} onPress={() => setIsEdit(true)}>
                <Text style={{fontSize:12,color:'white'}}>编 辑</Text>
            </TouchableOpacity>
        ) : null}

        {isEdit === true ? (
            <TouchableOpacity style={[styles.backButton,{backgroundColor:'#F16326'}]} onPress={() => handleFinish()}>
                <Text style={{fontSize:12,color:'white'}}>完 成</Text>
            </TouchableOpacity>
        ) : null}

      </View>

    {isCourseReady === true ? <EventEdit navigation={navigation} isEdit={isEdit} course={course}/> : null}

    {isEdit === true ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDelete}>
                <Text style={styles.buttontext}>删 除</Text>
            </TouchableOpacity>
          </View>
    ) : null}

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
//todo: 删除按钮会随着键盘而变化，需要改
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F16326', // 按钮背景颜色
    width: '90%', // 按钮宽度
    height: 45, // 按钮高度
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

});

export default DetailScreen;