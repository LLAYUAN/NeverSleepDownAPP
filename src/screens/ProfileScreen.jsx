import React, { useState } from 'react';
import { Modal,Image,StyleSheet, View, TextInput, Button, Text,TouchableOpacity,ActionSheetAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';


const ProfileScreen = ({ navigation }) => {

//todo：处理保存逻辑
  const handleFinish = () => {
    // Implement your login logic here
    navigation.navigate('Home');
  };

  //todo：获得当前使用的工作表名称（应该是一个全局的维护变量）
  const [selectedTable, setSelectedTable] = useState('默认工作表');

  //todo:获取并初始化课程块和日程块颜色（感觉可以是一个全局维护的变量）
  const [courseColor, setCourseColor] = useState('#002FA7');
  const [modalCourseVisible, setModalCourseVisible] = useState(false);
  const [eventColor, setEventColor] = useState('#F16326');
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
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState(date.toDateString());

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
  const weeks = Array.from({ length: 20 }, (_, i) => i + 1);


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
      <Text style={styles.titleText}>日期</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate('TimeSetting')} style={[styles.select,{justifyContent:'center'}]} >
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

export default ProfileScreen;