package com.eventflow.backend.controller;

import com.eventflow.backend.exception.GlobalExceptionHandler;
import com.eventflow.backend.model.Venue;
import com.eventflow.backend.security.JwtUtil;
import com.eventflow.backend.service.VenueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(VenueController.class)
@Import(GlobalExceptionHandler.class)
class VenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private VenueService venueService;

    @MockitoBean
    private JwtUtil jwtUtil;

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

    @Test
    void updateVenue_WhenExists_Returns200() throws Exception {
        when(venueService.updateVenue(eq(testId), any(Venue.class))).thenReturn(Optional.of(testVenue));

        mockMvc.perform(put("/api/venues/" + testId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testVenue)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Venue"));
    }

    @Test
    void updateVenue_WhenNotExists_Returns404() throws Exception {
        when(venueService.updateVenue(eq(testId), any(Venue.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/venues/" + testId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testVenue)))
                .andExpect(status().isNotFound());
    }

    @Test
    void isFollowing_Returns200WithBoolean() throws Exception {
        when(venueService.isFollowing(any(), eq(testId))).thenReturn(true);

        mockMvc.perform(get("/api/venues/" + testId + "/follow")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void followVenue_Returns200() throws Exception {
        doNothing().when(venueService).followVenueByToken(any(), eq(testId));

        mockMvc.perform(post("/api/venues/" + testId + "/follow")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk());

        verify(venueService, times(1)).followVenueByToken(any(), eq(testId));
    }

    @Test
    void unfollowVenue_Returns204() throws Exception {
        doNothing().when(venueService).unfollowVenueByToken(any(), eq(testId));

        mockMvc.perform(delete("/api/venues/" + testId + "/follow")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNoContent());

        verify(venueService, times(1)).unfollowVenueByToken(any(), eq(testId));
    }

    @Test
    void followVenue_WhenUserNotFound_Returns400() throws Exception {
        doThrow(new RuntimeException("User not found"))
                .when(venueService).followVenueByToken(any(), eq(testId));

        mockMvc.perform(post("/api/venues/" + testId + "/follow")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isBadRequest());
    }
}