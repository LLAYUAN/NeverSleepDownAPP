package org.example.backend.service;

import org.example.backend.model.ChangeTable;
import org.example.backend.repository.ChangeTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
//finished
@ExtendWith(MockitoExtension.class)
class ChangeTableServiceTest {

    @Mock
    private ChangeTableRepository mockChangeTableRepository;

    private ChangeTableService changeTableServiceUnderTest;

    @BeforeEach
    void setUp() {
        changeTableServiceUnderTest = new ChangeTableService(mockChangeTableRepository);
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


}
