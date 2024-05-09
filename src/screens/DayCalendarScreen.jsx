import React,{ useState,useEffect,useMemo }from 'react';
import {Text,View,StyleSheet} from 'react-native';
import WeekCalendar from '../component/WeekCalendar';
import TopBar from '../component/TopBar';
import TimeLine from '../component/TimeLine';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import {imp} from "../../.yarn/releases/yarn-1.22.22";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

export default function DayCalendarScreen({ route,navigation }){
    const selectDayStr = route.params?.selectDay;
    const selectDay = useMemo(() => selectDayStr ? new Date(selectDayStr) : new Date(), [selectDayStr]);
    //const selectDay = utcToZonedTime(selectDay0, 'Asia/Shanghai');

    const convertTimeToFloat = (time) => {
        //console.log("run convertTimeToFloat");
        // 分割字符串以获取小时和分钟
        const [hours, minutes] = time.split(':');
        // 将分钟转换为浮点数，以便可以表示如 9.5 这样的时间
        const timeFloat = parseFloat(hours) + parseFloat(minutes) / 60;
        return timeFloat;
    };

    const convertEventToTimeBlock = (event) => {
        console.log("run convertEventToTimeBlock");
        console.log(selectedDate);
        const startTime = convertTimeToFloat(event.startTime);
        const endTime = convertTimeToFloat(event.endTime);
        return {
            type: event.type,
            name: event.eventName,
            id: event.eventID,
            location: event.eventLocation,
            time: `${event.startTime}-${event.endTime}`,
            date: selectedDate.toLocaleDateString(),
            startTime,
            endTime,
        };
    };

    console.log('1',selectDay.toLocaleDateString());
    const [weeknow,setWeeknow] = useState(0);
    const [timeBlocks, setTimeBlocks] = useState([]);

    //查看timeBlocks实时状态
    useEffect(() => {
        console.log("Updated timeBlocks: ", timeBlocks);
        // 其他基于 timeBlocks 的逻辑
    }, [timeBlocks]); // 依赖项包含 timeBlocks

    const updateData = (mydate) => {
        axios({
            method: 'post',
            url: 'https://mock.apifox.com/m1/4226545-3867488-default/loadDayVision',
            headers: {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
            },
            data: {
                date: mydate.toLocaleDateString()
            }
        }).then(response => {
            console.log(response.data);
            if (response.data.code && response.data.eventArr) {
                console.log("weeknow:");
                console.log(response.data.weeknow);
                setWeeknow(response.data.weeknow);
                console.log("eventArr:");
                console.log(response.data.eventArr);
                //由于更新是异步的，所以不能立即使用eventArr来setTimeBlocks。所以其实上面的eventArr没啥用，
                // 要查看timeBlocks实时状态只能用useEffect钩子函数
                setTimeBlocks(response.data.eventArr.map(event => convertEventToTimeBlock(event)));
                console.log("lasttimeblocks:");
                console.log(timeBlocks);
                // AsyncStorage.setItem(
                //     'eventArr',
                //     JSON.stringify(response.data.eventArr),
                //     () => {
                //         console.log('数组存储成功',JSON.stringify(response.data.eventArr));
                //
                //     }
                // )
            } else {
                console.error("Error: code is 0!");
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const [selectedDate, setSelectedDate] = useState(selectDay);
      useEffect(() => {
        // 这里没有直接修改依赖项，因此不会引起死循环
        setSelectedDate(selectDay);
      }, [selectDay]); // 依赖项是selectDay，它由useMemo稳定，只有当selectDayStr变化时才重新计算

    console.log('2',selectedDate.toLocaleDateString());
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));
      useEffect(() => {
        setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));

          //在此处调用updateData,确保每次selectedDate更新时,都调用一次updateData
          // 以selectedDate为准
          console.log("useSelectedDate:");
          console.log(selectedDate.toLocaleDateString());
          updateData(selectedDate);
      }, [selectedDate]);


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
    {/*         todo:根据选择日期计算第几周 不需要了,直接传weeknow*/}
                <Text style={styles.weekText}>{`第${weeknow}周`}</Text>
                <WeekCalendar navigation={navigation} selectedDate={selectedDate} currentWeekStart={currentWeekStart} setSelectedDate={setSelectedDate} updateWeek={updateWeek}/>
            </View>
    {/* todo:根据选择日期调出当天的事件绘制timeline */}
            <TimeLine navigation={navigation} selectedDate={selectedDate} type={'day'} timeBlocks={timeBlocks}/>
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