import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button ,StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ClassSelectionModal = ({ isVisible, onClose, onSelect }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);

  const toggleClassSelection = (classNumber) => {
    const index = selectedClasses.indexOf(classNumber);
    if (index === -1) {
      setSelectedClasses([...selectedClasses, classNumber]);
    } else {
      setSelectedClasses(selectedClasses.filter((item) => item !== classNumber));
    }
  };

  const handleDone = () => {
    onSelect(selectedClasses);
    onClose();
  };

//获取课程节数
  const courses = Array.from({ length: 16 }, (_, i) => i + 1); // 创建一个包含16个课程号的数组

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <LinearGradient colors={['#FAE0E0', '#D6DCFB']} style={styles.block}>
          <Text style={styles.title}>课程时间</Text>
          <Text style={styles.littleTitle}>选择课程节数</Text>

          <View style={styles.container}>
            {courses.map((classNumber) => (
              <TouchableOpacity
                key={classNumber}
                style={[
                  styles.button,
                  { backgroundColor: selectedClasses.includes(classNumber) ? '#002FA7' : 'white' }
                ]}
                onPress={() => toggleClassSelection(classNumber)}
              >
                <Text style={[
                  styles.text,
                  { color: selectedClasses.includes(classNumber) ? 'white' : 'black' }
                ]}>
                  {classNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

export default ClassSelectionModal;

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
},
littleTitle:{
    padding:10,
    fontSize:14,
    color:'#666666',
},
button:{
   width:40,
   height:40,
   padding: 10,
   borderRadius: 25,
   margin: 10,
   justifyContent: 'center',
   alignItems: 'center',
   borderColor: '#002FA7',
   borderWidth: 1,
},
container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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