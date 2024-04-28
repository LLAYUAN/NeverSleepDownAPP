import React,{ useState }from 'react';
import {Text,View,StyleSheet} from 'react-native';
import WeekCalendar from '../component/WeekCalendar';
import TopBar from '../component/TopBar';
import TimeLine from '../component/TimeLine';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';

export default function DayCalendarScreen({ navigation }){
const [selectedDate, setSelectedDate] = useState(new Date());
const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
const updateWeek = (direction) => {
  const offset = selectedDate.getTime() - currentWeekStart.getTime();
  const newWeekStart = direction === 'previous' ? subWeeks(currentWeekStart, 1) : addWeeks(currentWeekStart, 1);
  const newSelectedDate = new Date(newWeekStart.getTime() + offset);
  setCurrentWeekStart(newWeekStart);
  setSelectedDate(newSelectedDate);
};
    return(
    <View style={styles.container1}>
        <TopBar navigation={navigation} active={4}/>
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
{/*         todo:根据选择日期计算第几周 */}
            <Text style={styles.weekText}>第三周</Text>
            <WeekCalendar selectedDate={selectedDate} currentWeekStart={currentWeekStart} setSelectedDate={setSelectedDate} updateWeek={updateWeek}/>
        </View>
{/* todo:根据选择日期调出当天的事件绘制timeline */}
        <TimeLine selectedDate={selectedDate} type={'day'}/>
    </View>

    )
}

const styles = StyleSheet.create({
    container1:{
      flex:1,
      flexDirection:'column',
    },
    weekText:{
      fontSize:18,
      width:20,
    }
});