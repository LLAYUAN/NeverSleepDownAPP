package org.example.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "coursetimetable")
public class CourseTimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //记录该课表一共的课程节数
    @Column(name = "number")
    private Integer courseNumber;

    @OneToOne(fetch = FetchType.EAGER , cascade = CascadeType.REMOVE)
    @JoinColumn(name = "eventtable_id")
    private EventTable eventTable;

    @Column(name = "time1")
    private String time1;

    @Column(name = "time2")
    private String time2;

    @Column(name = "time3")
    private String time3;

    @Column(name = "time4")
    private String time4;

    @Column(name = "time5")
    private String time5;

    @Column(name = "time6")
    private String time6;

    @Column(name = "time7")
    private String time7;

    @Column(name = "time8")
    private String time8;

    @Column(name = "time9")
    private String time9;

    @Column(name = "time10")
    private String time10;

    @Column(name = "time11")
    private String time11;

    @Column(name = "time12")
    private String time12;

    @Column(name = "time13")
    private String time13;

    @Column(name = "time14")
    private String time14;

    @Column(name = "time15")
    private String time15;

    @Column(name = "time16")
    private String time16;

    @Column(name = "time17")
    private String time17;

    @Column(name = "time18")
    private String time18;

    @Column(name = "time19")
    private String time19;

    @Column(name = "time20")
    private String time20;

    @Column(name = "time21")
    private String time21;

    @Column(name = "time22")
    private String time22;

    @Column(name = "time23")
    private String time23;

    @Column(name = "time24")
    private String time24;

    @Column(name = "time25")
    private String time25;

    @Column(name = "time26")
    private String time26;

    @Column(name = "time27")
    private String time27;

    @Column(name = "time28")
    private String time28;

    @Column(name = "time29")
    private String time29;

    @Column(name = "time30")
    private String time30;

    @Column(name = "time31")
    private String time31;

    @Column(name = "time32")
    private String time32;

    @Column(name = "time33")
    private String time33;

    @Column(name = "time34")
    private String time34;

    @Column(name = "time35")
    private String time35;

    @Column(name = "time36")
    private String time36;

    @Column(name = "time37")
    private String time37;

    @Column(name = "time38")
    private String time38;

    @Column(name = "time39")
    private String time39;

    @Column(name = "time40")
    private String time40;

    public CourseTimeTable() {
        this.courseNumber = 12;
        time1 = "08:00:00";
        time2 = "08:45:00";
        time3 = "08:55:00";
        time4 = "09:40:00";
        time5 = "10:00:00";
        time6 = "10:45:00";
        time7 = "10:55:00";
        time8 = "11:40:00";
        time9 = "12:00:00";
        time10 = "12:45:00";
        time11 = "12:55:00";
        time12 = "13:40:00";
        time13 = "14:00:00";
        time14 = "14:45:00";
        time15 = "14:55:00";
        time16 = "15:40:00";
        time17 = "16:00:00";
        time18 = "16:45:00";
        time19 = "16:55:00";
        time20 = "17:40:00";
        time21 = "18:00:00";
        time22 = "18:45:00";
        time23 = "18:55:00";
        time24 = "19:40:00";
        time25 = "20:00:00";
        time26 = "20:45:00";
        time27 = "21:00:00";
        time28 = "21:45:00";
        time29 = "21:55:00";
        time30 = "22:40:00";
        time31 = "23:00:00";
        time32 = "23:00:00";
        time33 = "23:00:00";
        time34 = "23:00:00";
        time35 = "23:00:00";
        time36 = "23:00:00";
        time37 = "23:00:00";
        time38 = "23:00:00";
        time39 = "23:00:00";
        time40 = "23:00:00";
    }

    // getters
    public Integer getId() { return id; }
    public Integer getCourseNumber() { return courseNumber; }
    public Integer getEventTableID() { return eventTable.getTableID(); }
    public String getTime1() { return time1; }
    public String getTime2() { return time2; }
    public String getTime3() { return time3; }
    public String getTime4() { return time4; }
    public String getTime5() { return time5; }
    public String getTime6() { return time6; }
    public String getTime7() { return time7; }
    public String getTime8() { return time8; }
    public String getTime9() { return time9; }
    public String getTime10() { return time10; }
    public String getTime11() { return time11; }
    public String getTime12() { return time12; }
    public String getTime13() { return time13; }
    public String getTime14() { return time14; }
    public String getTime15() { return time15; }
    public String getTime16() { return time16; }
    public String getTime17() { return time17; }
    public String getTime18() { return time18; }
    public String getTime19() { return time19; }
    public String getTime20() { return time20; }
    public String getTime21() { return time21; }
    public String getTime22() { return time22; }
    public String getTime23() { return time23; }
    public String getTime24() { return time24; }
    public String getTime25() { return time25; }
    public String getTime26() { return time26; }
    public String getTime27() { return time27; }
    public String getTime28() { return time28; }
    public String getTime29() { return time29; }
    public String getTime30() { return time30; }
    public String getTime31() { return time31; }
    public String getTime32() { return time32; }
    public String getTime33() { return time33; }
    public String getTime34() { return time34; }
    public String getTime35() { return time35; }
    public String getTime36() { return time36; }
    public String getTime37() { return time37; }
    public String getTime38() { return time38; }
    public String getTime39() { return time39; }
    public String getTime40() { return time40; }

    // setters
    public void setId(Integer id) { this.id = id; }
    public void setCourseNumber(Integer number) { this.courseNumber = number; }
    public void setEventTable(EventTable eventTable) { this.eventTable = eventTable; }
    public void setTime1(String time1) { this.time1 = time1; }
    public void setTime2(String time2) { this.time2 = time2; }
    public void setTime3(String time3) { this.time3 = time3; }
    public void setTime4(String time4) { this.time4 = time4; }
    public void setTime5(String time5) { this.time5 = time5; }
    public void setTime6(String time6) { this.time6 = time6; }
    public void setTime7(String time7) { this.time7 = time7; }
    public void setTime8(String time8) { this.time8 = time8; }
    public void setTime9(String time9) { this.time9 = time9; }
    public void setTime10(String time10) { this.time10 = time10; }
    public void setTime11(String time11) { this.time11 = time11; }
    public void setTime12(String time12) { this.time12 = time12; }
    public void setTime13(String time13) { this.time13 = time13; }
    public void setTime14(String time14) { this.time14 = time14; }
    public void setTime15(String time15) { this.time15 = time15; }
    public void setTime16(String time16) { this.time16 = time16; }
    public void setTime17(String time17) { this.time17 = time17; }
    public void setTime18(String time18) { this.time18 = time18; }
    public void setTime19(String time19) { this.time19 = time19; }
    public void setTime20(String time20) { this.time20 = time20; }
    public void setTime21(String time21) { this.time21 = time21; }
    public void setTime22(String time22) { this.time22 = time22; }
    public void setTime23(String time23) { this.time23 = time23; }
    public void setTime24(String time24) { this.time24 = time24; }
    public void setTime25(String time25) { this.time25 = time25; }
    public void setTime26(String time26) { this.time26 = time26; }
    public void setTime27(String time27) { this.time27 = time27; }
    public void setTime28(String time28) { this.time28 = time28; }
    public void setTime29(String time29) { this.time29 = time29; }
    public void setTime30(String time30) { this.time30 = time30; }
    public void setTime31(String time31) { this.time31 = time31; }
    public void setTime32(String time32) { this.time32 = time32; }
    public void setTime33(String time33) { this.time33 = time33; }
    public void setTime34(String time34) { this.time34 = time34; }
    public void setTime35(String time35) { this.time35 = time35; }
    public void setTime36(String time36) { this.time36 = time36; }
    public void setTime37(String time37) { this.time37 = time37; }
    public void setTime38(String time38) { this.time38 = time38; }
    public void setTime39(String time39) { this.time39 = time39; }
    public void setTime40(String time40) { this.time40 = time40; }
    public void setAllCourseTime(int myNumber, List<CourseTime> courseTimes){
        for(int i = 0; i < myNumber; i++) {
            switch (i) {
                case 0:
                    setTime1(courseTimes.get(i).getStartTime());
                    setTime2(courseTimes.get(i).getEndTime());
                    break;
                case 1:
                    setTime3(courseTimes.get(i).getStartTime());
                    setTime4(courseTimes.get(i).getEndTime());
                    break;
                case 2:
                    setTime5(courseTimes.get(i).getStartTime());
                    setTime6(courseTimes.get(i).getEndTime());
                    break;
                case 3:
                    setTime7(courseTimes.get(i).getStartTime());
                    setTime8(courseTimes.get(i).getEndTime());
                    break;
                case 4:
                    setTime9(courseTimes.get(i).getStartTime());
                    setTime10(courseTimes.get(i).getEndTime());
                    break;
                case 5:
                    setTime11(courseTimes.get(i).getStartTime());
                    setTime12(courseTimes.get(i).getEndTime());
                    break;
                case 6:
                    setTime13(courseTimes.get(i).getStartTime());
                    setTime14(courseTimes.get(i).getEndTime());
                    break;
                case 7:
                    setTime15(courseTimes.get(i).getStartTime());
                    setTime16(courseTimes.get(i).getEndTime());
                    break;
                case 8:
                    setTime17(courseTimes.get(i).getStartTime());
                    setTime18(courseTimes.get(i).getEndTime());
                    break;
                case 9:
                    setTime19(courseTimes.get(i).getStartTime());
                    setTime20(courseTimes.get(i).getEndTime());
                    break;
                case 10:
                    setTime21(courseTimes.get(i).getStartTime());
                    setTime22(courseTimes.get(i).getEndTime());
                    break;
                case 11:
                    setTime23(courseTimes.get(i).getStartTime());
                    setTime24(courseTimes.get(i).getEndTime());
                    break;
                case 12:
                    setTime25(courseTimes.get(i).getStartTime());
                    setTime26(courseTimes.get(i).getEndTime());
                    break;
                case 13:
                    setTime27(courseTimes.get(i).getStartTime());
                    setTime28(courseTimes.get(i).getEndTime());
                    break;
                case 14:
                    setTime29(courseTimes.get(i).getStartTime());
                    setTime30(courseTimes.get(i).getEndTime());
                    break;
                case 15:
                    setTime31(courseTimes.get(i).getStartTime());
                    setTime32(courseTimes.get(i).getEndTime());
                    break;
                case 16:
                    setTime33(courseTimes.get(i).getStartTime());
                    setTime34(courseTimes.get(i).getEndTime());
                    break;
                case 17:
                    setTime35(courseTimes.get(i).getStartTime());
                    setTime36(courseTimes.get(i).getEndTime());
                    break;
                case 18:
                    setTime37(courseTimes.get(i).getStartTime());
                    setTime38(courseTimes.get(i).getEndTime());
                    break;
                case 19:
                    setTime39(courseTimes.get(i).getStartTime());
                    setTime40(courseTimes.get(i).getEndTime());
                    break;
            }
        }
    }
}
