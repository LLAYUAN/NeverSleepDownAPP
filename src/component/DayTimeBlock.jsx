import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DayTimeBlock = ({ block, onPress }) => {
  const blockStyle = block.type === false ? styles.classBlock : styles.eventBlock;

  const topPosition = block.startTime * 60+30; // 假设每小时高度为60单位
  const blockHeight = (block.endTime - block.startTime) * 60; // 持续时间转换为高度

  return (
    <TouchableOpacity style={[styles.block, blockStyle,{ top: topPosition, height: blockHeight }]} onPress={onPress}>
      <Text style={styles.name}>{block.name}</Text>
      <Text style={styles.location}>{block.location}</Text>
      <Text style={styles.time}>{block.time}</Text>
    </TouchableOpacity>
  );
};
//todo：块太小文字怎么显示，块重叠怎么显示
const styles = StyleSheet.create({
  block: {
    position: 'absolute', // 这将使组件能够放置在ScrollView的正确位置
    left: 70, // 根据你的hourText宽度进行调整
    right: 0,
    justifyContent: 'start',
    padding: 10,
    borderRadius: 5, // 圆角
    overflow: 'hidden', // 设置溢出部分隐藏

  },
  classBlock: {
    backgroundColor: '#002FA790',
  },
  eventBlock: {
    backgroundColor: '#F1632690',
  },
  name: {
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    color: 'white',
  },
  time: {
    color: 'white',
  },
});

export default DayTimeBlock;
