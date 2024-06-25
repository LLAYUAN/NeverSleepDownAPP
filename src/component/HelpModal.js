import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity  } from 'react-native';
import Modal from 'react-native-modal';
import HighlightOverlay from './HighlightOverlay';
import LinearGradient from 'react-native-linear-gradient';

//todo：这个高亮块的位置可能需要调整（看你演示的手机的大小和位置（（
const helpTips = [
  { text: '点击，切换视图', highlight: { x: 90, y: 0, width: 230, height: 60 } },
  { text: '点击，添加事件（课程/日程）', highlight: { x: 360, y: 5, width: 50, height: 50 } },
  { text: '点击展开菜单栏，包括导入、导出、切换工作表；添加事件；账户设置；个性化设置等', highlight: { x: 0, y: 5, width: 50, height: 50 } },
  { text: '点击唤起智能助手，输入想做的事情，即可帮你完成', highlight: { x: 40, y: 5, width: 50, height: 50 } },
  { text: '点击查看每天的事件，滑动切换星期', highlight: { x: 5, y: 50, width: 400, height: 110 } },
];

const HelpModal = ({ isVisible, onClose }) => {
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

export default HelpModal;
