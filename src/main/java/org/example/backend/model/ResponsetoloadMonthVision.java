package org.example.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponsetoloadMonthVision {
    private int code;

    @Data
    public class DayInformation{
        //是否有日程
        private Boolean isHaveSchedule;
        //是否有日程
        private Boolean isHaveCourse;
        private Boolean isImportant;
//        private boolean isChanged;
        private Boolean rest;
        private Boolean work;
    }

    private List<DayInformation> dayInformations;
    public ResponsetoloadMonthVision(){
        code = 1;
        dayInformations = new ArrayList<>();
    }
    public void setCode(int code){
        this.code = code;
    }
    public int getCode(){
        return code;
    }
    public void addDayInformation(boolean isHaveSchedule,boolean isHaveCourse,boolean isImportant,boolean rest,boolean work){
        DayInformation dayInformation = new DayInformation();
        dayInformation.setIsHaveSchedule(isHaveSchedule);
        dayInformation.setIsHaveCourse(isHaveCourse);
        dayInformation.setIsImportant(isImportant);
        dayInformation.setRest(rest);
        dayInformation.setWork(work);
        dayInformations.add(dayInformation);
    }

    public List<DayInformation> getDayInformations(){
        return dayInformations;
    }
    public void setDayInformations(List<DayInformation> dayInformations){
        this.dayInformations = dayInformations;
    }
}
