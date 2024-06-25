package org.example.backend.service;

import org.example.backend.model.EventTime;
import org.example.backend.repository.EventTimeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
//finished
@ExtendWith(MockitoExtension.class)
class EventTimeServiceTest {

    @Mock
    private EventTimeRepository mockEventTimeRepository;

    private EventTimeService eventTimeServiceUnderTest;

    @BeforeEach
    void setUp() {
        eventTimeServiceUnderTest = new EventTimeService(mockEventTimeRepository);
    }

    @Test
    void testSave() {
        // Setup
        final EventTime eventTime = new EventTime(0, "startTime", "endTime", 0, 0);

        // Run the test
        eventTimeServiceUnderTest.save(eventTime);

        // Verify the results
        verify(mockEventTimeRepository).save(any(EventTime.class));
    }

    @Test
    void testDelete() {
        // Setup
        final EventTime eventTime = new EventTime(0, "startTime", "endTime", 0, 0);

        // Run the test
        eventTimeServiceUnderTest.delete(eventTime);

        // Verify the results
        verify(mockEventTimeRepository).delete(any(EventTime.class));
    }
}
