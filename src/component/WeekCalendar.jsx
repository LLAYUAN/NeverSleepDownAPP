import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';

const WeekCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Week starts on Monday
  const days = new Array(7).fill(null).map((_, i) => addDays(startWeek, i));

  const Day = ({ date }) => {
    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    return (
      <TouchableOpacity
        style={[styles.dayContainer, isSelected ? styles.selectedDay : isToday ? styles.today : null]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={styles.dayText}>{format(date, 'EEE')}</Text>
        <Text style={styles.dateText}>{format(date, 'd')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {days.map((date, index) => (
        <Day key={index} date={date} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    padding: 10,
  },
  selectedDay: {
    backgroundColor: '#FFCCCC',
  },
  today: {
    backgroundColor: '#CCCCCC',
  },
  dayText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 18,
  },
});

export default WeekCalendar;