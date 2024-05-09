import React, {useEffect, useState} from 'react';
import { Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ActionSheetAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import EventEdit from '../component/EventEdit';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import {response} from "../../.yarn/releases/yarn-1.22.22";
import AsyncStorage from "@react-native-community/async-storage";

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
      url: 'https://mock.apifox.com/m1/4226545-3867488-default/loadEventInfo',
      headers: {
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      },
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
          startTime: response.data.event.dayRepeat[0].startTime + ':00',//传到eventedit的时候加个秒，这样统一，好看点
          endTime: response.data.event.dayRepeat[0].endTime + ':00',
          timeNum: tmpres,
          weekRepeat: response.data.event.weekRepeat,
          dayRepeatNum: response.data.event.dayRepeat.length
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
  const handleFinish = () => {
    // Implement your login logic here
    setIsEdit(false);
  };

//todo：处理删除事件
  const handleDelete = () => {
    // Implement your login logic here

    navigation.navigate('Home');
  };

  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{fontSize:12,color:'white'}}>返 回</Text>
        </TouchableOpacity>

        {!isEdit&&(
            <TouchableOpacity style={styles.backButton} onPress={() => setIsEdit(true)}>
                <Text style={{fontSize:12,color:'white'}}>编 辑</Text>
            </TouchableOpacity>
        )}

        {isEdit&&(
            <TouchableOpacity style={[styles.backButton,{backgroundColor:'#F16326'}]} onPress={() => handleFinish()}>
                <Text style={{fontSize:12,color:'white'}}>完 成</Text>
            </TouchableOpacity>
        )}

      </View>

    {isCourseReady && <EventEdit navigation={navigation} isEdit={isEdit} course={course}/>}

    {isEdit &&(
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDelete}>
                <Text style={styles.buttontext}>删 除</Text>
            </TouchableOpacity>
          </View>
    )}

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