import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

//todo:获取每个日期的 重要，休息，工作，事件状态
const dayState={star:true,rest:false,work:true,class:true,event:true};

const MonthCalendarScreen = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const lunarDates = (date) => {
        // todo：日期和阴历的转换
        return '初一';
    };

  // Function to render custom day component
  const renderDay = (day,state, lunarDay,dayState) => {
    const { dateString, day: dayNumber } = day;
    // Only show days that belong to the current month
    if (state !== 'today' && state === 'disabled') {
      return <View style={styles.dayContainer} />; // Empty container for days not in the current month
    }

    const dayContainerStyle = (dateString === today) ? [styles.dayContainer, styles.currentDayContainer] : styles.dayContainer;

    return (
      <TouchableOpacity onPress={() => {}} style={dayContainerStyle}>
        {dayState.star && <Text style={styles.starStyle}>★</Text>}
        <Text style={styles.dayText}>{dayNumber}</Text>
        {dayState.rest && <Text style={styles.iconStyle}>休</Text>}
        {dayState.work && <Text style={styles.iconStyle}>班</Text>}
        <Text style={styles.lunarTextStyle}>{lunarDay}</Text>
        <View style={styles.dotsContainer}>
          {dayState.class&&<View style={styles.dotClassStyle} />}
          {dayState.event&&<View style={styles.dotEventStyle} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        dayComponent={({ date, state }) => {
            const lunarDay = lunarDates(date.dateString);
            return renderDay(date, state,lunarDay,dayState);
        }}
        theme={{
          'stylesheet.day.basic': {
            base: {
              alignItems: 'center', // Center the day components
            },
          },
        }}
      />
    </View>
  );
};

export default MonthCalendarScreen;

const styles = {
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 0,
    },
    currentDayContainer: {
       backgroundColor: '#FF788340', // Set your desired shade of pink here
    },
    dayContainer: {
      width: 45, // Divide the width of the screen by 7 for each day of the week
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginVertical: 5, // Adds space between week rows
    },
    starStyle: {
      position: 'absolute',
      top: 15,
      left: 2,
      fontSize: 12,
      color: 'red',
    },
    iconStyle: {
      position: 'absolute',
      top: 15,
      right: 2,
      fontSize: 12,
      color:'#F16326',
    },
    dotsContainer: {
      position: 'absolute',
      bottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotClassStyle: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'blue',
      marginHorizontal: 2,
    },
    dotEventStyle: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'orange',
      marginHorizontal: 2,
    },
    dayText: {
      fontSize: 20,
      backgroundColor: 'transparent', // Ensure text background does not overlap other elements
      color:'#002FA7',
    },
    lunarTextStyle: {
      fontSize: 10,
      backgroundColor: 'transparent',
    },
  };
