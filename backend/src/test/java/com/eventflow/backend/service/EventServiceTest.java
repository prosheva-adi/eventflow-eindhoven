package com.eventflow.backend.service;

import com.eventflow.backend.model.Event;
import com.eventflow.backend.repository.EventRepository;
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
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testEvent = new Event();
        testEvent.setId(testId);
        testEvent.setName("Test Event");
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
        when(eventRepository.findById(testId)).thenReturn(Optional.of(testEvent));

        Optional<Event> result = eventService.getEventById(testId);

        assertTrue(result.isPresent());
        assertEquals("Test Event", result.get().getName());
        verify(eventRepository, times(1)).findById(testId);
    }

    @Test
    void getEventById_WhenNotExists_ReturnsEmpty() {
        when(eventRepository.findById(testId)).thenReturn(Optional.empty());

        Optional<Event> result = eventService.getEventById(testId);

        assertFalse(result.isPresent());
        verify(eventRepository, times(1)).findById(testId);
    }

    @Test
    void saveEvent_ReturnsSavedEvent() {
        when(eventRepository.save(testEvent)).thenReturn(testEvent);

        Event result = eventService.saveEvent(testEvent);

        assertNotNull(result);
        assertEquals("Test Event", result.getName());
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void deleteEvent_CallsRepositoryDelete() {
        doNothing().when(eventRepository).deleteById(testId);

        eventService.deleteEvent(testId);

        verify(eventRepository, times(1)).deleteById(testId);
    }
}