package org.example.backend.service;

import org.example.backend.repository.EventTimeRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.backend.repository.EventRepository;
import org.springframework.transaction.annotation.Transactional;
import org.example.backend.model.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final EventTimeService eventTimeService;

    @Autowired
    public EventService(EventRepository eventRepository, EventTimeService eventTimeService) {
        this.eventRepository = eventRepository;
        this.eventTimeService = eventTimeService;
    }

    //从数据库中根据eventID进行删除
    public void deleteEventByEventID(int eventID) {
        eventRepository.deleteByEventID(eventID);
    }

//    public void adaptAllSchedules(EventTable eventTable, Date newFirstDayDate){
//        //计算出新的第一天和之前的第一天之间差几周，然后将每个日程的weekrepeat进行调整
//        int weekDiff = MyUtils.getWeekDiff(eventTable.getFirstDayDate(),newFirstDayDate);
//        System.out.println("weekDiff: " + weekDiff);
//        for(Event event : eventTable.getEvents()){
//            if(event.getType()){
//                String oldweekRepeat = event.getWeek();
//                String newWeekRepeat = "";
//                for(int i = 0; i < eventTable.getWeekAmount(); i++){
//                    //将所有位设置成"0"
//                    newWeekRepeat += '0';
//                }
//                for(int i = 0; i < eventTable.getWeekAmount() && i < oldweekRepeat.length() ; i++){
//                    if(i + weekDiff < eventTable.getWeekAmount() && i + weekDiff >= 0 && oldweekRepeat.charAt(i) == '1'){
//                        int newWeek = i + weekDiff;
//                        //将newWeekRepeat的第newWeek位从0更改为1
//                        newWeekRepeat = newWeekRepeat.substring(0,newWeek) + '1' + newWeekRepeat.substring(newWeek + 1);
//                    }
//                }
//            }
//        }
//    }

    public void saveEvent(Event event) {
        eventRepository.save(event);
    }

    public void delete(Event event) {
//        event.detach();
        List<EventTime> eventTimesToDelete = new ArrayList<>();
        for (EventTime eventTime : event.getEventTimes()) {
            eventTimesToDelete.add(eventTime);
        }
        // 删除临时集合中的 EventTime
        for (EventTime eventTime : eventTimesToDelete) {
//            event.getEventTimes().remove(eventTime);
            eventTimeService.delete(eventTime);
        }
        //删除event本身
        eventRepository.delete(event);
    }

    public void deleteByEventID(int eventID) {
        eventRepository.deleteByEventID(eventID);
    }

    public List<Event> findByEventNameContaining(String eventName, EventTable eventTable) {
        return eventRepository.findByEventNameContainingAndEventTable(eventName, eventTable);
    }

    public void updateTime(Event event,CourseTimeTable courseTimeTable){
        for(EventTime eventTime : event.getEventTimes()){
            String[] bothTime = MyUtils.getBothTimeWithCourseTimeTable(eventTime.getStartTimeNumber(),eventTime.getEndTimeNumber(),courseTimeTable);
            String startTime = bothTime[0];
            String endTime = bothTime[1];
            eventTime.setStartTime(startTime);
            eventTime.setEndTime(endTime);
            eventTime.setEvent(event);
            eventTimeService.save(eventTime);
        }
    }

    public ResponsetoChangeEventInfo checkEventTable(Boolean type,EventTable eventTable, Set<DayRepeat> dayRepeats,String weekRepeat){
        Logger log = org.slf4j.LoggerFactory.getLogger(EventTableService.class);
        CourseTimeTable courseTimeTable = eventTable.getCourseTimeTable();
        Set<Event> events = eventTable.getEvents();
        if(events.size() == 0){
            return new ResponsetoChangeEventInfo("",false);
        }
        log.info("开始检查事件表");
        int commonWeek = 0;
        for(Event event : events){
            log.info(event.getEventName());
            //如果要添加的是课程，则只考虑与其他课程的冲突情况
            if(!type && event.getType()) {
                log.info("是课程，不在乎日程");
                continue;
            }
            //先比较两个weekrepeat有没有重合的周数
            commonWeek = MyUtils.hasCommonWeek(weekRepeat,event.getWeek());
            if(commonWeek == 0){
                log.info("没有重复周");
                continue;
            }
            //如果有重复周，则查看有没有重复的date
            for(EventTime eventTime : event.getEventTimes()){
                //先检查有没有和dayrepeats里面重复的date
                for(DayRepeat dayRepeat : dayRepeats){
                    if(dayRepeat.getDate() == eventTime.getDate()){
                        //如果有重复的date，则检查时间是否重复，如果重复返回true
                        if(MyUtils.isTimeRepeat(dayRepeat.getStartTime(),dayRepeat.getEndTime(),eventTime.getStartTime(),eventTime.getEndTime())) {
                            String message;
                            if(event.getType())
                                 message = "您在第" + commonWeek + "周第" + eventTime.getDate() + "天的"+ eventTime.getStartTime() + "到" + eventTime.getEndTime() +"有日程 " + event.getEventName() + "与待加入事件有时间冲突，是否确定添加？";
                            else
                                message = "您在第" + commonWeek + "周第" + eventTime.getDate() + "天的"+ eventTime.getStartTime() + "到" + eventTime.getEndTime() +"有课程 " + event.getEventName() + "与待加入事件有时间冲突，是否确定添加？";
                            return new ResponsetoChangeEventInfo(message, true);
                        }
                    }
                }
            }
        }
        return new ResponsetoChangeEventInfo("",false);
    }
}
