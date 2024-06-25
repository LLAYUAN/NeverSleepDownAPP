import React, {useEffect, useState} from 'react';
import { Modal, View, Text, TouchableOpacity, Button ,StyleSheet,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";

const TableSelectionModal = ({ navigation,isVisible, onClose, onSelect/*,defaultTable */}) => {

    const [storageData, setStorageData] = useState({
        tableID: 0,
        defaultTable: '',
        isLoading: true, // 表示数据是否正在加载
    });
    useEffect( () => {
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
                    defaultTable: parsedData.tableName,
                    isLoading: false, // 数据已加载
                })
            }
        });
    }, []);
    const { tableID, defaultTable, isLoading } = storageData;

    useEffect(() => {
        setSelectedTable(storageData.defaultTable);
        console.log("setStorageData");
        console.log(storageData);
    }, [storageData]);

  const [selectedTable, setSelectedTable] = useState(defaultTable);
  const [table, setTable] = useState([]);
  const [tableNameAndID, setTableNameAndID] = useState([]);
    useEffect(() => {
        console.log("TableSelectionModal: selectedTable:");
        console.log(selectedTable);
    }, [selectedTable]);

    useEffect(() => {
        console.log("TableSelectionModal: table:");
        console.log(table);
    }, [table]);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://192.168.116.144:8080/getAllTableInfo',
            // url: 'https://mock.apifox.com/m1/4226545-3867488-default/getAllTableInfo',
            // headers: {
            //     'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
            // }
        }).then(response => {
            if (response.data.code /*&& response.data.tableArray*/) {
                console.log("axios settable");
                console.log(response.data.data.tableArrays);
                if (response.data.data.tableArrays) {
                    const tableNames = response.data.data.tableArrays.map(table => table.tableName);
                    setTable(tableNames);
                    setTableNameAndID(response.data.data.tableArrays);
                }
            } else {
                console.error("Error: code is 000!");
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

  const toggleTableSelection = (tableName) => {
    setSelectedTable(tableName);
  };

  const handleDone = async () => {
    console.log("工作表选择:点击完成");
    const choosetable = tableNameAndID.find(table => table.tableName === selectedTable);
    let tableID = 0;
    if (choosetable) {
        tableID = choosetable.tableID;
        console.log("找到对应工作表ID");
        console.log(tableID);
    } else {
        console.log("未找到对应的工作表ID");
    }
    await axios({
      method: 'post',
      url: 'http://192.168.116.144:8080/switchTable',
      data: {
          tableID: tableID,
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
          onClose();
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
      getAndscheduleNotifications();
  };
//todo:获取工作表
  //const table = ['工作表1',  '工作表7', '工作表8', '工作表9', '工作表10', '工作表11'];

    if (isLoading) return <Text>Loading...</Text>

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <LinearGradient colors={['#FAE0E0', '#D6DCFB']} style={styles.block}>
          <Text style={styles.title}>工作表选择</Text>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }} style={{height:350}}>
          <View style={styles.container}>
            {table.map((tableName) => (
              <TouchableOpacity
                key={tableName}
                style={[
                  styles.button,
                  { backgroundColor: selectedTable===tableName ? '#F16326' : 'white' }
                ]}
                onPress={() => toggleTableSelection(tableName)}
              >
                <Text style={[
                  styles.text,
                  { color: selectedTable===tableName ? 'white' : 'black' }
                ]}>
                  {tableName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
{/* todo：点击返回后再点击仍会显示刚才选过的 */}

              <TouchableOpacity
                style={{width: 250,height:40, padding: 10,borderRadius: 10,margin: 10,marginTop:20,justifyContent: 'center',alignItems: 'center',backgroundColor:'#002FA7'}}
                onPress={() => {onClose();navigation.navigate('AddTable')}}
              >
                <Text style={{color:'white'}}>新建工作表</Text>
              </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.smallButton} >
               <Text style={{color:'white'}}>返回</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone} style={styles.smallButton} >
               <Text style={{color:'white'}}>完成</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default TableSelectionModal;

const styles = StyleSheet.create({
block:{
    width:'80%',
    padding:20,
    backgroundColor:'white',
    borderRadius:10,
    alignItems:'center',
},
title:{
    fontSize:20,
    fontWeight:'bold',
    color:'#002FA7',
    padding:10,
    marginBottom:10,
},
littleTitle:{
    padding:10,
    fontSize:14,
    color:'#666666',
},
button:{
   width: 250,
   height:40,
   padding: 10,
   borderRadius: 10,
   margin: 10,
   justifyContent: 'center',
   alignItems: 'center',
   borderColor: '#002FA7',
   borderWidth: 1,
},
container: {
    justifyContent: 'space-around', // 保证每行间隔均匀
    marginHorizontal: 0, // 调整负边距以补偿按钮间的间隔
},
buttonContainer:{
    width:'90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
},
smallButton:{
    backgroundColor:'#002FA7',
    borderRadius:5,
    width:50,
    height:30,
    justifyContent:'center',
    alignItems:'center',
}
});