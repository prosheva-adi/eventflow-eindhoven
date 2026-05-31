package com.eventflow.backend.controller;

import com.eventflow.backend.dto.EventRequest;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.security.JwtAuthFilter;
import com.eventflow.backend.security.JwtUtil;
import com.eventflow.backend.service.EventService;
import com.eventflow.backend.service.LikedEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(EventController.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EventService eventService;

    @MockitoBean
    private LikedEventService likedEventService; // ← added: EventController now depends on this

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;

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
    void getAllEvents_Returns200WithList() throws Exception {
        when(eventService.getAllEvents()).thenReturn(List.of(testEvent));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Event"));

        verify(eventService, times(1)).getAllEvents();
    }

    @Test
    void getEventById_WhenExists_Returns200() throws Exception {
        when(eventService.getEventById(testId)).thenReturn(Optional.of(testEvent));

        mockMvc.perform(get("/api/events/" + testId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"));
    }

    @Test
    void getEventById_WhenNotExists_Returns404() throws Exception {
        when(eventService.getEventById(testId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/events/" + testId))
                .andExpect(status().isNotFound());
    }

    @Test
    void createEvent_Returns200WithCreatedEvent() throws Exception {
        when(eventService.createEvent(any(EventRequest.class))).thenReturn(testEvent);

        EventRequest req = new EventRequest();
        req.setVenueId(UUID.randomUUID());
        req.setName("Test Event");
        req.setStartDate(java.time.LocalDate.of(2026, 6, 1));
        req.setStartTime(java.time.LocalTime.of(20, 0));

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"));
    }

    @Test
    void deleteEvent_Returns204() throws Exception {
        doNothing().when(eventService).deleteEvent(testId);

        mockMvc.perform(delete("/api/events/" + testId))
                .andExpect(status().isNoContent());
    }

    @Test
    void updateEvent_WhenExists_Returns200() throws Exception {
        when(eventService.getEventById(testId)).thenReturn(Optional.of(testEvent));
        when(eventService.saveEvent(any(Event.class))).thenReturn(testEvent);

        mockMvc.perform(put("/api/events/" + testId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"));
    }

    @Test
    void updateEvent_WhenNotExists_Returns404() throws Exception {
        when(eventService.getEventById(testId)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/events/" + testId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isNotFound());
    }

    @Test
    void likeEvent_Returns204() throws Exception {
        doNothing().when(likedEventService).likeEvent(any(), any());

        mockMvc.perform(post("/api/events/" + testId + "/like"))
                .andExpect(status().isNoContent());
    }

    @Test
    void unlikeEvent_Returns204() throws Exception {
        doNothing().when(likedEventService).unlikeEvent(any(), any());

        mockMvc.perform(delete("/api/events/" + testId + "/like"))
                .andExpect(status().isNoContent());
    }

    @Test
    void isLiked_ReturnsBoolean() throws Exception {
        when(likedEventService.isLiked(any(), eq(testId))).thenReturn(true);

        mockMvc.perform(get("/api/events/" + testId + "/like"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(true));
    }

    @Test
    void getLikedEvents_Returns200() throws Exception {
        when(likedEventService.getLikedEvents(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/events/liked"))
                .andExpect(status().isOk());
    }
}