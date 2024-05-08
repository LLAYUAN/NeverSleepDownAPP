import React, { useState } from 'react';
import { Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ActionSheetAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ClassSelectionModal from './ClassSelectionModal';
import TableSelectionModal from './TableSelectionModal';
import ClassRepeatSelectionModal from './ClassRepeatSelectionModal';
import EventRepeatSelectionModal from './EventRepeatSelectionModal';

const EventEdit = ({ navigation ,isEdit,course}) => {
//todo:从数据库获取课程代码
const courses = [
  { label: 'SE221232', value: 'math' },
  { label: 'SE12333', value: 'physics' },
  { label: 'SE23232', value: 'chemistry' },
  // 更多课程...
];

  const [name, setName] = useState(course?.eventName || '');
  const [location, setLocation] = useState(course?.eventLocation || '');
  const [isImportant, setImportant] = useState(course?.isImportant || false);

  const [eventType, setEventType] = useState(() => {
    if (course) {
      return course.eventType===true ? "课程" : "日程";
    } else {
      return "课程";  // 如果没有 course 对象，缺省值为 "课程"
    }
  });

//todo:如果有传进来course这个参数，就用course里的数据，否则用默认数据
//需要初始化data，selectedStartTime，selectedEndTime，selectedClassesText，selectedTable，selectedClassRepeat，selectedEventRepeat
//需要用后端数据初始化一下，这里的变量的类型可以看下set的时候set是啥（）
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState(date.toDateString());

  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedStartTime, setStartTime] = useState(null);
  const [selectedEndTime, setEndTime] = useState(null);

  const [modalClassVisible, setModalClassVisible] = useState(false);
  const [selectedClassesText, setSelectedClassesText] = useState('');
  //todo：默认工作表
  const [modalTableVisible, setModalTableVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('默认工作表');

  const [modalClassRepeatVisible, setModalClassRepeatVisible] = useState(false);
  const [selectedClassRepeat, setSelectedClassRepeat] = useState([]);

  const [modalEventRepeatVisible, setModalEventRepeatVisible] = useState(false);
  const [selectedEventRepeat, setSelectedEventRepeat] = useState(0);//0不重复，1每天，2每周，3每两周，4每月，5每年


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

  const handleFinish = () => {
    // Implement your login logic here
    //todo：检查是否都填了，保存事件
    navigation.navigate('Home');
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };
//todo:维护一个记录选择了哪些课的变量
  const handleSelectClasses = (selectedClasses) => {
    setSelectedClassesText(selectedClasses.join(', '));
  };

//todo:全局维护一个记录选择了哪个工作表的变量
  const handleSelectTable = (selectedTable) => {
    setSelectedTable(selectedTable);
  };

  const handleSelectClassRepeat = (selectedClassRepeat) => {
    setSelectedClassRepeat(selectedClassRepeat);
    console.log(selectedClassRepeat);
  };

  const handleSelectEventRepeat = (selectedEventRepeat) => {
    setSelectedEventRepeat(selectedEventRepeat);
    console.log(selectedEventRepeat);
  };

  return (
  <LinearGradient colors={['#72C4FF80', '#FF9E9E80']} style={styles.container}>

      <TextInput
        style={styles.input}
        editable={isEdit}
        placeholder="标题"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        editable={isEdit}
        placeholder="地点"
        value={location}
        onChangeText={setLocation}
      />

      <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={!isEdit}
                value={isImportant}
                onValueChange={setImportant}
                style={styles.checkbox}
                tintColors={{ true: '#002FA7', false: '#b0c4de' }}
              />
              <Text style={styles.label}>重要事件</Text>
      </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>事件类型</Text>
      <Picker
        enabled={isEdit}
        selectedValue={eventType}
        onValueChange={itemValue => setEventType(itemValue)}
        style={{ width: 120 ,color:'black'}}
      >
        <Picker.Item label="课程" value="课程" />
        <Picker.Item label="日程" value="日程" />
      </Picker>
    </View>

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>课程代码</Text>
      <Picker
        enabled={isEdit}
        selectedValue={eventType}
        onValueChange={itemValue => setEventType(itemValue)}
        style={{ width: 160 ,color:'black'}}
      >
{/*       todo：获取代码编号 */}
        {courses.map((course, index) => (
            <Picker.Item key={index} label={course.label} value={course.value} />
        ))}
      </Picker>
    </View>

    {!isEdit&&(
    <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',marginVertical:15}}>
        <TouchableOpacity onPress={() => navigation.navigate('Note')} style={styles.buttonMiddleContainer}>
           <Image source={require('../image/note.png')} style={styles.icon}/>
           <Text style={styles.buttonMiddleText}>课堂笔记</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Talk')} style={styles.buttonMiddleContainer}>
           <Image source={require('../image/talk.png')} style={styles.icon}/>
           <Text style={styles.buttonMiddleText}>课堂讨论</Text>
        </TouchableOpacity>
    </View>
    )}
    {isEdit&&(
    <View style={{height:35}}></View>
    )}

    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>日期</Text>
      <TouchableOpacity disabled={!isEdit} onPress={showMode} style={styles.select}>
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

{/* todo：判断开始时间小于结束时间 */}
      {eventType === "日程" && (
      <>
        <View style={styles.selectContainer}>
          <Text style={styles.titleText}>开始时间</Text>
             <View>
                <TouchableOpacity disabled={!isEdit} onPress={showStartTimePicker} style={styles.select}>
                  {selectedStartTime && <Text style={{color:'black'}}>{selectedStartTime.toLocaleTimeString()}</Text>}
                  <Image source={require('../image/select.png')} style={styles.icon}/>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isStartTimePickerVisible}
                  mode="time"
                  onConfirm={handleStartTimeConfirm}
                  onCancel={hideStartTimePicker}
                  is24Hour={true}
                />
              </View>
        </View>
        <View style={styles.selectContainer}>
          <Text style={styles.titleText}>结束时间</Text>
             <View>
                <TouchableOpacity disabled={!isEdit} onPress={showEndTimePicker} style={styles.select}>
                  {selectedEndTime && <Text style={{color:'black'}}>{selectedEndTime.toLocaleTimeString()}</Text>}
                  <Image source={require('../image/select.png')} style={styles.icon}/>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isEndTimePickerVisible}
                  mode="time"
                  onConfirm={handleEndTimeConfirm}
                  onCancel={hideEndTimePicker}
                  is24Hour={true}
                />
              </View>
        </View>
      </>
      )}

    {eventType === "课程" && (
    <View style={styles.selectContainer}>
       <Text style={styles.titleText}>时间</Text>
      <TouchableOpacity disabled={!isEdit} onPress={() => setModalClassVisible(true)} style={styles.select} >
          <Text style={{color:'black'}}>{selectedClassesText}</Text>
          <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <ClassSelectionModal
        isVisible={modalClassVisible}
        onClose={() => setModalClassVisible(false)}
        onSelect={handleSelectClasses}
      />
    </View>)}

    <View style={{height:35}}></View>

    <View style={[styles.selectContainer,{justifyContent:'center'}]}>
      <TouchableOpacity disabled={!isEdit} onPress={() => setModalTableVisible(true)} style={[styles.select,{justifyContent:'center'}]} >
          <Text style={styles.titleText}>{selectedTable} </Text>
          <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <TableSelectionModal
        navigation={navigation}
        isVisible={modalTableVisible}
        onClose={() => setModalTableVisible(false)}
        onSelect={handleSelectTable}
        defaultTable={selectedTable}
      />
    </View>

    {eventType === "课程" && (
    <View style={[styles.selectContainer,{justifyContent:'center'}]}>
      <TouchableOpacity onPress={() => setModalClassRepeatVisible(true)} style={[styles.select,{justifyContent:'center'}]} >
          <Text style={styles.titleText}> 重复 </Text>
          <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <ClassRepeatSelectionModal
        isEdit={isEdit}
        isVisible={modalClassRepeatVisible}
        onClose={() => setModalClassRepeatVisible(false)}
        onSelect={handleSelectClassRepeat}
      />
    </View>)}

    {eventType === "日程" && (
    <View style={[styles.selectContainer,{justifyContent:'center'}]}>
      <TouchableOpacity onPress={() => setModalEventRepeatVisible(true)} style={[styles.select,{justifyContent:'center'}]} >
          <Text style={styles.titleText}> 重复 </Text>
          <Image source={require('../image/select.png')} style={styles.icon}/>
      </TouchableOpacity>
      <EventRepeatSelectionModal
        isEdit={isEdit}
        isVisible={modalEventRepeatVisible}
        onClose={() => setModalEventRepeatVisible(false)}
        onSelect={handleSelectEventRepeat}
      />
    </View>)}

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
  title: {
    fontSize: 24,
    color: '#002FA7',
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    width: '100%',
    marginVertical: 10,
    padding: 5,
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: 'black',
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
    width: '100%', // 按钮宽度
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
    checkboxContainer: {
      width: '95%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
    },
    checkbox: {
      marginRight: 8,
    },
    label: {
      fontSize: 14,
    },
    selectContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // 按钮背景颜色
        width: '100%', // 按钮宽度
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
    // icon:{
    //     width: 15,
    //     height: 15,
    // },
    select:{
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         marginRight: 15,
         width: 130,
    },
    buttonMiddleContainer:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        height:45,
        width:140,
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#002FA7',
        marginTop:15,
    },
    buttonMiddleText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
    },
    icon:{
        width:20,
        height:20,
    }
});

export default EventEdit;