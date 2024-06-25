package org.example.backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventID;

    @Column(name = "type")
    private boolean type;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_location")
    private String eventLocation;

    @Column(name = "course_code")
    private String courseCode;

    @Column(name = "is_important")
    private boolean isImportant;

    @Column(name = "week")
    private String week;

    @Column(name = "note")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eventtable_id")
    private EventTable eventTable;

    @OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Set<EventTime> eventTimes;

    public Event() {
        this.type = true;
        this.eventName = "事件名";
        this.eventLocation = "事件地点";
        this.courseCode = "课程代码";
        this.isImportant = false;
        this.week = "00000000000000000000";
        this.note = "";
    }

    //不需要声明id，因为generationtype会自动生成id
    public Event(boolean type, String eventName, String eventLocation, String courseCode, boolean isImportant, String week) {
        this.type = type;
        this.eventName = eventName;
        this.eventLocation = eventLocation;
        this.courseCode = courseCode;
        this.isImportant = isImportant;
        this.week = week;
    }

    // getters
    public Integer getEventID() { return eventID; }
    public boolean getType() { return type; }
    public String getEventName() { return eventName; }
    public String getEventLocation() { return eventLocation; }
    public String getCourseCode() { return courseCode; }
    public boolean getIsImportant() { return isImportant; }
    public String getWeek() { return week; }
    public String getNote() { return note; }

    // setters
    public void setEventID(Integer eventID) { this.eventID = eventID; }
    public void setType(boolean type) { this.type = type; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    public void setEventLocation(String eventLocation) { this.eventLocation = eventLocation; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public void setIsImportant(boolean isImportant) { this.isImportant = isImportant; }
    public void setWeek(String week) { this.week = week; }
    public void setEventTable(EventTable eventTable) { this.eventTable = eventTable; }
    public EventTable getEventTable() { return eventTable; }
    public Set<EventTime> getEventTimes() { return eventTimes; }
    public void setEventTimes(Set<EventTime> eventTimes) { this.eventTimes = eventTimes; }
    public void detach() {
        if(this.eventTable != null)
        this.eventTable.getEvents().remove(this);
    }
    public void setNote(String note) { this.note = note; }
}
