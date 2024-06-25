import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Modal from 'react-native-modal';
import HighlightOverlay from './HighlightOverlay';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from "@react-native-community/async-storage";
import {useNavigation} from "@react-navigation/native";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";


const AiModal = ({ isVisible, onClose }) => {
const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    console.log("AI:isLoading:");
    console.log(isLoading);
  }, [isLoading]);

//todo: 完成之后的字符串给后端
  const handleFinish = async () => {
    setIsLoading(true);
    console.log("press Finish AI:");
    console.log(inputText);
    let type = -1;
    let responseData;
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/Ai/chat1',
      data: {question: inputText}
    }).then(response => {
      console.log("AI response:");
      console.log(response.data);
      type = response.data.type;
      responseData = response.data.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });

    //const course = {"courseCode": "", "dayRepeat": [{"date": 4, "endTime": "", "endTimeNumber": 4, "startTime": "08:00:00", "startTimeNumber": 1}], "dayRepeatNum": 1, "endTime": "11:40:00", "eventDate": "2024/6/7", "eventID": 0, "eventLocation": "bbb", "eventName": "aaabbb", "isImportant": false, "startTime": "08:00:00", "timeNum": "1,2,3,4", "type": false, "weekRepeat": ''}

    //根据AI返回值执行逻辑
    if (type === -1) {
      console.log("AI type=-1");
      Alert.alert(
          '执行失败', // 标题
          'AI不明白你想干什么@_@', // 内容
          [
            {
              text: '确定', // 按钮文本
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if (type === 0 || type === 1) {
      await AsyncStorage.setItem('course', JSON.stringify(responseData));
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Add' }],
      });
    }
    else if (type === 2) {
      //如果要切换的工作表不存在怎么办？tableID是什么？ 是0
      if (responseData.tableID === 0) {
        Alert.alert(
            '执行失败', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
              },
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      } else {
        Alert.alert(
            '', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
                onPress: async () => {
                  await axios({
                    method: 'post',
                    url: 'http://192.168.116.144:8080/switchTable',
                    data: {
                      tableID: responseData.tableID,
                      tableName: ''
                    }
                  }).then(response => {
                    if (response.data.code && response.data.data) {
                      console.log("back cookie:");
                      console.log(response.data.data.cookie);//确定后端cookie大写?
                      console.log("back tabledata:");
                      console.log(response.data.data);
                      AsyncStorage.setItem('cookie', response.data.data.cookie);
                      AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
                      console.log("修改cookie和tabledata");
                      navigation.reset({
                        index: 1,
                        routes: [{ name: 'Home' }, { name: 'Day' }],
                      });
                    } else {
                      console.error("Error: code is 0!");
                    }
                  }).catch(error => {
                    console.error('Error fetching data:', error);
                  });
                }
              },
              {
                text: '取消'
              }
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      }
    }
    else if (type === 3) {
      Alert.alert(
          '', // 标题
          responseData.message, // 内容
          [
            {
              text: '确定', // 按钮文本

              onPress: async () => {
                await axios({
                  method: 'post',
                  url: 'http://192.168.116.144:8080/switchTable',
                  data: {
                    tableID: 0,
                    tableName: responseData.tableName
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
                getAndscheduleNotifications();
              }

            },
            {
              text: '取消'
            }
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    else if(type === 4) {
      if (responseData.eventID === 0) {
        Alert.alert(
            '执行失败', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
              },
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      } else {
        Alert.alert(
            '', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
                onPress: async () => {
                  await axios({
                    method: 'post',
                    url: 'http://192.168.116.144:8080/deleteEvent',
                    data: {
                      eventID: responseData.eventID
                    }
                  }).then(response => {
                    console.log("handleDelete: response status:");
                    console.log(response.status);
                  }).catch(error => {
                    console.error('Error fetching data:', error);
                  });
                  navigation.reset({
                    index: 1,
                    routes: [{ name: 'Home' }, { name: 'Day' }],
                  });
                }
              },
              {
                text: '取消'
              }
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      }
    }
    else if (type === 5) {
      if (responseData.tableID === 0) {
        Alert.alert(
            '执行失败', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
              },
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      } else {
        Alert.alert(
            '', // 标题
            responseData.message, // 内容
            [
              {
                text: '确定', // 按钮文本
                onPress: async () => {
                  console.log("press Delete:tableIdNow:");
                  console.log(responseData.tableID);
                  let switchtableID = 0;
                  let isDeleteSuccess = false;
                  // Implement your delete logic here
                  await axios({
                    method: 'post',
                    url: 'http://192.168.116.144:8080/deleteTable',
                    data: {tableID: responseData.tableID}
                  }).then(response => {
                    console.log("handleDelete:reponse data:");
                    console.log(response.data);
                    if (!response.data.deleteSuccess) {
                      Alert.alert(
                          '删除工作表失败', // 标题
                          '仅剩一个工作表', // 内容
                          [
                            {
                              text: '确定', // 按钮文本
                            },
                          ],
                          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                      );
                    } else {
                      isDeleteSuccess = true;
                      const cookieString = response.data.cookie;
                      AsyncStorage.setItem('cookie',response.data.cookie);
                      const firstSemicolonIndex = cookieString.indexOf(';');
                      const secondKeyValue = cookieString.substring(firstSemicolonIndex + 1);
                      const keyValueArray = secondKeyValue.split('=');
                      switchtableID = parseInt(keyValueArray[1], 10);
                    }
                  }).catch(error => {
                    console.error('Error fetching data:', error);
                  })

                  console.log("afterDelete:switchtableID:");
                  console.log(switchtableID);
                  if (isDeleteSuccess) {
                    axios({
                      method: 'post',
                      url: 'http://192.168.116.144:8080/switchTable',
                      data: {
                        tableID: switchtableID,
                        tableName: ''
                      }
                    }).then(response => {
                      if (response.data.code && response.data.data) {
                        console.log("back cookie:");
                        console.log(response.data.data.cookie);//确定后端cookie大写?
                        console.log("back tabledata:");
                        console.log(response.data.data);
                        AsyncStorage.setItem('cookie', response.data.data.cookie);
                        AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
                        console.log("修改cookie和tabledata");
                        navigation.reset({
                          index: 1,
                          routes: [{ name: 'Home' }, { name: 'Day' }],
                        });
                      } else {
                        console.error("Error: code is 0!");
                      }
                    }).catch(error => {
                      console.error('Error fetching data:', error);
                    });
                  }
                }
              },
              {
                text: '取消'
              }
            ],
            { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
        );
      }
    }
    else {
      Alert.alert(
          '出错啦', // 标题
          'AI出错啦', // 内容
          [
            {
              text: '确定', // 按钮文本
            },
          ],
          { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
      );
    }
    setIsLoading(false);
    setInputText('');
    onClose();
  }

  return (

    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.7}
      style={styles.modal}
    >
      <LinearGradient colors={['#FF9E9E20', '#FF9E9E60']} style={styles.modalContent}>
        {isLoading ? (
            // 加载中，显示加载信息
            <Text style={styles.titleText}>AI执行中，请等待......</Text>
        ) : (
            // 加载完成，显示输入框和按钮
            <>
              <Text style={styles.titleText}>Chat-NSD</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter text"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline={true}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onClose}
                >
                  <Text style={styles.buttonText}>返回</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFinish}
                >
                  <Text style={styles.buttonText}>完成</Text>
                </TouchableOpacity>
              </View>
            </>
        )}
      </LinearGradient>
    </Modal>

  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject, // Ensure the modal covers the whole screen
  },
  modalContent: {
    width: '80%',
    height: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1, // Ensure the modal content is above the highlight overlay
    justifyContent: 'center',

  },
    button: {
      backgroundColor: '#002FA7', // Set your desired button color here
      marginTop: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    buttonText: {
        fontWeight:'bold',
        color: 'white',
        fontSize: 16,
    },
    titleText: {
        color: '#002FA7',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
  input: {
    backgroundColor: 'white',
    borderColor: '#002FA7',
    borderWidth: 1,
    width: '100%',
    height: 100,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    textAlignVertical: 'top',

  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  }
});

export default AiModal;
