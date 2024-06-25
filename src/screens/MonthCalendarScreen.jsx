import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TopBar from '../component/TopBar';
import axios from 'axios';
const { width } = Dimensions.get('window');

const MonthCalendarScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);

    const fetchDayStateList = async (month) => {
        let dayStateTemplateArr = [];
        await axios({
            method: 'post',
            url: 'http://192.168.116.144:8080/loadMonthVision',
            data: { month: month }
        }).then(response => {
            console.log("MonthCalendarScreen:response:");
            console.log(response.data);
            dayStateTemplateArr = response.data.dayInformations;
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
        return dayStateTemplateArr;
    };

    const today = new Date().toISOString().split('T')[0];
    const lunarDates = (date) => {
        return '初一';
    };

    const [dayStateList, setDayStateList] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        console.log("MonthCalendarScreen:currentmonth:");
        console.log(currentMonth);
        const fetchAndSetDayStateList = async () => {
            const newDayStateList = await fetchDayStateList(currentMonth);
            setDayStateList(newDayStateList);
            setIsLoading(false);
        };
        fetchAndSetDayStateList();
    }, [currentMonth]);

    const handleMonthChange = (newDate) => {
        const { dateString, month: monthNumber } = newDate;
        if (monthNumber !== currentMonth) {
            setCurrentMonth(monthNumber);
        }
    };

    const getDayState = (dayStateList, day) => {
        const { dateString, day: dayNumber } = day;
        const dayIndex = dayNumber - 1;
        return dayStateList[dayIndex] || { isImportant: false, rest: false, work: false, isHaveCourse: false, isHaveSchedule: false };
    };

    const renderDay = (day, state, dayState) => {
        const { dateString, day: dayNumber } = day;
        if (state !== 'today' && state === 'disabled') {
            return <View style={styles.dayContainer} />;
        }

        const dayContainerStyle = (dateString === today) ? [styles.dayContainer, styles.currentDayContainer] : styles.dayContainer;

        return (
            <TouchableOpacity onPress={() => { navigation.navigate('Day', { selectDay: dateString }) }} style={dayContainerStyle}>
                {dayState.isImportant && <Text style={styles.starStyle}>★</Text>}
                <Text style={styles.dayText}>{dayNumber}</Text>
                {dayState.rest && <Text style={styles.iconStyle}>休</Text>}
                {dayState.work && <Text style={styles.iconStyle}>班</Text>}
                <Text style={styles.lunarTextStyle}></Text>
                <View style={styles.dotsContainer}>
                    {dayState.isHaveCourse && <View style={styles.dotClassStyle} />}
                    {dayState.isHaveSchedule && <View style={styles.dotEventStyle} />}
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation} active={2} />
            <Calendar
                onMonthChange={handleMonthChange}
                dayComponent={({ date, state }) => {
                    const dayState = getDayState(dayStateList, date);
                    return renderDay(date, state, dayState);
                }}
                theme={{
                    'stylesheet.day.basic': {
                        base: {
                            alignItems: 'center',
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
        backgroundColor: '#FF788340',
    },
    dayContainer: {
        width: 45,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5,
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
        color: '#F16326',
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
        backgroundColor: 'transparent',
        color: '#002FA7',
    },
    lunarTextStyle: {
        fontSize: 10,
        backgroundColor: 'transparent',
    },
};
