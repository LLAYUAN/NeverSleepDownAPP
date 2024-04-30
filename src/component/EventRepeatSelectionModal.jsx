import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button ,StyleSheet,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const TableSelectionModal = ({ isEdit,isVisible, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(0);

  const toggleTypeSelection = (type) => {
    setSelectedType(type.id);
  };

  const handleDone = () => {
    onSelect(selectedType);
    onClose();
  };

  const  types=[{id:0,name:'不重复'}, {id:1,name:'每天'}, {id:2,name:'每周'}, {id:3,name:'每两周'}, {id:4,name:'每月'}, {id:5,name:'每年'}];

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
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }} style={{height:400}}>
          <View style={styles.container}>
            {types.map((type) => (
              <TouchableOpacity
                disabled={!isEdit}
                key={type.id}
                style={[
                  styles.button,
                  { backgroundColor: selectedType===type.id ? '#002FA7' : 'white' }
                ]}
                onPress={() => toggleTypeSelection(type)}
              >
                <Text style={[
                  styles.text,
                  { color: selectedType===type.id  ? 'white' : 'black' }
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
{/* todo：点击返回后再点击仍会显示刚才选过的 */}
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
    width:'80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
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