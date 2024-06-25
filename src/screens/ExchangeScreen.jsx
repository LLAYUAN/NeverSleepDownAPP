import React, {useEffect, useState} from 'react';
import { Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ActionSheetAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const ExchangeScreen = ({ navigation }) => {
//todo：处理完成逻辑，向后端发送调整
  const handleFinish = async () => {
    // Implement your login logic here
    console.log("send tiaoxiu data");
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/addChangeHoliday',
      //url: 'https://mock.apifox.com/m1/4226545-3867488-default/addChangeHoliday',
      // headers: {
      //   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
      // },
      data: datatoSend
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Day' }],
    });
  };
  const initDateString = new Date().toLocaleDateString();
  const [datatoSend, setDatatoSend] = useState(
      {
        modifiedDate: initDateString,
        replaceDate: ''
      }
  )
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState(date.toDateString());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    //todo: 日期显示形式
    console.log("tiaoxiu: currentDate:");
    console.log(currentDate.toLocaleDateString());
    const currentDateString = currentDate.toLocaleDateString();
    const updateModifiedDate = {
      ...datatoSend,
      modifiedDate: currentDateString
    }
    setDatatoSend(updateModifiedDate);
    setDateText(currentDate.toDateString()); // 更新文本以显示选择的日期
  };
  const showMode = () => {
    setShow(true);
  };

  const [date1, setDate1] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const [dateText1, setDateText1] = useState(date.toDateString());
  const [myreplaceDate, setMyreplaceDate] = useState(initDateString);

  const onChange1 = (event, selectedDate) => {
    const currentDate1 = selectedDate || date1;
    setShow1(Platform.OS === 'ios');
    setDate1(currentDate1);
    //todo: 日期显示形式
    console.log("tiaoxiu: currentDate1:");
    console.log(currentDate1.toLocaleDateString());
    const currentDate1String = currentDate1.toLocaleDateString();
    if (eventType === "上课") {
      const updateModifiedDate = {
        ...datatoSend,
        replaceDate: currentDate1String
      };
      setDatatoSend(updateModifiedDate);
    }
    setDateText1(currentDate1.toDateString()); // 更新文本以显示选择的日期
    setMyreplaceDate(currentDate1String);
  };
  const showMode1 = () => {
    setShow1(true);
  };

const [eventType, setEventType] = useState('休假');

  useEffect(() => {
    console.log("tiaoxiu: eventType:");
    console.log(eventType);
    if (eventType === "休假") {
      const updateModifiedDate = {
        ...datatoSend,
        replaceDate: ''
      };
      setDatatoSend(updateModifiedDate);
    }
    else if (eventType === "上课") {
      const updateModifiedDate = {
        ...datatoSend,
        replaceDate: myreplaceDate
      };
      setDatatoSend(updateModifiedDate);
    }
  }, [eventType]);

  useEffect(() => {
    console.log("tiaoxiu: datatoSend:");
    console.log(datatoSend);
  }, [datatoSend]);


  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{fontSize:12,color:'white'}}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>调 休</Text>
        <View style={{ width: 48 }} />
      </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>调整日期</Text>
      <TouchableOpacity  onPress={showMode} style={styles.select}>
        <Text style={{color:'black'}}>{dateText}</Text>
        <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>事件类型</Text>
      <Picker
        selectedValue={eventType}
        onValueChange={itemValue => setEventType(itemValue)}
        style={{ width: 120 ,color:'black'}}
      >
        <Picker.Item label="休假" value="休假" />
        <Picker.Item label="上课" value="上课" />
      </Picker>
    </View>

    {eventType==='上课'&&(
        <View style={styles.selectContainer}>
          <Text style={styles.titleText}>原课程日期</Text>
          <TouchableOpacity  onPress={showMode1} style={styles.select}>
            <Text style={{color:'black'}}>{dateText1}</Text>
            <Image source={require('../image/select.png')} style={styles.icon}/>
          </TouchableOpacity>
          {show1 && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date1}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange1}
            />
          )}
        </View>
    )}

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
    marginTop: 30,
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
        marginTop: 30,
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
        width:20,
        height:20,
    }
});

export default ExchangeScreen;