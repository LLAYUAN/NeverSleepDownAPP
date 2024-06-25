import React, {useEffect, useState} from 'react';
import {Text,View,StyleSheet} from 'react-native';
import WeekCalendar from '../component/WeekCalendar';
import TopBar from '../component/TopBar';
import TimeLine from '../component/TimeLine';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subWeeks, addWeeks } from 'date-fns';
import {response} from "../../.yarn/releases/yarn-1.22.22";
import axios from "axios";

export default function WeekCalendarScreen({navigation }){
/*
    示例格式
    const arrtest = [
    {
        type: false,
        name: 'math',
        location: 'class111',
        time: '8:00-10:00',
        startTime: 8,
        endTime: 10,
        weekday: 1
    },
    {
        type: false,
        name: 'chinese',
        location: 'class333',
        time: '16:00-18:00',
        startTime: 16,
        endTime: 18,
        weekday: 3
    }
];*/
    useEffect(() => {
        console.log("WeekCalendarScreen:");
    }, []);
const [selectedDate, setSelectedDate] = useState(new Date());
const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

const updateWeek = (direction) => {
  const offset = selectedDate.getTime() - currentWeekStart.getTime();
  const newWeekStart = direction === 'previous' ? subWeeks(currentWeekStart, 1) : addWeeks(currentWeekStart, 1);
  const newSelectedDate = new Date(newWeekStart.getTime() + offset);
  setCurrentWeekStart(newWeekStart);
  setSelectedDate(newSelectedDate);
};

//监控weekcalendarDateNow
useEffect(() => {
    console.log("weekcalendarDateNow:");
    console.log(selectedDate.toLocaleDateString());
}, [selectedDate]);

//获取这个日期所在周的七个日期string
const getWeekDates = (date) => {
    const interval = {
        start: startOfWeek(date, {weekStartsOn: 1}),
        end: endOfWeek(date, {weekStartsOn: 1})
    };
    const weekDays = eachDayOfInterval(interval);
    const weekDates = weekDays.map(day => day.toLocaleDateString());
    return weekDates;
}
//获取这个日期所在周的七个日期date对象
const getWeekDays = (date) => {
    const interval = {
        start: startOfWeek(date, {weekStartsOn: 1}),
        end: endOfWeek(date, {weekStartsOn: 1})
    };
    const weekDays = eachDayOfInterval(interval);
    return weekDays;
}


    const[weekTimeBlocks, setWeekTimeBlocks] = useState([]);
    const[finalWeekTimeBlocks, setFinalWeekTimeBlocks] = useState([]);
    const[isWeekTimeBlocksReady, setIsWeekTimeBlocksReady] = useState(false);
    const[weeknow, setWeeknow] = useState(0);
    const convertTimeToFloat = (time) => {
        //console.log("run convertTimeToFloat");
        // 分割字符串以获取小时和分钟
        const [hours, minutes, seconds] = time.split(':');
        // 将分钟转换为浮点数，以便可以表示如 9.5 这样的时间
        const timeFloat = parseFloat(hours) + parseFloat(minutes) / 60;
        return timeFloat;
    };
    //将获得的eventarr标准化
    const formatEvent = event => ({
        type: event.type,
        name: event.eventName,
        id: event.eventID,
        location: event.eventLocation,
        time: `${event.startTime}-${event.endTime}`,
        startTime: convertTimeToFloat(event.startTime),
        endTime: convertTimeToFloat(event.endTime),
        weekday: event.weekday,
        date: event.date
    });



    //selectedDate一变就重新调用
    useEffect(() => {
        //先清空
        setWeekTimeBlocks([]);
        // 获取这个日期所在周的七个日期
        const weekDates = getWeekDates(selectedDate);
        const weekDays = getWeekDays(selectedDate);

        // 创建一个数组，存储每一天的请求 Promise
        const requests = weekDates.map(day =>
            axios.post('http://192.168.116.144:8080/loadDayVision'/*'https://mock.apifox.com/m1/4226545-3867488-default/loadDayVision'*/, {
                date: day
            })
        );

        // 使用 Promise.all 等待所有请求完成
        Promise.all(requests)
            .then(responses => {
                // 将事件按星期几整理
                const eventsByWeekday = responses.reduce((acc, response, index) => {
                    let weekday = weekDays[index].getDay(); // 获取星期几
                    let weekdate = weekDates[index];
                    // 将星期天的 weekday 设置为 7
                    if (weekday === 0) {
                        weekday = 7;
                    }
                    console.log("weekday,weekdate:");
                    console.log(weekday);
                    console.log(weekdate);
                    //set weeknow
                    console.log("WeekCalendarScreen: weeknow:");
                    console.log(response.data.weeknow);
                    setWeeknow(response.data.weeknow);
                    if (response.data.eventArrs) {
                        response.data.eventArrs.forEach(event => {
                            // 为每个事件添加 weekday 属性
                            acc.push({
                                ...event,
                                weekday: weekday,
                                date: weekdate
                            });
                        });
                    }
                    return acc;
                }, []);

                // 更新 weekTimeBlocks 状态
                setWeekTimeBlocks(prevWeekTimeBlocks => [...prevWeekTimeBlocks, ...eventsByWeekday]);
                setIsWeekTimeBlocksReady(true);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [selectedDate]); // 仅在 selectedDate 变化时执行

    //监控weekTimeBlocks
    useEffect(() => {
        console.log("weekTimeBlocks:");
        console.log(weekTimeBlocks);
        if (isWeekTimeBlocksReady) {
            console.log("change FinalWeekTimeBlocks because WeekTimeBlocks change")
            setFinalWeekTimeBlocks(weekTimeBlocks.map(formatEvent));
        }
    }, [weekTimeBlocks]);

    //在weekTimeBlocks set完毕之后将其转为标准型
    useEffect(() => {
        if (isWeekTimeBlocksReady) setFinalWeekTimeBlocks(weekTimeBlocks.map(formatEvent));
    }, [isWeekTimeBlocksReady]);

    //监控finalWeekTimeBlocks
    useEffect(() => {
        console.log("finalWeekTimeBlocks:");
        console.log(finalWeekTimeBlocks);
    }, [finalWeekTimeBlocks]);

    return(
    <View style={styles.container1}>
        <TopBar navigation={navigation} active={3}/>
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
{/*         todo:根据选择日期计算第几周  finished*/}
            <Text style={styles.weekText}>{`第${weeknow}周`}</Text>
{/*              todo:选择日期直接进入日视图 */}
            <WeekCalendar navigation={navigation} /*navigation={navigation}*/selectedDate={selectedDate} currentWeekStart={currentWeekStart} setSelectedDate={setSelectedDate} updateWeek={updateWeek}/>
        </View>
{/* todo:根据选择日期调出当天的事件绘制timeline */}
        <TimeLine navigation={navigation} selectedDate={selectedDate} type={'week'} timeBlocks={finalWeekTimeBlocks}/>
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