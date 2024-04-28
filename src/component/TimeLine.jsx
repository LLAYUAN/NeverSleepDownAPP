import React from 'react';
import { ScrollView, View, Text, StyleSheet, StatusBar } from 'react-native';
import DayTimeBlock from './DayTimeBlock'; // 确保路径正确
import WeekTimeBlock from './WeekTimeBlock'; // 确保路径正确

const TimeLine = ({selectedDate,type}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const timeBlocks = [
    // 假设的时间块数据
    //todo：startTime和显示的time的换算,日期和周几的换算
    { type: 'class', name: '数学', location: '教室112', time: '8:00-9:30',startTime: 8, endTime: 9.5,weekday:1},
    { type: 'event', name: '数学', location: '教室112', time: '10:00-13:00',startTime: 10, endTime: 13,weekday:7},
    // ...其他时间块数据
  ];

  return (
    <ScrollView style={styles.container}>
      {hours.map((hour) => (
        <View key={hour} style={styles.hourRow}>
          <Text style={styles.hourText}>{`${hour}:00`}</Text>
          <View style={styles.line} />
        </View>
      ))}
      {timeBlocks.map((block, index) => {
            if (type === 'day') {
                return (
                <DayTimeBlock
                key={index}
                block={block}
                onPress={() => console.log('时间块被点击')}
                />
                );
            } else if (type === 'week') {
                return (
                <WeekTimeBlock
                key={index}
                block={block}
                onPress={() => console.log('时间块被点击')}
                />
            );
        }
            })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60, // 设定每行的高度，以便时间块定位
    position: 'relative', // 确保时间块能够正确定位
  },
  hourText: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold'
  },
  line: {
    height: 0,
    flex: 1,
    borderBottomWidth: 1, // 设置底部边框宽度为 1 像素
    borderBottomColor: '#999999', // 设置底部边框颜色为灰色
    borderStyle: 'dashed'
  },
});

export default TimeLine;
