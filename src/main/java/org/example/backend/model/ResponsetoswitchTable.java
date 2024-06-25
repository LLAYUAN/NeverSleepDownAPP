package org.example.backend.model;

import org.springframework.data.relational.core.sql.In;

import java.util.ArrayList;
import java.util.List;

public class ResponsetoswitchTable {
    private int code;

    public class Data {

        public class CourseTimeItem {
            private String startTime;
            private String endTime;
            // getters
            public String getStartTime() { return startTime; }
            public String getEndTime() { return endTime; }
            // setters
            public void setStartTime(String startTime) { this.startTime = startTime; }
            public void setEndTime(String endTime) { this.endTime = endTime; }

            CourseTimeItem(String startTime,String endTime){
                this.startTime = startTime;
                this.endTime = endTime;
            }

            CourseTimeItem(){
            }
        }

        private String Cookie;
        private Integer tableId;
        private Integer courseNum;
        private List<CourseTimeItem> courseTime;

        public Data() {
            courseTime = new ArrayList<CourseTimeItem>();
        }

        // getters
        public String getCookie() {
            return Cookie;
        }
        public Integer getTableId() {
            return tableId;
        }
        public Integer getCourseNum() {
            return courseNum;
        }
        public List<CourseTimeItem> getCourseTime() {
            return courseTime;
        }

        // setters
        public void setCookie(String Cookie) {
            this.Cookie = Cookie;
        }
        public void setTableId(Integer tableId) {
            this.tableId = tableId;
        }
        public void setCourseNum(Integer courseNum) {
            this.courseNum = courseNum;
        }
        public void setCourseTime(List<CourseTimeItem> courseTime) {
            this.courseTime = courseTime;
        }
        public void addCourseTime(String startTime,String endTime){
            CourseTimeItem courseTimeItem = new CourseTimeItem(startTime,endTime);
            this.courseTime.add(courseTimeItem);
        }
    }

    private Data data;

    public ResponsetoswitchTable() {
    }

    // getters
    public int getCode() {
        return code;
    }

    public Data getData() {
        return data;
    }

    // setters
    public void setCode(int value) {
        this.code = value;
    }

    public void setData(String Cookie, Integer tableId,CourseTimeTable courseTimeTable) {
        this.data = new Data();
        data.setCookie(Cookie);
        data.setTableId(tableId);
        Integer courseNumber = courseTimeTable.getCourseNumber();
        data.setCourseNum(courseNumber);
        for(int i = 0;i < courseNumber;i++){
            switch (i){
                case 0:
                    this.data.addCourseTime(courseTimeTable.getTime1(),courseTimeTable.getTime2());
                    break;
                case 1:
                    this.data.addCourseTime(courseTimeTable.getTime3(),courseTimeTable.getTime4());
                    break;
                case 2:
                    this.data.addCourseTime(courseTimeTable.getTime5(),courseTimeTable.getTime6());
                    break;
                case 3:
                    this.data.addCourseTime(courseTimeTable.getTime7(),courseTimeTable.getTime8());
                    break;
                case 4:
                    this.data.addCourseTime(courseTimeTable.getTime9(),courseTimeTable.getTime10());
                    break;
                case 5:
                    this.data.addCourseTime(courseTimeTable.getTime11(),courseTimeTable.getTime12());
                    break;
                case 6:
                    this.data.addCourseTime(courseTimeTable.getTime13(),courseTimeTable.getTime14());
                    break;
                case 7:
                    this.data.addCourseTime(courseTimeTable.getTime15(),courseTimeTable.getTime16());
                    break;
                case 8:
                    this.data.addCourseTime(courseTimeTable.getTime17(),courseTimeTable.getTime18());
                    break;
                case 9:
                    this.data.addCourseTime(courseTimeTable.getTime19(),courseTimeTable.getTime20());
                    break;
                case 10:
                    this.data.addCourseTime(courseTimeTable.getTime21(),courseTimeTable.getTime22());
                    break;
                case 11:
                    this.data.addCourseTime(courseTimeTable.getTime23(),courseTimeTable.getTime24());
                    break;
                case 12:
                    this.data.addCourseTime(courseTimeTable.getTime25(),courseTimeTable.getTime26());
                    break;
                case 13:
                    this.data.addCourseTime(courseTimeTable.getTime27(),courseTimeTable.getTime28());
                    break;
                case 14:
                    this.data.addCourseTime(courseTimeTable.getTime29(),courseTimeTable.getTime30());
                    break;
                case 15:
                    this.data.addCourseTime(courseTimeTable.getTime31(),courseTimeTable.getTime32());
                    break;
                case 16:
                    this.data.addCourseTime(courseTimeTable.getTime33(),courseTimeTable.getTime34());
                    break;
                case 17:
                    this.data.addCourseTime(courseTimeTable.getTime35(),courseTimeTable.getTime36());
                    break;
                case 18:
                    this.data.addCourseTime(courseTimeTable.getTime37(),courseTimeTable.getTime38());
                    break;
                case 19:
                    this.data.addCourseTime(courseTimeTable.getTime39(),courseTimeTable.getTime40());
                    break;
            }
        }
    }
}
