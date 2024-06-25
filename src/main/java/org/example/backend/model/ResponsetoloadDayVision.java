package org.example.backend.model;

import java.util.HashSet;
import java.util.Set;

public class ResponsetoloadDayVision {
    private int code;
    private int weeknow;
    public class EventArr{
        private int eventID;
        private String eventName;
        private boolean type;
        private String eventLocation;
        private String courseCode;
        private String weekRepeat;
        private boolean isImportant;
        private String startTime;
        private String endTime;
        // getters
        public int getEventID() { return eventID; }
        public String getEventName() { return eventName; }
        public String getEventLocation() { return eventLocation; }
        public boolean getType() { return type; }
        public String getCourseCode() { return courseCode; }
        public String getWeekRepeat() { return weekRepeat; }
        public boolean getIsImportant() { return isImportant; }
        public String getStartTime() { return startTime; }
        public String getEndTime() { return endTime; }
        // setters
        public void setEventID(int eventID) { this.eventID = eventID; }
        public void setEventName(String eventName) { this.eventName = eventName; }
        public void setType(boolean type) { this.type = type; }
        public void setEventLocation(String eventLocation) { this.eventLocation = eventLocation; }
        public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
        public void setWeekRepeat(String weekRepeat) { this.weekRepeat = weekRepeat; }
        public void setIsImportant(boolean isImportant) { this.isImportant = isImportant; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
    }
    private Set<EventArr> eventArrs;
    // getters
    public ResponsetoloadDayVision() { eventArrs = new HashSet<>(); code = 1;}
    public int getCode() { return code; }

    public Set<EventArr> getEventArrs() { return eventArrs; }
    // setters
    public void setCode(int code) { this.code = code; }
    public void setEventArrs(Set<EventArr> eventArrs) { this.eventArrs = eventArrs; }
    public void setEventArr(Event event,EventTime eventTime){
        EventArr eventArr = new EventArr();
        eventArr.setEventID(event.getEventID());
        eventArr.setEventName(event.getEventName());
        eventArr.setType(event.getType());
        eventArr.setEventLocation(event.getEventLocation());
        eventArr.setCourseCode(event.getCourseCode());
        eventArr.setWeekRepeat(event.getWeek());
        eventArr.setIsImportant(event.getIsImportant());
        eventArr.setStartTime(eventTime.getStartTime());
        eventArr.setEndTime(eventTime.getEndTime());
        eventArrs.add(eventArr);
    }
    public void setWeeknow(int weeknow) { this.weeknow = weeknow; }
    public int getWeeknow() { return weeknow; }
}
