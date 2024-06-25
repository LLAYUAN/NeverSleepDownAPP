import React, {useEffect, useState} from 'react';
import {
  Modal,
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
import { ColorPicker } from 'react-native-color-picker';
import ColorPickerModal from '../component/ColorPickerModal';
import AsyncStorage from "@react-native-community/async-storage";
import {parse} from "date-fns/parse";
import axios from "axios";

const SettingScreen = ({ navigation }) => {

//todo：处理保存逻辑
  const handleFinish = () => {
    // Implement your login logic here
    axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/addTableInfo',
      data: storageData
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

  // 新增状态来存储从 AsyncStorage 读取的数据
  const [storageData, setStorageData] = useState({
    backgroundURL: '',
    tableName: '',
    courseColor: '',
    eventColor: '',
    firstDayDate: '',
    weekAmount: 16,
    courseNum: 10,
    courseTime: [],
    font: '',
  });
  const [tableNameNow, setTableNameNow] = useState('');
  const [tableIdNow, setTableIdNow] = useState(1);
  useEffect(() => {
    console.log("SettingScreen:tableIdNow:");
    console.log(tableIdNow);
  }, [tableIdNow]);
  //const [storageData, setStorageData] = useState(null);
  useEffect(() => {
    console.log("SettingScreen:storageData:");
    console.log(storageData);
  }, [storageData]);

  const convertfirstDateStringtoDateText = (firstDayDate) => {
    const tmpDate = parse(firstDayDate, "yyyy/MM/dd", new Date());
    console.log("tmpdate", tmpDate);
    const DateTextResult = tmpDate.toDateString();
    console.log("dateTextResult", DateTextResult);
    return DateTextResult;
  }
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("SettingScreen:isLoading:");
    console.log(isLoading);
    if (!isLoading) {
      setSelectedTable(storageData.tableName);
      setCourseColor(storageData.courseColor);
      setEventColor(storageData.eventColor);
      setDateText(convertfirstDateStringtoDateText(storageData.firstDayDate));
      setSelectedWeek(storageData.weekAmount);
    }
  }, [isLoading]);
  useEffect(() => {
    AsyncStorage.getItem('tabledata', (error, result) => {
      if (error) {
        // 处理读取错误
        console.error('读取错误:', error);
      } else {
        // result 是一个字符串，可能需要转换或解析
        console.log('SettingScreen:读取的数据:', result);
        // 如果数据是 JSON 格式，需要解析它
        const parsedData = JSON.parse(result);
        // 使用解析后的数据
        setStorageData({
          backgroundURL: parsedData.background,
          tableName: parsedData.tableName,
          courseColor: parsedData.courseColor,
          eventColor: parsedData.eventColor,
          weekAmount: parsedData.weekAmount,
          firstDayDate: parsedData.firstDayDate,
          courseNum: parsedData.courseNum,
          courseTime: parsedData.courseTime,
          font: parsedData.font, //实际上这个font的修改框都没有
        });
        setTableNameNow(parsedData.tableName);
        setTableIdNow(parsedData.tableID);
        setIsLoading(false);
      }
    });
  }, []);

  //todo：获得当前使用的工作表名称（应该是一个全局的维护变量）
  const [selectedTable, setSelectedTable] = useState(storageData?.tableName || "默认工作表");

  useEffect(() => {
    console.log("SettingScreen:selectedTable:");
    console.log(selectedTable);
    const updateStorageData = {
      ...storageData,
      tableName: selectedTable
    };
    setStorageData(updateStorageData);
    setTableNameNow(selectedTable);
  }, [selectedTable]);

  //todo:获取并初始化课程块和日程块颜色（感觉可以是一个全局维护的变量）
  const [courseColor, setCourseColor] = useState(storageData?.courseColor || '#002FA7');
  useEffect(() => {
    console.log("SettingScreen:courseColor:");
    console.log(courseColor);
    const updateStorageData = {
      ...storageData,
      courseColor: courseColor
    };
    setStorageData(updateStorageData);
  }, [courseColor]);

  const [modalCourseVisible, setModalCourseVisible] = useState(false);

  const [eventColor, setEventColor] = useState(storageData?.eventColor || '#F16326');
  useEffect(() => {
    console.log("SettingScreen:eventColor:");
    console.log(eventColor);
    const updateStorageData = {
      ...storageData,
      eventColor: eventColor
    };
    setStorageData(updateStorageData);
  }, [eventColor]);

  const [modalEventVisible, setModalEventVisible] = useState(false);

    const handleCourseColorChange = (color) => {
        setCourseColor(color);
    };
    const handleEventColorChange = (color) => {
        setEventColor(color);

    };

//todo:上传背景图片
    const handleUpload = () => {};

//todo：这里应该是获取到的当前工作表的第一天
  const [date, setDate] = useState(storageData.firstDayDate?(new Date(storageData.firstDayDate)) : (new Date()));
  const [show, setShow] = useState(false);

  const convertDateTexttoLocalDateString = (dateText) => {
    const date0 = new Date(dateText);
    return date0.toLocaleDateString();
  }
  const [dateText, setDateText] = useState(date.toDateString());
  useEffect(() => {
    console.log("SettingScreen:dateText:");
    console.log(dateText);
    const updateStorageData = {
      ...storageData,
      firstDayDate: convertDateTexttoLocalDateString(dateText)
    };
    setStorageData(updateStorageData);
  }, [dateText]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    //todo: 日期显示形式

    setDateText(currentDate.toDateString()); // 更新文本以显示选择的日期
  };
  const showMode = () => {
    setShow(true);
  };

////todo：这里应该是获取到的当前工作表的周数
  const [selectedWeek, setSelectedWeek] = useState(16);
  useEffect(() => {
    console.log("SettingScreen:selectedWeek:");
    console.log(selectedWeek);
    const updateStorageData = {
      ...storageData,
      weekAmount: selectedWeek
    };
    setStorageData(updateStorageData);
  }, [selectedWeek]);

  const weeks = Array.from({ length: 20 }, (_, i) => i + 1);


  //todo: 处理删除逻辑
  const handleDelete = async ()=>{
    console.log("press Delete:tableIdNow:");
    console.log(tableIdNow);
    let switchtableID = 0;
    let isDeleteSuccess = false;
    // Implement your delete logic here
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/deleteTable',
      data: {tableID: tableIdNow}
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

    //navigation.navigate('Home');

  }

  if (isLoading) return <Text>Loading...</Text>;
  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{fontSize:12,color:'white'}}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>个性化设置</Text>
        <View style={{ width: 48 }} />
      </View>

    <View style={{height:20}}></View>
    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>{selectedTable}</Text>
    </View>

    <View style={{height:30}}></View>
{/* todo：上传背景图片    */}
    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>工作表背景</Text>
      <TouchableOpacity onPress={handleUpload} style={[styles.select,{justifyContent:'center'}]} >
              <Image source={require('../image/upload.png')} style={styles.icon}/>
      </TouchableOpacity>
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>课程块颜色</Text>
      <TouchableOpacity onPress={() => setModalCourseVisible(true)} style={[styles.select,{justifyContent:'center'}]} >
              <Text style={[{color:courseColor},styles.colorText]}>{courseColor} </Text>
              <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <ColorPickerModal
            isVisible={modalCourseVisible}
            onClose={() => setModalCourseVisible(false)}
            onSelect={handleCourseColorChange}
            defaultColor={courseColor}
      />
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>日程块颜色</Text>
      <TouchableOpacity onPress={() => setModalEventVisible(true)} style={[styles.select,{justifyContent:'center'}]} >
              <Text style={[{color:eventColor},styles.colorText]}>{eventColor} </Text>
              <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <ColorPickerModal
            isVisible={modalEventVisible}
            onClose={() => setModalEventVisible(false)}
            onSelect={handleEventColorChange}
            defaultColor={eventColor}
      />
    </View>

    <View style={{height:30}}></View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>工作表起始日期</Text>
      <TouchableOpacity onPress={showMode} style={styles.select}>
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
      <Text style={styles.titleText}>周数</Text>
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

    <View style={{height:30}}></View>

    <View style={[styles.selectContainer,{justifyContent:'center'}]}>
      <TouchableOpacity onPress={() => navigation.navigate('TimeSetting', {courseNum: storageData.courseNum, courseTime: storageData.courseTime, tableData: storageData, tableIdNow: tableIdNow, tableNameNow: tableNameNow})} style={[styles.select,{justifyContent:'center'}]} >
          <Text style={styles.titleText}> 上课时间 </Text>
          <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
    </View>

    <View style={{height:30}}></View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>
      </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button,{backgroundColor: '#F16326'}]} onPress={handleDelete}>
        <Text style={styles.buttonText}>删除</Text>
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
    marginTop: 30,
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
});

export default SettingScreen;