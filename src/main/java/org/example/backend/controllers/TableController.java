package org.example.backend.controllers;

import org.example.backend.model.*;
import org.example.backend.service.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.*;

@RestController
public class TableController {
    /*
    处理所有工作表相关的请求
    TODO:
        addTableInfo done，同时该table关联的所有课程的时间都要进行更新
        deleteTable done
        switchTable done
        getAllTableInfo done
    */

    @Autowired
    private UserService userService;

    @Autowired
    private EventTableService eventTableService;

    @Autowired
    private CourseTimeTableService courseTimeTableService;
    @Autowired
    private EventService eventService;

    @PostMapping("/addTableInfo")
    public void addTableInfo(@RequestHeader(value="Cookie") String cookie,
                             @RequestBody Map<String,Object> requestBody) {
        String userID = null;
        Integer tableID = 0;
        String tableName = (String) requestBody.get("tableName");
        String backgroundURL = (String) requestBody.get("backgroundURL");
        String font = (String) requestBody.get("font");
        String courseColor = (String) requestBody.get("courseColor");
        String eventColor = (String) requestBody.get("eventColor");
        String firstDayDate = (String) requestBody.get("firstDayDate");

        Integer weekAmount = 0;
        if(requestBody.get("weekAmount")!=null){
            weekAmount = (Integer) requestBody.get("weekAmount");
        }

        Integer courseNumber = 0;
        if(requestBody.get("courseNum") != null){
            courseNumber = (Integer) requestBody.get("courseNum");
        }

        List<Map<String, String>> courseTimeList = (List<Map<String, String>>) requestBody.get("courseTime");
        List<CourseTime> courseTimes = new ArrayList<>();

        // 遍历数组，创建 CourseTime 对象并添加到列表中
        for (Map<String, String> courseTimeMap : courseTimeList) {
            String startTime = courseTimeMap.get("startTime");
            String endTime = courseTimeMap.get("endTime");
            CourseTime courseTime = new CourseTime(startTime, endTime); // 假设你的 CourseTime 类有一个构造函数接收 startTime 和 endTime
            courseTimes.add(courseTime);
        }

        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        userID = cookieInfo[0];
        tableID = Integer.parseInt(cookieInfo[1]);
        //根据userID和tableID找到对应的eventTable
        Set<EventTable> eventTables = userService.getEventTablesByuserID(userID);
        EventTable eventTable = null;
        //找到userID,tableID对应的eventTable
        //还要找到eventTable对应的courseTimeTable
        CourseTimeTable courseTimeTable = null;
        for (EventTable et : eventTables) {
            if (Objects.equals(et.getTableID(), tableID)) {
                eventTable = et;
                break;
            }
        }
        if(eventTable != null) {
            //找到eventTable对应
            courseTimeTable = eventTable.getCourseTimeTable();
            //如果没有对应的表，则创建一个
            if(courseTimeTable == null) {
                courseTimeTable = new CourseTimeTable();
                courseTimeTable.setEventTable(eventTable);
            }
            eventTable.setTableName(tableName);
            eventTable.setBackground(backgroundURL);
            eventTable.setFont(font);
            eventTable.setCourseColor(courseColor);
            eventTable.setEventColor(eventColor);
            //如果firstDayDate不同，则要对所有日程的时间进行更新
//            if(MyUtils.stringToDate(firstDayDate) != eventTable.getFirstDayDate())
//                eventService.adaptAllSchedules(eventTable,MyUtils.stringToDate(firstDayDate));
            eventTable.setFirstDayDate(MyUtils.stringToDate(firstDayDate));
            if(weekAmount != 0)
            eventTable.setWeekAmount(weekAmount);
            if(courseNumber != 0) {
                courseTimeTable.setAllCourseTime(courseNumber,courseTimes);
            }
            courseTimeTable.setCourseNumber(courseNumber);
            eventTableService.saveEventTable(eventTable);
            courseTimeTableService.save(courseTimeTable);
            //根据新的courseTime对于各个事件的时间进行更新
            Set<Event> events = eventTable.getEvents();
            for(Event event : events) {
                if(!event.getType()){
                    eventService.updateTime(event,courseTimeTable);
                }
            }
        }

    }

    @PostMapping("/deleteTable")
    public ResponsetoDeleteTable deleteTable(@RequestHeader(value="Cookie") String cookie,
                                            @RequestBody Map<String,Object> requestBody) {
        Logger log = org.slf4j.LoggerFactory.getLogger(TableController.class);
        String userID = null;
        Integer nowtableID = 0;
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        userID = cookieInfo[0];
        nowtableID = Integer.parseInt(cookieInfo[1]);
        Integer deleteTableID = (Integer)requestBody.get("tableID");
        //根据userID和tableID找到对应的eventTable
        User user = userService.getUserByUserID(userID);
        List<EventTable> eventTables = eventTableService.findByUser(user);
        //如果只有一个工作表，不允许删除
        log.info("eventTables.size() = " + eventTables.size());
        if(eventTables.size() == 1) {
            ResponsetoDeleteTable response = new ResponsetoDeleteTable(false,"");
            return response;
        }
        EventTable eventTable = null;
        //找到userID,tableID对应的eventTable
        //还要找到eventTable对应的courseTimeTable
        for (EventTable et : eventTables) {
            if (Objects.equals(et.getTableID(), deleteTableID)) {
                eventTable = et;
                break;
            }
        }
        //TODO：删除eventTable和courseTimeTable和对应的event
        ResponsetoDeleteTable response = null;
        if(eventTable != null) {
            //如果删除的是默认表，则将第一个表设为默认表并返回一个新的cookie
            if(eventTable.getDefaultTable()){
                EventTable newDefaultTable = null;
                for(EventTable et : eventTables){
                    if(!et.getDefaultTable()){
                        newDefaultTable = et;
                        break;
                    }
                }
                newDefaultTable.setDefaultTable(true);
                eventTableService.saveEventTable(newDefaultTable);
                cookie = MyUtils.setCookie(userID,newDefaultTable.getTableID());
                response = new ResponsetoDeleteTable(true,cookie);
            }
            else{
                cookie = MyUtils.setCookie(userID,nowtableID);
                response = new ResponsetoDeleteTable(true,cookie);
            }
            //删除eventtable对应的event
//            //删除eventtable对应的coursetimetable
//            courseTimeTableService.deleteByEventTableID(tableID);
            //删除eventtable本身
            eventTableService.deleteByTableID(deleteTableID);
        }
        return response;
    }

    @GetMapping("/getAllTableInfo")
    public ResponsetogetAllTableInfo getAllTableInfo(@RequestHeader(value="Cookie") String cookie) {
        String userID = null;
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        userID = cookieInfo[0];
        //获取所有的eventTable
        Set<EventTable> eventTables = userService.getEventTablesByuserID(userID);
        ResponsetogetAllTableInfo response = new ResponsetogetAllTableInfo();
        response.setCode(1);
        Set<TableArray> tableArrays = new HashSet<>();
        //将eventTable转换为TableArray
        for(EventTable et : eventTables) {
            TableArray tableArray = new TableArray();
            tableArray.setTableArray(et.getTableID(),et.getTableName());
            tableArrays.add(tableArray);
        }
        response.setData(tableArrays.size(),tableArrays);
        return response;
    }

    @PostMapping("/switchTable")
    public ResponsetoisPasswordCorrect switchTable(@RequestHeader(value="Cookie") String cookie,
                                             @RequestBody Map<String,Object> requestBody) {

        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer oldTableID = Integer.parseInt(cookieInfo[1]);
        //要切换过去的表
        Integer newTableID = (Integer)requestBody.get("tableID");
        String tableName = (String)requestBody.get("tableName");
        User user = userService.getUserByUserID(userID);
        EventTable oldEventTable = user.getEventTableByTableID(oldTableID);
        oldEventTable.setDefaultTable(false);
        eventTableService.saveEventTable(oldEventTable);
        EventTable newEventTable;
        CourseTimeTable courseTimeTable = null;
        if(newTableID == 0){//要为它生成新的EventTable对象并插入数据库，将返回的tableID和Cookie更新
            newEventTable = new EventTable();
            newEventTable.setUser(user);
//            long count = eventTableService.countByUser(user);
//            newEventTable.setTableName("工作表"+(count+1));
            newEventTable.setDefaultTable(true);
            newEventTable.setTableName(tableName);
            eventTableService.saveEventTable(newEventTable);
            newTableID = newEventTable.getTableID();
            courseTimeTable = new CourseTimeTable();
            courseTimeTable.setEventTable(newEventTable);
            courseTimeTableService.save(courseTimeTable);
        }
        else {
            //根据userID和tableID找到对应的eventTable
            Set<EventTable> eventTables = user.getEventTables();
            newEventTable = null;
            //找到userID,tableID对应的eventTable
            for (EventTable et : eventTables) {
                if (Objects.equals(et.getTableID(), newTableID)) {
                    newEventTable = et;
                    break;
                }
            }
            if (newEventTable == null) {
                newTableID = 0;
            }
            else {
                courseTimeTable = newEventTable.getCourseTimeTable();
                newEventTable.setDefaultTable(true);
                eventTableService.saveEventTable(newEventTable);
            }
        }
        cookie = MyUtils.setCookie(userID,newTableID);
        ResponsetoisPasswordCorrect response = new ResponsetoisPasswordCorrect();
        response.setCode(1);
        response.setData(true,false, newTableID,cookie,newEventTable.getTableName(),newEventTable.getBackground(),newEventTable.getFont(),newEventTable.getCourseColor(),newEventTable.getEventColor(),MyUtils.dateToString(newEventTable.getFirstDayDate()),newEventTable.getWeekAmount(),courseTimeTable);
        return response;
    }
}
