import React, {useEffect, useState} from 'react';
import {
    TouchableWithoutFeedback,
    Modal,
    Image,
    View,
    Text,
    TouchableOpacity,
    Button,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TableSelectionModal from './TableSelectionModal';
import AsyncStorage from "@react-native-community/async-storage";
import { generatePDF } from '../service/share';
import axios from "axios";

const MenuModal = ({ navigation,isVisible, onClose}) => {
  const [modalTableVisible, setModalTableVisible] = useState(false);
    // 新增状态来存储从 AsyncStorage 读取的数据
    /*const [storageData, setStorageData] = useState({
        tableID: 0,
        tableName: '',
        isLoading: true, // 表示数据是否正在加载
    });
    useEffect(() => {
        console.log("MenuModal: useEffect:");
        AsyncStorage.getItem('tabledata', (error, result) => {
            if (error) {
                // 处理读取错误
                console.error('读取错误:', error);
            } else {
                // result 是一个字符串，可能需要转换或解析
                console.log('读取的数据:', result);
                // 如果数据是 JSON 格式，需要解析它
                const parsedData = JSON.parse(result);
                // 使用解析后的数据
                setStorageData({
                    tableID: parsedData.tableID,
                    tableName: parsedData.tableName,
                    isLoading: false, // 数据已加载
                })
            }
        });
    }, []);
    const { tableID, tableName, isLoading } = storageData;*/
    //if (isLoading) return <Text>Loading...</Text>

//todo:更新选择的工作表 没必要在这加啊
//   const handleSelectTable = () => {
//
//   };
    const handleExport = async () => {
        let courses = [];
        await axios({
            method: 'get',
            url: 'http://192.168.116.144:8080/export',
        }).then(response => {
            console.log("MenuModal: handleExport: response.data:");
            console.log(response.data);
            courses = response.data.courses;
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
        if (!courses) {
            Alert.alert(
                '导出失败', // 标题
                '课表为空', // 内容
                [
                    {
                        text: '确定', // 按钮文本
                    },
                ],
                { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
            );
        } else {
            generatePDF(courses);
        }
        onClose();
    }

    const handleImport = async () => {
        Alert.alert('提示', '正在导入...', [], { cancelable: false }); // 显示提示框
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log("handleImport:accessToken:");
        console.log(accessToken);
        if (accessToken) {
            await axios({
                method: 'get',
                url: `http://192.168.116.144:8080/RequestLesson?accessToken=${accessToken}`,
            }).then(response => {
                console.log("MenuModal: handleImport");
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        Alert.alert('提示', '导入成功', [{ text: '确定' }], { cancelable: false });
        onClose();
        navigation.reset({
            index: 1,
            routes: [{ name: 'Home' }, { name: 'Day' }],
        });
    }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
             <View style={styles.block}>
                <TouchableOpacity onPress={handleImport} style={styles.buttonContainer}>
                    <Image source={require('../image/import.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>导入</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Add')}} style={styles.buttonContainer}>
                    <Image source={require('../image/add.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>新 建</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {setModalTableVisible(true)}} style={styles.buttonContainer}>
                    <Image source={require('../image/change.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>切 换</Text>
                </TouchableOpacity>

                  <TableSelectionModal
                    navigation={navigation}
                    isVisible={modalTableVisible}
                    onClose={() => {onClose();setModalTableVisible(false)}}
                    //onSelect={handleSelectTable}
                    //defaultTable={tableName}
                  />

                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Tiaoxiu')}} style={styles.buttonContainer}>
                    <Image source={require('../image/tiaoxiu.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>调 休</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleExport} style={styles.buttonContainer}>
                    <Image source={require('../image/export.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>导 出</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>{onClose(); navigation.navigate('Setting')}} style={styles.buttonContainer}>
                    <Image source={require('../image/setting.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>个性化</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Profile')}} style={styles.buttonContainer}>
                    <Image source={require('../image/user.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>账 户</Text>
                </TouchableOpacity>

                 {/* update */}
                 <TouchableOpacity onPress={() => {onClose();navigation.navigate('Notes')}} style={styles.buttonContainer}>
                     <Image source={require('../image/note.png')} style={styles.icon}/>
                     <Text style={styles.buttonText}>笔 记</Text>
                 </TouchableOpacity>

                <View style={{height:15}}></View>
             </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // 半透明背景
  },
    block:{
        backgroundColor:'white',
        position:'absolute',
        width:'40%',
        top:110,
        left:40,
        borderRadius:10,
        alignItems:'center',
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        height:45,
        width:'80%',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#002FA7',
        marginTop:15,
    },
    buttonText:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
    },
    icon: {
        width: 25,
        height: 25,
    }

});