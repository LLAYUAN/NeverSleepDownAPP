import React, { useState } from 'react';
import { TouchableWithoutFeedback,Modal, Image,View, Text, TouchableOpacity, Button ,StyleSheet,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TableSelectionModal from './TableSelectionModal';

const MenuModal = ({ navigation,isVisible, onClose}) => {
  const [modalTableVisible, setModalTableVisible] = useState(false);

//todo:更新选择的工作表
  handleSelectTable = () => {

  };

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
                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Import')}} style={styles.buttonContainer}>
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
                    onSelect={handleSelectTable}
                    defaultTable="工作表1"
                  />

                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Tiaoxiu')}} style={styles.buttonContainer}>
                    <Image source={require('../image/tiaoxiu.png')} style={styles.icon}/>
                    <Text style={styles.buttonText}>调 休</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {onClose();navigation.navigate('Export')}} style={styles.buttonContainer}>
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
    icon:{
        width:25,
        height:25,
    }

});