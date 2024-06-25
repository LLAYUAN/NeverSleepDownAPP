import React, { useState,useEffect } from 'react';
import { Modal,Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const TimeSettingScreen = ({route, navigation }) => {

  const {courseNum, courseTime, tableData, tableIdNow, tableNameNow} = route.params;

  console.log("TimeSettingScreen:courseNum:");
  console.log(courseNum);
  console.log("TimeSettingScreen:courseTime:");
  console.log(courseTime);
  console.log("TimeSettingScreen:tableData:")
  console.log(tableData);

// 辅助函数，用于将时间字符串转换为小时、分钟、秒的数组
  //const parseTime = (time) => {
    // 假设时间格式总是像 "08:00:00" 这样，冒号分隔
    //return time.split(':').map(n => parseInt(n, 10));
  //};

  /*const transformedArray = courseTime.map(item => ({
    selectedStartTime: new Date(Date.parse(`${new Date(2024, 0, 1).toISOString().split('T')[0]}T${item.starttime}`)),
    selectedEndTime: new Date(Date.parse(`${new Date(2024, 0, 1).toISOString().split('T')[0]}T${item.endtime}`)),
    isStartTimePickerVisible: false,
    isEndTimePickerVisible: false
  }));*/
  const parseTime = (time) => {
    // 检查时间是否为非空字符串
    if (time && typeof time === 'string') {
      return time.split(':').map(n => parseInt(n, 10));
    } else {
      // 如果时间格式不正确或为null，则返回一个默认时间（例如：00:00:00）
      console.error('Invalid time format:', time);
      return [0, 0, 0]; // 这里只是一个示例，你应该根据实际情况返回合适的默认值
    }
  };

  const transformedArray = courseTime.map(item => {
    // 确保 item.startTime 和 item.endTime 是有效的字符串
    const startTimeParts = parseTime(item.startTime);
    const endTimeParts = parseTime(item.endTime);
    return {
      selectedStartTime: new Date(2024, 0, 1, ...startTimeParts),
      selectedEndTime: new Date(2024, 0, 1, ...endTimeParts),
      isStartTimePickerVisible: false,
      isEndTimePickerVisible: false
    };
  });

  // const transformedArray = courseTime.map(item => ({
  //   selectedStartTime: new Date(2024, 0, 1, ...parseTime(item.startTime)),
  //   selectedEndTime: new Date(2024, 0, 1, ...parseTime(item.endTime)),
  //   isStartTimePickerVisible: false,
  //   isEndTimePickerVisible: false
  // }));

  console.log("transformedArray");
  console.log(transformedArray);
//todo：处理保存逻辑
  const handleFinish = () => {
    // Implement your login logic here
    axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/addTableInfo',
      // url: 'https://mock.apifox.com/m1/4226545-3867488-default/addTableInfo',
      // headers: {
      //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      // },
      data: finalTableDatatoSend
    }).then(response => {
      if (response.status === 200) {
        console.log("SettingScreen: 录入工作表信息请求成功");
      } else {
        console.log("SettingScreen: 录入工作表信息请求失败");
      }
      //修改前端存储的个性化数据
      axios({
        method: 'post',
        url: 'http://192.168.116.144:8080/switchTable',
        // url: 'https://mock.apifox.com/m1/4226545-3867488-default/switchTable',
        // headers: {
        //     'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        // },
        data: {
          tableID: tableIdNow,
          tableName: tableNameNow
        }
      }).then(response => {
        if (response.data.code && response.data.data) {
          console.log("back cookie:");
          console.log(response.data.data.cookie);//确定后端cookie大写?
          AsyncStorage.setItem('cookie', response.data.data.cookie);
          AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
          console.log("修改cookie和tabledata");
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
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };


//todo:获取当前工作表的节数和每节课的时间进行初始化
  const [selectedWeek, setSelectedWeek] = useState(courseNum? courseNum : 13);
  const weeks = Array.from({ length: 30 }, (_, i) => i + 1);

  //将courses数组转成要发送的格式
  const convertCourses = (courses) => {
    const tmpCourseTime = courses.map((course) => {
      return {
        startTime: course.selectedStartTime.toLocaleTimeString(),
        endTime: course.selectedEndTime.toLocaleTimeString()
      }
    })
    return tmpCourseTime;
  }
  const [courses, setCourses] = useState( transformedArray? transformedArray : []);
  const [courseTimetoSend, setCourseTimetoSend] = useState([]);
  useEffect(() => {
    console.log("TimeSettingScreen: courses:");
    console.log(courses);
    const tmpcourseTimetoSend = convertCourses(courses);
    setCourseTimetoSend(tmpcourseTimetoSend);
  }, [courses]);

  useEffect(() => {
    // 当 selectedWeek 改变时，调整 courses 数组以匹配课程数
    const newCourses = [];
    for (let i = 0; i < selectedWeek; i++) {
      if (i < courses.length) {
        newCourses.push(courses[i]);  // 保留已有课程的数据
      } else {
        newCourses.push({  // 添加新课程的初始数据
          selectedStartTime: null,
          selectedEndTime: null,
          isStartTimePickerVisible: false,
          isEndTimePickerVisible: false
        });
      }
    }
    setCourses(newCourses);
  }, [selectedWeek]);

  const [finalTableDatatoSend, setFinalTableDatatoSend] = useState(tableData);
  useEffect(() => {
    setFinalTableDatatoSend({
      ...tableData,
      courseNum: selectedWeek,
      courseTime: courseTimetoSend
    })
  }, [selectedWeek, courseTimetoSend]);

  useEffect(() => {
    console.log("TimeSettingScreen: finalTableDatatoSend:");
    console.log(finalTableDatatoSend);
  }, [finalTableDatatoSend]);

  // 时间选择和隐藏处理
  const handlePickerVisibility = (index, type, isVisible) => {
    setCourses(courses.map((course, i) =>
      i === index ? {...course, [`${type}PickerVisible`]: isVisible} : course
    ));
  };

  const handleTimeConfirm = (index, type, time) => {
    setCourses(courses.map((course, i) =>
      i === index ? {...course, [type]: time, [`${type}PickerVisible`]: false} : course
    ));
  };

//todo:这页不知道为什么是偏左的，需要调整
  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{fontSize:12,color:'white'}}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>上课时间设置</Text>
        <TouchableOpacity style={[styles.backButton,{backgroundColor:'#F16326'}]} onPress={() => handleFinish()}>
            <Text style={{fontSize:12,color:'white'}}>完成</Text>
        </TouchableOpacity>
      </View>

    <View style={{height:20}}></View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>一天上课节数</Text>
      <Picker
        selectedValue={selectedWeek}
        onValueChange={(itemValue, itemIndex) => setSelectedWeek(itemValue)}
        style={[styles.select,{width: 100}]}
      >
        {weeks.map((week) => (
          <Picker.Item key={week} label={`${week}`} value={week} />
        ))}
      </Picker>
    </View>
    <View style={{height:20}}></View>

    <ScrollView contentContainerStyle={{ paddingVertical: 20 }} style={{height:350}}>
      {courses.map((course, index) => (
        <View key={index} >
        <View style={styles.selectContainer}>
          <Text style={styles.titleText}>第{index+1}节开始时间</Text>
          <TouchableOpacity
            onPress={() => handlePickerVisibility(index, 'isStartTime', true)}
            style={styles.select}>
            <Text>{course.selectedStartTime ? course.selectedStartTime.toLocaleTimeString() : '选择开始时间'}</Text>
            <Image source={require('../image/select.png')} style={styles.icon}/>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={course.isStartTimePickerVisible}
            mode="time"
            onConfirm={(time) => handleTimeConfirm(index, 'selectedStartTime', time)}
            onCancel={() => handlePickerVisibility(index, 'selectedStartTime', false)}
            is24Hour={true}
          />
        </View>
        <View style={styles.selectContainer}>
          <Text style={styles.titleText}>第{index+1}节结束时间</Text>
          <TouchableOpacity
            onPress={() => handlePickerVisibility(index, 'isEndTime', true)}
            style={styles.select}>
            <Text>{course.selectedEndTime ? course.selectedEndTime.toLocaleTimeString() : '选择结束时间'}</Text>
            <Image source={require('../image/select.png')} style={styles.icon}/>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={course.isEndTimePickerVisible}
            mode="time"
            onConfirm={(time) => handleTimeConfirm(index, 'selectedEndTime', time)}
            onCancel={() => handlePickerVisibility(index, 'selectedEndTime', false)}
            is24Hour={true}
          />
        </View>
        <View style={{height:20}}></View>
        </View>
      ))}
    </ScrollView>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'space-evenly',
    backgroundColor: '#F0F0F7',
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
    marginTop: 30,
  },
  button: {
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: '100%', // 按钮宽度
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
         width: 100,
    },
    icon:{
        width: 15,
        height: 15,
    },
});

export default TimeSettingScreen;