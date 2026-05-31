package com.eventflow.backend.service;

import com.eventflow.backend.dto.EventNotificationDTO;
import com.eventflow.backend.model.*;
import com.eventflow.backend.repository.UserFollowedVenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private SimpMessagingTemplate messagingTemplate;
    @Mock private UserFollowedVenueRepository followRepo;
    @Mock private JavaMailSender mailSender;

    @InjectMocks
    private NotificationService notificationService;

    private Event testEvent;
    private User testUser;
    private Venue testVenue;
    private UserFollowedVenue testFollow;

    @BeforeEach
    void setUp() {
        testVenue = new Venue();
        testVenue.setId(UUID.randomUUID());
        testVenue.setName("Test Venue");

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("user@test.com");
        testUser.setUsername("testuser");

        testEvent = new Event();
        testEvent.setId(UUID.randomUUID());
        testEvent.setName("Test Event");
        testEvent.setVenue(testVenue);
        testEvent.setStartDate(LocalDate.of(2026, 6, 1));
        testEvent.setStartTime(LocalTime.of(20, 0));

        UserFollowedVenueId followId = new UserFollowedVenueId();
        followId.setUserId(testUser.getId());
        followId.setVenueId(testVenue.getId());

        testFollow = new UserFollowedVenue();
        testFollow.setId(followId);
        testFollow.setUser(testUser);
        testFollow.setVenue(testVenue);
    }

    @Test
    void notifyFollowers_WhenFollowersExist_SendsWebSocketAndEmail() {
        when(followRepo.findByVenueId(testVenue.getId())).thenReturn(List.of(testFollow));

        notificationService.notifyFollowers(testEvent);

        verify(messagingTemplate, times(1)).convertAndSendToUser(
                eq(testUser.getEmail()),
                eq("/topic/notifications"),
                any(EventNotificationDTO.class)
        );
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void notifyFollowers_WhenNoFollowers_SendsNothing() {
        when(followRepo.findByVenueId(testVenue.getId())).thenReturn(List.of());

        notificationService.notifyFollowers(testEvent);

        verify(messagingTemplate, never()).convertAndSendToUser(any(), any(), any());
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void notifyFollowers_WhenMultipleFollowers_SendsToEach() {
        User secondUser = new User();
        secondUser.setId(UUID.randomUUID());
        secondUser.setEmail("second@test.com");
        secondUser.setUsername("seconduser");

        UserFollowedVenueId secondFollowId = new UserFollowedVenueId();
        secondFollowId.setUserId(secondUser.getId());
        secondFollowId.setVenueId(testVenue.getId());

        UserFollowedVenue secondFollow = new UserFollowedVenue();
        secondFollow.setId(secondFollowId);
        secondFollow.setUser(secondUser);
        secondFollow.setVenue(testVenue);

        when(followRepo.findByVenueId(testVenue.getId())).thenReturn(List.of(testFollow, secondFollow));

        notificationService.notifyFollowers(testEvent);

        verify(messagingTemplate, times(2)).convertAndSendToUser(any(), any(), any());
        verify(mailSender, times(2)).send(any(SimpleMailMessage.class));
    }
}