package org.example.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class EventDTO {
    String eventName;

    String courseCode;

    String eventLocation;

    String weekRepeat;

    List<DayRepeat> dayRepeat;

    public EventDTO()
    {
        dayRepeat = new ArrayList<>();
        eventName = "";
        courseCode = "";
        eventLocation = "";
        weekRepeat = "";
    }

    public EventDTO(String eventName,String courseCode,String eventLocation,String weekRepeat)
    {
        this.eventName=eventName;
        this.courseCode=courseCode;
        this.eventLocation=eventLocation;
        this.weekRepeat=weekRepeat;
        dayRepeat = new ArrayList<>();
    }
}
