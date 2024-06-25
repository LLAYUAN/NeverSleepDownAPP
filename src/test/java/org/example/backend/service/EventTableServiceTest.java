package org.example.backend.service;

import org.example.backend.model.EventTable;
import org.example.backend.repository.CourseTimeTableRepository;
import org.example.backend.repository.EventTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventTableServiceTest {

    @Mock
    private EventTableRepository mockEventTableRepository;
    @Mock
    private CourseTimeTableRepository mockCourseTimeTableRepository;
    @Mock
    private EventService mockEventService;

    private EventTableService eventTableServiceUnderTest;

    @BeforeEach
    void setUp() {
        eventTableServiceUnderTest = new EventTableService(mockEventTableRepository, mockCourseTimeTableRepository,
                mockEventService);
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
    void testDelete() {
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
}
