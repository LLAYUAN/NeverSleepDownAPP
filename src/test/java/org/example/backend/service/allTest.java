package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
//finished

@ExtendWith(MockitoExtension.class)
public class allTest {
    @Mock
    private ChangeTableRepository mockChangeTableRepository;

    private ChangeTableService changeTableServiceUnderTest;

    @Mock
    private CourseTimeTableRepository mockCourseTimeTableRepository;

    private CourseTimeTableService courseTimeTableServiceUnderTest;

    @Mock
    private EventRepository mockEventRepository;
    @Mock
    private EventTimeService mockEventTimeService;

    private EventService eventServiceUnderTest;

    @Mock
    private EventTableRepository mockEventTableRepository;
    @Mock
    private EventService mockEventService;

    private EventTableService eventTableServiceUnderTest;

    @Mock
    private EventTimeRepository mockEventTimeRepository;

    private EventTimeService eventTimeServiceUnderTest;

    @Mock
    private UserRepository mockUserRepository;

    private UserService userServiceUnderTest;

    @BeforeEach
    void setUp() {
        courseTimeTableServiceUnderTest = new CourseTimeTableService(mockCourseTimeTableRepository);
        changeTableServiceUnderTest = new ChangeTableService(mockChangeTableRepository);
        eventServiceUnderTest = new EventService(mockEventRepository, mockEventTimeService);
        eventTableServiceUnderTest = new EventTableService(mockEventTableRepository, mockCourseTimeTableRepository,
                mockEventService);
        eventTimeServiceUnderTest = new EventTimeService(mockEventTimeRepository);
        userServiceUnderTest = new UserService(mockUserRepository, mockEventTableRepository);
    }

    @Test
    void testSaveChangeTable() {
        // Setup
        final ChangeTable changeTable = new ChangeTable(0, Date.valueOf(LocalDate.of(2020, 1, 1)),
                Date.valueOf(LocalDate.of(2020, 1, 1)));

        // Run the test
        changeTableServiceUnderTest.saveChangeTable(changeTable);

        // Verify the results
        verify(mockChangeTableRepository).save(any(ChangeTable.class));
    }

    @Test
    void testSave() {
        // Setup
        final CourseTimeTable courseTimeTable = new CourseTimeTable();
        courseTimeTable.setId(0);
        courseTimeTable.setCourseNumber(0);
        final EventTable eventTable = new EventTable();
        eventTable.setTableID(0);
        eventTable.setTableName("tableName");
        courseTimeTable.setEventTable(eventTable);

        // Run the test
        courseTimeTableServiceUnderTest.save(courseTimeTable);

        // Verify the results
        verify(mockCourseTimeTableRepository).save(any(CourseTimeTable.class));
    }

    @Test
    void testDeleteEventByEventID() {
        // Setup
        // Run the test
        eventServiceUnderTest.deleteEventByEventID(0);

        // Verify the results
        verify(mockEventRepository).deleteByEventID(0);
    }

    @Test
    void testSaveEvent() {
        // Setup
        final Event event = new Event();
        final EventTime eventTime = new EventTime();
        eventTime.setStartTime("startTime");
        eventTime.setEndTime("endTime");
        eventTime.setStartTimeNumber(0);
        eventTime.setEndTimeNumber(0);
        event.setEventTimes(Set.of(eventTime));

        // Run the test
        eventServiceUnderTest.saveEvent(event);

        // Verify the results
        verify(mockEventRepository).save(any(Event.class));
    }

    @Test
    void testDelete() {
        // Setup
        final EventTable eventTable = new EventTable();
        final Event event = new Event();
        final EventTime eventTime = new EventTime();
        eventTime.setStartTime("startTime");
        eventTime.setEndTime("endTime");
        eventTime.setStartTimeNumber(0);
        eventTime.setEndTimeNumber(0);
        eventTable.setEvents(Set.of(event));
        event.setEventTable(eventTable);
        event.setEventTimes(Set.of(eventTime));

        // Run the test
        eventServiceUnderTest.delete(event);

        // Verify the results
        verify(mockEventTimeService).delete(any(EventTime.class));
        verify(mockEventRepository).delete(any(Event.class));
    }

    @Test
    void testUpdateTime() {
        // Setup
        final Event event = new Event();
        final EventTime eventTime = new EventTime();
        eventTime.setStartTime("startTime");
        eventTime.setEndTime("endTime");
        eventTime.setStartTimeNumber(0);
        eventTime.setEndTimeNumber(0);
        event.setEventTimes(Set.of(eventTime));

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

        // Run the test
        eventServiceUnderTest.updateTime(event, courseTimeTable);

        // Verify the results
        verify(mockEventTimeService).save(any(EventTime.class));
    }

    @Test
    void testSaveEventTable() {
        // Setup
        final EventTable eventTable = new EventTable();
        eventTable.setTableID(0);
        eventTable.setTableName("tableName");
        eventTable.setBackground("background");
        eventTable.setFont("font");
        eventTable.setCourseColor("courseColor");

        // Run the test
        eventTableServiceUnderTest.saveEventTable(eventTable);

        // Verify the results
        verify(mockEventTableRepository).save(any(EventTable.class));
    }

    @Test
    void testDeleteByTableID() {
        // Setup
        // Configure EventTableRepository.getByTableID(...).
        final EventTable eventTable = new EventTable();
        eventTable.setTableID(0);
        eventTable.setTableName("tableName");
        eventTable.setBackground("background");
        eventTable.setFont("font");
        eventTable.setCourseColor("courseColor");
        when(mockEventTableRepository.getByTableID(0)).thenReturn(eventTable);

        // Run the test
        eventTableServiceUnderTest.deleteByTableID(0);

        // Verify the results
        verify(mockEventTableRepository).delete(any(EventTable.class));
    }

    @Test
    void testEventTableDelete() {
        // Setup
        final EventTable eventTable = new EventTable();
        eventTable.setTableID(0);
        eventTable.setTableName("tableName");
        eventTable.setBackground("background");
        eventTable.setFont("font");
        eventTable.setCourseColor("courseColor");

        // Run the test
        eventTableServiceUnderTest.delete(eventTable);

        // Verify the results
        verify(mockEventTableRepository).delete(any(EventTable.class));
    }

    @Test
    void testEventTimeSave() {
        // Setup
        final EventTime eventTime = new EventTime(0, "startTime", "endTime", 0, 0);

        // Run the test
        eventTimeServiceUnderTest.save(eventTime);

        // Verify the results
        verify(mockEventTimeRepository).save(any(EventTime.class));
    }

    @Test
    void testEventTimeDelete() {
        // Setup
        final EventTime eventTime = new EventTime(0, "startTime", "endTime", 0, 0);

        // Run the test
        eventTimeServiceUnderTest.delete(eventTime);

        // Verify the results
        verify(mockEventTimeRepository).delete(any(EventTime.class));
        //测试eventTime为空的情况
        eventTimeServiceUnderTest.delete(null);
    }

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

    @Test
    void testIsPasswardCorrect() {
        // Setup
        // Configure UserRepository.findByUserID(...).
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));
        when(mockUserRepository.findByUserID("userID")).thenReturn(user);

        // Run the test
        final User result = userServiceUnderTest.isPasswardCorrect("userID", "password");

        // Verify the results
    }

    @Test
    void testIsPasswardCorrect_UserRepositoryReturnsNull() {
        // Setup
        when(mockUserRepository.findByUserID("userID")).thenReturn(null);

        // Run the test
        final User result = userServiceUnderTest.isPasswardCorrect("userID", "password");

        // Verify the results
        assertThat(result).isNull();
    }

    @Test
    void testGetUserByUserID() {
        // Setup
        // Configure UserRepository.findByUserID(...).
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));
        when(mockUserRepository.findByUserID("userID")).thenReturn(user);

        // Run the test
        final User result = userServiceUnderTest.getUserByUserID("userID");

        // Verify the results
    }

    @Test
    void testUpdateUser() {
        // Setup
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));

        // Run the test
        userServiceUnderTest.updateUser(user);

        // Verify the results
        verify(mockUserRepository).save(any(User.class));
    }

    @Test
    void testSaveUser() {
        // Setup
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));

        // Configure UserRepository.findByUserID(...).
        final User user1 = new User();
        user1.setUserID("userID");
        user1.setUserName("userName");
        user1.setUserGender(false);
        user1.setPassword("password");
        final EventTable eventTable1 = new EventTable();
        user1.setEventTables(Set.of(eventTable1));
        when(mockUserRepository.findByUserID("userID")).thenReturn(user1);

        // Run the test
        final boolean result = userServiceUnderTest.saveUser(user);

        // Verify the results
        assertThat(result).isFalse();
    }

    @Test
    void testSaveUser_UserRepositoryFindByUserIDReturnsNull() {
        // Setup
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));

        when(mockUserRepository.findByUserID("userID")).thenReturn(null);

        // Run the test
        final boolean result = userServiceUnderTest.saveUser(user);

        // Verify the results
        assertThat(result).isTrue();
        verify(mockUserRepository).save(any(User.class));
    }

    @Test
    void testGetEventTablesByuserID() {
        // Setup
        // Configure UserRepository.findByUserID(...).
        final User user = new User();
        user.setUserID("userID");
        user.setUserName("userName");
        user.setUserGender(false);
        user.setPassword("password");
        final EventTable eventTable = new EventTable();
        user.setEventTables(Set.of(eventTable));
        when(mockUserRepository.findByUserID("userID")).thenReturn(user);

        // Run the test
        final Set<EventTable> result = userServiceUnderTest.getEventTablesByuserID("userID");

        // Verify the results
    }


}
