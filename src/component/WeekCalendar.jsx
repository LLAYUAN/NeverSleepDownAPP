import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {format, startOfWeek, addDays, subWeeks, addWeeks, endOfWeek} from 'date-fns';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-community/async-storage";

const WeekCalendar = ({ navigation,selectedDate,currentWeekStart,setSelectedDate,updateWeek}) => {
  //const [weekAmount, setWeekAmount] = useState(16);
  const [canSwipeLeft, setCanSwipeLeft] = useState(false);
  const [canSwipeRight, setCanSwipeRight] = useState(false);

  useEffect(() => {
    const banSwipe = async () => {
      await AsyncStorage.getItem('tabledata', (error, result) => {
        if (error) {
          console.error('读取错误:', error);
        } else {
          // 如果数据是 JSON 格式，需要解析它
          const parsedData = JSON.parse(result);
          console.log("WeekCalendar:parsedata.WeekAmount:",parsedData.weekAmount);
          const weekAmount = parsedData.weekAmount;

          const firstweekStartStr = parsedData.firstDayDate;
          const firstweekStartDate = new Date(firstweekStartStr.replace(/\//g, '-'));

          const firstweekMondayDate = startOfWeek(firstweekStartDate, { weekStartsOn: 1 });
          const firstweekMondayStr = format(firstweekMondayDate, 'yyyy-MM-dd');//找到第一周周一
          console.log("firstweekMondayStr:",firstweekMondayStr)

          const selectedweekMondayDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
          const selectedweekMondayStr = format(selectedweekMondayDate, 'yyyy-MM-dd');//找到所选周周1
          console.log("selectedmonday:",selectedweekMondayStr);
          const selectedweekSundayDate = endOfWeek(selectedDate, {weekStartsOn: 1});
          const selectedweekSundayStr = format(selectedweekSundayDate, 'yyyy-MM-dd');//找到所选周周日
          console.log("selectedsunday:",selectedweekSundayStr);

          const endweekSundayDate = addWeeks(endOfWeek(subWeeks(firstweekMondayDate, 1, 'week'), { weekStartsOn: 1 }), weekAmount);
          const endweekSundayStr = format(endweekSundayDate, 'yyyy-MM-dd');//找到最后一周周日
          console.log("endsunday:",endweekSundayStr);

          const isEndWeek = endweekSundayStr === selectedweekSundayStr;
          const isStartWeek = firstweekMondayStr === selectedweekMondayStr;
          const canSwipeLeft = !isStartWeek;
          const canSwipeRight = !isEndWeek;
          setCanSwipeLeft(canSwipeLeft);
          setCanSwipeRight(canSwipeRight);
        }
      });
    }
    banSwipe();
  }, [selectedDate]);


  const handleSwipeableLeftOpen = () => {
    if (canSwipeLeft) {
      updateWeek('previous');
    }
  };
  const handleSwipeableRightOpen = () => {
    if (canSwipeRight) {
      updateWeek('next');
    }
  };


  console.log('WeekCalendar',selectedDate);
  const days = new Array(7).fill(null).map((_, i) => addDays(currentWeekStart, i));

  const handlePressDay= (date) => {
  //  setSelectedDate(date);
  const selectDayStr = date.toISOString();
    navigation.navigate('Day', { selectDay: selectDayStr });
  }

  const Day = ({ date }) => {
    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    return (
      <TouchableOpacity
        style={[styles.dayContainer, isSelected ? styles.selectedDay : isToday ? styles.today : null]}
        onPress={() => {handlePressDay(date)}}
      >
        <Text style={styles.dayText}>{format(date, 'EEE')}</Text>
        <Text style={styles.dateText}>{format(date, 'd')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{alignItems:'center'}}>
      <Swipeable
        //onSwipeableLeftOpen={() => updateWeek('previous')}
        //onSwipeableRightOpen={() => updateWeek('next')}
        //renderLeftActions={() => <View style={{ width: 1, backgroundColor: '#00FFFF00' }} />}
        //renderRightActions={() => <View style={{ width: 1, backgroundColor: '#00FFFF00' }} />}

        onSwipeableLeftOpen={handleSwipeableLeftOpen}
        onSwipeableRightOpen={handleSwipeableRightOpen}
        // 禁用不需要的滑动方向
        renderLeftActions={() => canSwipeLeft ? <View style={{ width: 1, backgroundColor: '#00FFFF00' }} /> : null}
        renderRightActions={() => canSwipeRight ? <View style={{ width: 1, backgroundColor: '#00FFFF00' }} /> : null}

        friction={2}
        //leftThreshold={1}
        //rightThreshold={1}
        leftThreshold={canSwipeLeft ? 1 : 0}
        rightThreshold={canSwipeRight ? 1 : 0}
      >
        <View style={styles.container}>
          {days.map((date, index) => (
            <Day key={index} date={date} />
          ))}
        </View>
      </Swipeable>
      <Text style={styles.dayText}>{format(selectedDate, 'yyyy.MM.dd.E')}</Text>
{/*       tode:完善日期表达方式 */}
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    padding: 15,
  },
  selectedDay: {
    backgroundColor: '#FFCCCC',
  },
  today: {
    backgroundColor: '#CCCCCC',
  },
  // dayText: {
  //   fontSize: 14,
  // },
  dateText: {
    fontSize: 18,
  },
  dayText:{
    fontSize: 12,
    color: '#000000',
  }
});

export default WeekCalendar;


// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { format, startOfWeek, addDays } from 'date-fns';
//
// const WeekCalendar = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//
//   const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Week starts on Monday
//   const days = new Array(7).fill(null).map((_, i) => addDays(startWeek, i));
//
//   const Day = ({ date }) => {
//     const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
//     const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
//     return (
//       <TouchableOpacity
//         style={[styles.dayContainer, isSelected ? styles.selectedDay : isToday ? styles.today : null]}
//         onPress={() => setSelectedDate(date)}
//       >
//         <Text style={styles.dayText}>{format(date, 'EEE')}</Text>
//         <Text style={styles.dateText}>{format(date, 'd')}</Text>
//       </TouchableOpacity>
//     );
//   };
//
//   return (
//     <View style={styles.container}>
//       {days.map((date, index) => (
//         <Day key={index} date={date} />
//       ))}
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dayContainer: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   selectedDay: {
//     backgroundColor: '#FFCCCC',
//   },
//   today: {
//     backgroundColor: '#CCCCCC',
//   },
//   dayText: {
//     fontSize: 14,
//   },
//   dateText: {
//     fontSize: 18,
//   },
// });
//
// export default WeekCalendar;