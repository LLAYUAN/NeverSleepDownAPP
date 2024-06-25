package org.example.backend.model;

import org.example.backend.model.DayRepeat;

import java.util.Set;

public class ResponsetoloadEventInfo {
    private int code;

    public class Event{
        private boolean type;
        private int eventID;
        private String eventName;
        private String eventLocation;
        private String courseCode;
        private String weekRepeat;
        private boolean isImportant;
        private Set<DayRepeat> dayRepeat;
        // getters
        public boolean getType() { return type; }
        public int getEventID() { return eventID; }
        public String getEventName() { return eventName; }
        public String getEventLocation() { return eventLocation; }
        public String getCourseCode() { return courseCode; }
        public String getWeekRepeat() { return weekRepeat; }
        public boolean getIsImportant() { return isImportant; }
        public Set<DayRepeat> getDayRepeat() { return dayRepeat; }
        // setters
        public void setType(boolean type) { this.type = type; }
        public void setEventID(int eventID) { this.eventID = eventID; }
        public void setEventName(String eventName) { this.eventName = eventName; }
        public void setEventLocation(String eventLocation) { this.eventLocation = eventLocation; }
        public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
        public void setWeekRepeat(String weekRepeat) { this.weekRepeat = weekRepeat; }
        public void setIsImportant(boolean isImportant) { this.isImportant = isImportant; }
        public void setDayRepeat(Set<DayRepeat> dayRepeat) { this.dayRepeat = dayRepeat; }
    }
    private Event event;

    // getters
    public int getCode() { return code; }
    public Event getEvent() { return event; }

    // setters
    public void setCode(int code) { this.code = code; }
    public void setEvent(org.example.backend.model.Event event,Set<DayRepeat> dayRepeat){
        this.event = new Event();
        this.event.setType(event.getType());
        this.event.setEventID(event.getEventID());
        this.event.setEventName(event.getEventName());
        this.event.setEventLocation(event.getEventLocation());
        this.event.setCourseCode(event.getCourseCode());
        this.event.setWeekRepeat(event.getWeek());
        this.event.setIsImportant(event.getIsImportant());
        this.event.setDayRepeat(dayRepeat);
    }


}
