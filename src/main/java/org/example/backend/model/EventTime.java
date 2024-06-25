package org.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "eventtime")
public class EventTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eventtime_id")
    private Integer eventTimeID;

    @Column(name = "date")
    private Integer date;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    //课程节数，如果是日程则为0，方便进行计算
    @Column(name = "starttime_number")
    private Integer startTimeNumber;

    @Column(name = "endtime_number")
    private Integer endTimeNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    public EventTime() {
    }

    public EventTime(Integer date, String startTime, String endTime,Integer startTimeNumber,Integer endTimeNumber) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startTimeNumber = startTimeNumber;
        this.endTimeNumber = endTimeNumber;
    }

    // getters
    public Integer getEventTimeID() { return eventTimeID; }
    public Integer getDate() { return date; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public Integer getStartTimeNumber() { return startTimeNumber; }
    public Integer getEndTimeNumber() { return endTimeNumber; }

    // setters
    public void setEventTimeID(Integer eventTimeID) { this.eventTimeID = eventTimeID; }
    public void setDate(Integer date) { this.date = date; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public void setStartTimeNumber(Integer startTimeNumber) { this.startTimeNumber = startTimeNumber; }
    public void setEndTimeNumber(Integer endTimeNumber) { this.endTimeNumber = endTimeNumber; }
    public void setEvent(Event event) { this.event = event; }
    public void detach() { this.event.getEventTimes().remove(this); }
    public Event getEvent() { return event; }
}
