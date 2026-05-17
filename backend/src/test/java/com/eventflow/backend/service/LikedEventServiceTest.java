package com.eventflow.backend.service;

import com.eventflow.backend.dto.LikedEventResponse;
import com.eventflow.backend.model.*;
import com.eventflow.backend.repository.EventRepository;
import com.eventflow.backend.repository.UserLikedEventRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikedEventServiceTest {

    @Mock private UserLikedEventRepository likedEventRepository;
    @Mock private EventRepository eventRepository;

    @InjectMocks
    private LikedEventService likedEventService;

    private User testUser;
    private Event testEvent;
    private UUID userId;
    private UUID eventId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        eventId = UUID.randomUUID();

        testUser = new User();
        testUser.setId(userId);
        testUser.setUsername("testuser");

        testEvent = new Event();
        testEvent.setId(eventId);
        testEvent.setName("Test Event");
    }

    // ── likeEvent ──

    @Test
    void likeEvent_WhenNotAlreadyLiked_SavesLike() {
        when(likedEventRepository.existsById(any())).thenReturn(false);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(testEvent));

        likedEventService.likeEvent(testUser, eventId);

        verify(likedEventRepository).save(any(UserLikedEvent.class));
    }

    @Test
    void likeEvent_WhenAlreadyLiked_DoesNothing() {
        when(likedEventRepository.existsById(any())).thenReturn(true);

        likedEventService.likeEvent(testUser, eventId);

        verify(likedEventRepository, never()).save(any());
        verify(eventRepository, never()).findById(any());
    }

    @Test
    void likeEvent_WhenEventNotFound_ThrowsException() {
        when(likedEventRepository.existsById(any())).thenReturn(false);
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                likedEventService.likeEvent(testUser, eventId));

        verify(likedEventRepository, never()).save(any());
    }

    // ── unlikeEvent ──

    @Test
    void unlikeEvent_WhenLikeExists_DeletesLike() {
        when(likedEventRepository.existsById(any())).thenReturn(true);

        likedEventService.unlikeEvent(testUser, eventId);

        verify(likedEventRepository).deleteById(any());
    }

    @Test
    void unlikeEvent_WhenLikeNotFound_ThrowsException() {
        when(likedEventRepository.existsById(any())).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () ->
                likedEventService.unlikeEvent(testUser, eventId));

        verify(likedEventRepository, never()).deleteById(any());
    }

    // ── isLiked ──

    @Test
    void isLiked_WhenLiked_ReturnsTrue() {
        when(likedEventRepository.existsById(any())).thenReturn(true);

        assertTrue(likedEventService.isLiked(testUser, eventId));
    }

    @Test
    void isLiked_WhenNotLiked_ReturnsFalse() {
        when(likedEventRepository.existsById(any())).thenReturn(false);

        assertFalse(likedEventService.isLiked(testUser, eventId));
    }

    // ── getLikedEvents ──

    @Test
    void getLikedEvents_ReturnsListOfResponses() {
        UserLikedEvent ule = new UserLikedEvent();
        ule.setUser(testUser);
        ule.setEvent(testEvent);

        when(likedEventRepository.findByUserIdWithEvent(userId)).thenReturn(List.of(ule));

        List<LikedEventResponse> result = likedEventService.getLikedEvents(testUser);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(likedEventRepository).findByUserIdWithEvent(userId);
    }
}