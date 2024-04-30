import React, { useState,useEffect } from 'react';
import { Modal,Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimeSettingScreen = ({ navigation }) => {

//todo：处理保存逻辑
  const handleFinish = () => {
    // Implement your login logic here
    navigation.goBack();
  };

//todo:获取当前工作表的节数和每节课的时间进行初始化
  const [selectedWeek, setSelectedWeek] = useState(13);
  const weeks = Array.from({ length: 30 }, (_, i) => i + 1);

  const [courses, setCourses] = useState([]);

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