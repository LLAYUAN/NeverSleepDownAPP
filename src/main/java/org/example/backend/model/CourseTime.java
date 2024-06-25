package org.example.backend.model;

public class CourseTime {
    private String startTime;
    private String endTime;
    public CourseTime() {
    }
    public CourseTime(String startTime,String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
}