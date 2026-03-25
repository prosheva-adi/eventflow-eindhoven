package com.eventflow.backend.controller;

import com.eventflow.backend.model.Venue;
import com.eventflow.backend.service.VenueService;
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
@WebMvcTest(VenueController.class)
class VenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private VenueService venueService;

    private Venue testVenue;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testVenue = new Venue();
        testVenue.setId(testId);
        testVenue.setName("Test Venue");
    }

    @Test
    void getAllVenues_Returns200WithList() throws Exception {
        when(venueService.getAllVenues()).thenReturn(List.of(testVenue));

        mockMvc.perform(get("/api/venues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Venue"));

        verify(venueService, times(1)).getAllVenues();
    }

    @Test
    void getVenueById_WhenExists_Returns200() throws Exception {
        when(venueService.getVenueById(testId)).thenReturn(Optional.of(testVenue));

        mockMvc.perform(get("/api/venues/" + testId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Venue"));
    }

    @Test
    void getVenueById_WhenNotExists_Returns404() throws Exception {
        when(venueService.getVenueById(testId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/venues/" + testId))
                .andExpect(status().isNotFound());
    }

    @Test
    void createVenue_Returns200WithCreatedVenue() throws Exception {
        when(venueService.saveVenue(any(Venue.class))).thenReturn(testVenue);

        mockMvc.perform(post("/api/venues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testVenue)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Venue"));
    }

    @Test
    void deleteVenue_Returns204() throws Exception {
        doNothing().when(venueService).deleteVenue(testId);

        mockMvc.perform(delete("/api/venues/" + testId))
                .andExpect(status().isNoContent());
    }
}