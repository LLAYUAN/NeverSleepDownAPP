import React, { useState } from 'react';
import { View, Button, StyleSheet, Text,TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { ColorPicker } from 'react-native-color-picker';
import tinycolor from 'tinycolor2';

const ColorPickerModal = ({ isVisible, onClose, onSelect,defaultColor}) => {
// 将十六进制颜色转换为HSV
const hexToHsv = (hexColor) => {
  const color = tinycolor(hexColor);
  const hsvColor = color.toHsv(); // 返回HSV颜色对象
  return hsvColor;
};

// 将HSV颜色转换为十六进制
const hsvToHex = (hsvColor) => {
  const color = tinycolor(hsvColor);
  const hexColor = color.toHexString(); // 返回十六进制颜色字符串
  return hexColor;
};

const [selectedColor, setSelectedColor] = useState(hexToHsv(defaultColor));

const handleColorChange = (color) => {
  setSelectedColor(color);
};

//todo:点击外围自动退出
  return (
      <Modal isVisible={isVisible}>
        <View style={styles.modalContent}>
          <ColorPicker
            onColorChange={handleColorChange}
            style={styles.colorPicker}
            hideSliders={true}
            color={selectedColor}
          />
        <TouchableOpacity style={styles.backButton} onPress={()=>{onSelect(hsvToHex(selectedColor));onClose()}}>
            <Text style={{fontSize:16,color:'white',fontWeight:'bold'}}>完 成</Text>
        </TouchableOpacity>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width:'100%',
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  colorPicker: {
    width: 200,
    height: 200,
  },
  backButton:{
    marginTop:10,
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: '50%', // 按钮宽度
    height: 40, // 按钮高度
    borderRadius: 5, // 设置圆角
    justifyContent: 'center',
    alignItems: 'center',
    underlayColor: '#000F37',
  },
});

export default ColorPickerModal;
