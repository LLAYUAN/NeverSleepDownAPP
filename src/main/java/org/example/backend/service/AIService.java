package org.example.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Data;
import org.example.backend.model.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Set;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {
    @Autowired
    private EventService eventService;

    @Autowired
    private EventTableService eventTableService;

    @Autowired
    private ObjectMapper objectMapper;

    @Data
    public class DataforEvent{
        private Integer eventID;
        private String eventName;
        private String eventLocation;
//        private List<Integer> week;
        private String weekRepeat;
        private List<DayRepeat> dayRepeat;
        private String courseCode;
        private Boolean isDirectlySave;
        private Boolean isImportant;
        private Boolean type;
        private String eventDate;
        private String timeNum;
        private Integer dayRepeatNum;
        private String endTime;
        private String startTime;

        public DataforEvent() {
            type = false;
            isDirectlySave = false;
            isImportant = false;
            dayRepeatNum = 0;
            endTime = "";
            startTime = "";
//            week = new ArrayList<>();
            dayRepeat = null;
            eventID = 0;
            eventName = "";
            eventLocation = "";
            courseCode = "";
            //先把weekRepeat默认的null清空
            weekRepeat = "";

            for(int i = 0; i < 20;i++){
                weekRepeat += "0";
            }
            System.out.println(weekRepeat);
//            Date nowDate = new Date(System.currentTimeMillis());
//            LocalDate firstDay = nowDate.toLocalDate();
//            firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
            eventDate = "";
        }

        public void addDayRepeatforCourse(JsonNode dayRepeat) {
            //如果dayRepeat未开辟空间，则开辟
            if(this.dayRepeat == null) {
                this.dayRepeat = new ArrayList<>();
            }
            Date nowDate = new Date(System.currentTimeMillis());
            LocalDate firstDay = nowDate.toLocalDate();
            int date = dayRepeat.get("date").asInt();
            switch (date){
                case 1:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
                    break;
                case 2:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.TUESDAY));
                    break;
                case 3:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.WEDNESDAY));
                    break;
                case 4:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.THURSDAY));
                    break;
                case 5:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.FRIDAY));
                    break;
                case 6:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.SATURDAY));
                    break;
                case 7:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.SUNDAY));
                    break;
                default:
                    break;
            }
            //转回Date
            Date firstday = Date.valueOf(firstDay);
            eventDate = MyUtils.dateToString(firstday);
            DayRepeat newDayRepeat = new DayRepeat();
            newDayRepeat.setDate(date);
            int startTimeNumber = dayRepeat.get("startTimeNumber").asInt();
            int endTimeNumber = dayRepeat.get("endTimeNumber").asInt();
            // 如果starttimenumber为1，endTimeNumber为4，则将timeNum写为"1,2,3,4"
            timeNum = "";
            for(int i = startTimeNumber; i <= endTimeNumber; i++) {
                if(i == endTimeNumber)
                    timeNum += i;
                else
                    timeNum += i + ",";
            }
            newDayRepeat.setStartTimeNumber(startTimeNumber);
            newDayRepeat.setEndTimeNumber(endTimeNumber);
            newDayRepeat.setEndTime("");
            newDayRepeat.setStartTime("");
            this.dayRepeat.add(newDayRepeat);
        }

        public void addDayRepeatforSchedule(JsonNode dayRepeat) {
            if(this.dayRepeat == null) {
                this.dayRepeat = new ArrayList<>();
            }
            Date nowDate = new Date(System.currentTimeMillis());
            LocalDate firstDay = nowDate.toLocalDate();
            int date = dayRepeat.get("date").asInt();
            switch (date){
                case 1:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
                    break;
                case 2:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.TUESDAY));
                    break;
                case 3:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.WEDNESDAY));
                    break;
                case 4:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.THURSDAY));
                    break;
                case 5:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.FRIDAY));
                    break;
                case 6:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.SATURDAY));
                    break;
                case 7:
                    firstDay = firstDay.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.SUNDAY));
                    break;
                default:
                    break;
            }
            //转回Date
            Date firstday = Date.valueOf(firstDay);
            eventDate = MyUtils.dateToString(firstday);
            DayRepeat newDayRepeat = new DayRepeat();
            newDayRepeat.setDate(dayRepeat.get("date").asInt());
            timeNum = "";
            String startTime = dayRepeat.get("startTime").asText();
            String endTime = dayRepeat.get("endTime").asText();
            newDayRepeat.setStartTime(startTime);
            newDayRepeat.setEndTime(endTime);
            this.startTime = startTime;
            this.endTime = endTime;
            newDayRepeat.setStartTimeNumber(0);
            newDayRepeat.setEndTimeNumber(0);
            this.dayRepeat.add(newDayRepeat);
        }
        public void addWeek(Integer week) {
            if(week >= 0 && week < 20)
            this.weekRepeat = this.weekRepeat.substring(0,week) + "1" + this.weekRepeat.substring(week+1);
        }
    }

    public ResponseAI newCourse(JsonNode jsonNode, Integer tableID) {
        Logger log = org.slf4j.LoggerFactory.getLogger(AIService.class);
        EventTable eventTable = eventTableService.getByTableID(tableID);
        String weekRepeat = jsonNode.get("weekRepeat").asText();
        //认为周数从0开始，到weekAmount-1
        log.info("weekRepeat: " + weekRepeat);
        DataforEvent data = new DataforEvent();
        if(weekRepeat.equals("每周")) {
            for(int i = 0; i < eventTable.getWeekAmount(); i++) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("单周")) {
            for(int i = 0; i < eventTable.getWeekAmount(); i+=2) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("双周")) {
            for(int i = 1; i < eventTable.getWeekAmount(); i+=2) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("本周")) {
            //获得当前时间，然后计算出当前周数
            Date todayDate = new Date(System.currentTimeMillis());
            int weekNow = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(),todayDate)[0]-1;
            data.addWeek(weekNow);
        } else if(weekRepeat.equals("下周")) {
            Date todayDate = new Date(System.currentTimeMillis());
            int weekNext = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(),todayDate)[0];
            data.addWeek(weekNext);
        } else {
            log.info("no weekRepeat");
            weekRepeat = "";
            JsonNode weekNode = jsonNode.get("week");
            if(weekNode.isArray()){
                log.info("weekNode is array");
                for(JsonNode weekNumber : weekNode) {
                    log.info("weekNumber: " + weekNumber.asInt());
                    data.addWeek(weekNumber.asInt() - 1);
                }
            }
        }
        String eventName = jsonNode.get("eventName").asText();
        String eventLocation = jsonNode.get("eventLocation").asText();
        data.setEventName(eventName);
        data.setEventLocation(eventLocation);
        JsonNode dayRepeat = jsonNode.get("dayRepeat");
        if(dayRepeat.isArray()) {
            if(dayRepeat.size() == 7) {
                data.setDayRepeatNum(7);
                for (JsonNode dayRepeatNode : dayRepeat) {
                    data.addDayRepeatforCourse(dayRepeatNode);
                }
            }
            else if(dayRepeat.size() == 0){
                data.setDayRepeatNum(0);
            }
            else {
                // 只将第一个元素加入
                data.setDayRepeatNum(1);
                data.addDayRepeatforCourse(dayRepeat.get(0));
            }
        }
        return new ResponseAI<DataforEvent>(0,data);
    }

    public ResponseAI newSchedule(JsonNode jsonNode,Integer tableID) {
        Logger log = org.slf4j.LoggerFactory.getLogger(AIService.class);
        EventTable eventTable = eventTableService.getByTableID(tableID);
        String weekRepeat = jsonNode.get("weekRepeat").asText();
//        List<Integer> week = new ArrayList<>();

        //认为周数从0开始，到weekAmount-1
        log.info("weekRepeat: " + weekRepeat);
        DataforEvent data = new DataforEvent();
        if(weekRepeat.equals("每周")) {
            for(int i = 0; i < eventTable.getWeekAmount(); i++) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("单周")) {
            for(int i = 0; i < eventTable.getWeekAmount(); i+=2) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("双周")) {
            for(int i = 1; i < eventTable.getWeekAmount(); i+=2) {
                data.addWeek(i);
            }
        } else if(weekRepeat.equals("本周")) {
            //获得当前时间，然后计算出当前周数
            Date todayDate = new Date(System.currentTimeMillis());
            int weekNow = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(),todayDate)[0]-1;
            data.addWeek(weekNow);
        } else if(weekRepeat.equals("下周")) {
            Date todayDate = new Date(System.currentTimeMillis());
            int weekNext = MyUtils.DateToWeekandDay(eventTable.getFirstDayDate(),todayDate)[0];
            data.addWeek(weekNext);
        } else {
            weekRepeat = "";
            JsonNode weekNode = jsonNode.get("week");
            if(weekNode.isArray()){
                for(JsonNode weekNumber : weekNode) {
                    log.info("weekNumber: " + weekNumber.asInt());
                    data.addWeek(weekNumber.asInt()-1);
                }
            }
        }
        String eventName = jsonNode.get("eventName").asText();
        String eventLocation = jsonNode.get("eventLocation").asText();
        data.setEventName(eventName);
        data.setEventLocation(eventLocation);
        data.setType(true);
        JsonNode dayRepeat = jsonNode.get("dayRepeat");
        if(dayRepeat.isArray()) {
            if(dayRepeat.size() == 7) {
                data.setDayRepeatNum(7);
                for (JsonNode dayRepeatNode : dayRepeat) {
                    data.addDayRepeatforSchedule(dayRepeatNode);
                }
            }
            else if(dayRepeat.size() == 0){
                data.setDayRepeatNum(0);
            }
            else {
                // 只将第一个元素加入
                data.setDayRepeatNum(1);
                data.addDayRepeatforSchedule(dayRepeat.get(0));
            }
        }
        return new ResponseAI<DataforEvent>(0,data);
    }

    public ResponseAI switchTable(String tableName,User user) {
        @Data
        class DataForSwitchTable {
            private Integer tableID;
            private String message;
            public DataForSwitchTable(String message, Integer tableID) {
                this.message = message;
                this.tableID = tableID;
            }
            public DataForSwitchTable(){
                this.message = "没有找到您要切换的工作表";
                this.tableID = 0;
            }
        }
        DataForSwitchTable data = new DataForSwitchTable();
        List<EventTable> eventTabless = eventTableService.findByTableNameContaining(tableName,user);
        if(eventTabless.isEmpty()) {
            return new ResponseAI<DataForSwitchTable>(2,data);
        }
        EventTable eventTable = eventTabless.get(0);

        data.setTableID(eventTable.getTableID());
        String message = "是否切换到工作表：\"" + eventTable.getTableName() +"\"？";
        data.setMessage(message);
        return new ResponseAI<DataForSwitchTable>(2,data);
    }

    public ResponseAI createTable(JsonNode jsonNode, User user) {
        @Data
        class DataForCreateTable {
            private String tableName;
            private String font;
            private Integer weekAmount;
            private String message;
            public DataForCreateTable(String tableName, String font, Integer weekAmount,String message) {
                this.tableName = tableName;
                this.font = font;
                this.weekAmount = weekAmount;
                this.message = message;
            }
        }
        String tableName = jsonNode.get("tableName").asText();
        String font = jsonNode.get("font").asText();
        Integer weekAmount = jsonNode.get("weekAmount").asInt();
        String message = "是否创建工作表：\"" + tableName + "\"？";
        DataForCreateTable data = new DataForCreateTable(tableName,font,weekAmount,message);
        return new ResponseAI<DataForCreateTable>(3,data);
    }

    public ResponseAI deleteEvent(JsonNode jsonNode,EventTable eventTable) {
        @Data
        class DataForDeleteEvent {
            private Integer eventID;
            private String message;
            public DataForDeleteEvent(Integer eventID,String message) {
                this.eventID = eventID;
                this.message = message;
            }
        }
        String eventName = jsonNode.get("eventName").asText();
        List<Event> events = eventService.findByEventNameContaining(eventName,eventTable);
        DataForDeleteEvent data;
        if(events.isEmpty()) {
            data = new DataForDeleteEvent(0,"没有找到您要删除的日程或课程：\""+eventName+"\"。");
            return new ResponseAI(4,data);
        }
        //取第一个元素
        Event event = events.get(0);
        Integer eventID = event.getEventID();
        String message;
        if(event.getType())
            message = "是否删除日程：\"" + event.getEventName() + "\"？";
        else
            message = "是否删除课程：\"" + event.getEventName() + "\"？";
        data = new DataForDeleteEvent(eventID,message);
        return new ResponseAI<DataForDeleteEvent>(4,data);
    }

    public ResponseAI deleteTable(JsonNode jsonNode,User user) {
        @Data
        class DataForDeleteTable {
            private Integer tableID;
            private String message;
            public DataForDeleteTable(Integer tableID,String message) {
                this.tableID = tableID;
                this.message = message;
            }
        }
        String tableName = jsonNode.get("tableName").asText();
        List<EventTable> eventTables = eventTableService.findByTableNameContaining(tableName,user);
        if(eventTables.isEmpty()) {
            DataForDeleteTable data = new DataForDeleteTable(0,"没有找到您要删除的工作表：\""+tableName+"\"。");
            return new ResponseAI(5,data);
        }
        EventTable eventTable = eventTables.get(0);
        DataForDeleteTable data;
//        if(eventTable.getDefaultTable()) {
//            data = new DataForDeleteTable(eventTable.getTableID(),"默认工作表无法删除。");
//            return new ResponseAI<DataForDeleteTable>(5,data);
//        }
        data = new DataForDeleteTable(eventTable.getTableID(),"是否删除工作表：\"" + eventTable.getTableName() + "\"？");
        return new ResponseAI<DataForDeleteTable>(5,data);
    }

    public ResponseAI defaultSetting() {
        return new ResponseAI(-1,"无法识别");
    }
}
