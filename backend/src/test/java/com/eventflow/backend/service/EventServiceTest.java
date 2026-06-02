package com.eventflow.backend.service;

import com.eventflow.backend.dto.EventRequest;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.EventRepository;
import com.eventflow.backend.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock private EventRepository eventRepository;
    @Mock private VenueRepository venueRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private Venue testVenue;
    private UUID testEventId;
    private UUID testVenueId;

    @BeforeEach
    void setUp() {
        testVenueId = UUID.randomUUID();
        testEventId = UUID.randomUUID();

        testVenue = new Venue();
        testVenue.setId(testVenueId);
        testVenue.setName("Test Venue");

        testEvent = new Event();
        testEvent.setId(testEventId);
        testEvent.setName("Test Event");
        testEvent.setVenue(testVenue);
        testEvent.setStartDate(LocalDate.of(2026, 6, 1));
        testEvent.setStartTime(LocalTime.of(20, 0));
    }

    @Test
    void getAllEvents_ReturnsListOfEvents() {
        when(eventRepository.findAll()).thenReturn(List.of(testEvent));

        List<Event> result = eventService.getAllEvents();

        assertEquals(1, result.size());
        assertEquals("Test Event", result.get(0).getName());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getEventById_WhenExists_ReturnsEvent() {
        when(eventRepository.findById(testEventId)).thenReturn(Optional.of(testEvent));

        Optional<Event> result = eventService.getEventById(testEventId);

        assertTrue(result.isPresent());
        assertEquals("Test Event", result.get().getName());
    }

    @Test
    void getEventById_WhenNotExists_ReturnsEmpty() {
        when(eventRepository.findById(testEventId)).thenReturn(Optional.empty());

        Optional<Event> result = eventService.getEventById(testEventId);

        assertFalse(result.isPresent());
    }

    @Test
    void createEvent_SavesEventAndNotifiesFollowers() {
        EventRequest req = new EventRequest();
        req.setVenueId(testVenueId);
        req.setName("Test Event");
        req.setStartDate(LocalDate.of(2026, 6, 1));
        req.setStartTime(LocalTime.of(20, 0));

        when(venueRepository.findById(testVenueId)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);
        when(eventRepository.findById(any())).thenReturn(Optional.of(testEvent));

        Event result = eventService.createEvent(req);

        assertNotNull(result);
        assertEquals("Test Event", result.getName());
        verify(notificationService, times(1)).notifyFollowers(any(Event.class));
    }

    @Test
    void createEvent_WhenVenueNotFound_ThrowsException() {
        EventRequest req = new EventRequest();
        req.setVenueId(testVenueId);

        when(venueRepository.findById(testVenueId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> eventService.createEvent(req));
        verify(notificationService, never()).notifyFollowers(any());
    }

    @Test
    void deleteEvent_CallsRepositoryDelete() {
        doNothing().when(eventRepository).deleteById(testEventId);

        eventService.deleteEvent(testEventId);

        verify(eventRepository, times(1)).deleteById(testEventId);
    }

    @Test
    void saveEvent_NotifiesFollowers() {
        when(eventRepository.save(testEvent)).thenReturn(testEvent);

        eventService.saveEvent(testEvent);

        verify(notificationService, times(1)).notifyFollowers(testEvent);
    }
}