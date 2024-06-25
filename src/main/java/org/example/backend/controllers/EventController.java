package org.example.backend.controllers;

import jakarta.persistence.EntityManager;
import kong.unirest.Unirest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.backend.service.*;
import org.example.backend.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import org.apache.el.parser.ParseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.util.*;

@RestController
public class EventController {
    /*
    处理所有存储在数据库的事件相关的请求
    TODO:
        changeEventInfo,当传入的EventID为0时，表示新建事件，否则表示修改事件，待完成，因为外键等都没有构造成功
        deleteEvent 删除事件，要将它的eventtime连带着一起删除
     */
    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseTimeTableService courseTimeTableService;

    @Autowired
    private EventTimeService eventTimeService;

    @Autowired
    private EventTableService eventTableService;

    //不需要返回值，因为修改后前端为整个重新load来获取当天的所有课程
    @PostMapping("/changeEventInfo")
    public ResponsetoChangeEventInfo changeEventInfo(@RequestHeader(value = "Cookie") String cookie,
                                @RequestBody Map<String, Object> requestBody) {
        final Logger log = LoggerFactory.getLogger(EventController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        //0为课程，1为日程
        boolean type = (boolean) requestBody.get("type");
        Integer eventID = (Integer) requestBody.get("eventID");
        String eventName = (String) requestBody.get("eventName");
        String eventLocation = (String) requestBody.get("eventLocation");
        String courseCode = (String) requestBody.get("courseCode");
        String weekRepeat = (String) requestBody.get("weekRepeat");
        if(weekRepeat.length()<20){
            for(int i = weekRepeat.length(); i < 20; i++){
                weekRepeat += '0';
            }
        }
        Boolean isImportant = (Boolean) requestBody.get("isImportant");
        List<Map<String, Object>> dayRepeatList = (List<Map<String, Object>>) requestBody.get("dayRepeat");
        Boolean isDirectlySave = (Boolean) requestBody.get("isDirectlySave");
        User user = userService.getUserByUserID(userID);
        //根据userID，tableID先达到对应的eventTable
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<DayRepeat> dayRepeats = new HashSet<>();
        int date;
        int startTimeNumber = 0;
        int endTimeNumber = 0;
        String startTime = null;
        String endTime = null;
        Event event = null;
        //将dayRepeats读取出来，后续存入eventtime
        if(!type){
            //如果是课程，则只看startTimeNumber和endTimeNumber
            for (Map<String, Object> dayRepeatMap : dayRepeatList) {
                date = (int) dayRepeatMap.get("date");
                startTimeNumber = (int) dayRepeatMap.get("startTimeNumber");
                endTimeNumber = (int) dayRepeatMap.get("endTimeNumber");
                String[] bothTime = MyUtils.getBothTimeByTwoNumber(eventTable, startTimeNumber, endTimeNumber, courseTimeTableService);
                startTime = bothTime[0];
                endTime = bothTime[1];
                DayRepeat dayRepeat = new DayRepeat(date, startTimeNumber, endTimeNumber);
                dayRepeat.setStartTime(startTime);
                dayRepeat.setEndTime(endTime);
                dayRepeats.add(dayRepeat);
            }
        }
        else {
            //如果为日程，节数直接都标志为0
            //如果是日程，则只看startTime和endTime
            for (Map<String, Object> dayRepeatMap : dayRepeatList) {
                date = (int) dayRepeatMap.get("date");
                startTime = (String) dayRepeatMap.get("startTime");
                endTime = (String) dayRepeatMap.get("endTime");
                DayRepeat dayRepeat = new DayRepeat(date, startTime, endTime);
                dayRepeats.add(dayRepeat);
            }
        }
        if(!isDirectlySave) {
            ResponsetoChangeEventInfo res = eventService.checkEventTable(type,eventTable, dayRepeats, weekRepeat);
            if(res.getIsRepeat()) {
                return res;
            }
        }
        //要先找到对应的event，如果是0则新建，否则找到对应的event
        if(eventID == 0){
            //需要新建事件
            event = new Event();
        }
        else {
            log.info("eventID: " + eventID);
            //要找到对应的event，通过eventtable和event的外键进行寻找
            Set<Event> events = eventTable.getEvents();
            for (Event event0 : events) {
                if(Objects.equals(event0.getEventID(), eventID)){
                    //如果找到了原先的事件，则需要将原先事件的eventtime清零
                    log.info("event 0 ID: " + event0.getEventID());
                    event = event0;
                    for(EventTime eventTime : event.getEventTimes()){
                        eventTimeService.delete(eventTime);
                    }
                    break;
                }
            }
        }
        if(event != null){
            event.setType(type);
        }
        if(eventName != null){
            event.setEventName(eventName);
        }
        if(eventLocation != null)
        event.setEventLocation(eventLocation);
        if(courseCode != null)
        event.setCourseCode(courseCode);
        event.setWeek(weekRepeat);
        if (isImportant!=null)
        event.setIsImportant(isImportant);
        event.setEventTable(eventTable);
        eventService.saveEvent(event);
        if(!type){
            //遍历dayRepeats，把一个Dayrepeat对应存一列eventtime并保存到数据库中
            for (DayRepeat dayRepeat : dayRepeats) {
                EventTime eventTime = new EventTime();
                eventTime.setDate(dayRepeat.getDate());
                startTimeNumber = dayRepeat.getStartTimeNumber();
                endTimeNumber = dayRepeat.getEndTimeNumber();
                startTime = dayRepeat.getStartTime();
                endTime = dayRepeat.getEndTime();
                //先存入节数，再根据节数算出对应的课程时间，将所有内容都进行存入
                eventTime.setStartTimeNumber(startTimeNumber);
                eventTime.setEndTimeNumber(endTimeNumber);
                //根据courseTimeTable算出对应的课程时间
//                String[] bothTime = MyUtils.getBothTimeByTwoNumber(eventTable, startTimeNumber, endTimeNumber, courseTimeTableService);
//                startTime = bothTime[0];
//                endTime = bothTime[1];
                eventTime.setStartTime(startTime);
                eventTime.setEndTime(endTime);
                eventTime.setEvent(event);
                eventTimeService.save(eventTime);
            }
        }
        else {
            for (DayRepeat dayRepeat : dayRepeats) {
                EventTime eventTime = new EventTime();
                eventTime.setDate(dayRepeat.getDate());
                eventTime.setStartTimeNumber(dayRepeat.getStartTimeNumber());
                eventTime.setEndTimeNumber(dayRepeat.getEndTimeNumber());
                eventTime.setStartTime(dayRepeat.getStartTime());
                eventTime.setEndTime(dayRepeat.getEndTime());
                eventTime.setEvent(event);
                log.info("to here 3");
                eventTimeService.save(eventTime);
                log.info("to here 4");
            }
        }
        return new ResponsetoChangeEventInfo("", false);
    }

    @PostMapping("/deleteEvent")
    public void deleteEvent(@RequestHeader(value = "Cookie") String cookie,
                            @RequestBody Map<String, Object> requestBody) {
        Logger log = LoggerFactory.getLogger(EventController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        Integer eventID = (Integer) requestBody.get("eventID");
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        Event event = null;
        for (Event event0 : events) {
            if(Objects.equals(event0.getEventID(), eventID)){
                log.info("eventID: " + event0.getEventID());
                event = event0;
                break;
            }
        }
        if(event != null){
            log.info("delete event: " + event.getEventID());
            //删除event下属的所有eventTimes，再删除event
            //在遍历set的同时删除eventTime会导致并行错误，用迭代器也不行，但是用List就可以，原因不明，但能跑，是好代码
//            eventService.delete(event);
            eventService.deleteByEventID(eventID);
//            List<EventTime> eventTimesToDelete = new ArrayList<>();
//            for (EventTime eventTime : event.getEventTimes()) {
//                eventTimesToDelete.add(eventTime);
//            }
//            // 删除临时集合中的 EventTime
//            for (EventTime eventTime : eventTimesToDelete) {
//                event.getEventTimes().remove(eventTime);
//                eventTimeService.delete(eventTime);
//            }
//            //删除event本身
//            eventService.delete(event);
        }
    }

    @PostMapping("/saveOneCourseNote")
    public void saveOneCourseNote(@RequestHeader(value = "Cookie") String cookie,
                                  @RequestBody Map<String, Object> requestBody) {
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        Integer eventID = (Integer) requestBody.get("eventID");
        String courseNote = (String) requestBody.get("text");
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        Event event = null;
        for (Event event0 : events) {
            if(Objects.equals(event0.getEventID(), eventID)){
                event = event0;
                break;
            }
        }
        if(event != null){
            event.setNote(courseNote);
            eventService.saveEvent(event);
        }
    }

    @GetMapping("/getAllCourseinNote")
    public ResponsetoGetAllCourseinNote getAllCourseinNote(@RequestHeader(value = "Cookie") String cookie) {
        Logger log = LoggerFactory.getLogger(EventController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        log.info("event's size"+ events.size());
        ResponsetoGetAllCourseinNote responsetoGetAllCourseinNote = new ResponsetoGetAllCourseinNote();
        responsetoGetAllCourseinNote.setCourseInfoinNote(events);
//        log.info("get all course in note");
        return responsetoGetAllCourseinNote;
    }

    public class ResponsetoGetOneCourseNote {
        private String note;

        public void setNote (String note) {
            this.note = note;
        }

        // getters
        public String getNote() {
            return note;
        }
    }

    @PostMapping("/getOneCourseNote")
    public ResponsetoGetOneCourseNote getOneCourseNote(@RequestHeader(value = "Cookie") String cookie,
                                                       @RequestBody Map<String, Object> requestBody) {
        Logger log = LoggerFactory.getLogger(EventController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        Integer eventID = (Integer) requestBody.get("eventID");
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        Set<Event> events = eventTable.getEvents();
        Event event = null;
        for (Event event0 : events) {
            if(Objects.equals(event0.getEventID(), eventID)){
                event = event0;
                break;
            }
        }
        ResponsetoGetOneCourseNote responsetoGetOneCourseNote = new ResponsetoGetOneCourseNote();
        responsetoGetOneCourseNote.setNote(event.getNote());
        return responsetoGetOneCourseNote;
    }

    @GetMapping("/RequestLesson")
    public void requestLesson(@RequestHeader(value = "Cookie") String cookie,
                              @RequestParam String accessToken) throws AuthenticationException {

        accessToken = accessToken.substring(1,accessToken.length()-1);
        System.out.println(accessToken);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        User user = userService.getUserByUserID(userID);
        EventTable eventTable = user.getEventTableByTableID(tableID);
        if(eventTable.getDoneImport()){
            //告知前端已经导入过课程表
            return;
        }
        System.out.println("进入Lesson成功");
        System.out.println("Cookie:" + cookie);
//        Unirest.config().connectTimeout(6000).socketTimeout(6000); // 设置合理的超时
        List<EventDTO> events = new ArrayList<>();
        try {
            //可以根据学期修改
            String term = "2023-2024-2";

            System.out.println("0000000");
            System.out.println("https://api.sjtu.edu.cn/v1/me/lessons/" + term + "?access_token=" + accessToken);
            HttpResponse<String> response2 = Unirest.get("https://api.sjtu.edu.cn/v1/me/lessons/" + term + "?access_token=" + accessToken).asString();
            JSONObject responseBody2 = new JSONObject(response2.getBody());
            System.out.println("111111");

            // 课程
            Object classes = responseBody2.get("entities");
            classes.toString();
            System.out.println(classes);

            for (int i = 0; i < ((JSONArray) classes).length(); i++) {
                //每次循环都是找一门课
//                EventDTO event1 = new EventDTO();
                List<EventDTO> event = new ArrayList<>();

                JSONObject classInfo = ((JSONArray) classes).getJSONObject(i);

                //设置 courseID 和 courseName
//                JSONObject course = (JSONObject) classInfo.get("course");
//                event1.setCourseCode(course.getString("code"));
//                event1.setEventName(course.getString("name"));

                //设置 courseLocation 和 weekRepeat
                Object classTime = classInfo.get("classes");
                classTime.toString();

                List<Integer> date = new ArrayList<>();
                for (int j = 0; j < ((JSONArray) classTime).length(); j++) {
                    JSONObject classTimeInfo = ((JSONArray) classTime).getJSONObject(j);

                    JSONObject classSchedule = (JSONObject) classTimeInfo.get("schedule");

                    if(!date.contains(classSchedule.getInt("day"))){
                        date.add(classSchedule.getInt("day"));
                    }
                }

                List<String> weekRepeat = new ArrayList<>();
                for(int c = 0; c < date.size(); c++){

                    String week = "00000000000000000000";

                    for (int j = 0; j < ((JSONArray) classTime).length(); j++) {
                        JSONObject classTimeInfo = ((JSONArray) classTime).getJSONObject(j);

                        JSONObject classSchedule = (JSONObject) classTimeInfo.get("schedule");

                        int week1 = (int) classSchedule.get("week");
                        if(classSchedule.get("day") == date.get(c)){
                            if (week1 == 0){
                                String tmp = "1" + week.substring(1);
                                week = tmp;
                            }else{
                                String tmp = week.substring(0,week1) + "1" + week.substring(week1+1);
                                week = tmp;
                            }
                        }
                    }

                    weekRepeat.add(week);
                }

                List<Integer> period = new ArrayList<>();

                for(int c = 0; c < date.size(); c++){

                    DayRepeat day = new DayRepeat();
                    List<DayRepeat> dayRepeat = new ArrayList<>();
                    EventDTO event1 = new EventDTO();

                    JSONObject cse = (JSONObject) classInfo.get("course");
                    event1.setCourseCode(cse.getString("code"));
                    event1.setEventName(cse.getString("name"));

                    period.clear();
                    for (int j = 0; j < ((JSONArray) classTime).length(); j++) {
                        JSONObject classTimeInfo = ((JSONArray) classTime).getJSONObject(j);

                        JSONObject classSchedule = (JSONObject) classTimeInfo.get("schedule");
                        int pp = (int) classSchedule.get("period");
                        if(classSchedule.get("day") == date.get(c)){
                            period.add(pp);
                        }
                    }
                    Integer s = 1000;
                    Integer e = 0;
                    for(Integer jj : period){
                        if(jj < s)
                            s = jj;
                        if(jj > e)
                            e = jj;
                    }
                    day.setDate(date.get(c)+1);
                    day.setStartTimeNumber(s+1);
                    day.setEndTimeNumber(e+1);

                    dayRepeat.add(day);

                    event1.setDayRepeat(dayRepeat);
                    event1.setWeekRepeat(weekRepeat.get(c));

                    for (int j = 0; j < ((JSONArray) classTime).length(); j++) {
                        JSONObject classTimeInfo = ((JSONArray) classTime).getJSONObject(j);

                        JSONObject classClassroom = (JSONObject) classTimeInfo.get("classroom");

                        if (event1.getEventLocation() == null){
                            event1.setEventLocation( classClassroom.getString("name"));
                        }else if (!event1.getEventLocation().contains(classClassroom.getString("name"))) {
                            event1.setEventLocation(event1.getEventLocation() + " " + classClassroom.getString("name"));
                        }
                    }
                    event.add(event1);
                }

                for(int j = 0; j < event.size(); j++){
                    events.add(event.get(j));
                }
            }

            //Debug
            for(int i = 0; i < events.size(); i++){
                System.out.println(events.get(i).getEventName());
                System.out.println(events.get(i).getEventLocation());
                System.out.println(events.get(i).getWeekRepeat());
                System.out.println(events.get(i).getDayRepeat().get(0).getDate());
                System.out.println(events.get(i).getDayRepeat().get(0).getStartTimeNumber());
                System.out.println(events.get(i).getDayRepeat().get(0).getEndTimeNumber());
            }

        } catch (UnirestException | JSONException e) {
            throw new AuthenticationException("Request Lesson failed");
        }

        Logger log = LoggerFactory.getLogger(EventController.class);
        eventTable.setDoneImport(true);
        eventTableService.saveEventTable(eventTable);
        log.info("user"+user.getUserID());
        log.info("TableID: " + tableID);
        log.info("eventTable: " + eventTable.getTableName());
        for (EventDTO eventDTO : events) {
            log.info(String.valueOf(eventDTO.getDayRepeat().size()));
            boolean type = false;
            boolean isImportant = false;
            Integer eventID = 0;
            String eventName = eventDTO.getEventName();
            String eventLocation = eventDTO.getEventLocation();
            String courseCode = eventDTO.getCourseCode();
            String weekRepeat = eventDTO.getWeekRepeat();
            if (weekRepeat.length() < 20) {
                for (int i = weekRepeat.length(); i < 20; i++) {
                    weekRepeat += '0';
                }
            }
            List<DayRepeat> dayRepeats = eventDTO.getDayRepeat();
            int date;
            int startTimeNumber = 0;
            int endTimeNumber = 0;
            String startTime = null;
            String endTime = null;
            Event event = null;
            //将dayRepeats读取出来，后续存入eventtime
            //要先找到对应的event，如果是0则新建，否则找到对应的event
            event = new Event();
            event.setType(type);
            event.setEventName(eventName);
            event.setEventLocation(eventLocation);
            event.setCourseCode(courseCode);
            event.setWeek(weekRepeat);
            event.setIsImportant(isImportant);
            event.setEventTable(eventTable);
            eventService.saveEvent(event);
            //遍历dayRepeats，把一个Dayrepeat对应存一列eventtime并保存到数据库中
            for (DayRepeat dayRepeat : dayRepeats) {
                EventTime eventTime = new EventTime();
                eventTime.setDate(dayRepeat.getDate());
                startTimeNumber = dayRepeat.getStartTimeNumber();
                endTimeNumber = dayRepeat.getEndTimeNumber();
                startTime = dayRepeat.getStartTime();
                endTime = dayRepeat.getEndTime();
                //先存入节数，再根据节数算出对应的课程时间，将所有内容都进行存入
                eventTime.setStartTimeNumber(startTimeNumber);
                eventTime.setEndTimeNumber(endTimeNumber);
                //根据courseTimeTable算出对应的课程时间
                String[] bothTime = MyUtils.getBothTimeByTwoNumber(eventTable, startTimeNumber, endTimeNumber, courseTimeTableService);
                startTime = bothTime[0];
                endTime = bothTime[1];
                eventTime.setStartTime(startTime);
                eventTime.setEndTime(endTime);
                eventTime.setEvent(event);
                eventTimeService.save(eventTime);
            }
        }
    }
}


