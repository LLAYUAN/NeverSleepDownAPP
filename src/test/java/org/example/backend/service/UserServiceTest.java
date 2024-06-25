package org.example.backend.service;

import org.example.backend.model.EventTable;
import org.example.backend.model.User;
import org.example.backend.repository.EventTableRepository;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private EventTableRepository mockEventTableRepository;

    private UserService userServiceUnderTest;

    @BeforeEach
    void setUp() {
        userServiceUnderTest = new UserService(mockUserRepository, mockEventTableRepository);
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
