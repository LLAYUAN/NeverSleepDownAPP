package org.example.backend.controllers;

import org.example.backend.service.*;
import org.example.backend.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.Date;
import java.util.*;

@RestController
//@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class LoadController {
    /*
    TODO:
        addChangeHoliday
        loadEventInfo 加载单件事件的详细信息到前端
        loadDayVision 加载某一天所有事件的信息到前端
        loadMonthVision 加载某一月所有事件的简要信息到前端
     */

    //向日志中加载receive request
    @Autowired
    private EventService eventService;

    @Autowired
    private ChangeTableService changeTableService;

    @Autowired
    private UserService userService;

    @Autowired
    private EventTableService eventTableService;

    @Autowired
    private CourseTimeTableService courseTimeTableService;

    @Autowired
    private EventTimeService eventTimeService;

    @PostMapping("/addChangeHoliday")
    public void addChangeHoliday(@RequestHeader(value = "Cookie") String cookie,
                                   @RequestBody Map<String, Object> requestBody) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        log.info("receive addChangeHoliday");
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        //modified为需要被替换的天
        Date modifiedDate = MyUtils.stringToDate((String) requestBody.get("modifiedDate"));
        //replace为替换上来的天,如果为空则表示当天取消
        Date replaceDate = MyUtils.stringToDate((String) requestBody.get("replaceDate"));
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        //获取学期开始的日期，以更好地进行计算
        Date firstDayDate = eventTable.getFirstDayDate();
        //我需要通过学期开始的第一天，结合日历，modifiedDate的值，来计算出这是这学期第几周的第几天
        //注：这里认为重复调整直接覆盖，所以要找到对应的changeTable，如果没有则新建
        Set<ChangeTable> changeTables = user.getChangeTables();
        ChangeTable changeTable = null;
        for(ChangeTable ct : changeTables){
            //如果里面本来就有要被调整的，则直接覆盖
            if(ct.getModifiedDate().equals(modifiedDate)){
                ct.setReplaceDate(replaceDate);
                changeTableService.saveChangeTable(ct);
                changeTable = ct;
                break;
            }
        }
        //如果没有找到，则新建
        if(changeTable == null) {
            changeTable = new ChangeTable();
            changeTable.setModifiedDate(modifiedDate);
            changeTable.setReplaceDate(replaceDate);
            changeTable.setUser(user);
            changeTableService.saveChangeTable(changeTable);
        }
    }

    @PostMapping("/loadEventInfo")
    public ResponsetoloadEventInfo loadEventInfo(@RequestHeader(value = "Cookie") String cookie,
                                                 @RequestBody Map<String, Object> requestBody) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        log.info("receive loadEventInfo");
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        Integer eventID = (Integer) requestBody.get("eventID");
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Event event = eventTable.getEventByEventID(eventID);
        Set<EventTime> eventTimes = event.getEventTimes();
        Set<DayRepeat> dayRepeats = MyUtils.eventTimestoDayRepeats(eventTimes);
        ResponsetoloadEventInfo response = new ResponsetoloadEventInfo();
        response.setCode(1);
        response.setEvent(event,dayRepeats);
        return response;
    }

    @PostMapping("/loadDayVision")
    public ResponsetoloadDayVision loadDayVision(@RequestHeader(value = "Cookie") String cookie,
                                @RequestBody Map<String, Object> requestBody) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        //获取的date为2024-2-14格式
        Date date = MyUtils.stringToDate((String) requestBody.get("date"));
        log.info("date:" + date);
        boolean isChanged = false;//标志是否调休
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        //在读取前要先检验是否被调休
        Set<ChangeTable> changeTables = user.getChangeTables();
        Date replaceDate = null;
        //如果被调休则替换日期,但要特殊处理直接放假的天，正常显示日程但不显示课程
        if(!changeTables.isEmpty()) {
            for(ChangeTable changeTable : changeTables) {
                if (changeTable != null) {
                    if (changeTable.getModifiedDate().equals(date)) {
                        replaceDate = changeTable.getReplaceDate();
                        isChanged = true;
                    }
                }
            }
        }
        ResponsetoloadDayVision response = new ResponsetoloadDayVision();
        log.info("ReplaceDate:" + replaceDate);
        //先获取这是第几周的第几天
        if(!isChanged || (isChanged && replaceDate != null)) {
            if(isChanged) {
                //如果调休了，那么要显示date当天的日程和replaceDate当天的课程
                Integer[] weekandday0 = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
                Integer weekforDate = weekandday0[0];
                Integer dayforDate = weekandday0[1];
                response.setWeeknow(weekforDate);
                Integer[] weekandday1 = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), replaceDate);
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
                                //将这个事件的信息传到前端
                                response.setEventArr(e, et);
                            }
                        }
                    }
                    if (!e.getType() && e.getWeek().charAt(weekforReplaceDate - 1) == '1') {
                        Set<EventTime> eventTimes = e.getEventTimes();
                        for (EventTime et : eventTimes) {
                            if (et.getDate().equals(dayforReplaceDate)) {
                                //将这个事件的信息传到前端
                                response.setEventArr(e, et);
                            }
                        }
                    }
                    //其他情况都不会认为是当天的事件
                }
            }
            else {
                Integer[] weekandday = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
                Integer week = weekandday[0];
                Integer day = weekandday[1];
                response.setWeeknow(week);
                log.info("week:" + week + " day:" + day);
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
                                //将这个事件的信息传到前端
                                response.setEventArr(e, et);
                            }
                        }
                    }
                }
            }

            return response;
        }
        else {
            log.info("这一天被放假了，只有当天的日程");
            Integer[] weekandday = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
            Integer week = weekandday[0];
            Integer day = weekandday[1];
            response.setWeeknow(week);
            log.info("week:" + week + " day:" + day);
            //获取这一天的所有事件
            for (Event e : events) {
                //只显示在当天的日程
                if (!e.getType() || e.getWeek().charAt(week - 1) == '0') {
                    continue;
                }
                //如果当周空出，则查看day是否匹配
                else {
                    Set<EventTime> eventTimes = e.getEventTimes();
                    for (EventTime et : eventTimes) {
                        if (et.getDate().equals(day)) {
                            //将这个事件的信息传到前端
                            response.setEventArr(e, et);
                        }
                    }
                }
            }
            return response;
        }
    }

    @PostMapping("/loadMonthVision")
    public ResponsetoloadMonthVision loadMonthVision(@RequestHeader(value = "Cookie") String cookie,
                                  @RequestBody Map<String, Object> requestBody) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        boolean isHaveSchedule = false;
        boolean isHaveCourse = false;
        boolean isImportant = false;
        boolean rest = false;
        boolean work = false;
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        Integer month = (Integer) requestBody.get("month");
        month -= 1;
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Date firstDayDate = eventTable.getFirstDayDate();
        Set<Event> events = eventTable.getEvents();
        Set<ChangeTable> changeTables = user.getChangeTables();
        // 将 Date 对象转换为 Calendar 对象
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(firstDayDate);
        // 获取指定年份
        int year = calendar.get(Calendar.YEAR);

        // 设置 Calendar 对象的年份和月份
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month);

        // 获取该月的第一天
        int firstDay = calendar.getActualMinimum(Calendar.DAY_OF_MONTH);
        calendar.set(Calendar.DAY_OF_MONTH, firstDay);
        ResponsetoloadMonthVision response = new ResponsetoloadMonthVision();
        // 遍历该月的每一天
        while (calendar.get(Calendar.YEAR) == year && calendar.get(Calendar.MONTH) == month) {
            // 获取当前日期
            Date currentDate = new java.sql.Date(calendar.getTimeInMillis());
            log.info("currentDate:" + currentDate);
            boolean[] bools = MyUtils.getBooleans(currentDate,firstDayDate,changeTables,events);
            isHaveSchedule = bools[0];
            isHaveCourse = bools[1];
            isImportant = bools[2];
//            isChanged = bools[3];
            rest = bools[3];
            work = bools[4];
            response.addDayInformation(isHaveSchedule,isHaveCourse,isImportant,rest,work);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        response.setCode(1);
        return response;
    }

    @GetMapping("/loadNotification")
    public ResponsetoloadNotification loadNotification(@RequestHeader(value = "Cookie") String cookie) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        log.info("receive loadNotification");
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        System.out.println("userID:"+userID+"tableID"+tableID.toString());
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        ResponsetoloadNotification response = new ResponsetoloadNotification();
        // 返回本机当前日期
        Date date = new Date(System.currentTimeMillis());
        log.info("date:" + date);
        boolean isChanged = false;//标志是否调休
        Set<Event> events = eventTable.getEvents();
        //在读取前要先检验是否被调休
        Set<ChangeTable> changeTables = user.getChangeTables();
        Date replaceDate = null;
        //如果被调休则替换日期,但要特殊处理直接放假的天，正常显示日程但不显示课程
        if(!changeTables.isEmpty()) {
            for(ChangeTable changeTable : changeTables) {
                if (changeTable != null) {
                    log.info("changeTable.getModifiedDate():" + changeTable.getModifiedDate() + " date:" + date);
                    if (changeTable.getModifiedDate().toString().equals(date.toString())) {
                        log.info("这一天被调休了");
                        replaceDate = changeTable.getReplaceDate();
                        isChanged = true;
                    }
                }
            }
        }
        log.info("ReplaceDate:" + replaceDate);
        //先获取这是第几周的第几天
        if(!isChanged || (isChanged && replaceDate != null)) {
            if(isChanged) {
                log.info("这一天被调休了，只有当天的日程");
                //如果调休了，那么要显示date当天的日程和replaceDate当天的课程
                Integer[] weekandday0 = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
                Integer weekforDate = weekandday0[0];
                Integer dayforDate = weekandday0[1];
                Integer[] weekandday1 = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), replaceDate);
                Integer weekforReplaceDate = weekandday1[0];
                Integer dayforReplaceDate = weekandday1[1];
                //遍历所有事件
                for (Event e : events) {
                    //先看时间在两个时间点是否有，然后再看它的属性
                    //weekforDate只看日程
                    if (e.getType() && e.getWeek().charAt(weekforDate - 1) == '1') {
                        log.info("这是当天的日程"+e.getEventName());
                        Set<EventTime> eventTimes = e.getEventTimes();
                        for (EventTime et : eventTimes) {
                            if (et.getDate().equals(dayforDate)) {
                                //将这个事件的信息传到前端
                                //现在我的starttime是08:00:00的格式，我要加上我的date，变成"2024-06-07T13:45:30"的格式
                                String startTime = MyUtils.completeDate(et.getStartTime(), date);
                                response.addNoteTime(e.getEventName(), startTime);
//                                response.setEventArr(e, et);
                            }
                        }
                    }
                    if (!e.getType() && e.getWeek().charAt(weekforReplaceDate - 1) == '1') {
                        Set<EventTime> eventTimes = e.getEventTimes();
                        for (EventTime et : eventTimes) {
                            if (et.getDate().equals(dayforReplaceDate)) {
                                //将这个事件的信息传到前端
                                String startTime = MyUtils.completeDate(et.getStartTime(), date);
                                response.addNoteTime(e.getEventName(), startTime);
//                                response.setEventArr(e, et);
                            }
                        }
                    }
                    //其他情况都不会认为是当天的事件
                }
            }
            else {
                Integer[] weekandday = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
                Integer week = weekandday[0];
                Integer day = weekandday[1];
//                response.setWeeknow(week);
                log.info("week:" + week + " day:" + day);
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
                                //将这个事件的信息传到前端
                                String startTime = MyUtils.completeDate(et.getStartTime(), date);
                                response.addNoteTime(e.getEventName(), startTime);
//                                response.setEventArr(e, et);
                            }
                        }
                    }
                }
            }
        }
        else {
            log.info("这一天被放假了，只有当天的日程");
            Integer[] weekandday = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(), date);
            Integer week = weekandday[0];
            Integer day = weekandday[1];
//            response.setWeeknow(week);
            log.info("week:" + week + " day:" + day);
            //获取这一天的所有事件
            for (Event e : events) {
                //只显示在当天的日程
                if (!e.getType() || e.getWeek().charAt(week - 1) == '0') {
                    continue;
                }
                //如果当周空出，则查看day是否匹配
                else {
                    Set<EventTime> eventTimes = e.getEventTimes();
                    for (EventTime et : eventTimes) {
                        if (et.getDate().equals(day)) {
                            //将这个事件的信息传到前端
                            String startTime = MyUtils.completeDate(et.getStartTime(), date);
                            response.addNoteTime(e.getEventName(), startTime);
//                            response.setEventArr(e, et);
                        }
                    }
                }
            }
        }
        return response;
    }


    @GetMapping("/export")
    public ResponsetoExport export(@RequestHeader(value = "Cookie") String cookie) {
        final Logger log = LoggerFactory.getLogger(LoadController.class);
        log.info("receive export");
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        //遍历所有事件，将它们的第一个eventtime和event作为参数加入到response中
        ResponsetoExport response = new ResponsetoExport();
        for(Event e : events){
            if(e.getType())
                continue;
            Set<EventTime> eventTimes = e.getEventTimes();
            for(EventTime et : eventTimes){
                response.addCourses(e,et);
            }
        }
        return response;
    }

}
