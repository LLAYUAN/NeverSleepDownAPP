import React, { useState,useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Button ,StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ClassRepeatSelectionModal = ({ isVisible, onClose, onSelect }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [type, setType] = useState(0);//0是随机，1是全部，2是单周，3是双周

  const toggleClassSelection = (classNumber) => {
    const index = selectedClasses.indexOf(classNumber);
    if (index === -1) {
      setSelectedClasses([...selectedClasses, classNumber]);
    } else {
      setSelectedClasses(selectedClasses.filter((item) => item !== classNumber));
    }
  };

  useEffect(() => {
    //遍历判断是不是全部选上，还是单周，还是双周，更新type
    setType(0);
    if(selectedClasses.length===week.length){
      setType(1);
    }
    if(selectedClasses.length===Math.floor((week.length+1)/2)){
        let flag = 0;
        for(let i=0;i<selectedClasses.length;i++){
          if(selectedClasses[i]%2!==1){
            flag = 1;
            break;
          }
        }
        if(flag===0)
          setType(2);
    }
    if(selectedClasses.length===Math.floor((week.length)/2)){
        let flag = 0;
        for(let i=0;i<selectedClasses.length;i++){
          if(selectedClasses[i]%2!==0){
            flag = 1;
            break;
          }
        }
        if(flag===0){
          setType(3);
        }
    }
  }, [selectedClasses]);

  const handleDone = () => {
    onSelect(selectedClasses);
    onClose();
  };

  const handlePressAll = () => {
    if(type===1){
    setSelectedClasses([]);
    }else{
    setSelectedClasses(Array.from({ length: 16 }, (_, i) => i + 1));
    }
  };

  const handlePressOne = () => {
    if(type===2){
    setSelectedClasses([]);
    }else{
    setSelectedClasses(Array.from({ length: 8 }, (_, i) => i * 2 + 1));
    }
  };

  const handlePressTwo = () => {
    if(type===3){
    setSelectedClasses([]);
    }else{
    setSelectedClasses(Array.from({ length: 8 }, (_, i) => i * 2 + 2));
    }
  };

//获取课程周数
  const week = Array.from({ length: 16 }, (_, i) => i + 1); // 创建一个包含16个课程号的数组

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <LinearGradient colors={['#FAE0E0', '#D6DCFB']} style={styles.block}>
          <Text style={styles.title}>重复课程</Text>
          <Text style={styles.littleTitle}>选择重复周数</Text>

          <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%',margin:20}}>
            <TouchableOpacity onPress={handlePressAll} style={[styles.typeButton,{backgroundColor: type===1?'#002FA7' : 'white'}]} >
               <Text style={{color:type===1?'white' : '#002FA7',fontWeight:'bold'}}>全部</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressOne} style={[styles.typeButton,{backgroundColor: type===2?'#002FA7' : 'white'}]} >
               <Text style={{color:type===2?'white' : '#002FA7',fontWeight:'bold'}}>单周</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressTwo} style={[styles.typeButton,{backgroundColor: type===3?'#002FA7' : 'white'}]} >
               <Text style={{color:type===3?'white' : '#002FA7',fontWeight:'bold'}}>双周</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            {week.map((classNumber) => (
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

export default ClassRepeatSelectionModal;

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
},
typeButton:{
    borderWidth:1,
    borderColor:'#002FA7',
    borderRadius:5,
    width:60,
    height:40,
    justifyContent:'center',
    alignItems:'center',
},
});