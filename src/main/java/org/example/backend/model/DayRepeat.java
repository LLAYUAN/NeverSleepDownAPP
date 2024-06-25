package org.example.backend.model;

public class DayRepeat {
    private int date;//记录这节课是周几上
    private String startTime;
    private String endTime;
    private int startTimeNumber;
    private int endTimeNumber;

    public DayRepeat() {
        date = 0;
        startTime = null;
        endTime = null;
        startTimeNumber = 0;
        endTimeNumber = 0;
    }

    public DayRepeat(int date, String startTime, String endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public DayRepeat(int date, int startTimeNumber, int endTimeNumber) {
        this.date = date;
        this.startTimeNumber = startTimeNumber;
        this.endTimeNumber = endTimeNumber;
    }

    public void setCourseDayRepeat(int date,int startTimeNumber,int endTimeNumber){
        this.date = date;
        this.startTimeNumber = startTimeNumber;
        this.endTimeNumber = endTimeNumber;
    }

    public void setEventDayRepeat(int date,String startTime,String endTime){
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // getters
    public int getDate() { return date; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public int getStartTimeNumber() { return startTimeNumber; }
    public int getEndTimeNumber() { return endTimeNumber; }

    // setters
    public void setDate(int date) { this.date = date; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public void setStartTimeNumber(int startTimeNumber) { this.startTimeNumber = startTimeNumber; }
    public void setEndTimeNumber(int endTimeNumber) { this.endTimeNumber = endTimeNumber; }
}
