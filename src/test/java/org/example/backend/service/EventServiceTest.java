package org.example.backend.service;

import org.example.backend.model.CourseTimeTable;
import org.example.backend.model.Event;
import org.example.backend.model.EventTime;
import org.example.backend.model.EventTable;
import org.example.backend.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
//finished
@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository mockEventRepository;
    @Mock
    private EventTimeService mockEventTimeService;

    private EventService eventServiceUnderTest;

    @BeforeEach
    void setUp() {
        eventServiceUnderTest = new EventService(mockEventRepository, mockEventTimeService);
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
}
