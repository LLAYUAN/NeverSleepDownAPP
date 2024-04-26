import React from 'react';
import {Text,View} from 'react-native';
import WeekCalendar from '../component/WeekCalendar';
import TopBar from '../component/TopBar';
export default function DayCalendarScreen({ navigation }){
    return(
    <View>
        <TopBar navigation={navigation}/>
        <WeekCalendar/>
    </View>

    )
}