package org.example.backend.model;

import java.util.ArrayList;
import java.util.List;

public class ResponsetoisPasswordCorrect {
    private int code;

    public class Data {

        public class CourseTimeItem{
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

        private String cookie;
        private boolean isLogin;//1为密码正确，0为密码或用户名错误
        private boolean isFirstLogin;//1为第一次登录，0为非第一次登录
        private int tableID;
        private String tableName;
        private String background;
        private String font;
        private String courseColor;
        private String eventColor;
        private String firstDayDate;
        private Integer weekAmount;
        private Integer courseNum;
        private List<CourseTimeItem> courseTime;
        //TODO：此外还要新建一张空表返回给前端

        // getters
        public String getCookie() { return cookie; }
        public boolean getIsLogin() { return isLogin; }
        public boolean getIsFirstLogin() { return isFirstLogin; }
        public int getTableID() { return tableID; }
        public String getTableName() { return tableName; }
        public String getBackground() { return background; }
        public String getFont() { return font; }
        public String getCourseColor() { return courseColor; }
        public String getEventColor() { return eventColor; }
        public String getFirstDayDate() { return firstDayDate; }
        public Integer getWeekAmount() { return weekAmount; }
        public Integer getCourseNum() { return courseNum; }
        public List<CourseTimeItem> getCourseTime() { return courseTime; }

        // setters
        public void setCookie(String cookie) { this.cookie = cookie; }
        public void setIsLogin(boolean isLogin) { this.isLogin = isLogin; }
        public void setIsFirstLogin(boolean isFirstLogin) { this.isFirstLogin = isFirstLogin; }
        public void setTableID(int tableID) { this.tableID = tableID; }
        public void setTableName(String tableName) { this.tableName = tableName; }
        public void setBackground(String background) { this.background = background; }
        public void setFont(String font) { this.font = font; }
        public void setCourseColor(String courseColor) { this.courseColor = courseColor; }
        public void setEventColor(String eventColor) { this.eventColor = eventColor; }
        public void setFirstDayDate(String firstDayDate) { this.firstDayDate = firstDayDate; }
        public void setWeekAmount(Integer weekAmount) { this.weekAmount = weekAmount; }
        public void setCourseNum(Integer courseNum) { this.courseNum = courseNum; }
        public void setCourseTime(List<CourseTimeItem> courseTime) { this.courseTime = courseTime; }
        public void addCourseTime(String startTime,String endTime){
            CourseTimeItem courseTimeItem = new CourseTimeItem(startTime,endTime);
            this.courseTime.add(courseTimeItem);
        }

        Data() {
            this.courseTime = new ArrayList<CourseTimeItem>();
        }
    }

    private Data data;

    public ResponsetoisPasswordCorrect() {
        this.code = 1; // 默认响应码为1
        this.data = null; // 默认数据为空
    }

    public ResponsetoisPasswordCorrect(int code, Data data,String cookie) {
        this.code = code;
        this.data = data;
    }

    public long getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Data getData() {
        return data;
    }

    public void setData(boolean isLogin,boolean isFirstLogin, int tableID,String cookie,String tableName,String background, String font,String courseColor,String eventColor,String firstDayDate, Integer weekAmount,CourseTimeTable courseTimeTable) {
        this.data = new Data();
        this.data.setIsLogin(isLogin);
        this.data.setIsFirstLogin(isFirstLogin);
        this.data.setTableID(tableID);
        this.data.setCookie(cookie);
        this.data.setTableName(tableName);
        this.data.setBackground(background);
        this.data.setFont(font);
        this.data.setCourseColor(courseColor);
        this.data.setEventColor(eventColor);
        this.data.setFirstDayDate(firstDayDate);
        this.data.setWeekAmount(weekAmount);
        Integer courseNumber = courseTimeTable.getCourseNumber();
        this.data.setCourseNum(courseNumber);
        for(int i=0;i<courseNumber;i++){
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

    public void setFailureData(boolean isLogin, int tableID,String cookie) {
        this.data = new Data();
        this.data.setIsLogin(isLogin);
        this.data.setTableID(tableID);
        this.data.setCookie(cookie);
    }

}
