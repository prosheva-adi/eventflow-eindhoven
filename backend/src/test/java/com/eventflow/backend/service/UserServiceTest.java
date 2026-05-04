package com.eventflow.backend.service;

import com.eventflow.backend.model.User;
import com.eventflow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(testId);
        testUser.setEmail("test@test.com");
        testUser.setUsername("testuser");
    }

    @Test
    void getUserById_WhenExists_ReturnsUser() {
        when(userRepository.findById(testId)).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.getUserById(testId);

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository, times(1)).findById(testId);
    }

    @Test
    void getUserById_WhenNotExists_ReturnsEmpty() {
        when(userRepository.findById(testId)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(testId);

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(testId);
    }

    @Test
    void getUserByEmail_WhenExists_ReturnsUser() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.getUserByEmail("test@test.com");

        assertTrue(result.isPresent());
        assertEquals("test@test.com", result.get().getEmail());
        verify(userRepository, times(1)).findByEmail("test@test.com");
    }

    @Test
    void saveUser_ReturnsSavedUser() {
        when(userRepository.save(testUser)).thenReturn(testUser);

        User result = userService.saveUser(testUser);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).save(testUser);
    }
}