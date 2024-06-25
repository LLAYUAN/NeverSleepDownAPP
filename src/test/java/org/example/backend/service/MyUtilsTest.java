package org.example.backend.service;

import org.example.backend.model.*;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class MyUtilsTest {

    @Test
    void testGetCookieInfo() {
        assertThat(MyUtils.getCookieInfo("userID=123;tableID=456")).isEqualTo(new String[]{"123", "456"});
        assertThat(MyUtils.getCookieInfo("tableID=456")).isEqualTo(new String[]{"","456"});
        assertThat(MyUtils.getCookieInfo("userID=123")).isEqualTo(new String[]{"123","-1"});
        assertThat(MyUtils.getCookieInfo("123")).isEqualTo(new String[]{"","-1"});
        assertThat(MyUtils.getCookieInfo("userID=123;aaeID=456")).isEqualTo(new String[]{"123","-1"});
    }

    @Test
    void testSetCookie() {
        assertThat(MyUtils.setCookie("123", 0)).isEqualTo("userID=123;tableID=0");
        assertThat(MyUtils.setCookie("user", 1)).isEqualTo("userID=user;tableID=1");
    }

    @Test
    void testStringToDate() {
        assertThat(MyUtils.stringToDate("2020-01-01")).isEqualTo(Date.valueOf(LocalDate.of(2020, 1, 1)));
        assertThat(MyUtils.stringToDate(null)).isEqualTo((Date)null);
        assertThat(MyUtils.stringToDate("")).isEqualTo((Date)null);
    }

    @Test
    void testDateToString() {
        assertThat(MyUtils.dateToString(Date.valueOf(LocalDate.of(2020, 1, 1)))).isEqualTo("2020/01/01");
        assertThat(MyUtils.dateToString(null)).isEqualTo(null);
    }

    @Test
    void testDateToWeekandDay() {
        assertThat(MyUtils.DateToWeekandDay(Date.valueOf(LocalDate.of(2020, 1, 1)),
                Date.valueOf(LocalDate.of(2020, 1, 1)))).isEqualTo(new Integer[]{1, 3});
        assertThat(MyUtils.DateToWeekandDay(Date.valueOf(LocalDate.of(2020, 1, 1)),
                Date.valueOf(LocalDate.of(2020, 2, 3)))).isEqualTo(new Integer[]{5,1});
    }

    @Test
    void testEventTimestoDayRepeats() {
        // Setup
        final Set<EventTime> eventTimes = Set.of(new EventTime(0, "startTime", "endTime", 0, 0));

        // Run the test
        final Set<DayRepeat> result = MyUtils.eventTimestoDayRepeats(eventTimes);

        // Verify the results
    }

    @Test
    void testGetBooleans() {
        // Setup
        Set<ChangeTable> changeTables = Set.of(
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 1)), Date.valueOf(LocalDate.of(2020, 1, 1))));
        Event event = new Event();
        event.setType(false);
        event.setIsImportant(false);
        event.setWeek("week");
        EventTime eventTime = new EventTime();
        eventTime.setDate(0);
        eventTime.setStartTime("startTime");
        eventTime.setEndTime("endTime");
        eventTime.setStartTimeNumber(0);
        eventTime.setEndTimeNumber(0);
        event.setEventTimes(Set.of(eventTime));
        Set<Event> events = Set.of(event);

        // Run the test
        boolean[] result = MyUtils.getBooleans(Date.valueOf(LocalDate.of(2020, 1, 1)),
                Date.valueOf(LocalDate.of(2020, 1, 1)), changeTables, events);

        // Verify the results
        assertThat(result).isEqualTo(new boolean[]{false,false,false,true});

        changeTables = Set.of();
        result = MyUtils.getBooleans(Date.valueOf(LocalDate.of(2020, 1, 1)),
                Date.valueOf(LocalDate.of(2020, 1, 1)), changeTables, events);

        // Verify the results
        assertThat(result).isEqualTo(new boolean[]{false,false,false,false});

        Date currentDate = Date.valueOf(LocalDate.of(2020, 1, 1));
        Date firstDayDate = Date.valueOf(LocalDate.of(2020, 1, 2));
        changeTables = Set.of();
        events = Set.of();

        // Run the test
        result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);

        // Verify the results
        assertThat(result).isEqualTo(new boolean[]{false, false, false, false});

        changeTables = Set.of(
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 1)), Date.valueOf(LocalDate.of(2020, 1, 1))),
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 2)), Date.valueOf(LocalDate.of(2020, 1, 2)))
        );
        events = Set.of();
        firstDayDate = Date.valueOf(LocalDate.of(2019, 12, 30));
        result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);
        assertThat(result).isEqualTo(new boolean[]{false, false, false, true});

        event.setWeek("1101010");
        firstDayDate = Date.valueOf(LocalDate.of(2020, 1, 1));
        changeTables = Set.of(
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 1)), Date.valueOf(LocalDate.of(2020, 1, 1))),
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 2)), Date.valueOf(LocalDate.of(2020, 1, 2)))
        );
        event.setIsImportant(true);
        event.setType(true);
        eventTime.setDate(3);
        Event event2 = new Event();
        event2.setType(false);
        event2.setIsImportant(false);
        event2.setWeek("1101010");
        event2.setEventTimes(Set.of(eventTime));
        events = Set.of(event, event2);
        result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);
        assertThat(result).isEqualTo(new boolean[]{true, true, true, true});

        event.setWeek("1101010");
        firstDayDate = Date.valueOf(LocalDate.of(2020, 1, 1));
        changeTables = Set.of();
        event.setIsImportant(true);
        event.setType(true);
        eventTime.setDate(3);
        event2.setType(false);
        event2.setIsImportant(false);
        event2.setWeek("1101010");
        events = Set.of(event, event2);
        result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);
        assertThat(result).isEqualTo(new boolean[]{true, true, true, false});

        event.setWeek("1101010");
        firstDayDate = Date.valueOf(LocalDate.of(2020, 1, 1));
        changeTables =changeTables = Set.of(
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 1)), null),
                new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 2)), Date.valueOf(LocalDate.of(2020, 1, 2)))
        );
        event.setIsImportant(true);
        event.setType(true);
        eventTime.setDate(3);
        event2.setType(false);
        event2.setIsImportant(false);
        event2.setWeek("1101010");
        events = Set.of(event, event2);
        result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);
        assertThat(result).isEqualTo(new boolean[]{true, false, true, true});

    }

//    @Test
//    void testGetBooleans_EventsNotEmpty() {
//        // Setup
//        Date currentDate = Date.valueOf(LocalDate.of(2020, 1, 1));
//        Date firstDayDate = Date.valueOf(LocalDate.of(2020, 1, 1));
//        Set<ChangeTable> changeTables = Set.of();
//        Event event = mock(Event.class);
//        when(event.getType()).thenReturn(true);
//        when(event.getWeek()).thenReturn("0101010");
//        when(event.getIsImportant()).thenReturn(true);
//        Set<EventTime> eventTimes = Set.of();
//        when(event.getEventTimes()).thenReturn(eventTimes);
//        Set<Event> events = Set.of(event);
//
//        // Run the test
//        boolean[] result = MyUtils.getBooleans(currentDate, firstDayDate, changeTables, events);
//
//        // Verify the results
//        assertArrayEquals(new boolean[]{false, false, true, false}, result);
//    }

    @Test
    void testGetBothTimeByTwoNumber() {
        // Setup
        final EventTable eventTable = new EventTable();
        final CourseTimeTable courseTimeTable = new CourseTimeTable();
        courseTimeTable.setTime1("time1");
        courseTimeTable.setTime2("time2");
        courseTimeTable.setTime3("time3");
        courseTimeTable.setTime4("time4");
        courseTimeTable.setTime5("time5");
        courseTimeTable.setTime6("time6");
        courseTimeTable.setTime7("time7");
        courseTimeTable.setTime8("time8");
        courseTimeTable.setTime9("time9");
        courseTimeTable.setTime10("time10");
        courseTimeTable.setTime11("time11");
        courseTimeTable.setTime12("time12");
        courseTimeTable.setTime13("time13");
        courseTimeTable.setTime14("time14");
        courseTimeTable.setTime15("time15");
        courseTimeTable.setTime16("time16");
        courseTimeTable.setTime17("time17");
        courseTimeTable.setTime18("time18");
        courseTimeTable.setTime19("time19");
        courseTimeTable.setTime20("time20");
        courseTimeTable.setTime21("time21");
        courseTimeTable.setTime22("time22");
        courseTimeTable.setTime23("time23");
        courseTimeTable.setTime24("time24");
        courseTimeTable.setTime25("time25");
        courseTimeTable.setTime26("time26");
        courseTimeTable.setTime27("time27");
        courseTimeTable.setTime28("time28");
        courseTimeTable.setTime29("time29");
        courseTimeTable.setTime30("time30");
        courseTimeTable.setTime31("time31");
        courseTimeTable.setTime32("time32");
        courseTimeTable.setTime33("time33");
        courseTimeTable.setTime34("time34");
        courseTimeTable.setTime35("time35");
        courseTimeTable.setTime36("time36");
        courseTimeTable.setTime37("time37");
        courseTimeTable.setTime38("time38");
        courseTimeTable.setTime39("time39");
        courseTimeTable.setTime40("time40");
        eventTable.setCourseTimeTable(courseTimeTable);

        final CourseTimeTableService courseTimeTableService = new CourseTimeTableService(null);

//        // Run the test
//        final String[] result = MyUtils.getBothTimeByTwoNumber(eventTable, 1, 20, courseTimeTableService);
//        final String[] result2 = MyUtils.getBothTimeByTwoNumber(eventTable, 0, 20, courseTimeTableService);
//        // Verify the results
//        assertThat(result).isEqualTo(new String[]{"time1", "time40"});
//        assertThat(result2).isEqualTo(new String[]{null, "time40"});
        for (int startTimeNumber = 1; startTimeNumber <= 20; startTimeNumber++) {
            for (int endTimeNumber = 1; endTimeNumber <= 20; endTimeNumber++) {
                // 运行测试
                final String[] result = MyUtils.getBothTimeByTwoNumber(eventTable, startTimeNumber, endTimeNumber, courseTimeTableService);
                assertThat(result).isNotNull();
            }
        }
    }

    @Test
    void testGetBothTimeWithCourseTimeTable() {
        // Setup
        final CourseTimeTable courseTimeTable = new CourseTimeTable();
        courseTimeTable.setTime1("time1");
        courseTimeTable.setTime2("time2");
        courseTimeTable.setTime3("time3");
        courseTimeTable.setTime4("time4");
        courseTimeTable.setTime5("time5");
        courseTimeTable.setTime6("time6");
        courseTimeTable.setTime7("time7");
        courseTimeTable.setTime8("time8");
        courseTimeTable.setTime9("time9");
        courseTimeTable.setTime10("time10");
        courseTimeTable.setTime11("time11");
        courseTimeTable.setTime12("time12");
        courseTimeTable.setTime13("time13");
        courseTimeTable.setTime14("time14");
        courseTimeTable.setTime15("time15");
        courseTimeTable.setTime16("time16");
        courseTimeTable.setTime17("time17");
        courseTimeTable.setTime18("time18");
        courseTimeTable.setTime19("time19");
        courseTimeTable.setTime20("time20");
        courseTimeTable.setTime21("time21");
        courseTimeTable.setTime22("time22");
        courseTimeTable.setTime23("time23");
        courseTimeTable.setTime24("time24");
        courseTimeTable.setTime25("time25");
        courseTimeTable.setTime26("time26");
        courseTimeTable.setTime27("time27");
        courseTimeTable.setTime28("time28");
        courseTimeTable.setTime29("time29");
        courseTimeTable.setTime30("time30");
        courseTimeTable.setTime31("time31");
        courseTimeTable.setTime32("time32");
        courseTimeTable.setTime33("time33");
        courseTimeTable.setTime34("time34");
        courseTimeTable.setTime35("time35");
        courseTimeTable.setTime36("time36");
        courseTimeTable.setTime37("time37");
        courseTimeTable.setTime38("time38");
        courseTimeTable.setTime39("time39");
        courseTimeTable.setTime40("time40");

        for (int startTimeNumber = 1; startTimeNumber <= 20; startTimeNumber++) {
            for (int endTimeNumber = 1; endTimeNumber <= 20; endTimeNumber++) {
                // 运行测试
                final String[] result = MyUtils.getBothTimeWithCourseTimeTable(startTimeNumber, endTimeNumber, courseTimeTable);
                assertThat(result).isNotNull();
            }
        }
    }
}
