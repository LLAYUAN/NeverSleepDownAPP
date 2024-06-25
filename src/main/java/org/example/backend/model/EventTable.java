package org.example.backend.model;

import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Set;

@Entity
@Table(name = "eventtable")
public class EventTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tableid")
    private Integer tableID;

    @Column(name = "table_name")
    private String tableName;

    @Column(name = "background")
    private String background;

    @Column(name = "font")
    private String font;

    @Column(name = "course_color")//课程快颜色
    private String courseColor;

    @Column(name = "event_color")//日程块颜色
    private String eventColor;

    @Column(name = "first_day_date")
    private Date firstDayDate;

    @Column(name = "week_amount")
    private Integer weekAmount;

    @Column(name = "defaulttable")
    private boolean defaultTable;

    @Column(name = "done_import")
    private boolean doneImport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "for_userid")
    private User user;

    @OneToMany(mappedBy = "eventTable", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Set<Event> events;

    @OneToOne(mappedBy = "eventTable", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private CourseTimeTable courseTimeTable;

    public EventTable() {
        this.tableName = "默认表";
        this.background = "background.jpg";
        this.font = "微软雅黑";
        this.courseColor = "#002fa7";
        this.eventColor = "#f16326";
        LocalDate localTmpDate = LocalDate.now();

        // 找到当天所在周的周一日期
        localTmpDate = localTmpDate.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));

        // 将 LocalDate 转换成 Date 类型
        this.firstDayDate = java.sql.Date.valueOf(localTmpDate);
        this.weekAmount = 20;
        this.defaultTable = true;
        this.doneImport = false;
    }

    public EventTable(Integer tableID,String tableName, String background, String font, String courseColor, String eventColor, Date firstDayDate, Integer weekAmount,boolean defaultTable) {
        this.tableID = tableID;
        this.tableName = tableName;
        this.background = background;
        this.font = font;
        this.courseColor = courseColor;
        this.eventColor = eventColor;
        this.firstDayDate = firstDayDate;
        this.weekAmount = weekAmount;
        this.defaultTable = false;
//        this.for_userID = for_userID;
    }

    // getters
    public Integer getTableID() { return tableID; }
    public String getTableName() { return tableName; }
    public String getBackground() { return background; }
    public String getFont() { return font; }
    public String getCourseColor() { return courseColor; }
    public String getEventColor() { return eventColor; }
    public Date getFirstDayDate() { return firstDayDate; }
    public Integer getWeekAmount() { return weekAmount; }
//    public String getFor_userID() { return for_userID; }
//    public String getFor_userID() { return user.getUserID(); }
    public User getUser() { return user; }
    public boolean getDefaultTable() { return defaultTable; }
    public CourseTimeTable getCourseTimeTable() { return courseTimeTable; }
    public boolean getDoneImport() { return doneImport; }

    // setters
    public void setTableID(Integer tableID) { this.tableID = tableID; }
    public void setTableName(String tableName) { this.tableName = tableName; }
    public void setBackground(String background) { this.background = background; }
    public void setFont(String font) { this.font = font; }
    public void setCourseColor(String courseColor) { this.courseColor = courseColor; }
    public void setEventColor(String eventColor) { this.eventColor = eventColor; }
    public void setFirstDayDate(Date firstDayDate) { this.firstDayDate = firstDayDate; }
    public void setEvents(Set<Event> events) { this.events = events; }
    public void setWeekAmount(Integer weekAmount) { this.weekAmount = weekAmount; }
//    public void setFor_userID(String for_userID) { this.for_userID = for_userID; }
    public void setUser(User user) {
        this.user = user;
    }
    public void setDefaultTable(boolean defaultTable) { this.defaultTable = defaultTable; }
    public void setCourseTimeTable(CourseTimeTable courseTimeTable) { this.courseTimeTable = courseTimeTable; }
    public void setDoneImport(boolean doneImport) { this.doneImport = doneImport; }
//    public void detach(){
//        this.user.getEventTables().remove(this);
//    }
    public Set<Event> getEvents() { return events; }
    public Event getEventByEventID(Integer eventID) {
        for (Event event : events) {
            if (event.getEventID().equals(eventID)) {
                return event;
            }
        }
        return null;
    }
}
