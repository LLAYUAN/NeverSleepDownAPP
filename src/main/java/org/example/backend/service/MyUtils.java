package org.example.backend.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.backend.model.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.time.format.DateTimeFormatter;
import java.time.LocalTime;

public class MyUtils {
    //处理一些公共的问题，比如时间转换，cookie信息读取等等
    //String cookieValue = "userID = "+ userID + "; tableID = " + tableID;这是我生成cookie的格式
    //读取cookie信息

    public static String[] getCookieInfo(String cookie) {
        //cookie的形式是 "userID="+ userID + ";tableID=" + tableID，我需要读出userID和tableID
        String[] keyValuePairs = cookie.split(";");
        String[] cookieInfo = new String[2]; // 0: userID, 1: tableID

        // 默认值
        cookieInfo[0] = "";
        cookieInfo[1] = "-1";

        for (String pair : keyValuePairs) {
            // 再次分割键值对成键和值
            String[] keyValue = pair.trim().split("=");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();
                // 找到键为 "userID" 的值
                if (key.equalsIgnoreCase("userID")) {
                    cookieInfo[0] = value;
                }
                // 找到键为 "tableID" 的值
                if (key.equalsIgnoreCase("tableID")) {
                    cookieInfo[1] = value;
                }
            }
        }
        //注意，这里返回的是两个字符串，要将tableID转换成数字才行
        return cookieInfo;
    }

    @org.jetbrains.annotations.NotNull
    @org.jetbrains.annotations.Contract(pure = true)
    public static String setCookie(String userID, Integer tableID) {
        String cookieValue = "userID="+ userID + ";tableID=" + tableID;
        return cookieValue;
    }

    public static Date stringToDate(String date) {
        //将字符串转换成日期
        if(date == null||date.isEmpty())
            return null;
        else {
            date = date.replace("/", "-");
            return Date.valueOf(date);
        }
    }

    public static String dateToString(Date date){
        //将日期转换成字符串
        if(date == null)
            return null;
        else {
            return date.toString().replace("-","/");
        }
    }

    public static int getWeekDiff(Date oldDate,Date newDate){
        //计算两个日期之间的周数差
        LocalDate oldLocalDate = oldDate.toLocalDate();
        LocalDate newLocalDate = newDate.toLocalDate();
        oldLocalDate = oldLocalDate.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        newLocalDate = newLocalDate.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        long dayDifference = ChronoUnit.DAYS.between(oldLocalDate, newLocalDate);
        // 计算新的比旧的晚多少天，算出来的是晚几周
        int weekDiff = (int) (dayDifference / 7);
        return weekDiff;
    }

    public static Integer[] DateToWeekandDay(Date firstDayDate,Date calculateDate){
        //将日期转换成星期和日期
        LocalDate firstDay = firstDayDate.toLocalDate();
        firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate calculateDay = calculateDate.toLocalDate();
        long dayDifference = ChronoUnit.DAYS.between(firstDay, calculateDay);
        int weekNum = (int) (dayDifference / 7) + 1;
//        int startDay = firstDayDate.toLocalDate().getDayOfWeek().getValue();
        int dayNum = calculateDate.toLocalDate().getDayOfWeek().getValue();
        Integer[] weekAndDay = new Integer[2];
        weekAndDay[0] = weekNum;
        weekAndDay[1] = dayNum;
        return weekAndDay;
    }

    public static Set<DayRepeat> eventTimestoDayRepeats(Set<EventTime> eventTimes){
        //将eventTime转换成dayRepeat
        Set<DayRepeat> dayRepeats = new HashSet<>();
        for(EventTime et : eventTimes){
            DayRepeat dayRepeat = new DayRepeat();
            dayRepeat.setDate(et.getDate());
            dayRepeat.setStartTime(et.getStartTime());
            dayRepeat.setEndTime(et.getEndTime());
            dayRepeat.setStartTimeNumber(et.getStartTimeNumber());
            dayRepeat.setEndTimeNumber(et.getEndTimeNumber());
            dayRepeats.add(dayRepeat);
        }
        return dayRepeats;
    }

    public static boolean[] getBooleans(Date currentDate, Date firstDayDate,Set<ChangeTable> changeTables, Set<Event> events){
        //检查一天是否有日程、课程、重要事件、是否被调休
        final Logger log = org.slf4j.LoggerFactory.getLogger(MyUtils.class);
        boolean isHaveSchedule = false;
        boolean isHaveCourse = false;
        boolean isImportant = false;
        boolean rest = false;
        boolean work = false;
        Date replaceDate = null;
        log.info("currentDate:" + currentDate+" firstDayDate:"+firstDayDate);
        //如果currentDate小于firstDayDate，则直接返回false
        if(currentDate.compareTo(firstDayDate) >= 0) {
            log.info("currentDate:" + currentDate+" firstDayDate:"+firstDayDate);
            //如果被调休则替换日期,但要特殊处理直接放假的天，正常显示日程但不显示课程
            if (!changeTables.isEmpty()) {
                for (ChangeTable changeTable : changeTables) {
//                    if (changeTable != null) {
                        if (changeTable.getModifiedDate().equals(currentDate)) {
                            replaceDate = changeTable.getReplaceDate();
                            if (replaceDate == null) {
                                rest = true;
                            } else {
                                work = true;
                            }
//                            isChanged = true;
                        }
//                    }
                }
            }
            //先获取这是第几周的第几天,这种情况是调休上班
            if((!rest && !work) || work) {
                if(work) {
                    //如果调休了，那么要显示date当天的日程和replaceDate当天的课程
                    Integer[] weekandday0 = MyUtils.DateToWeekandDay(firstDayDate, currentDate);
                    Integer weekforDate = weekandday0[0];
                    Integer dayforDate = weekandday0[1];
                    Integer[] weekandday1 = MyUtils.DateToWeekandDay(firstDayDate, replaceDate);
                    Integer weekforReplaceDate = weekandday1[0];
                    Integer dayforReplaceDate = weekandday1[1];
                    //遍历所有事件
                    for (Event e : events) {
                        //先看时间在两个时间点是否有，然后再看它的属性
                        //weekforDate只看日程
                        if (e.getType() && e.getWeek().charAt(weekforDate - 1) == '1') {
                            Set<EventTime> eventTimes = e.getEventTimes();
                            for (EventTime et : eventTimes) {
                                if (et.getDate().equals(dayforDate)) {
                                    isHaveSchedule = true;
                                    if (e.getIsImportant()) {
                                        isImportant = true;
                                    }
                                    break;
                                }
                            }
                        }
                        if (!e.getType() && e.getWeek().charAt(weekforReplaceDate - 1) == '1') {
                            Set<EventTime> eventTimes = e.getEventTimes();
                            for (EventTime et : eventTimes) {
                                if (et.getDate().equals(dayforReplaceDate)) {
                                    //将这个事件的信息传到前端
                                    isHaveCourse = true;
                                    if (e.getIsImportant()) {
                                        isImportant = true;
                                    }
                                    break;
                                }
                            }
                        }
                        //其他情况都不会认为是当天的事件
                    }
                }
                else {
                    Integer[] weekandday = MyUtils.DateToWeekandDay(firstDayDate, currentDate);
                    Integer week = weekandday[0];
                    Integer day = weekandday[1];
                    //获取这一天的所有事件
                    for (Event e : events) {
                        //先看当周是否空出
                        if (e.getWeek().charAt(week - 1) == '0') {
                            continue;
                        }
                        //如果当周空出，则查看day是否匹配
                        else {
                            Set<EventTime> eventTimes = e.getEventTimes();
                            for (EventTime et : eventTimes) {
                                if (et.getDate().equals(day)) {
                                    if(e.getType()){
                                        isHaveSchedule = true;
                                    }
                                    else{
                                        isHaveCourse = true;
                                    }
                                    if (e.getIsImportant()) {
                                        isImportant = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                Integer[] weekandday = MyUtils.DateToWeekandDay(firstDayDate, currentDate);
                Integer week = weekandday[0];
                Integer day = weekandday[1];

                for (Event e : events) {
                    //先看当周是否空出，且只显示日程
                    if (!e.getType() || e.getWeek().charAt(week - 1) == '0') {
                        continue;
                    }
                    //如果当周空出，则查看day是否匹配
                    else {
                        Set<EventTime> eventTimes = e.getEventTimes();
                        for (EventTime et : eventTimes) {
                            if (et.getDate().equals(day)) {
                                //将这个事件的信息传到前端
                                isHaveSchedule = true;
                                if (e.getIsImportant()) {
                                    isImportant = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        boolean[] booleans = new boolean[5];
        booleans[0] = isHaveSchedule;
        booleans[1] = isHaveCourse;
        booleans[2] = isImportant;
        booleans[3] = rest;
        booleans[4] = work;
        return booleans;
    }

    public static String completeDate(String startTime,Date date){
        //将日期补全
        //现在我的starttime是08:00:00的格式，我要加上我的date，变成"2024-06-07T13:45:30"的格式
        String dateStr = date.toString();
        String[] time = startTime.split(":");
        String[] dateArray = dateStr.split("-");
        String completeDate = dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2] + "T" + time[0] + ":" + time[1] + ":00";
        return completeDate;
    }

    public static String[] getBothTimeByTwoNumber(EventTable eventTable,Integer startTimeNumber,Integer endTimeNumber,CourseTimeTableService courseTimeTableService){
        //根据tableID和startTimeNumber找到对应的startTime

        CourseTimeTable courseTimeTable = eventTable.getCourseTimeTable();
        String[] bothTime = new String[2];
        switch (startTimeNumber) {
            case 1:
                bothTime[0] = courseTimeTable.getTime1();
                break;
            case 2:
                bothTime[0] = courseTimeTable.getTime3();
                break;
            case 3:
                bothTime[0] = courseTimeTable.getTime5();
                break;
            case 4:
                bothTime[0] = courseTimeTable.getTime7();
                break;
            case 5:
                bothTime[0] = courseTimeTable.getTime9();
                break;
            case 6:
                bothTime[0] = courseTimeTable.getTime11();
                break;
            case 7:
                bothTime[0] = courseTimeTable.getTime13();
                break;
            case 8:
                bothTime[0] = courseTimeTable.getTime15();
                break;
            case 9:
                bothTime[0] = courseTimeTable.getTime17();
                break;
            case 10:
                bothTime[0] = courseTimeTable.getTime19();
                break;
            case 11:
                bothTime[0] = courseTimeTable.getTime21();
                break;
            case 12:
                bothTime[0] = courseTimeTable.getTime23();
                break;
            case 13:
                bothTime[0] = courseTimeTable.getTime25();
                break;
            case 14:
                bothTime[0] = courseTimeTable.getTime27();
                break;
            case 15:
                bothTime[0] = courseTimeTable.getTime29();
                break;
            case 16:
                bothTime[0] = courseTimeTable.getTime31();
                break;
            case 17:
                bothTime[0] = courseTimeTable.getTime33();
                break;
            case 18:
                bothTime[0] = courseTimeTable.getTime35();
                break;
            case 19:
                bothTime[0] = courseTimeTable.getTime37();
                break;
            case 20:
                bothTime[0] = courseTimeTable.getTime39();
                break;
            default:
                // 处理默认情况
                break;
        }
        switch (endTimeNumber) {
            case 1:
                bothTime[1] = courseTimeTable.getTime2();
                break;
            case 2:
                bothTime[1] = courseTimeTable.getTime4();
                break;
            case 3:
                bothTime[1] = courseTimeTable.getTime6();
                break;
            case 4:
                bothTime[1] = courseTimeTable.getTime8();
                break;
            case 5:
                bothTime[1] = courseTimeTable.getTime10();
                break;
            case 6:
                bothTime[1] = courseTimeTable.getTime12();
                break;
            case 7:
                bothTime[1] = courseTimeTable.getTime14();
                break;
            case 8:
                bothTime[1] = courseTimeTable.getTime16();
                break;
            case 9:
                bothTime[1] = courseTimeTable.getTime18();
                break;
            case 10:
                bothTime[1] = courseTimeTable.getTime20();
                break;
            case 11:
                bothTime[1] = courseTimeTable.getTime22();
                break;
            case 12:
                bothTime[1] = courseTimeTable.getTime24();
                break;
            case 13:
                bothTime[1] = courseTimeTable.getTime26();
                break;
            case 14:
                bothTime[1] = courseTimeTable.getTime28();
                break;
            case 15:
                bothTime[1] = courseTimeTable.getTime30();
                break;
            case 16:
                bothTime[1] = courseTimeTable.getTime32();
                break;
            case 17:
                bothTime[1] = courseTimeTable.getTime34();
                break;
            case 18:
                bothTime[1] = courseTimeTable.getTime36();
                break;
            case 19:
                bothTime[1] = courseTimeTable.getTime38();
                break;
            case 20:
                bothTime[1] = courseTimeTable.getTime40();
                break;
            default:
                // 处理默认情况
                break;
        }
        return bothTime;
    }


    public static String[] getBothTimeWithCourseTimeTable(Integer startTimeNumber,Integer endTimeNumber,CourseTimeTable courseTimeTable){
        //根据tableID和startTimeNumber找到对应的startTime
        String[] bothTime = new String[2];
        switch (startTimeNumber) {
            case 1:
                bothTime[0] = courseTimeTable.getTime1();
                break;
            case 2:
                bothTime[0] = courseTimeTable.getTime3();
                break;
            case 3:
                bothTime[0] = courseTimeTable.getTime5();
                break;
            case 4:
                bothTime[0] = courseTimeTable.getTime7();
                break;
            case 5:
                bothTime[0] = courseTimeTable.getTime9();
                break;
            case 6:
                bothTime[0] = courseTimeTable.getTime11();
                break;
            case 7:
                bothTime[0] = courseTimeTable.getTime13();
                break;
            case 8:
                bothTime[0] = courseTimeTable.getTime15();
                break;
            case 9:
                bothTime[0] = courseTimeTable.getTime17();
                break;
            case 10:
                bothTime[0] = courseTimeTable.getTime19();
                break;
            case 11:
                bothTime[0] = courseTimeTable.getTime21();
                break;
            case 12:
                bothTime[0] = courseTimeTable.getTime23();
                break;
            case 13:
                bothTime[0] = courseTimeTable.getTime25();
                break;
            case 14:
                bothTime[0] = courseTimeTable.getTime27();
                break;
            case 15:
                bothTime[0] = courseTimeTable.getTime29();
                break;
            case 16:
                bothTime[0] = courseTimeTable.getTime31();
                break;
            case 17:
                bothTime[0] = courseTimeTable.getTime33();
                break;
            case 18:
                bothTime[0] = courseTimeTable.getTime35();
                break;
            case 19:
                bothTime[0] = courseTimeTable.getTime37();
                break;
            case 20:
                bothTime[0] = courseTimeTable.getTime39();
                break;
            default:
                // 处理默认情况
                break;
        }
        switch (endTimeNumber) {
            case 1:
                bothTime[1] = courseTimeTable.getTime2();
                break;
            case 2:
                bothTime[1] = courseTimeTable.getTime4();
                break;
            case 3:
                bothTime[1] = courseTimeTable.getTime6();
                break;
            case 4:
                bothTime[1] = courseTimeTable.getTime8();
                break;
            case 5:
                bothTime[1] = courseTimeTable.getTime10();
                break;
            case 6:
                bothTime[1] = courseTimeTable.getTime12();
                break;
            case 7:
                bothTime[1] = courseTimeTable.getTime14();
                break;
            case 8:
                bothTime[1] = courseTimeTable.getTime16();
                break;
            case 9:
                bothTime[1] = courseTimeTable.getTime18();
                break;
            case 10:
                bothTime[1] = courseTimeTable.getTime20();
                break;
            case 11:
                bothTime[1] = courseTimeTable.getTime22();
                break;
            case 12:
                bothTime[1] = courseTimeTable.getTime24();
                break;
            case 13:
                bothTime[1] = courseTimeTable.getTime26();
                break;
            case 14:
                bothTime[1] = courseTimeTable.getTime28();
                break;
            case 15:
                bothTime[1] = courseTimeTable.getTime30();
                break;
            case 16:
                bothTime[1] = courseTimeTable.getTime32();
                break;
            case 17:
                bothTime[1] = courseTimeTable.getTime34();
                break;
            case 18:
                bothTime[1] = courseTimeTable.getTime36();
                break;
            case 19:
                bothTime[1] = courseTimeTable.getTime38();
                break;
            case 20:
                bothTime[1] = courseTimeTable.getTime40();
                break;
            default:
                // 处理默认情况
                break;
        }
        return bothTime;
    }

    public static int hasCommonWeek(String week1,String week2){
        //length为较短字符串的长度
        int length = week1.length() > week2.length() ? week2.length() : week1.length();
        //判断两个周数是否有重合
        for(int i = 0;i < length;i++){
            if(week1.charAt(i) == '1' && week2.charAt(i) == '1'){
                return (i+1);
            }
        }
        return 0;
    }

    public static boolean isTimeRepeat(String startTime1,String endTime1,String startTime2,String endTime2){
        //判断两个时间段是否有重合,第一个的开始事件大于等于第二个的结束时间，或者第一个的结束时间小于等于第二个的开始时间
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        DateTimeFormatter timeFormatter2 = DateTimeFormatter.ofPattern("H:mm:ss");

        // 解析时间字符串
        if(startTime1.length() == 7)
            startTime1 = "0" + startTime1;
        if(endTime1.length() == 7)
            endTime1 = "0" + endTime1;
        if(startTime2.length() == 7)
            startTime2 = "0" + startTime2;
        if(endTime2.length() == 7)
            endTime2 = "0" + endTime2;
        LocalTime time1Start = LocalTime.parse(startTime1, timeFormatter);
        LocalTime time1End = LocalTime.parse(endTime1, timeFormatter);
        LocalTime time2Start = LocalTime.parse(startTime2, timeFormatter);
        LocalTime time2End = LocalTime.parse(endTime2, timeFormatter);

        // 判断两个时间段是否有重合
        // 第一个时间段的开始时间在第二个时间段的开始时间和结束时间之间
        // 或者第一个时间段的结束时间在第二个时间段的开始时间和结束时间之间
        return !(time1Start.isAfter(time2End) || time1End.isBefore(time2Start));
    }
}
