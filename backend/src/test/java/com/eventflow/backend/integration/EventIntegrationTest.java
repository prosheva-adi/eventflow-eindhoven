package com.eventflow.backend.integration;

import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EventIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VenueRepository venueRepository;

    @Test
    void getAllEvents_WithoutAuth_Returns200() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk());
    }

    @Test
    void getEventById_WithNonExistentId_Returns404() throws Exception {
        mockMvc.perform(get("/api/events/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createEvent_WithoutAuth_Returns403() throws Exception {
        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Test Event",
                            "description": "Test Description"
                        }
                        """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createEvent_WithAdminAuth_Returns200() throws Exception {
        // first create a venue to get a real venueId
        Venue venue = new Venue();
        venue.setName("Test Venue");
        venue.setAddress("Test Address");
        venue.setLatitude(new java.math.BigDecimal("51.44"));
        venue.setLongitude(new java.math.BigDecimal("5.47"));
        venue.setCategory("BAR");
        venue = venueRepository.save(venue);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                {
                    "venueId": "%s",
                    "name": "Test Event",
                    "description": "Test Description",
                    "startDate": "2026-06-01",
                    "startTime": "18:00:00"
                }
                """.formatted(venue.getId())))
                .andExpect(status().isOk());
    }
    @Test
    @WithMockUser(roles = "USER")
    void createEvent_WithUserAuth_Returns403() throws Exception {
        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Test Event",
                            "description": "Test Description"
                        }
                        """))
                .andExpect(status().isForbidden());
    }
}