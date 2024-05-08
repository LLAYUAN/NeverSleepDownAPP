import React, {useEffect, useState} from 'react';
import { ScrollView, View, Text, StyleSheet, StatusBar } from 'react-native';
import DayTimeBlock from './DayTimeBlock'; // 确保路径正确
import WeekTimeBlock from './WeekTimeBlock';
import AsyncStorage from "@react-native-community/async-storage"; // 确保路径正确

const TimeLine = ({navigation,selectedDate,type,timeBlocks}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
              console.log("timeline:blockid:");
              console.log(block.id);
                return (
                <DayTimeBlock
                key={index}
                block={block}
                onPress={() => navigation.navigate('Detail', { eventID:block.id })} //修改了此处
                />
                );
            } else if (type === 'week') {
                return (
                <WeekTimeBlock
                key={index}
                block={block}
                onPress={() => navigation.navigate('Detail', { eventID:block.id })}
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
