import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity  } from 'react-native';
import Modal from 'react-native-modal';
import HighlightOverlay from './HighlightOverlay';
import LinearGradient from 'react-native-linear-gradient';

//todo：这个高亮块的位置可能需要调整（看你演示的手机的大小和位置（（
const helpTips = [
  { text: '导入，点击选择从教学服务信息网导入课表', highlight: { x: 45, y: 115, width: 150, height: 65 } },
  { text: '新建，点击新建事件', highlight: { x: 45, y: 175, width: 150, height: 65 } },
  { text: '切换，点击切换工作表或新建工作表', highlight: { x: 45, y: 235, width: 150, height: 65 } },
  { text: '调休，点击选择休假日期与补课调整', highlight: { x: 45, y: 295, width: 150, height: 65 } },
  { text: '导出，点击导出当前工作表', highlight: { x: 45, y: 355, width: 150, height: 65 } },
  { text: '个性化，点击设置当前工作表的颜色、上课时间等', highlight: { x: 45, y: 415, width: 150, height: 65 } },
  { text: '账户，点击设置账户信息，修改密码，退出登录等', highlight: { x: 45, y: 475, width: 150, height: 65 } },
  { text: '笔记，点击查看所有课程笔记', highlight: { x: 45, y: 535, width: 150, height: 65 } },
];

const MenuHelpModal = ({ isVisible, onClose }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const nextTip = () => {
    if (currentTipIndex < helpTips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    } else {
      onClose();
      setCurrentTipIndex(0);
    }
  };

  const currentTip = helpTips[currentTipIndex];

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.7}
      style={styles.modal}
    >
      <HighlightOverlay {...currentTip.highlight} />
      <LinearGradient colors={['#FF9E9E20', '#FF9E9E60']} style={styles.modalContent}>
        <Text style={styles.titleText}>帮助提示</Text>
        <Text style={styles.helpText}>{currentTip.text}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={nextTip}
        >
          <Text style={styles.buttonText}>
            {currentTipIndex === helpTips.length - 1 ? 'OK' : '下一步'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject, // Ensure the modal covers the whole screen
  },
  modalContent: {
//    width: '70%',
//    height: '20%',
    position: 'absolute',
    top: 300,
    left: 210,
    width: 190,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1, // Ensure the modal content is above the highlight overlay
    justifyContent: 'center',

  },
  helpText: {
    marginBottom: 20,
    fontSize: 18,

  },
    button: {
      backgroundColor: '#002FA7', // Set your desired button color here
       marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
        fontWeight:'bold',
        color: 'white',
        fontSize: 16,
    },
    titleText: {
        color: '#002FA7',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default MenuHelpModal;
