package org.example.backend.service;

import org.example.backend.model.CourseTimeTable;
import org.example.backend.model.EventTable;
import org.example.backend.repository.CourseTimeTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CourseTimeTableServiceTest {

    @Mock
    private CourseTimeTableRepository mockCourseTimeTableRepository;

    private CourseTimeTableService courseTimeTableServiceUnderTest;

    @BeforeEach
    void setUp() {
        courseTimeTableServiceUnderTest = new CourseTimeTableService(mockCourseTimeTableRepository);
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
}
