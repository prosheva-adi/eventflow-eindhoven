package com.eventflow.backend.controller;

import com.eventflow.backend.model.Event;
import com.eventflow.backend.security.JwtAuthFilter;
import com.eventflow.backend.security.JwtUtil;
import com.eventflow.backend.service.EventService;
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
        when(eventService.saveEvent(any(Event.class))).thenReturn(testEvent);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"));
    }

    @Test
    void deleteEvent_Returns204() throws Exception {
        doNothing().when(eventService).deleteEvent(testId);

        mockMvc.perform(delete("/api/events/" + testId))
                .andExpect(status().isNoContent());
    }
}