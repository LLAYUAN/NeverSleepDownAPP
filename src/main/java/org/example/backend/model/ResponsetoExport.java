package org.example.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponsetoExport {
    @Data
    class CoursePDF{
        Integer date;
        String eventName;
        String eventLocation;
        String courseCode;
        Integer startTimeNumber;
        Integer endTimeNumber;
    }
    List<CoursePDF> courses;
    public ResponsetoExport(){
        courses = null;
    }
    public void addCourses(Event event,EventTime eventTime){
        if(courses == null){
            courses = new ArrayList<>();
        }
        CoursePDF coursePDF = new CoursePDF();
        coursePDF.setDate(eventTime.getDate());
        coursePDF.setEventName(event.getEventName());
        coursePDF.setEventLocation(event.getEventLocation());
        coursePDF.setCourseCode(event.getCourseCode());
        coursePDF.setStartTimeNumber(eventTime.getStartTimeNumber());
        coursePDF.setEndTimeNumber(eventTime.getEndTimeNumber());
        courses.add(coursePDF);
    }
}
