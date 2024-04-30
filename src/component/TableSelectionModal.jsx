import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button ,StyleSheet,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const TableSelectionModal = ({ navigation,isVisible, onClose, onSelect,defaultTable }) => {
  const [selectedTable, setSelectedTable] = useState(defaultTable);

  const toggleTableSelection = (tableName) => {
    setSelectedTable(tableName);

  };

  const handleDone = () => {
    onSelect(selectedTable);
    onClose();
  };
//todo:获取工作表
  const table = ['工作表1',  '工作表7', '工作表8', '工作表9', '工作表10', '工作表11'];

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